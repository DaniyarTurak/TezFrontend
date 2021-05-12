import React, { useEffect, useState, useRef, Fragment } from "react";
import Axios from "axios";
import AddProductForm from "./AddProductForm";
import Breadcrumb from "../../../Breadcrumb";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import ProductDetails from "../ProductDetails";
import ProductAlerts from "../Alerts/ProductAlerts";
import _ from "lodash";
import Searching from "../../../Searching";

import { Progress } from "reactstrap";

import { utils, read } from "xlsx";
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

export default function ManageInvoice({ location, history }) {
  const [deleted, setDeleted] = useState(false);
  const [disableEdit, setDisableEdit] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(0);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [modalIsOpenAlert, setModalOpenAlert] = useState(false);
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState("");
  const [sweetalert, setSweetAlert] = useState(null);
  const [stockTo, setStockTo] = useState(location.state.stockTo);
  const [selectedFile, setSelectedFile] = useState("");
  const scrollRef = useRef();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");

  const breadcrumb = [
    { caption: "Товары" },
    { caption: "Новый товар" },
    { caption: "Новая накладная" },
    { caption: "Добавить товары", active: true },
  ];
  const invoiceNumber = location.state.invoiceNumber;
  const invoiceDate = location.state.invoiceDate;
  const altInvoiceNumber = location.state.altInvoiceNumber;
  const counterparty = location.state.counterparty || {};

  useEffect(() => {
    if (deleted && !isEditing) {
      setDeleted(false);
    }
    return () => {
      setDeleted(false);
    };
  }, [deleted]);

  useEffect(() => {
    Axios.get("/api/stock", {
      params: { id: stockTo },
    })
      .then((res) => res.data[0])
      .then((stockTo) => {
        setStockTo(stockTo);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
    setLoading(true);
    getInvoiceProducts(invoiceNumber);
  }, []);

  const addProduct = (newProduct) => {
    let newProductList = productList;
    let newProd = newProduct;
    let attributescaption = [];
    getInvoiceProducts(invoiceNumber);

    if (newProd.attrs_json && newProd.attrs_json.length > 0) {
      newProd.attrs_json.forEach((attr) => {
        attributescaption =
          attributescaption +
          (attributescaption ? ", " : "") +
          attr.name +
          ": " +
          attr.value;
      });
    }
    newProd.attrs_json = attributescaption;
    newProductList.push(newProduct);
    newProductList.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    setProductList(newProductList);
  };

  const getInvoiceProducts = (invoicenumber) => {
    //setDeleted(false);
    Axios.get("/api/invoice/product", {
      params: { invoicenumber },
    })
      .then((res) => res.data)
      .then((result) => {
        result.sort(function (a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        let attr = [];
        result.forEach((element) => {
          attr.push({ ...element, attrs_json: JSON.parse(element.attrs_json) });
        });
        setDisableEdit(new Array(result.length).fill(false));
        setProductList(attr);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const toggleDisabled = (idx) => {
    const disable = _.clone(disableEdit);
    // disable[idx] = true;
    disable.forEach(function (part, index) {
      if (index === idx) {
        this[index] = true;
      } else this[index] = false;
    }, disable);
    setDisableEdit(disable);
  };

  const handleEdit = (product, idx) => {
    Axios.get("/api/invoice/product/details", {
      params: {
        invoiceNumber,
        productId: product.stock,
      },
    })
      .then((res) => res.data)
      .then((det) => {
        toggleDisabled(idx);
        setProduct({
          ...det,
          ...product,
        });
        setEditing(true);
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };
  const handleEditing = () => {
    setEditing(false);
    setDeleted(false);
  };
  const handleDetail = (product) => {
    setProduct(product);
    setEditing(false);
    setModalOpen(true);
  };

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setLoaded(0);
  };

  const handleFetchFromExcel = () => {
    if (!selectedFile) {
      return Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    const reader = new FileReader();

    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = read(bstr, { type: "binary" });
      let errMsg = "";
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const invoiceprods = JSON.stringify(
        utils.sheet_to_json(
          ws,
          { raw: true },
          { skipUndfendVale: false, defaultValue: null }
        )
      );

      /* Check kirill in code*/
      const pwk = [];

      const prods = utils.sheet_to_json(
        ws,
        { raw: true },
        { skipUndfendVale: false, defaultValue: null }
      );

      prods.forEach((product, i) => {
        if (
          product.Code.toString()
            .toLowerCase()
            .search(/[а-яё]/i) >= 0
        ) {
          pwk.push(i + 1);
        }
      });

      if (pwk && pwk.length !== 0) {
        if (pwk.length > 1) {
          pwk.forEach((number, i) => {
            if (i !== pwk.length - 1) {
              errMsg += number.toString() + ", ";
            } else {
              errMsg += number.toString() + " ";
            }
          });
          errMsg = "В строках " + errMsg + "имеются символы кириллицы";
        } else {
          errMsg =
            "В строке " + pwk[0].toString() + "имеются символы кириллицы";
        }
        setMessage(errMsg);
        setOpen(true);
      } else {
        /* Update state */
        let params = new URLSearchParams();

        params.append("invoiceprods", invoiceprods);
        params.append("invoice", invoiceNumber);

        setLoading(true);

        const options = {
          method: "post",
          url: "/api/utils/invoice_add_xls",
          responseType: "blob",
          data: params,
        };

        Axios(options, {
          onUploadProgress: (ProgressEvent) => {
            setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
          },
        })
          .then((res) => res.data)
          .then((res) => {
            if (res && res.size > 42) {
              const url = window.URL.createObjectURL(new Blob([res]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Список ошибок.xlsx`);
              document.body.appendChild(link);
              link.click();

              Alert.success("Данные импортированы, но с ошибками.", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
              });
            } else {
              Alert.success("Данные успешно импортированы", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
              });
            }

            getInvoiceProducts(invoiceNumber);
          })
          .catch((err) => {
            ErrorAlert(err);
            getInvoiceProducts(invoiceNumber);
          });
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleDeleteInvoice = () => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={() => deleteInvoice()}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить накладную?
      </SweetAlert>
    );
  };

  const deleteInvoice = () => {
    const req = { invoice: invoiceNumber };
    Axios.post("/api/invoice/delete", req)
      .then(() => {
        history.push({
          pathname: "/usercabinet/product",
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleDeleteProduct = (item, idx) => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={() => deleteProduct(item, idx)}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить добавленный товар?
      </SweetAlert>
    );
  };

  const deleteProduct = (item, idx) => {
    const newProductList = productList.filter((productList) => {
      return productList !== item;
    });
    const req = {
      invoice: invoiceNumber,
      stock: item.stock,
      attributes: item.attributes,
    };

    Axios.post("/api/invoice/delete/product", req)
      .then(() => {
        if (isEditing) {
          toggleDisabled(idx);
          setDeleted(true);
          setProductList(newProductList);
        } else {
          setProductList(newProductList);
          Alert.success("Товар успешно удален", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });

    setSweetAlert(null);
  };

  const handleDownload = (file) => {
    setLoading(true);
    Axios.get("/api/files/download", { responseType: "blob", params: { file } })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      });
  };

  return (
    <div className="manage-invoice-page">
      <ReactModal
        isOpen={open}
        style={{
          content: {
            textAlign: "center",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
          },
        }}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <p style={{ color: "red" }}>
          Символы кириллицы в штрих-коде недопустимы.
        </p>
        <p>{message}.</p>
        <p />
        <button
          className="btn btn-success btn-sm"
          style={{ minWidth: "40px" }}
          onClick={() => {
            setOpen(false);
          }}
        >
          {" "}
          Ок{" "}
        </button>
      </ReactModal>
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <ProductDetails
          product={product}
          closeDetail={() => setModalOpen(false)}
          invoiceNumber={invoiceNumber}
        />
      </ReactModal>

      <ReactModal isOpen={modalIsOpenAlert} style={customStyles}>
        <ProductAlerts
          history={history}
          closeAlert={() => setModalOpenAlert(false)}
          invoiceNumber={invoiceNumber}
        />
      </ReactModal>

      {sweetalert}

      <Breadcrumb content={breadcrumb} />

      <div
        className="row"
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div className="col-md-3">
          <b className="btn-one-line">
            Накладная {altInvoiceNumber} от {invoiceDate}
          </b>
          <p className="manage-invoice-page-stocks">
            {stockTo.name && `Прием товара на ${stockTo.name}`}
            <br />
            {Object.keys(counterparty).length > 0 &&
              `Контрагент: ${counterparty.label}`}
          </p>
        </div>

        <div
          className="col-md-3"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            style={{
              marginBottom: "5px",
            }}
            className="btn btn-info"
            onClick={() => handleDownload("instruction.pdf")}
          >
            Скачать инструкцию
          </button>
        </div>
        <div
          className="col-md-3"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            style={{
              marginBottom: "5px",
            }}
            className="btn btn-info"
            onClick={() => handleDownload("template.xlsx")}
          >
            Скачать шаблон
          </button>
        </div>
        <div
          className="col-md-3"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            style={{
              marginBottom: "5px",
            }}
            disabled={isEditing}
            className="btn btn-danger"
            onClick={handleDeleteInvoice}
          >
            Удалить накладную
          </button>
        </div>
      </div>
      <div className="form-group files download-files">
        <input
          disabled={isEditing}
          style={{ color: "#2ea591" }}
          type="file"
          className="form-control"
          name="file"
          onChange={handleSelectedFile}
        />
      </div>
      <div className="form-group">
        <Progress max="100" color="success" value={loaded}>
          {Math.round(loaded, 2)}%
        </Progress>
      </div>
      <button
        className="btn btn-info form-control"
        onClick={handleFetchFromExcel}
      >
        Выгрузить
      </button>
      {isLoading && <Searching />}

      {!isLoading && (
        <Fragment>
          {productList.length === 0 && (
            <div className="text-center not-found-text">
              Список товаров пуст
            </div>
          )}

          {productList.length > 0 && (
            <table className="table table-hover mt-20">
              <thead>
                <tr>
                  <th style={{ width: "2%" }}></th>
                  <th style={{ width: "25%" }}>Наименование</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Штрих код
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Цена закупки
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Цена продажи
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Количество
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Итого цена закупки
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Итого цена продажи
                  </th>
                  <th style={{ width: "8%" }}></th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      {product.name}
                      <br />
                      {product.attrs_json.map((e, indx) => {
                        return (
                          <tr className="hint" key={indx}>
                            {e.name}: {e.value},
                          </tr>
                        );
                      })}
                    </td>
                    <td className="text-center">{product.code}</td>
                    <td className="text-center tenge">
                      {product.purchaseprice.toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center tenge">
                      {product.newprice.toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {product.amount.toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center tenge">
                      {(
                        product.amount * product.purchaseprice
                      ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {(product.amount * product.newprice).toLocaleString(
                        "ru",
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon edit-item"
                        title="Редактировать"
                        disabled={disableEdit[idx]}
                        onClick={() => {
                          handleEdit(product, idx);
                        }}
                      />
                      <button
                        className="btn btn-w-icon detail-item"
                        title="Детали"
                        //disabled={disableEdit[idx]}
                        onClick={() => {
                          handleDetail(product);
                        }}
                      ></button>
                      <button
                        //disabled={isEditing}
                        className="btn btn-w-icon delete-item"
                        title="Удалить"
                        //disabled={disableEdit[idx]}
                        onClick={() => {
                          handleDeleteProduct(product, idx);
                        }}
                      ></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan={3}>Итого</td>
                  <td className="text-center tenge">
                    {productList
                      .reduce((prev, cur) => {
                        const curPurchaseprice = parseFloat(cur.purchaseprice);
                        return (
                          prev + (curPurchaseprice > 0 ? curPurchaseprice : 0)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {productList
                      .reduce((prev, cur) => {
                        const curNewprice = parseFloat(cur.newprice);
                        return prev + (curNewprice > 0 ? curNewprice : 0);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    {productList
                      .reduce((prev, cur) => {
                        const curAmoun = parseFloat(cur.amount);
                        return prev + (curAmoun > 0 ? curAmoun : 0);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {productList
                      .reduce((prev, cur) => {
                        const curAmoun = parseFloat(cur.amount);
                        const curPurchaseprice = parseFloat(cur.purchaseprice);
                        return (
                          prev +
                          (curPurchaseprice > 0 && curAmoun > 0
                            ? curAmoun * curPurchaseprice
                            : 0)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {productList
                      .reduce((prev, cur) => {
                        const curAmoun = parseFloat(cur.amount);
                        const curNewprice = parseFloat(cur.newprice);
                        return (
                          prev +
                          (curNewprice > 0 && curAmoun > 0
                            ? curAmoun * curNewprice
                            : 0)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
          <div className="row pb-10">
            <div className="col-md-12 text-right">
              {productList.length > 0 && (
                <button
                  disabled={isEditing}
                  className="btn btn-success btn-sm"
                  onClick={() => setModalOpenAlert(true)}
                >
                  Сохранить и закрыть накладную
                </button>
              )}
            </div>
          </div>
          <AddProductForm
            deleted={deleted}
            deleteOldRecord={deleteProduct}
            isEditing={isEditing}
            handleEditing={handleEditing}
            newProduct={addProduct}
            invoiceNumber={invoiceNumber}
            editProduct={product}
          />
          <div ref={scrollRef}></div>
        </Fragment>
      )}
    </div>
  );
}
