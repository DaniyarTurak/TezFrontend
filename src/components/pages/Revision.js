import React, { Component, Fragment } from "react";
import Quagga from "quagga";
import Axios from "axios";
import ReactModal from "react-modal";
import SelectProduct from "./revision/SelectProduct";
import Moment from "moment";
import Alert from "react-s-alert";
import Select from "react-select";
import icons from "glyphicons";
import "../../sass/revision.sass";
import ScrollUpButton from "react-scroll-up-button";
import { inherits } from "util";
import { Link } from "react-router-dom";
import { isChrome, isMobile } from "react-device-detect";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};
ReactModal.setAppElement("#root");

class Revision extends Component {
  state = {
    name: "",
    barcode: "",
    stockUnits: "",
    factUnits: "",
    attributes: "",
    src: "",
    pointId: "",
    revType: "",
    deviceType: 2, //2-камера
    revisionDate: new Date(),
    username: JSON.parse(sessionStorage.getItem("isme-user-data")).login || "",
    loaderPaddingRight: 0,
    photoToBackground: true,
    resultCollector: null,
    isLandsape: false,
    isCameraLoading: true,
    isCameraError: false,
    isDataSearching: false,
    modalIsOpen: false,
    isRedirecting: false,
    windowIsSmall: false,
    barcodeEntered: "",
    productSelectValue: null,
    coloredRow: false,
    productsForSelect: [],
    coldRevProducts: [],
    coldTempRevProducts: [],
    coldRevProductsCheck: {},
    products: [],
    myTimeOut: null,
    keyboardOpened: false,
    selectedProduct: {},
    isTempDataSaving: false,
    coloredIdx: -1,
    params: JSON.parse(sessionStorage.getItem("revision-params")) || {},
    label: {
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
    },
  };

  createResultCollector = () => {
    let { resultCollector } = this.state;
    resultCollector = Quagga.ResultCollector.create({
      capture: true, // keep track of the image producing this result
      capacity: 1, // maximum number of results to store
      filter: function (codeResult) {
        // only store results which match this constraint
        // returns true/false
        // e.g.: return codeResult.format === "ean_13";
        return true;
      },
    });
    Quagga.registerResultCollector(resultCollector);
    this.setState({ resultCollector });
  };

