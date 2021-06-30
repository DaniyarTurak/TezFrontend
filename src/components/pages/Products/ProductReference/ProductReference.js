import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import ProductReferenceList from "./ProductReferenceList";
import { makeStyles } from "@material-ui/core/styles";
import "./product-reference.sass";
import productreference from "../../../../data/productreference.json";
import CreateProduct from "./CreateProduct";
import UpdateCategoryPage from "../../Updates/UpdateCategoryPage";
import AttrSprPage from "../../AttrSprPage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

export default function ProductReference() {
  const classes = useStyles();
  const [reference, setReference] = useState([]);
  const [currentTab, setCurrentTab] = useState("CreateProduct");
  const [productBarcode, setProductBarcode] = useState("");
  const [productSelectValue, setProductSelectValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [capations, setCapations] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    if (productSelectValue.label) {
      getProducts();
      setProductBarcode(productSelectValue.code);
    }
  }, [productSelectValue]);

  const changeProductList = (e) => {
    getProducts();
    setCurrentTab(e.target.name);
    setReference({});
    setProductBarcode("");
    setProductSelectValue("");
  };

  const getProductByBarcode = (pb) => {
    const barcode = pb.trim() || productBarcode.trim();
    Axios.get("/api/nomenclature", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        let productSelectValue = {
          label: product.name,
          value: product.id,
          code: product.code,
        };
        setProductSelectValue(productSelectValue);
      })
      .catch((err) => {
        console.log(err);
      });
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
      return;
    }
  };
  const onBarcodeKeyDown = (e, barcode) => {
    if (e.keyCode === 13) {
      getProductByBarcode(barcode);
    }
  };

  const getProductReference = () => {
    Axios.get("/api/nomenclature", {
      params: { barcode: productSelectValue.code },
    })
      .then((res) => res.data)
      .then((res) => {
        setReference(res);
        setCapations(res.attributescaption);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (inp) => {
    Axios.get("/api/products", {
      params: { productName: inp ? inp : productSelectValue },
    })
      .then((res) => res.data)
      .then((list) => {
        setProductsList(list);
        const productOptionsChanged = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
            category: product.catname,
            brand: product.brandname,
            nds: product.taxid,
          };
        });
        setProductOptions(productOptionsChanged);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const productListChange = (e, productSelectValueChanged) => {
    setProductSelectValue(productSelectValueChanged);
    if (productSelectValueChanged === null) {
      setProductSelectValue("");
      setProductBarcode("");
      getProducts([]);
      return;
    }
    if (!productSelectValueChanged.code) {
      return setProductBarcode();
    }
  };

  const onProductListChange = (e, productName) => {
    getProducts(productName);
  };

  return (
    <div className={classes.root}>
      <div>
        <div className={`row ${currentTab ? "pb-10" : ""}`}>
          {productreference.map((create) => (
            <div className="col-md-3 create-btn-block" key={create.id}>
              <button
                className={`btn btn-sm btn-block btn-create ${currentTab === create.route ? "btn-info" : "btn-outline-info"
                  }`}
                name={create.route}
                onClick={changeProductList}
              >
                {create.caption}
              </button>
            </div>
          ))}
        </div>
        {currentTab && (
          <Fragment>
            <div className="empty-space" />
            <div className="row mt-10">
              <div className="col-md-12">
                {currentTab === "CreateProduct" && (
                  <CreateProduct
                    reference={reference}
                    getProductReference={getProductReference}
                    productBarcode={productBarcode}
                    onBarcodeChange={onBarcodeChange}
                    onBarcodeKeyDown={onBarcodeKeyDown}
                    productSelectValue={productSelectValue}
                    setProductBarcode={setProductBarcode}
                    productListChange={productListChange}
                    onProductListChange={onProductListChange}
                    getProducts={getProducts}
                    setReference={setReference}
                  />
                )}
                {currentTab === "ProductList" && (
                  <ProductReferenceList
                    productsList={productsList}
                    productBarcode={productBarcode}
                    setProductSelectValue={setProductSelectValue}
                    reference={reference}
                    getProductReference={getProductReference}
                    onBarcodeChange={onBarcodeChange}
                    onBarcodeKeyDown={onBarcodeKeyDown}
                    productSelectValue={productSelectValue}
                    productOptions={productOptions}
                    productListChange={productListChange}
                    onProductListChange={onProductListChange}
                    getProducts={getProducts}
                    getBarcodeProps={getProductByBarcode}
                    getProductByBarcode={getProductByBarcode}
                    capations={capations}
                  />
                )}
                {currentTab === "UpdateCategoryPage" && <UpdateCategoryPage />}
                {currentTab === "AttrSprPage" && <AttrSprPage />}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
