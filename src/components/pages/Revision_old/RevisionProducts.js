import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Axios from "axios";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import Button from '@material-ui/core/Button';
import Alert from "react-s-alert";
import Quagga from 'quagga';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function RevisionSettings(
    {
        handleNext,
        handleBack,
        steps,
        activeStep
    }) {

    let label = {
        title: {
            send: "Обновить количество",
            delete: "Очистить поля",
            report: "Перейти в отчеты",
            endrevision: "Завершить ревизию",
            gotoeditlist: "Перейти к завершению ревизии",
        },
        colnames: {
            name: "Наименование",
            attributes: "Атрибуты",
            barcode: "Штрих-код",
            factUnits: "Количество по факту",
            stockUnits: "Количество на складе",
        },
        placeholder: {
            enterbarcode: "Введите или отсканируйте штрих код",
        },
        header: {
            report: "Отчеты по ревизии",
            exit: "Выход",
            params: "Параметры",
            help: "Помощь",
        },
    };

    // const [isMobile, setMobile] = useState(true);

    const [resultCollector, setResultCollector] = useState(null);
    const [src, setSrc] = useState("");
    const [photoToBackground, setPhotoToBackground] = useState(true);
    const [isCameraLoading, setCameraLoading] = useState(false);
    const [keyboardOpened, setKeyboardOpened] = useState(false);
    const [isMobile, setMobile] = useState(false);
    const [deviceType, setDeviceType] = useState(2);
    const [name, setName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [stockUnits, setStockUnits] = useState("");
    const [factUnits, setFactUnits] = useState("");
    const [attributes, setAttributes] = useState("");
    const [pointId, setPointId] = useState("");
    const [revType, setRevType] = useState("");
    const [revisionDate, setRevisionDate] = useState(new Date());
    const [username, setUsername] = useState(JSON.parse(sessionStorage.getItem("isme-user-data")).login || "")
    const [selectedProduct, setSelectedProduct] = useState({});
    const [isCameraError, setCameraError] = useState(false);
    const [products, setProducts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [params, setParams] = useState(JSON.parse(sessionStorage.getItem("revision-params")) || {});
    const [barcodeEntered, setBarcodeEntered] = useState("");
    const [productSelectValue, setProductSelectValue] = useState(null);
    const [isRedirecting, setRedirecting] = useState(false);
    const [isLandsape, setLandscape] = useState(false);
    const [isDataSearching, setDataSearching] = useState(false);
    const [windowIsSmall, setWindowIsSmall] = useState(false);
    const [productsForSelect, setProductsForSelect] = useState([]);
    const [isTempDataSaving, setTempDataSaving] = useState(false);
    const [myTimeOut, setMyTimeOut] = useState(null);
    const [coloredRow, isColoredRow] = useState(false);
    const [coldRevProducts, setColdRevProducts] = useState([]);
    const [coldTempRevProducts, setColdTempRevProducts] = useState([]);
    const [coldRevProductsCheck, setColdRevProductsCheck] = useState({});
    const [coloredIdx, setColoredIdx] = useState(-1);
    const [loaderPaddingRight, setLoaderPaddingRight] = useState(0);

    const createResultCollector = () => {
        let temp;
        temp = Quagga.ResultCollector.create({
            capture: true, // keep track of the image producing this result
            capacity: 1, // maximum number of results to store
            filter: function (codeResult) {
                return true;
            },
        });
        Quagga.registerResultCollector(temp);
        setResultCollector(temp);
    };

    const initQuagga = () => {
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#barcode"),
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: "environment",
                    },
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true,
                },
                numOfWorkers: 4,
                locate: true,
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "code_39_reader",
                        "code_39_vin_reader",
                        "codabar_reader",
                        "upc_reader",
                        "upc_e_reader",
                        "i2of5_reader",
                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true,
                        },
                    },
                },
            },
            function (err) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
                //включить выключить фонарик
                // var track = Quagga.CameraAccess.getActiveTrack();
                // track.applyConstraints({advanced: [{torch:true}]}); //Torch is on
                // track.applyConstraints({advanced: [{torch:false}]}); //Torch still on :(
            }
        );
    }

    const saveState = () => {
        sessionStorage.setItem(
            "saved-state",
            JSON.stringify(selectedProduct)
        );
    };

    const restartScan = () => {
        createResultCollector();
        if (!keyboardOpened) Quagga.start();
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
        drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width"), 10),
            parseInt(drawingCanvas.getAttribute("height"), 10)
        );
        setSrc("");
        setPhotoToBackground(true);
    };

    const loadState = () => {
        if (deviceType === 2) {
            const temp =
                JSON.parse(sessionStorage.getItem("saved-state")) || {};
            if (temp.code) {
                setSelectedProduct(temp);
                setName(temp.name);
                setBarcode(temp.code);
                setFactUnits(temp.factUnits);
                setStockUnits(temp.units);
                setAttributes(temp.attrvalue);
                setBarcodeEntered("");
                setProductSelectValue("");
            }
            sessionStorage.removeItem("saved-state");
        }
    };

    const cameraLoadResult = (error, loading) => {
        setCameraError(error);
        setCameraLoading(loading);
    };

    useEffect(() => {
        document.body.removeAttribute("style");
        document.body.style.overflow = "auto";
        if (!revType || !params.point) {
            setRedirecting(true);
            // this.props.history.push("/revision/params");
            return;
        }
        if (!username) {
            setRedirecting(true);
            // this.props.history.push("/revision/signout");
            return;
        }
        loadState();
        let windowIsSmallTemp = false;
        if (isMobile || window.innerWidth < 480) {
            label.placeholder.enterbarcode = "Введите штрих код";
            windowIsSmallTemp = true;
        }
        if (window.innerWidth < 340) label.header.report = "Отчеты";

        const revTypeTemp =
            params.revType === "cold"
                ? 0
                : params.revType === "hot"
                    ? 1
                    : params.revType === "coldTemp"
                        ? 4
                        : null;
        const sendTitle =
            revTypeTemp === 0 ? "Добавить товар в список" : label.title.send;
        label.title.send = sendTitle;
        const deviceTypeTemp = params.deviceType
            ? params.deviceType
            : 2;

        if (isMobile && window.innerWidth > 480) {
            setLandscape(true);
            setPointId(params.point);
            setRevType(revTypeTemp);
            setWindowIsSmall(windowIsSmallTemp);
            setDeviceType(deviceTypeTemp);
        }
        else {
            setPointId(params.point);
            setRevType(revTypeTemp);
            setWindowIsSmall(windowIsSmallTemp);
            setDeviceType(deviceTypeTemp);
        }

        if (revType === 4) {
            setTempDataSaving(true);
            Axios.get("/api/revision/temprevproducts", {
                params: {
                    point: params.point,
                },
            })
                .then((data) => {
                    return data.data;
                })
                .then((products) => {
                    setColdTempRevProducts(products.revProducts);
                    setTempDataSaving(false);
                })
                .catch((err) => {
                    console.log(err);
                    setTempDataSaving(false);
                });
        }
    }, []);

    useEffect(() => {

        getColdRevProducts();
        getProducts();
        let constraints_width = 480,
            constraints_height = 320;

        let windowIsSmallTemp = false;

        //в эмуляторе телефона в браузере отображается боком в отличие от самих телефонов
        if (isMobile) {
            windowIsSmallTemp = true;

            if (this.state.deviceType === 2) {
                if (window.innerWidth < 480) {
                    constraints_width = 320;
                    constraints_height = 480;
                } else {
                    setLandscape(true);
                }

                window.addEventListener("orientationchange", () => {
                    saveState();
                    document.location.reload(true);
                });

                const _originalSize = window.innerHeight - 100;
                window.addEventListener("resize", () => {
                    console.log("the orientation of the device is now resized");
                    let keyboardOpenedTemp = false;
                    if (
                        window.innerHeight < _originalSize &&
                        deviceType === 2
                    ) {
                        keyboardOpenedTemp = true;
                    }
                    setKeyboardOpened(keyboardOpenedTemp)
                    if (keyboardOpenedTemp) {
                        Quagga.pause();
                    }
                    else {
                        Quagga.start();
                    }
                });
            }
        } else {
            if (window.innerWidth < 480) {
                windowIsSmallTemp = true;
            }
        }

        if (revType !== 4) {
            const width =
                loaderPaddingRight +
                document.getElementsByClassName("text-column")[0].clientWidth / 2 -
                40;
            setLoaderPaddingRight(width);
            setWindowIsSmall(windowIsSmallTemp);
        } else {
            setWindowIsSmall(windowIsSmallTemp);
        }

        createResultCollector();
        initQuagga();

        let lastTime = new Date();

        Quagga.onDetected((data) => {
            const currTime = new Date();
            currTime.setSeconds(currTime.getSeconds() - 2);
            if (lastTime > currTime) return;
            lastTime = new Date();
            Quagga.pause();
            const barcode = data.codeResult.code;
            console.log(barcode);
            restartScan();
            // this.getProductUnits(barcode);
            // setSrc(resultCollector.getResults()[0] ? resultCollector.getResults()[0].frame : "");
            // setPhotoToBackground(false);
        });

        Quagga.onProcessed(function (result) {
            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.codeResult && result.codeResult.code) {
                    drawingCtx.clearRect(
                        0,
                        0,
                        parseInt(drawingCanvas.getAttribute("width"), 10),
                        parseInt(drawingCanvas.getAttribute("height"), 10)
                    );
                    Quagga.ImageDebug.drawPath(
                        result.line,
                        { x: "x", y: "y" },
                        drawingCtx,
                        { color: "red", lineWidth: 3 }
                    );
                }
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                        color: "#00F",
                        lineWidth: 2,
                    });
                }
            }
        });
    }, []);