  initQuagga(constraints_width, constraints_height) {
    if (this.state.deviceType !== 2) return;
    else if (this.state.isRedirecting) return;
    //alert(constraints_width + " " + constraints_height)
    let self = this; //here save the reference of this
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode"),
          constraints: {
            width: constraints_width,
            height: constraints_height,
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
          self.cameraLoadResult(true, false);
          return;
        }
        self.cameraLoadResult(false, false);
        console.log("Initialization finished. Ready to start");

        if (isMobile && window.innerWidth > 480)
          document.getElementsByTagName("canvas")[0].className +=
            " video-width-landscape";

        Quagga.start();

        //включить выключить фонарик
        // var track = Quagga.CameraAccess.getActiveTrack();
        // track.applyConstraints({advanced: [{torch:true}]}); //Torch is on
        // track.applyConstraints({advanced: [{torch:false}]}); //Torch still on :(
      }
    );
  }

  saveState = () => {
    sessionStorage.setItem(
      "saved-state",
      JSON.stringify(this.state.selectedProduct)
    );
  };

  loadState = () => {
    if (this.state.deviceType === 2) {
      const selectedProduct =
        JSON.parse(sessionStorage.getItem("saved-state")) || {};
      if (selectedProduct.code) {
        this.setState({
          selectedProduct,
          name: selectedProduct.name,
          barcode: selectedProduct.code,
          factUnits: selectedProduct.factUnits,
          stockUnits: selectedProduct.units,
          attributes: selectedProduct.attrvalue,
          barcodeEntered: "",
          productSelectValue: "",
        });
      }
      sessionStorage.removeItem("saved-state");
    }
  };

  cameraLoadResult = (isCameraError, isCameraLoading) => {
    this.setState({ isCameraError, isCameraLoading });
  };

  componentWillMount() {
    document.body.removeAttribute("style");
    document.body.style.overflow = "auto";

    if (!this.state.params.revType || !this.state.params.point) {
      this.setState({ isRedirecting: true });
      this.props.history.push("/revision/params");
      return;
    }
    if (!this.state.username) {
      this.setState({ isRedirecting: true });
      this.props.history.push("/revision/signout");
      return;
    }

    this.loadState();

    let windowIsSmall = false;
    const { label } = this.state;
    if (isMobile || window.innerWidth < 480) {
      label.placeholder.enterbarcode = "Введите штрих код";
      windowIsSmall = true;
    }
    if (window.innerWidth < 340) label.header.report = "Отчеты";

    const revType =
      this.state.params.revType === "cold"
        ? 0
        : this.state.params.revType === "hot"
        ? 1
        : this.state.params.revType === "coldTemp"
        ? 4
        : null;
    const sendTitle =
      revType === 0 ? "Добавить товар в список" : label.title.send;
    label.title.send = sendTitle;
    const deviceType = this.state.params.deviceType
      ? this.state.params.deviceType
      : 2;

    if (isMobile && window.innerWidth > 480)
      this.setState({
        isLandsape: true,
        pointId: this.state.params.point,
        windowIsSmall,
        revType,
        deviceType,
        label,
      });
    else
      this.setState({
        pointId: this.state.params.point,
        windowIsSmall,
        revType,
        deviceType,
        label,
      });

    if (revType === 4) {
      this.setState({ isTempDataSaving: true });
      Axios.get("/api/revision/temprevproducts", {
        params: {
          point: this.state.params.point,
        },
      })
        .then((data) => {
          return data.data;
        })
        .then((products) => {
          this.setState({
            coldTempRevProducts: products.revProducts,
            isTempDataSaving: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isTempDataSaving: false });
        });
    }
  }

  componentDidMount() {
    this.getColdRevProducts();
    this.getProducts();
    let constraints_width = 480,
      constraints_height = 320;

    let windowIsSmall = false;

    //в эмуляторе телефона в браузере отображается боком в отличие от самих телефонов
    if (isMobile) {
      windowIsSmall = true;

      if (this.state.deviceType === 2) {
        if (window.innerWidth < 480) {
          constraints_width = 320;
          constraints_height = 480;
        } else {
          this.setState({ isLandsape: true });
        }

        window.addEventListener("orientationchange", () => {
          this.saveState();
          document.location.reload(true);
        });

        const _originalSize = window.innerHeight - 100;
        window.addEventListener("resize", () => {
          console.log("the orientation of the device is now resized");
          let keyboardOpened = false;
          if (
            window.innerHeight < _originalSize &&
            this.state.deviceType === 2
          ) {
            keyboardOpened = true;
          }
          this.setState({ keyboardOpened });
          if (keyboardOpened) Quagga.pause();
          else Quagga.start();
        });
      }
    } else {
      if (window.innerWidth < 480) windowIsSmall = true;
    }

    if (this.state.revType !== 4) {
      const width =
        this.state.loaderPaddingRight +
        document.getElementsByClassName("text-column")[0].clientWidth / 2 -
        40;
      this.setState({ loaderPaddingRight: width, windowIsSmall });
    } else this.setState({ windowIsSmall });

    this.createResultCollector();

    this.initQuagga(constraints_width, constraints_height);

    let lastTime = new Date();

    Quagga.onDetected((data) => {
      const currTime = new Date();
      currTime.setSeconds(currTime.getSeconds() - 2);
      if (lastTime > currTime) return;

      lastTime = new Date();

      Quagga.pause();
      const barcode = data.codeResult.code;
      this.getProductUnits(barcode);

      this.setState({
        src: this.state.resultCollector.getResults()[0]
          ? this.state.resultCollector.getResults()[0].frame
          : "",
        photoToBackground: false,
      });
    });

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
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
  }

  getProductUnits = (_barcode) => {
    let barcode = _barcode;
    let {
      selectedProduct,
      barcodeEntered,
      coldRevProductsCheck,
      windowIsSmall,
    } = this.state;
    if (typeof barcode === "object") {
      barcode = barcodeEntered;
    }
    if (!barcode) {
      this.focusBarcodeInput();
      return;
    }
    const params = {
      barcode,
      point: this.state.pointId,
    };
    this.setState({
      isDataSearching: true,
      barcode: "",
      factUnits: "",
      stockUnits: "",
      name: "",
      attributes: "",
    });
    if (this.state.revType !== 4) {
      Axios.get("/api/revision/unitsbybarcode", {
        params,
      })
        .then((data) => {
          return data.data;
        })
        .then((products) => {
          this.setState({
            isDataSearching: false,
            barcodeEntered: "",
            productSelectValue: "",
          });
          if (products.length === 0) {
            this.setState({
              name: "Товар не найден на складе",
              attributes: "",
              barcode,
            });
            this.continueToScan(true);
          } else if (products.length > 1) this.openDetails(products);
          else {
            const currSelectedProduct = products[0];

            if (currSelectedProduct.code === selectedProduct.code) {
              selectedProduct.factUnits = selectedProduct.factUnits
                ? selectedProduct.factUnits + 1
                : 1;
              this.setState({
                selectedProduct,
                name: selectedProduct.name,
                barcode: selectedProduct.code,
                factUnits: selectedProduct.factUnits,
                stockUnits: selectedProduct.units,
                attributes: selectedProduct.attrvalue,
                barcodeEntered: "",
                productSelectValue: "",
              });
              this.continueToScan(true);
              this.focusBarcodeInput();
              return;
            }

            if (
              coldRevProductsCheck[
                products[0].product + " " + products[0].attributes
              ]
            )
              currSelectedProduct.factUnits =
                coldRevProductsCheck[
                  products[0].product + " " + products[0].attributes
                ].factUnits + 1;
            else currSelectedProduct.factUnits = 1;
            this.setState({
              selectedProduct: currSelectedProduct,
              revisionDate: new Date(),
              name: currSelectedProduct.name,
              barcode: currSelectedProduct.code,
              factUnits: currSelectedProduct.factUnits,
              stockUnits: currSelectedProduct.units,
              attributes: currSelectedProduct.attrvalue,
            });
            this.continueToScan(true);
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            isDataSearching: false,
            attributes: "",
            name: "Товар не найден на складе",
            barcode,
            barcodeEntered: "",
            productSelectValue: "",
          });
          this.continueToScan(true);
        })
        .finally(() => {
          this.focusBarcodeInput();
        });
    } else {
      this.setState({ isTempDataSaving: true });
      Axios.get("/api/revision/temprevision", {
        params,
      })
        .then((data) => {
          return data.data;
        })
        .then((products) => {
          console.log(products);
          this.setState({
            isDataSearching: false,
            barcodeEntered: "",
            productSelectValue: "",
            barcode,
          });
          if (products.result.length > 1) this.openDetails(products.result);
          else {
            if (products.revProducts.length === 0) {
              // this.setState({selectedProduct:{}})
              // this.setState({selectedProduct:products.revProducts[0]})
              Alert.warning(
                `Товар по штрих-коду ${barcode} не найден на складе`,
                {
                  position: windowIsSmall ? "top" : "top-right",
                  effect: "bouncyflip",
                  timeout: 3000,
                }
              );
            } else {
              this.setState({
                coldTempRevProducts: products.revProducts,
                selectedProduct: products.revProducts[0],
                coloredRow: true,
              });
              this.startRowCOlorTimer();
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.data.inserted === "success")
            Alert.error(
              "Товар добавлен, но произошла ошибка при отображении изменений. Обновите страницу",
              {
                position: windowIsSmall ? "top" : "top-right",
                effect: "bouncyflip",
                timeout: 10000,
              }
            );
          else
            Alert.error("Произошла ошибка при добавлении товара", {
              position: windowIsSmall ? "top" : "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            });
          this.setState({
            isDataSearching: false,
            attributes: "",
            name: "Товар не найден на складе",
            barcode,
            barcodeEntered: "",
            productSelectValue: "",
          });
        })
        .finally(() => {
          this.continueToScan(true);
          this.setState({ isTempDataSaving: false });
          this.focusBarcodeInput();
        });
    }
  };

  continueToScan = (withTimout) => {
    if (this.state.deviceType !== 2) return;
    withTimout
      ? setTimeout(() => {
          this.restartScan();
        }, 2000)
      : this.restartScan();
  };

  startRowCOlorTimer = (type) => {
    let { myTimeOut } = this.state;
    clearTimeout(myTimeOut);

    myTimeOut =
      type === 1
        ? setTimeout(() => {
            this.setState({ coloredIdx: -1 });
          }, 3000)
        : setTimeout(() => {
            this.setState({ coloredRow: false });
          }, 3000);

    type === 1
      ? this.setState({ myTimeOut, coloredRow: false })
      : this.setState({ myTimeOut, coloredIdx: -1 });
  };

  restartScan = () => {
    this.createResultCollector();
    if (!this.state.keyboardOpened) Quagga.start();
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.clearRect(
      0,
      0,
      parseInt(drawingCanvas.getAttribute("width"), 10),
      parseInt(drawingCanvas.getAttribute("height"), 10)
    );
    this.setState({ src: "", photoToBackground: true });
  };

  handleEmptyFields = () => {
    this.setState({
      barcode: "",
      factUnits: "",
      stockUnits: "",
      name: "",
      selectedProduct: {},
      attributes: "",
      barcodeEntered: "",
      productSelectValue: "",
    });
  };

  openDetails = (products) => {
    this.setState({ modalIsOpen: true, products, revisionDate: new Date() });
  };

  closeDetail = () => {
    this.setState({ modalIsOpen: false });
    this.continueToScan(false);
  };

  onProductChange = (productSelectValue) => {
    if (!productSelectValue.code) {
      this.setState({ productSelectValue: "", barcodeEntered: "" });
      return;
    }
    // this.setState({ productSelectValue, barcodeEntered: productSelectValue.code });
    //делаем поиск по товару в базе
    this.getProductUnits(productSelectValue.code);
  };

  onProductListInput = (productName) => {
    if (productName.length > 0) this.getProducts(productName);
    // else if(this.state.productsForSelect.length===0) this.getProducts(productName);
    // this.getProducts(productName);
  };

  getProducts = (productName) => {
    Axios.get("/api/products/bypoint", {
      params: { productName, point: this.state.pointId },
    })
      .then((res) => res.data)
      .then((list) => {
        const productsForSelect = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });

        this.setState({ productsForSelect });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getColdRevProducts = () => {
    if (this.state.revType === 0) {
      Axios.get("/api/revision/coldrevproducts", {
        params: { point: this.state.pointId },
      })
        .then((data) => {
          return data.data;
        })
        .then((products) => {
          if (products.length > 0) {
            let coldRevProductsCheck = {};
            products.forEach((product) => {
              coldRevProductsCheck[
                product.product + " " + product.attributes
              ] = product;
            });
            this.setState({ coldRevProducts: products, coldRevProductsCheck });
          } else {
            console.log("1");
            this.setState({ coldRevProducts: [], coldRevProductsCheck: {} });
          }
        })
        .catch((err) => {
          console.log("2");
          //this.setState({ coldRevProducts: [], coldRevProductsCheck: {} });
          console.log(err);
        });
    }
  };

  productSelected = (idx) => {
    const selectedProduct = this.state.products[idx];
    const currSelectedProduct = this.state.selectedProduct;
    if (this.state.revType !== 4) {
      const { coldRevProductsCheck } = this.state;
      if (
        currSelectedProduct.code === selectedProduct.code &&
        currSelectedProduct.attributes === selectedProduct.attributes
      ) {
        currSelectedProduct.factUnits = currSelectedProduct.factUnits
          ? currSelectedProduct.factUnits + 1
          : 1;
        this.setState({
          modalIsOpen: false,
          selectedProduct: currSelectedProduct,
          name: currSelectedProduct.name,
          barcode: currSelectedProduct.code,
          factUnits: currSelectedProduct.factUnits,
          stockUnits: currSelectedProduct.units,
          attributes: currSelectedProduct.attrvalue,
          barcodeEntered: "",
          productSelectValue: "",
        });
        this.focusBarcodeInput();
      } else {
        if (
          coldRevProductsCheck[
            selectedProduct.product + " " + selectedProduct.attributes
          ]
        )
          selectedProduct.factUnits =
            coldRevProductsCheck[
              selectedProduct.product + " " + selectedProduct.attributes
            ].factUnits + 1;
        else selectedProduct.factUnits = 1;

        this.setState({
          modalIsOpen: false,
          selectedProduct,
          name: selectedProduct.name,
          barcode: selectedProduct.code,
          factUnits: selectedProduct.factUnits,
          stockUnits: selectedProduct.units,
          attributes: selectedProduct.attrvalue,
          barcodeEntered: "",
          productSelectValue: "",
        });
      }
    } else {
      const { windowIsSmall } = this.state;
      this.setState({ isTempDataSaving: true });
      Axios.get("/api/revision/temprevision", {
        params: {
          barcode: selectedProduct.code,
          point: this.state.pointId,
          product: selectedProduct.product,
          attributes: selectedProduct.attributes,
        },
      })
        .then((data) => {
          return data.data;
        })
        .then((products) => {
          console.log(products);
          if (products.result.length > 1) this.openDetails(products.result);
          else {
            if (products.revProducts.length === 0) {
              Alert.error(
                "Произошла ошибка при отображении изменений. Обновите страницу",
                {
                  position: windowIsSmall ? "top" : "top-right",
                  effect: "bouncyflip",
                  timeout: 10000,
                }
              );
            } else {
              this.setState({
                coldTempRevProducts: products.revProducts,
                barcode: selectedProduct.code,
                coloredRow: true,
              });
              this.startRowCOlorTimer();
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.data.inserted === "success")
            Alert.error(
              "Товар добавлен, но произошла ошибка при отображении изменений. Обновите страницу",
              {
                position: windowIsSmall ? "top" : "top-right",
                effect: "bouncyflip",
                timeout: 10000,
              }
            );
          else
            Alert.error("Произошла ошибка при добавлении товара", {
              position: windowIsSmall ? "top" : "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            });
          this.setState({
            attributes: "",
            name: "Товар не найден на складе",
            barcode: selectedProduct.code,
          });
        })
        .finally(() => {
          this.setState({
            modalIsOpen: false,
            selectedProduct,
            barcodeEntered: "",
            productSelectValue: "",
            isTempDataSaving: false,
            isDataSearching: false,
          });
          this.focusBarcodeInput();
        });
    }
    this.continueToScan(false);
  };

  selledUnitsChanged = (idx, e) => {
    let { coldRevProducts } = this.state;
    //проверка чтобы поле могло быть пустым иначе все отвалится на проверки float isNaN
    if (e.target.value === "") {
      coldRevProducts[idx].selledUnits = 0;
    } else {
      if (isNaN(parseFloat(e.target.value))) return;
      //проверяем если точка последний символ то оставляем все как есть, в ином случае парсим в float
      //эта же провека отсекает все прочие точки которые мы пытаемся ставить если одна точка уже есть
      const selledUnits =
        e.target.value.indexOf(".") === e.target.value.length - 1
          ? e.target.value
          : parseFloat(e.target.value);
      coldRevProducts[idx].selledUnits = selledUnits;
    }
    this.setState(coldRevProducts);
  };

  factUnitsChanged2 = (idx, e) => {
    let { coldRevProducts } = this.state;
    //проверка чтобы поле могло быть пустым иначе все отвалится на проверки float isNaN
    if (e.target.value === "") {
      coldRevProducts[idx].factUnits = 0;
    } else {
      if (isNaN(parseFloat(e.target.value))) return;
      //проверяем если точка последний символ то оставляем все как есть, в ином случае парсим в float
      //эта же провека отсекает все прочие точки которые мы пытаемся ставить если одна точка уже есть
      const factUnits =
        e.target.value.indexOf(".") === e.target.value.length - 1
          ? e.target.value
          : parseFloat(e.target.value);
      coldRevProducts[idx].factUnits = factUnits;
    }
    this.setState(coldRevProducts);
  };

  factUnitsChanged = (e) => {
    const { selectedProduct } = this.state;
    //проверка чтобы поле могло быть пустым иначе все отвалится на проверки float isNaN
    if (e.target.value === "") {
      selectedProduct.factUnits = 0;
      this.setState({ factUnits: "", selectedProduct });
      return;
    } else {
      if (isNaN(parseFloat(e.target.value))) return;
      selectedProduct.factUnits = parseFloat(e.target.value);
      //проверяем если точка последний символ то оставляем все как есть, в ином случае парсим в float
      //эта же провека отсекает все прочие точки которые мы пытаемся ставить если одна точка уже есть
      const factUnits =
        e.target.value.indexOf(".") === e.target.value.length - 1
          ? e.target.value
          : parseFloat(e.target.value);
      this.setState({ factUnits, selectedProduct });
    }
  };

  factUnitsKeyDown = (e) => {
    //38 - arrowUp
    //40 - arrowDown
    //69 - 'e'
    // if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 69)
    //     e.preventDefault()

    //позволяем нажимать все клаиши на которых может быть точка
    if (e.keyCode !== 110 && e.keyCode !== 190 && e.keyCode !== 191) {
      //проверяем если число не парсится в float, и поле не пустое то не даем ничего писать
      if (isNaN(parseFloat(e.target.value)) && e.target.value.length > 0)
        e.preventDefault();
    }
  };

  barcodeChanged = (e) => {
    this.setState({ barcodeEntered: e.target.value, productSelectValue: "" });
  };

  onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) this.getProductUnits(this.state.barcodeEntered);
  };

  handleEndRevision = () => {
    this.handleSend(true);
  };

  focusBarcodeInput = () => {
    // if(this.state.deviceType===1)
    if (!isMobile) {
      this.nameInput.focus();
    }
  };

  handleSend = (isRevisionEnd) => {
    isRevisionEnd = isRevisionEnd === true ? isRevisionEnd : false;
    const {
      pointId,
      selectedProduct,
      username,
      revisionDate,
      windowIsSmall,
      coldRevProductsCheck,
      coldRevProducts,
    } = this.state;
    let { revType } = this.state;

    if (!selectedProduct.product && !isRevisionEnd) {
      return Alert.warning("Товар не выбран", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    if (this.state.factUnits < 0 && !isRevisionEnd) {
      return Alert.warning("Количество по факту не может быть меньше 0", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    if (!this.state.factUnits && this.state.factUnits !== 0 && !isRevisionEnd) {
      return Alert.warning("Поле Количество по факту не может быть пустым", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    if (isRevisionEnd && coldRevProducts.length === 0) {
      return Alert.warning("Для завершения ревизии не выбран ни один товар", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    this.setState({ isDataSearching: true });

    let createdate;

    if (
      coldRevProductsCheck[
        selectedProduct.product + " " + selectedProduct.attributes
      ]
    ) {
      revType = 2;
      createdate =
        coldRevProductsCheck[
          selectedProduct.product + " " + selectedProduct.attributes
        ].date;
    }

    if (isRevisionEnd) {
      revType = 3;
    }

    const products = isRevisionEnd
      ? coldRevProducts.map((selectedProduct) => {
          const unitsSelled = selectedProduct.selledUnits
            ? selectedProduct.selledUnits
            : 0;
          return {
            createdate: selectedProduct.date,
            prodid: selectedProduct.product,
            unitswas: selectedProduct.units,
            time: Moment(revisionDate).format("MM.DD.YYYY HH:mm:ss"),
            attribute: selectedProduct.attributes,
            units: selectedProduct.factUnits - unitsSelled,
            unitsSelled,
          };
        })
      : [
          {
            createdate,
            prodid: selectedProduct.product,
            unitswas: selectedProduct.units,
            time: Moment(revisionDate).format("MM.DD.YYYY HH:mm:ss"),
            attribute: selectedProduct.attributes,
            units: selectedProduct.factUnits,
          },
        ];

    Axios.post("/api/revision", {
      user: username,
      pointid: pointId,
      revtype: revType,
      products,
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        this.setState({ isDataSearching: false });
        if (resp.code === "success") {
          this.handleEmptyFields();
          Alert.success("Успешно", {
            position: windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          this.getColdRevProducts();
        } else {
          Alert.error(
            resp.code === "error" && resp.text
              ? resp.text
              : "Сервис временно не доступен",
            {
              position: windowIsSmall ? "top" : "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        this.getColdRevProducts();
        this.setState({ isDataSearching: false });
        Alert.error("Сервис временно не доступен", {
          position: windowIsSmall ? "top" : "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      })
      .finally(() => {
        this.focusBarcodeInput();
      });
  };

  deleteTempItem = (product, attributes, index) => {
    const { windowIsSmall, coldTempRevProducts, pointId } = this.state;
    this.setState({ isTempDataSaving: true });
    Axios.get("/api/revision/deletetempproduct", {
      params: { product, attributes, point: pointId },
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        const newUnits = coldTempRevProducts[index].factUnits - resp;
        coldTempRevProducts[index].factUnits = newUnits;
        this.setState({
          coldTempRevProducts,
          coloredIdx: resp > 0 ? index : -1,
        });
        if (resp > 0) this.startRowCOlorTimer(1);
      })
      .catch((err) => {
        console.log(err.response);
        Alert.error("Произошла ошибка при удалении товара", {
          position: windowIsSmall ? "top" : "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      })
      .finally(() => {
        this.setState({ isTempDataSaving: false });
        this.focusBarcodeInput();
      });
  };

  handleGoToEditList = () => {
    const { pointId, username, revisionDate } = this.state;
    this.props.history.push("/revision/edit", {
      pointId,
      username,
      revisionDate,
    });
  };

  //удаление товаров из темповой таблицы при введения количества товаров вручную. Холодная ревизия.
  clearColdRevProducts = () => {
    const { pointId, revType, windowIsSmall } = this.state;
    if (revType === 0) {
      Axios.get("/api/revision/deleterevproducts", {
        params: { point: pointId },
      })
        .then((data) => {
          return data.data;
        })
        .then((deleted) => {
          console.log(deleted);
          this.props.history.push("/revision/params");
        })
        .catch((err) => {
          console.log(err);
          Alert.error(`Возникла ошибка при обработке вашего запроса: ${err}`, {
            position: windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        });
    }
  };

  //удаление товаров из темповой таблицы при сканировании товаров подряд. Холодная ревизия.
  clearColdTempRevProducts = () => {
    const { pointId, revType, windowIsSmall } = this.state;
    if (revType === 4) {
      Axios.get("/api/revision/deletetemprevproducts", {
        params: { point: pointId },
      })
        .then((data) => {
          return data.data;
        })
        .then((deleted) => {
          console.log(deleted);
          this.props.history.push("/revision/params");
        })
        .catch((err) => {
          console.log(err);
          Alert.error(`Возникла ошибка при обработке вашего запроса: ${err}`, {
            position: windowIsSmall ? "top" : "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        });
    }
  };

  render() {
    const {
      name,
      barcode,
      stockUnits,
      factUnits,
      src,
      photoToBackground,
      label,
      attributes,
      keyboardOpened,
      barcodeEntered,
      productsForSelect,
      loaderPaddingRight,
      isDataSearching,
      isCameraLoading,
      modalIsOpen,
      products,
      windowIsSmall,
      deviceType,
      productSelectValue,
      coldRevProducts,
      coldTempRevProducts,
      revType,
      coloredRow,
      isTempDataSaving,
      coloredIdx,
    } = this.state;
    return isChrome || isMobile ? (
      <Fragment>
        <ScrollUpButton
          ToggledStyle={isMobile ? { left: 20, right: inherits } : {}}
          style={
            isMobile
              ? {
                  left: -50,
                  right: inherits,
                  transitionProperty: "opacity, left",
                }
              : {}
          }
        />
        <ReactModal
          onRequestClose={() => {
            this.closeDetail();
          }}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <SelectProduct
            products={products}
            closeDetail={this.closeDetail}
            productSelected={(idx) => this.productSelected(idx)}
          />
        </ReactModal>
        <Alert stack={{ limit: 1 }} offset={windowIsSmall ? 0 : 30} />
        {isMobile && (
          <div
            className={`revision-header ${
              isMobile ? "mobile-revision-header" : "window-width"
            }`}
          >
            {/* video-width */}
            <Link
              to={{
                pathname: "/usercabinet/report/reportRevision",
                state: "revision",
              }}
              className="firstElement"
            >
              {!isMobile ? label.header.report : "Отчёт"}
            </Link>
            <span className="emptySapace"></span>
            <a
              href="http://tezportal.ddns.net/public/files/Инструкция_по_ревизии.pdf"
              download
            >
              <li>{label.header.help}</li>
            </a>
            <a href="/revision/params">
              <li>{label.header.params}</li>
            </a>
            <a href="/revision/signout">
              <li>{label.header.exit}</li>
            </a>
          </div>
        )}
        {
          <div className="revision-block">
            {!isMobile && (
              <div
                className={`revision-header ${
                  isMobile ? "mobile-revision-header" : "window-width"
                }`}
              >
                <Link
                  to={{
                    pathname: "/usercabinet/report/reportRevision",
                    state: "revision",
                  }}
                  className="firstElement"
                >
                  {!isMobile ? label.header.report : "Отчёт"}
                </Link>
                <span className="emptySapace"></span>
                <a
                  href="http://tezportal.ddns.net/public/files/Инструкция_по_ревизии.pdf"
                  download
                >
                  <li>{label.header.help}</li>
                </a>
                <a href="/revision/params">
                  <li>{label.header.params}</li>
                </a>
                <a href="/revision/signout">
                  <li>{label.header.exit}</li>
                </a>
              </div>
            )}
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
                    className={`flex center ${
                      isCameraLoading ? "" : "barcode-visible"
                    }`}
                  ></div>
                  {src && (
                    <div
                      className={`${
                        photoToBackground ? "to-backgroud" : ""
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
                  {isTempDataSaving && (
                    <div
                      className="loader loader-text-block"
                      style={{
                        paddingRight: `${loaderPaddingRight}px`,
                        left: "45%",
                        zIndex: "1",
                      }}
                    >
                      <div className="icon"></div>
                    </div>
                  )}
                  <Select
                    name="selectproduct"
                    value={productSelectValue}
                    onChange={this.onProductChange}
                    options={productsForSelect}
                    placeholder="Выберите товар"
                    onInputChange={this.onProductListInput.bind(this)}
                    noOptionsMessage={() => "Товар не найден"}
                    isDisabled={isTempDataSaving}
                  />
                  <div className="mt-10 flex">
                    <input
                      type="text"
                      className="form-control"
                      value={barcodeEntered}
                      name="barcode"
                      autoComplete="off"
                      ref={(input) => {
                        this.nameInput = input;
                      }}
                      placeholder={label.placeholder.enterbarcode}
                      onChange={this.barcodeChanged}
                      onKeyDown={this.onBarcodeKeyDown}
                      disabled={isTempDataSaving}
                    />
                    <button
                      className="btn btn-success ml-10"
                      disabled={isTempDataSaving}
                      onClick={this.getProductUnits}
                    >
                      <span>{icons.magnifyingGlass}</span>
                    </button>
                  </div>
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
                {isTempDataSaving && (
                  <div
                    className="loader loader-text-block"
                    style={{
                      paddingRight: `${loaderPaddingRight}px`,
                      left: "45%",
                      zIndex: "1",
                    }}
                  >
                    <div className="icon"></div>
                  </div>
                )}
                <Select
                  name="selectproduct"
                  value={productSelectValue}
                  onChange={this.onProductChange}
                  options={productsForSelect}
                  placeholder="Выберите товар"
                  onInputChange={this.onProductListInput.bind(this)}
                  noOptionsMessage={() => "Товар не найден"}
                  isDisabled={isTempDataSaving}
                />
                <div className="mt-10 flex">
                  <input
                    type="text"
                    className="form-control"
                    value={barcodeEntered}
                    name="barcode"
                    autoComplete="off"
                    ref={(input) => {
                      this.nameInput = input;
                    }}
                    placeholder={label.placeholder.enterbarcode}
                    onChange={this.barcodeChanged}
                    onKeyDown={this.onBarcodeKeyDown}
                    disabled={isTempDataSaving}
                  />
                  <button
                    className="btn btn-success ml-10"
                    disabled={isTempDataSaving}
                    onClick={this.getProductUnits}
                  >
                    <span>{icons.magnifyingGlass}</span>
                  </button>
                </div>
              </div>
            )}
            {revType !== 4 && (
              <div
                className="video-width text-block"
                style={{
                  paddingTop: keyboardOpened && isMobile ? "60px" : "0px",
                }}
              >
                <div className="table-loader">
                  {isDataSearching && (
                    <div
                      className="loader loader-text-block"
                      style={{ paddingRight: `${loaderPaddingRight}px` }}
                    >
                      <div className="icon"></div>
                    </div>
                  )}
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>{label.colnames.name}</td>
                        <td
                          className={`${
                            isDataSearching ? "without-border-top" : ""
                          } text-column`}
                        >
                          {name}
                        </td>
                      </tr>
                      {attributes ? (
                        <tr>
                          <td>{label.colnames.attributes}</td>
                          <td
                            className={`${
                              isDataSearching ? "without-border-top" : ""
                            } text-column`}
                          >
                            {attributes}
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td>{label.colnames.barcode}</td>
                        <td
                          className={`${
                            isDataSearching ? "without-border-center" : ""
                          }`}
                        >
                          {barcode}
                        </td>
                      </tr>
                      <tr>
                        <td>{label.colnames.stockUnits}</td>
                        <td
                          className={`${
                            isDataSearching ? "without-border-center" : ""
                          }`}
                        >
                          {stockUnits}
                        </td>
                      </tr>
                      <tr>
                        <td className="vertical-align-inherit">
                          {label.colnames.factUnits}
                        </td>
                        <td
                          className={`${
                            isDataSearching ? "without-border-bottom" : ""
                          } vertical-align-inherit`}
                        >
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            value={factUnits}
                            name="factUnits"
                            onChange={this.factUnitsChanged}
                            onKeyDown={this.factUnitsKeyDown}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row mt-10">
                  <div className="col-md-12 text-center">
                    <button
                      className="btn btn-sm btn-success send_data"
                      disabled={isDataSearching}
                      onClick={this.handleSend}
                    >
                      {label.title.send}
                    </button>
                    <button
                      className="btn btn-w-icon delete-item empty_fields"
                      title={label.title.delete}
                      onClick={this.handleEmptyFields}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mb-100 edited-table">
              {coldRevProducts.length > 0 && revType === 0 && (
                <Fragment>
                  <span style={{ fontSize: "12px" }}>
                    Перейдите к завершению ревизии
                  </span>
                  <table className="data-table editedProductsTable">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "125px" }}>Наименование</th>
                        <th style={{ minWidth: "53px" }}>Было</th>
                        <th style={{ minWidth: "57px" }}>
                          Отсканированное количество
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coldRevProducts.map((product, idx) => (
                        <tr key={idx}>
                          <td>
                            {product.name} {product.attrvalue}
                          </td>
                          <td>{product.units}</td>
                          <td>{product.factUnits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center">
                    <button
                      className="btn btn-sm btn-success mt-10"
                      onClick={this.handleGoToEditList}
                    >
                      {label.title.gotoeditlist}
                    </button>
                  </div>
                </Fragment>
              )}
              {coldRevProducts.length > 0 && revType === 0 && (
                <div className="text-center">
                  <button
                    className="btn btn-sm btn-danger mt-10"
                    onClick={this.clearColdRevProducts}
                  >
                    Очистить таблицу
                  </button>
                </div>
              )}
              {coldTempRevProducts.length > 0 && revType === 4 && (
                <Fragment>
                  <span style={{ fontSize: "12px" }}>
                    Перейдите к завершению ревизии
                  </span>
                  <table className="data-table editedProductsTable">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "125px" }}>Наименование</th>
                        <th style={{ minWidth: "57px" }}>
                          Отсканированное количество
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coldTempRevProducts.map((product, idx) => (
                        <tr
                          key={idx}
                          className={`${
                            idx === 0 && coloredRow ? "coloredRow" : ""
                          } ${idx === coloredIdx ? "coloredRowDeleted" : ""}`}
                        >
                          <td>
                            {product.name} {product.attrvalue}
                          </td>
                          <td>
                            {product.factUnits}
                            <button
                              className="btn btn-success"
                              style={{ float: "right" }}
                              disabled={isTempDataSaving}
                              onClick={() => {
                                this.deleteTempItem(
                                  product.product,
                                  product.attributes,
                                  idx
                                );
                              }}
                            >
                              <span>-1</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center">
                    <button
                      className="btn btn-sm btn-success mt-10"
                      disabled={isTempDataSaving}
                      onClick={this.handleGoToEditList}
                    >
                      {label.title.gotoeditlist}
                    </button>
                  </div>
                </Fragment>
              )}
              {coldTempRevProducts.length > 0 && revType === 4 && (
                <div className="text-center">
                  <button
                    className="btn btn-sm btn-danger mt-10"
                    onClick={this.clearColdTempRevProducts}
                  >
                    Очистить таблицу
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      </Fragment>
    ) : (
      <div>Для ревизии рекомендуется использовать браузер Chrome</div>
    );
  }
}

export default Revision;
