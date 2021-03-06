import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import Searching from "../../../Searching";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Characteristics from "./Characteristics";
import Grid from "@material-ui/core/Grid";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "600px",
    width: "700px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

const CancelButton = withStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "#DCDCDC",
    "&:hover": {
      backgroundColor: "#D3D3D3",
    },
  },
}))(Button);

ReactModal.setAppElement("#root");

export default function PageN1({ stockFrom, invoicenumber, productListProps }) {
  const [amountExceeds, setAmountExceeds] = useState(false);
  const [detail, setDetail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productBarcode, setProductBarcode] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [writeoffAmount, setWriteoffAmount] = useState(0);
  const [writeoffReason, setWriteoffReason] = useState("");
  const [prodName, setProdName] = useState("");

  useEffect(() => {
    getStockCurrentProducts();
    getInvoiceProducts();
  }, []);

  const getInvoiceProducts = () => {
    setLoading(true);
    Axios.get("/api/invoice/stockcurrent/product", {
      params: { invoicenumber },
    })
      .then((res) => res.data)
      .then((res) => {
        setProductList(res);
        setLoading(false);
        productListProps(res);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
        console.log(err);
      });
  };

  const getStockCurrentProducts = (productName) => {
    Axios.get("/api/products/stockcurrent/stock", {
      params: {
        stockid: stockFrom.value,
        productName,
        isWeightProduct: true,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        const opt = res.map((product) => {
          return {
            label:
              product.name.trim() +
              (product.attributescaption ? ", " : "") +
              product.attributescaption +
              " [" +
              product.unitspr_shortname +
              "]",
            value: product.id,
            code: product.code,
            attributes: product.attributes,
          };
        });
        setProductOptions(opt);
      })
      .catch((err) => {
        ErrorAlert(err);
        console.log(err);
      });
  };

  const getStockCurrentProductsBarcode = (barcode) => {
    if (barcode) {
      Axios.get("/api/products/stockcurrent/stock", {
        params: {
          stockid: stockFrom.value,
          barcode,
          isWeightProduct: true,
        },
      })
        .then((res) => res.data)
        .then((res) => {
          if (res.length === 0) return;
          if (res.length === 1) {
            const product = res[0];
            const prod = {
              label:
                product.name.trim() +
                (product.attributescaption ? ", " : "") +
                product.attributescaption +
                " [" +
                product.unitspr_shortname +
                "]",
              value: product.id,
              code: product.code,
              attributes: product.attributes,
            };
            setProductSelectValue(prod);

            getStockCurrentDetail(product.id);
          } else {
            setProdName(res[0].name);
            let arr = [];
            res.forEach((element) => {
              if (Number(element.units) > 0) {
                arr.push(element);
              }
            });
            if (arr.length !== 0) {
              setProducts(arr);
              setModalOpen(true);
            } else {
              ErrorAlert("?????????? ???????????????????? ???? ????????????");
            }
          }
        })
        .catch((err) => {
          ErrorAlert(err);
          console.log(err);
        });
    }
  };

  const onBarcodeChange = (e) => {
    const pb = e.target.value.toUpperCase();
    setProductBarcode(pb);
    if (!pb) {
      setProductSelectValue("");
      setDetail({});
      setWriteoffAmount("");
      setWriteoffReason("");
      return;
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getStockCurrentProductsBarcode(productBarcode);
  };

  const onProductListChange = (inputValue) => {
    if (inputValue.length > 0) getStockCurrentProducts(inputValue);
  };

  const productListChange = (psv) => {
    setProductSelectValue(psv);

    if (psv.length === 0) {
      setProductBarcode("");
      setDetail({});
      setWriteoffAmount(0);
      setWriteoffReason("");
      return;
    }
    setWriteoffAmount(0);
    setProductBarcode(psv.code);
    getStockCurrentDetail(psv.value);
  };

  const onReasonChange = (e) => {
    const wr = e.target.value;
    setWriteoffReason(wr);
  };

  const selectAttribute = (product) => {
    const psv = {
      label:
        product.name.trim() +
        (product.attributescaption ? ", " : "") +
        product.attributescaption,
      value: product.id,
      code: product.code,
      attributes: product.attributes,
    };
    setProductSelectValue(psv);
    setModalOpen(false);
    getStockCurrentDetail(product.id);
  };

  const getStockCurrentDetail = (stockcurrentid) => {
    if (stockcurrentid) {
      Axios.get("/api/stockcurrent/detail", { params: { stockcurrentid } })
        .then((res) => res.data)
        .then((res) => {
          setDetail(res);
        })
        .catch((err) => {
          ErrorAlert(err);
          console.log(err);
        });
    } else {
      setDetail({});
    }
  };

  const addProduct = () => {
    if (!productSelectValue.value || !writeoffAmount || !writeoffReason) {
      return Alert.info(
        !productSelectValue.value
          ? "???????????????? ??????????"
          : !writeoffAmount
            ? "?????????????? ???????????????????? ?????? ????????????????"
            : !writeoffReason
              ? "?????????????? ?????????????? ?????? ????????????????"
              : "",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }
    if (writeoffAmount <= 0) {
      return Alert.info("???????????????????? ?????? ???????????????? ???????????? ???????? ???????????? ????????", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    let pl = productList;
    const alreadyExist = pl.filter(
      (product) =>
        product.code === productSelectValue.code &&
        product.attributes === productSelectValue.attributes
    );
    if (alreadyExist.length > 0) {
      return Alert.info(
        "???????????? ?????????? ?????? ?? ????????????, ?????????????? ???????????? ???? ??????????????, ?? ?????????? ?????????????? ??????????.",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }

    const reqdata = {
      invoice: invoicenumber,
      type: "7",
      stockcurrentfrom: [
        {
          id: productSelectValue.value,
          amount: writeoffAmount,
          reason: writeoffReason,
          attributes: productSelectValue.attributes,
          SKU: null,
          newprice: detail.price
        },
      ],
    };

    Axios.post("/api/invoice/add/product", reqdata)
      .then(() => {
        const newProduct = {
          id: productSelectValue.value,
          code: productSelectValue.code,
          name: productSelectValue.label,
          amount: writeoffAmount,
          reason: writeoffReason,
          attributes: productSelectValue.attributes,
        };
        pl.push(newProduct);
        setProductList(pl);
        setWriteoffAmount(0);
        setWriteoffReason("");
        setProductSelectValue("");
        setProductBarcode("");
        setDetail("");
        setAmountExceeds(false);
        productListProps(pl);
        getInvoiceProducts();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const removeProduct = (item) => {
    const newProductList = productList.filter((pl) => {
      return pl !== item;
    });

    const req = {
      invoice: invoicenumber,
      stock: item.stock || item.id,
      attributes: item.attributes,
    };

    Axios.post("/api/invoice/delete/product", req)
      .then(() => {
        setProductList(newProductList);
        productListProps(newProductList);
        Alert.success("?????????? ???????????? ???? ????????????", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onAmountChange = (e) => {
    let amount = isNaN(e.target.value) ? 0 : e.target.value;
    if (amount > detail.units) {
      setAmountExceeds(true);
      setWriteoffAmount(amount);
    } else {
      setAmountExceeds(false);
      setWriteoffAmount(amount);
    }
  };

  return (
    <div className="product-write-off-page-n1">
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Characteristics
              products={products}
              prodName={prodName}
              selectAttribute={selectAttribute}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <CancelButton
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                ????????????
              </CancelButton>
            </Grid>
          </Grid>
        </Grid>
      </ReactModal>
      <div className="row">
        <div className="col-md-12">
          <label htmlFor="">???????????????? ???????????? ???? ????????????</label>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="barcode"
            value={productBarcode}
            className="form-control"
            placeholder="?????????????? ?????? ???????????????????????? ?????????? ??????"
            onChange={onBarcodeChange}
            onKeyDown={onBarcodeKeyDown}
          />
        </div>
        <div className="col-md-6 zi-3">
          <Select
            name="productList"
            value={productSelectValue}
            noOptionsMessage={() => "?????????? ???? ????????????"}
            onChange={productListChange}
            placeholder="???????????????? ?????????? ???? ????????????"
            onInputChange={onProductListChange.bind(this)}
            options={productOptions || []}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>?????????????? ???????????????????? ?????? ????????????????</label>
          <div className="input-group">
            <div className="input-group-prepend">
              {Object.keys(detail).length > 0 && (
                <Fragment>
                  <span className="input-group-text">
                    {`${detail.units === 0
                      ? "?????????? ???? ???????????? ??????????????????????"
                      : "?????????????? ???? ????????????: "
                      } ${detail.units}`}
                  </span>
                  <span className="input-group-text">
                    {`???????? ???? ????????????: ${detail.price}`}
                  </span>
                  <span className="input-group-text">
                    {`???????? ??????????????: ${detail.purchaseprice}`}
                  </span>
                </Fragment>
              )}
            </div>
            <input
              type="text"
              name="writeoffAmount"
              className="form-control"
              placeholder="???????????????????? ?????? ????????????????"
              value={writeoffAmount}
              onChange={onAmountChange}
            />
          </div>
          {amountExceeds && (
            <span className="message text-danger">
              ???????????????????? ???? ?????????? ?????????????????? {detail.units}
            </span>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>?????????????? ?????????????? ????????????????</label>
          <textarea
            type="text"
            name="writeoffReason"
            rows="3"
            className="form-control"
            placeholder="?????????????? ???????????????? ???????????? ???? ????????????"
            value={writeoffReason}
            onChange={onReasonChange}
          />
        </div>
      </div>
      <div className={`row mt-10 ${productList.length > 0 ? "pb-10" : ""}`}>
        <div className="col-md-12 text-right">
          <button
            className="btn btn-info"
            onClick={addProduct}
            style={{ zIndex: 0 }}
            disabled={amountExceeds}
          >
            ????????????????
          </button>
        </div>
      </div>
      {isLoading && <Searching />}
      {!isLoading && productList.length > 0 && (
        <Fragment>
          <div className="empty-space"></div>
          <table className="table table-hover mt-10">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>??????????????</th>
                <th style={{ width: "10%" }}>?????????? ??????</th>
                <th style={{ width: "20%" }} className="text-center">
                  ???????????????????? ?????? ????????????????
                </th>
                <th style={{ width: "20%" }} className="text-center">
                  ???????? ????????????????????
                </th>
                <th style={{ width: "40%" }}>??????????????</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, idx) => {
                return (
                  <tr key={idx}>
                    <td>{product.name}</td>
                    <td>{product.code}</td>
                    <td className="text-center">{product.amount}</td>
                    <td className="text-center">{product.total_price} ????.</td>
                    <td>{product.reason}</td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon delete-item"
                        onClick={() => {
                          removeProduct(product);
                        }}
                      ></button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <th>??????????</th>
                <td />
                <th className="text-center">
                  {productList
                    .reduce((prev, cur) => {
                      const curAmount = parseFloat(cur.amount);
                      return (
                        prev + (curAmount > 0 ? curAmount : 0)
                      );
                    }, 0)}
                </th>
                <th className="text-center">
                  {productList
                    .reduce((prev, cur) => {
                      const curPrice = parseFloat(cur.total_price);
                      return (
                        prev + (curPrice > 0 ? curPrice : 0)
                      );
                    }, 0)} ????.
                </th>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
}
