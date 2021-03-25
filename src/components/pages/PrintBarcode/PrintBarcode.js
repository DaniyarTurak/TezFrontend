import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import "./print-barcode.sass";

import ComponentToPrintIMG from "./ComponentToPrints/ComponentToPrintIMG";
import ComponentToPrintSVG from "./ComponentToPrints/ComponentToPrintSVG";
import ComponentToPrintPrice from "./ComponentToPrints/ComponentToPrintPrice";
import ComponentToPrint30x20 from "./ComponentToPrints/ComponentToPrint30x20";
import ComponentWithNoPrice30x20 from "./ComponentToPrints/ComponentWithNoPrice30x20";
import ComponentToPrint60x30 from "./ComponentToPrints/ComponentToPrint60x30";
import BarcodeAttributes from "./BarcodeComponents/BarcodeAttributes";
import BarcodeOptions from "./BarcodeComponents/BarcodeOptions";
import FirstType from "./BarcodeComponents/FirstType";
import SecondType from "./BarcodeComponents/SecondType";
import ThirdType from "./BarcodeComponents/ThirdType";
import FourthType from "./BarcodeComponents/FourthType";
import FifthType from "./BarcodeComponents/FifthType";
import SixthType from "./BarcodeComponents/SixthType";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

export default function PrintBarcode({ history }) {
  const classes = useStyles();
  const [attr, setAttr] = useState("");
  const [brand, setBrand] = useState("");
  const [filterValue, setFilterValue] = useState({
    value: "60",
    label: "60мм",
  });
  const [fontSize, setFontSize] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [OS, setOS] = useState("Win");
  const [point, setPoint] = useState("");
  const [points, setPoints] = useState([]);
  const [printTypeRotate, setPrintTypeRotate] = useState(false);
  const [printType2Rotate, setPrintType2Rotate] = useState(false);
  const [printType3Rotate, setPrintType3Rotate] = useState(false);
  const [printType4Rotate, setPrintType4Rotate] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [productBarcode, setProductBarcode] = useState("");
  const [productSelectValue, setProductSelectValue] = useState("");
  const [selectedPrintType, setSelectedPrintType] = useState({
    value: "1",
    label: "Обычный svg",
  });

  const componentRef1 = useRef();
  const componentRef2 = useRef();
  const componentRef3 = useRef();
  const componentRef4 = useRef();
  const componentRef5 = useRef();
  const componentRef6 = useRef();

  const fontSizes = [
    { value: "0", label: "маленький текст" },
    { value: "1", label: "большой текст" },
  ];

  const options = [
    { value: "80", label: "80мм" },
    { value: "60", label: "60мм" },
  ];
  const printTypes = [
    { value: "1", label: "Обычный svg" },
    { value: "2", label: "Обычный img" },
    { value: "3", label: "С ценой svg" },
    { value: "4", label: "С ценой 30x20" },
    { value: "5", label: "С ценой 60x30" },
    { value: "6", label: "30x20" },
  ];

  useEffect(() => {
    getPoints();
    const oscpu = navigator.oscpu || navigator.platform;
    const OS = oscpu.toLowerCase().includes("win") ? "Win" : "Linux";
    setOS(OS);
  }, []);

  useEffect(() => {
    if (productSelectValue.label) {
      getBarcode(productSelectValue.code);
      setProductBarcode(productSelectValue.code);
    }
  }, [productSelectValue]);

  const getBarcode = (barcode) => {
    Axios.get("/api/barcode", { params: { barcode, OS } })
      .then((res) => res.data)
      .then((png) => {
        const src = "data:image/png;base64," + png.toString("base64");
        setImgSrc(src);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (inputValue, pointSelected) => {
    const p = pointSelected ? pointSelected : point;
    const pointValue = p ? p.value : null;
    Axios.get("/api/products/bypoint", {
      params: { productName: inputValue, point: pointValue },
    })
      .then((res) => res.data)
      .then((list) => {
        const productOptions = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
            price: product.price,
          };
        });
        setProductOptions(productOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByBarcode = (pb) => {
    if (!point) return;
    const barcode = pb || productBarcode;

    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        let productSelectValue = {
          label: product.name,
          value: product.id,
          code: product.code,
          price: product.price,
        };
        setProductSelectValue(productSelectValue);
        if (productSelectValue.label) getBarcode(productSelectValue.code);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterChange = (filterValue) => {
    if (filterValue.length === 0) return;
    setFilterValue(filterValue);
  };

  const onBarcodeChange = (e) => {
    const pB = e.target.value.toUpperCase();
    if (pB.length > 0) {
      getProductByBarcode(pB);
      setProductBarcode(pB);
      return;
    } else if (pB.length === 0) {
      setProductBarcode("");
      setProductSelectValue("");
      //getProducts(null);
      return;
    }
  };
  const onBrandChange = (e) => {
    const brand = e.target.value;
    setBrand(brand);
  };

  const onAttrChange = (e) => {
    const attr = e.target.value;
    setAttr(attr);
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(productBarcode);
  };

  const onProductListChange = (e, productName) => {
    getProducts(productName);
  };

  const productListChange = (e, productSelectValueChanged) => {
    setProductSelectValue(productSelectValueChanged);
    if (productSelectValueChanged === null) {
      setProductSelectValue({ value: "", label: "", code: "" });
      setProductBarcode("");
      return;
    }
    if (!productSelectValueChanged.code) {
      return setProductBarcode("");
    }
  };

  const getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        const points = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints(points);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFontSizeChange = (e, f) => {
    if (f.length === 0) return;
    setFontSize(f);
  };

  const pointsChange = (e, p) => {
    setPoint(p);
    if (p === null) {
      return;
    } else if (p.value) {
      getProducts(null, p);
    }
  };

  const printTypesChanged = (e, spType) => {
    if (!spType) return;
    setSelectedPrintType(spType);
  };

  const handleRotate0 = () => {
    const rotate = !printTypeRotate;
    setPrintTypeRotate(rotate);
  };

  const handleRotate = () => {
    const rotate = !printType2Rotate;
    setPrintType2Rotate(rotate);
  };

  const handleRotate2 = () => {
    const rotate = !printType3Rotate;
    setPrintType3Rotate(rotate);
  };

  const handleRotate4 = () => {
    const rotate = !printType4Rotate;
    setPrintType4Rotate(rotate);
  };

  const handleInvoice = () => {
    history.push({
      pathname: "printbarcode/invoice",
    });
  };

  return (
    <div className={classes.root}>
      <BarcodeOptions
        classes={classes}
        selectedPrintType={selectedPrintType}
        points={points}
        pointsChange={pointsChange}
        handleInvoice={handleInvoice}
        productBarcode={productBarcode}
        onBarcodeKeyDown={onBarcodeKeyDown}
        onBarcodeChange={onBarcodeChange}
        productOptions={productOptions}
        productSelectValue={productSelectValue}
        productListChange={productListChange}
        onProductListChange={onProductListChange}
        printTypes={printTypes}
        printTypesChanged={printTypesChanged}
      />

      {(selectedPrintType.value === "3" ||
        selectedPrintType.value === "4" ||
        selectedPrintType.value === "5" ||
        selectedPrintType.value === "6") &&
        productBarcode &&
        productSelectValue.label && (
          <BarcodeAttributes
            classes={classes}
            selectedPrintType={selectedPrintType}
            brand={brand}
            onBrandChange={onBrandChange}
            attr={attr}
            onAttrChange={onAttrChange}
            fontSizes={fontSizes}
            onFontSizeChange={onFontSizeChange}
          />
        )}
      {selectedPrintType.value === "1" &&
        productBarcode &&
        productSelectValue.label && (
          <FirstType
            classes={classes}
            productBarcode={productBarcode}
            printTypeRotate={printTypeRotate}
            productSelectValue={productSelectValue}
            componentRef2={componentRef2}
            handleRotate0={handleRotate0}
          />
        )}

      {selectedPrintType.value === "2" &&
        productBarcode &&
        productSelectValue.label &&
        imgSrc && (
          <SecondType
            classes={classes}
            options={options}
            filterChange={filterChange}
            productSelectValue={productSelectValue}
            componentRef1={componentRef1}
            handleRotate={handleRotate}
            printType2Rotate={printType2Rotate}
            imgSrc={imgSrc}
            OS={OS}
          />
        )}

      {selectedPrintType.value === "3" &&
        productBarcode &&
        productSelectValue.label && (
          <ThirdType
            classes={classes}
            attr={attr}
            productSelectValue={productSelectValue}
            componentRef3={componentRef3}
            handleRotate2={handleRotate2}
            printType3Rotate={printType3Rotate}
            brand={brand}
            productBarcode={productBarcode}
          />
        )}

      {selectedPrintType.value === "4" &&
        productBarcode &&
        productSelectValue.label && (
          <FourthType
            classes={classes}
            attr={attr}
            productSelectValue={productSelectValue}
            componentRef4={componentRef4}
            handleRotate2={handleRotate2}
            printType3Rotate={printType3Rotate}
            productBarcode={productBarcode}
          />
        )}

      {selectedPrintType.value === "5" &&
        productBarcode &&
        productSelectValue.label && (
          <FifthType
            classes={classes}
            attr={attr}
            productSelectValue={productSelectValue}
            componentRef5={componentRef5}
            handleRotate2={handleRotate2}
            printType3Rotate={printType3Rotate}
            productBarcode={productBarcode}
            fontSize={fontSize}
          />
        )}

      {selectedPrintType.value === "6" &&
        productBarcode &&
        productSelectValue.label && (
          <SixthType
            classes={classes}
            attr={attr}
            productSelectValue={productSelectValue}
            componentRef6={componentRef6}
            handleRotate4={handleRotate4}
            printType4Rotate={printType4Rotate}
            productBarcode={productBarcode}
          />
        )}

      {productBarcode && imgSrc && (
        <div hidden>
          <ComponentToPrintIMG
            productName={productSelectValue.label}
            OS={OS}
            src={imgSrc}
            filterValue={filterValue}
            printTypeRotate={printType2Rotate}
            ref={componentRef1}
          />
          <ComponentToPrintSVG
            productBarcode={productBarcode}
            productName={productSelectValue.label}
            OS={OS}
            printTypeRotate={printTypeRotate}
            ref={componentRef2}
          />
          <ComponentToPrintPrice
            productBarcode={productBarcode}
            productName={productSelectValue.label}
            OS={OS}
            brand={brand}
            attr={attr}
            printTypeRotate={printType3Rotate}
            price={productSelectValue.price}
            ref={componentRef3}
          />
          <ComponentToPrint30x20
            productBarcode={productBarcode}
            productName={
              productSelectValue.label && productSelectValue.label.slice(0, 63)
            }
            OS={OS}
            brand={brand}
            attr={attr}
            printTypeRotate={printType3Rotate}
            price={productSelectValue.price}
            ref={componentRef4}
          />
          <ComponentToPrint60x30
            productBarcode={productBarcode}
            productName={
              productSelectValue.label && productSelectValue.label.slice(0, 63)
            }
            OS={OS}
            brand={brand}
            attr={attr}
            printTypeRotate={printType3Rotate}
            price={productSelectValue.price}
            ref={componentRef5}
            fontSize={fontSize}
          />
          <ComponentWithNoPrice30x20
            productBarcode={productBarcode}
            productName={
              productSelectValue.label && productSelectValue.label.slice(0, 63)
            }
            attr={attr}
            printTypeRotate={printType4Rotate}
            ref={componentRef6}
          />
        </div>
      )}
    </div>
  );
}
