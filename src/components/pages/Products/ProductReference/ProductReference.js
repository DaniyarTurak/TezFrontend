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
  const [productList, setProductList] = useState("CreateProduct");
  const [productBarcode, setProductBarcode] = useState("");
  const [productSelectValue, setProductSelectValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    if (productSelectValue.label) {
      getProducts();
      setProductBarcode(productSelectValue.code);
    }
  }, [productSelectValue]);

  const changeProductList = (e) => {
    getProducts();
    setProductList(e.target.name);
    setReference({});
    setProductBarcode("");
    setProductSelectValue("");
  };

  const getProductByBarcode = (pb) => {
    const barcode = pb || productBarcode;
    Axios.get("/api/products/barcode", { params: { barcode } })
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
      console.log(pB);
      return;
    } else if (pB.length === 0) {
      setProductBarcode("");
      setProductSelectValue("");
      return;
    }
  };
  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(productBarcode);
  };

  const getProductReference = () => {
    Axios.get("/api/products/barcode", {
      params: { barcode: productSelectValue.code },
    })
      .then((res) => res.data)
      .then((res) => {
        setReference(res);
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
      <div className="text-center">
        <div className={`row ${productList ? "pb-10" : ""}`}>
          {productreference.map((create) => (
            <div className="col-md-3 create-btn-block" key={create.id}>
              <button
                className={`btn btn-sm btn-block btn-create ${
                  productList === create.route ? "btn-info" : "btn-outline-info"
                }`}
                name={create.route}
                onClick={changeProductList}
              >
                {create.caption}
              </button>
            </div>
          ))}
        </div>
        {productList && (
          <Fragment>
            <div className="empty-space" />
            <div className="row mt-10">
              <div className="col-md-12">
                {productList === "CreateProduct" && (
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
                {productList === "ProductList" && (
                  <ProductReferenceList
                    reference={reference}
                    getProductReference={getProductReference}
                    productBarcode={productBarcode}
                    onBarcodeChange={onBarcodeChange}
                    onBarcodeKeyDown={onBarcodeKeyDown}
                    productSelectValue={productSelectValue}
                    setProductBarcode={setProductBarcode}
                    productOptions={productOptions}
                    productListChange={productListChange}
                    onProductListChange={onProductListChange}
                    getProducts={getProducts}
                    getBarcodeProps={getProductByBarcode}
                    setReference={setReference}
                    getProductByBarcode={getProductByBarcode}
                  />
                )}
                {productList === "UpdateCategoryPage" && <UpdateCategoryPage />}
                {productList === "AttrSprPage" && <AttrSprPage />}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
