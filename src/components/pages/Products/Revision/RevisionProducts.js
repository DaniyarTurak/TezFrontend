import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import TextField from '@material-ui/core/TextField';
import Scanner from "./Scanner";
import useDebounce from "../../../ReusableComponents/useDebounce";
import Alert from "react-s-alert";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RevisionTable from "./RevisionTable";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ManualAdd from "./ManualAdd";
import ReactModal from "react-modal";
import PlusOneIcon from '@material-ui/icons/PlusOne';

const CustomField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#17a2b8',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#17a2b8',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#17a2b8',
            },
            '&:hover fieldset': {
                borderColor: '#17a2b8',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#17a2b8',
            },
        },
    },
})(TextField);

const CustomRadio = withStyles({
    root: {
        color: "#17a2b8",
        '&$checked': {
            color: "#28a745",
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function RevisonProducts({
    barcode,
    setBarcode,
    hardware,
    setHardware,
    point,
    type,
    object,
    revNumber,
    setActiveStep,
    revisionProducts,
    setRevisionProducts,
    admin
}) {

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            marginLeft: "40px",
            transform: "translate(-50%, -50%)",
            maxWidth: "400px",
            maxHeight: "80vh",
            overlfow: "scroll",
            zIndex: 11,
        },
        overlay: { zIndex: 10 },
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            overflow: 'hidden',
            padding: theme.spacing(0, 3),
        },
        paper: {
            maxWidth: 480,
            margin: `${theme.spacing(1)}px auto`,
            padding: theme.spacing(2),
        },
    }));
    const classes = useStyles();


    const debouncedBarcode = useDebounce(barcode, 150);
    const [restartScanner, setRestartScanner] = useState(false);
    const [isSelectProduct, setSelectProduct] = useState(false);
    const [fewProducts, setFewProducts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const debouncedRestartScanner = useDebounce(restartScanner, 200);
    useEffect(() => {
        getRevisionProducts();
        setUser(JSON.parse(sessionStorage.getItem("isme-user-data")).id);
    }, []);

    useEffect(() => {
        if (barcode !== "") {
            searchByBarcode();
        }
    }, [debouncedBarcode]);

    const getRevisionProducts = () => {
        const params = {
            revisionnumber: revNumber,
            point: point
        }
        setLoading(true);
        Axios.get("/api/revision/revisiontemp/list", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                let temp = [];
                products.forEach((product) => {
                    temp.push({ ...product, isChanging: false })
                })
                setRevisionProducts(products);
                setLoading(false);
            })
            .catch((err) => {
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    }

    const barcodeChange = (e) => {
        setBarcode(e.target.value);
    };

    const searchByBarcode = () => {
        const params = {
            barcode,
            point,
            type,
            object: object ? object.value : null
        };
        setLoading(true);
        Axios.get("/api/revision/unitsbybarcode", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                if (products.length > 0) {
                    if (products.length > 1) {
                        setFewProducts(products);
                        setSelectProduct(true);
                    }
                    else {
                        addToRevisionTemp(products[0]);
                    }
                }
                else {
                    Alert.warning(`Товар со штрих-кодом ${barcode} отсутствует на складе ${type === 2 ? `под брендом "${object.label}"` : type === 3 ? `под категорией "${object.label}"` : ""}`, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);
                }
                setBarcode("");
                setRestartScanner(!restartScanner);
                setLoading(false);
            })
            .catch((err) => {
                Alert.warning(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setBarcode("");
                setRestartScanner(!restartScanner);
                setLoading(false);
            });
    };

    const addToRevisionTemp = (product) => {
        setLoading(true);
        Axios.post("/api/revision/revisiontemp/update", {
            revnumber: revNumber,
            point,
            id: product.product,
            attribute: product.attributes,
            unitswas: Number(product.units)
        })
            .then((res) => res.data)
            .then((res) => {
                if (res[0].revisiontemp_update.code === "success") {
                    getRevisionProducts();
                    setSelectProduct(false);
                    setFewProducts([]);
                    setLoading(false);
                }
                else {
                    Alert.error(res[0].update_revisiontemp.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const closeModal = () => {
        setSelectProduct(false);
        setFewProducts([]);
    }
    return (
        <Fragment>
            {fewProducts.length > 0 &&
                < ReactModal
                    isOpen={isSelectProduct}
                    style={customStyles}
                >
                    <Grid container>
                        <Grid item xs={12} style={{ textAlign: "center" }}><b>Выберите товар</b></Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ paddingTop: "15px" }}>
                        <Grid item xs={5}><b>Наименование</b></Grid>
                        <Grid item xs={7}>{fewProducts[0].name}</Grid>
                        <Grid item xs={5}><b>Штрих-код</b></Grid>
                        <Grid item xs={7}>{fewProducts[0].code}</Grid>
                    </Grid>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={6} style={{ textAlign: "center" }}><b>Характеристики</b></Grid>
                        {
                            fewProducts.map((prod, idx) => (
                                <Fragment key={idx}>
                                    <Grid item xs={8}>{prod.attrvalue ? prod.attrvalue : "Без характеристик"}</Grid>
                                    <Grid item xs={2} style={{ textAlign: "right" }} >
                                        <button
                                            className="btn btn-success"
                                            onClick={() => addToRevisionTemp(prod)}
                                            style={{ padding: "0px" }}
                                            disabled={isLoading}
                                        >
                                            <PlusOneIcon size="small" />
                                        </button></Grid>
                                </Fragment>
                            ))
                        }
                    </Grid>
                    <hr />
                    <Grid container spacing={3}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                        </Grid>
                    </Grid>
                </ReactModal>
            }
            <Paper className={classes.paper}>
                <Grid
                    direction="column"
                    container
                    wrap="nowrap"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <span>Способ ввода</span>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <RadioGroup row name="harware"
                                value={hardware}
                                onChange={(e) => setHardware(e.target.value)}
                            >
                                <FormControlLabel
                                    value="camera"
                                    control={<CustomRadio />}
                                    label="Камера"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="manual"
                                    control={<CustomRadio />}
                                    label="Ручной ввод"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="scanner"
                                    control={<CustomRadio />}
                                    label="Сканер"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper} elevation={hardware === 'camera' ? 3 : 0} style={{ paddingLeft: "0px" }}>
                <Scanner
                    barcode={barcode}
                    setBarcode={setBarcode}
                    debouncedRestartScanner={debouncedRestartScanner}
                    hardware={hardware}
                />
            </Paper>
            {
                hardware === "scanner" &&
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={12}>
                            <CustomField
                                fullWidth
                                size="small"
                                variant="outlined"
                                label={"Штрих-код"}
                                value={barcode}
                                autoFocus={true}
                                onChange={barcodeChange}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            }
            {
                hardware === "manual" &&
                <ManualAdd
                    setSelectProduct={setSelectProduct}
                    setFewProducts={setFewProducts}
                    point={point}
                    revNumber={revNumber}
                    getRevisionProducts={getRevisionProducts}
                    type={type}
                    object={object}
                />
            }
            {
                revisionProducts.length > 0 &&
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={12} style={{ padding: "0px" }}>
                            <RevisionTable
                                revisionProducts={revisionProducts}
                                setRevisionProducts={setRevisionProducts}
                                point={point}
                                revNumber={revNumber}
                                getRevisionProducts={getRevisionProducts}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            }
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={6}>
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-outline-secondary"
                            onClick={() => setActiveStep(0)}
                        >
                            Назад
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button
                            onClick={() => setActiveStep(2)}
                            style={{ width: "100%" }}
                            className="btn btn-success"
                            disabled={revisionProducts.length > 0 && admin === user ? false : true}
                        >
                            Далее
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment >
    );
};