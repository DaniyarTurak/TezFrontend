import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import Searching from "../../../Searching";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

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
            setProducts(res);
            setModalOpen(true);
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

  const onAmountChange = (e) => {
    const amount = isNaN(e.target.value) ? 0 : e.target.value;
    if (writeoffAmount > detail.units) {
      setAmountExceeds(true);
    } else {
      setWriteoffAmount(amount);
      setAmountExceeds(false);
    }
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
          ? "Выберите товар"
          : !writeoffAmount
          ? "Внесите количество для списания"
          : !writeoffReason
          ? "Внесите причину для списания"
          : "",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }
    if (writeoffAmount <= 0) {
      return Alert.info("Количество для списания должно быть больше ноля", {
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
        "Данный товар уже в списке, удалите запись из таблицы, и снова внесите товар.",
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
        Alert.success("Товар удален из списка", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <div className="product-write-off-page-n1">
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <Fragment>
          <h6>Для данного товара, найдены следующие характеристики:</h6>

          <table className="table table-hover">
            <tbody>
              {products.map((product) => (
                <tr key={product.attributes + product.attributescaption}>
                  <td>
                    {product.attributes === "0"
                      ? "Без дополнительных характеристик"
                      : product.attributescaption}
                  </td>
                  <td style={{ width: "20%" }}>
                    <button
                      className="btn btn-sm btn-block btn-outline-secondary"
                      onClick={() => selectAttribute(product)}
                    >
                      Выбрать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      </ReactModal>

      <div className="row">
        <div className="col-md-12">
          <label htmlFor="">Выберите товары на складе</label>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="barcode"
            value={productBarcode}
            className="form-control"
            placeholder="Введите или отсканируйте штрих код"
            onChange={onBarcodeChange}
            onKeyDown={onBarcodeKeyDown}
          />
        </div>
        <div className="col-md-6 zi-3">
          <Select
            name="productList"
            value={productSelectValue}
            noOptionsMessage={() => "Товар не найден"}
            onChange={productListChange}
            placeholder="Выберите товар из списка"
            onInputChange={onProductListChange.bind(this)}
            options={productOptions || []}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <label>Внесите количество для списания</label>
          <div className="input-group">
            <div className="input-group-prepend">
              {Object.keys(detail).length > 0 && (
                <Fragment>
                  <span className="input-group-text">
                    {`${
                      detail.units === 0
                        ? "Товар на складе отсутствует"
                        : "Товаров на складе: "
                    } ${detail.units}`}
                  </span>
                  <span className="input-group-text">
                    {`Цена на складе: ${detail.price}`}
                  </span>
                  <span className="input-group-text">
                    {`Цена закупки: ${detail.purchaseprice}`}
                  </span>
                </Fragment>
              )}
            </div>
            <input
              type="text"
              name="writeoffAmount"
              className="form-control"
              placeholder="Количество для списания"
              value={writeoffAmount}
              onChange={onAmountChange}
            />
          </div>
          {amountExceeds && (
            <span className="message text-danger">
              Количество не может превышать {detail.units}
            </span>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <label>Внесите причину списания</label>
          <textarea
            type="text"
            name="writeoffReason"
            rows="3"
            className="form-control"
            placeholder="Причина списания товара со склада"
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
          >
            Добавить
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
                <th style={{ width: "30%" }}>Продукт</th>
                <th style={{ width: "10%" }}>Штрих код</th>
                <th style={{ width: "20%" }} className="text-center">
                  Количество для списания
                </th>
                <th style={{ width: "40%" }}>Причина</th>
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
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
}