//  const   getProductUnits = (_barcode) => {
//         let barcodeTemp = _barcode;
//         let {
//             selectedProduct,
//             barcodeEntered,
//             coldRevProductsCheck,
//             windowIsSmall,
//         } = this.state;
//         if (typeof barcode === "object") {
//             barcode = barcodeEntered;
//         }
//         if (!barcode) {
//             this.focusBarcodeInput();
//             return;
//         }
//         const params = {
//             barcode,
//             point: this.state.pointId,
//         };
//         this.setState({
//             isDataSearching: true,
//             barcode: "",
//             factUnits: "",
//             stockUnits: "",
//             name: "",
//             attributes: "",
//         });
//         if (this.state.revType !== 4) {
//             Axios.get("/api/revision/unitsbybarcode", {
//                 params,
//             })
//                 .then((data) => {
//                     return data.data;
//                 })
//                 .then((products) => {
//                     this.setState({
//                         isDataSearching: false,
//                         barcodeEntered: "",
//                         productSelectValue: "",
//                     });
//                     if (products.length === 0) {
//                         this.setState({
//                             name: "Товар не найден на складе",
//                             attributes: "",
//                             barcode,
//                         });
//                         this.continueToScan(true);
//                     } else if (products.length > 1) this.openDetails(products);
//                     else {
//                         const currSelectedProduct = products[0];

//                         if (currSelectedProduct.code === selectedProduct.code) {
//                             selectedProduct.factUnits = selectedProduct.factUnits
//                                 ? selectedProduct.factUnits + 1
//                                 : 1;
//                             this.setState({
//                                 selectedProduct,
//                                 name: selectedProduct.name,
//                                 barcode: selectedProduct.code,
//                                 factUnits: selectedProduct.factUnits,
//                                 stockUnits: selectedProduct.units,
//                                 attributes: selectedProduct.attrvalue,
//                                 barcodeEntered: "",
//                                 productSelectValue: "",
//                             });
//                             this.continueToScan(true);
//                             this.focusBarcodeInput();
//                             return;
//                         }

//                         if (
//                             coldRevProductsCheck[
//                             products[0].product + " " + products[0].attributes
//                             ]
//                         )
//                             currSelectedProduct.factUnits =
//                                 coldRevProductsCheck[
//                                     products[0].product + " " + products[0].attributes
//                                 ].factUnits + 1;
//                         else currSelectedProduct.factUnits = 1;
//                         this.setState({
//                             selectedProduct: currSelectedProduct,
//                             revisionDate: new Date(),
//                             name: currSelectedProduct.name,
//                             barcode: currSelectedProduct.code,
//                             factUnits: currSelectedProduct.factUnits,
//                             stockUnits: currSelectedProduct.units,
//                             attributes: currSelectedProduct.attrvalue,
//                         });
//                         this.continueToScan(true);
//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                     this.setState({
//                         isDataSearching: false,
//                         attributes: "",
//                         name: "Товар не найден на складе",
//                         barcode,
//                         barcodeEntered: "",
//                         productSelectValue: "",
//                     });
//                     this.continueToScan(true);
//                 })
//                 .finally(() => {
//                     this.focusBarcodeInput();
//                 });
//         } else {
//             this.setState({ isTempDataSaving: true });
//             Axios.get("/api/revision/temprevision", {
//                 params,
//             })
//                 .then((data) => {
//                     return data.data;
//                 })
//                 .then((products) => {
//                     console.log(products);
//                     this.setState({
//                         isDataSearching: false,
//                         barcodeEntered: "",
//                         productSelectValue: "",
//                         barcode,
//                     });
//                     if (products.result.length > 1) this.openDetails(products.result);
//                     else {
//                         if (products.revProducts.length === 0) {
//                             // this.setState({selectedProduct:{}})
//                             // this.setState({selectedProduct:products.revProducts[0]})
//                             Alert.warning(
//                                 `Товар по штрих-коду ${barcode} не найден на складе`,
//                                 {
//                                     position: windowIsSmall ? "top" : "top-right",
//                                     effect: "bouncyflip",
//                                     timeout: 3000,
//                                 }
//                             );
//                         } else {
//                             this.setState({
//                                 coldTempRevProducts: products.revProducts,
//                                 selectedProduct: products.revProducts[0],
//                                 coloredRow: true,
//                             });
//                             this.startRowCOlorTimer();
//                         }
//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err.response);
//                     if (err.response.data.inserted === "success")
//                         Alert.error(
//                             "Товар добавлен, но произошла ошибка при отображении изменений. Обновите страницу",
//                             {
//                                 position: windowIsSmall ? "top" : "top-right",
//                                 effect: "bouncyflip",
//                                 timeout: 10000,
//                             }
//                         );
//                     else
//                         Alert.error("Произошла ошибка при добавлении товара", {
//                             position: windowIsSmall ? "top" : "top-right",
//                             effect: "bouncyflip",
//                             timeout: 3000,
//                         });
//                     this.setState({
//                         isDataSearching: false,
//                         attributes: "",
//                         name: "Товар не найден на складе",
//                         barcode,
//                         barcodeEntered: "",
//                         productSelectValue: "",
//                     });
//                 })
//                 .finally(() => {
//                     this.continueToScan(true);
//                     this.setState({ isTempDataSaving: false });
//                     this.focusBarcodeInput();
//                 });
//         }
//     };

    return (
        <Fragment>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <div className="revision-block">
                        {deviceType === 2 ? (
                            <Fragment>
                                <div
                                    className="flex video-width video-height"
                                    style={{
                                        display: keyboardOpened ? "none" : "flex",
                                        paddingTop: isMobile ? "60px" : "0px",
                                    }}
                                >
                                    {isCameraLoading && (
                                        <div className="loader loader-camera">
                                            <div className="icon"></div>
                                        </div>
                                    )}
                                    <div
                                        id="barcode"
                                        className={`flex center ${isCameraLoading ? "" : "barcode-visible"
                                            }`}
                                    ></div>
                                    {src && (
                                        <div
                                            className={`${photoToBackground ? "to-backgroud" : ""
                                                } photo`}
                                        >
                                            <img
                                                src={src}
                                                alt=""
                                                className="video-width video-height"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="video-width video-height"
                                    style={{
                                        paddingTop: isMobile && keyboardOpened ? "60px" : "10px",
                                        display: "block",
                                    }}
                                >
                                </div>
                            </Fragment>
                        ) : (
                            <div
                                className="video-width video-height"
                                style={{
                                    paddingTop: isMobile ? "60px" : "10px",
                                    display: "block",
                                }}
                            >
                            </div>
                        )}
                    </div>
                </Grid>
            </Grid>
        </Fragment>
    )
}