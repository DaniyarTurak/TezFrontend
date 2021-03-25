import React, { useState, useEffect, Fragment } from "react";
import Breadcrumb from "../../../Breadcrumb";
import Axios from "axios";

import PageN1 from "./PageN1";
import PageN2 from "./PageN2";

import SweetAlert from "react-bootstrap-sweetalert";
import PageN1Invoice from "./PageN1Invoice";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function InvoiceTransfer({ location, history }) {
  const [fromPoint, setFromPoint] = useState(location.state.fromPoint);
  const [isSaving, setSaving] = useState(false);
  const [pages, setPages] = useState({
    n1: true,
    n2: false,
    width: "50%",
  });
  const [selectedGoods, setSelectedGoods] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [stateType, setStateType] = useState("fromStock");
  const [sweetalert, setSweetAlert] = useState(null);
  const [toPoint, setToPoint] = useState(location.state.toPoint);

  const altInvoiceNumber = location.state.altInvoiceNumber;
  const invoiceNumber = location.state.invoiceNumber;
  const invoiceDate = location.state.invoiceDate;
  const breadcrumb = [
    { caption: "Товары" },
    { caption: "Перемещение" },
    { caption: "Новая накладная" },
    { caption: "Выбор товаров", active: true },
  ];

  useEffect(() => {
    if (!fromPoint.value) {
      Axios.get("/api/stock", {
        params: { id: fromPoint },
      })
        .then((res) => res.data[0])
        .then((point) => {
          setFromPoint({ value: point.id, label: point.name });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!toPoint.value) {
      Axios.get("/api/stock", {
        params: { id: toPoint },
      })
        .then((res) => res.data[0])
        .then((point) => {
          setToPoint({ value: point.id, label: point.name });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const hideAlert = () => {
    setSweetAlert(null);
    setSaving(false);
  };

  const handleType = (e) => {
    setStateType(e.target.name);
  };

  const paginate = (e) => {
    switch (e.target.name) {
      case "prevPgBtn":
        setPages({ n1: true, n2: false, width: "50%" });
        break;
      case "nextPgBtn":
        setPages({ n2: true, n1: false, width: "100%" });
        break;
      default:
        setPages({ n1: true, n2: false, width: "50%" });
    }
  };

  const getSelectedGoods = (goods, invoice) => {
    setSelectedGoods([...goods]);
    setSelectedInvoice(invoice);
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
        onConfirm={deleteInvoice}
        onCancel={hideAlert}
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
          state: {
            successInvoiceDelete: true,
          },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleSubmitInvoice = () => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={submit}
        onCancel={hideAlert}
      >
        Вы действительно хотите сохранить и закрыть накладную?
      </SweetAlert>
    );
  };

  const submit = () => {
    hideAlert();
    setSaving(true);
    stateType === "fromInvoice" ? saveInvoiceList() : saveInvoice();
  };

  const saveInvoice = () => {
    const req = { invoice: invoiceNumber };

    Axios.post("/api/invoice/submit/movement", req)
      .then(() => {
        history.push({
          pathname: "/usercabinet/product",
          state: { fromSubmitInvoice: true },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
        setSaving(false);
      });
  };

  const saveInvoiceList = () => {
    const req = {
      invoice: invoiceNumber,
      type: "1",
      stockcurrentfrom: selectedGoods.map((good) => {
        return {
          id: good.id,
          scale: good.scale,
          amount: good.amount,
          attributes: good.attributes,
          SKU: null,
        };
      }),
    };

    Axios.post("/api/invoice/submit/movement/list", req)
      .then(() => {
        history.push({
          pathname: "/usercabinet/product",
          state: { fromSubmitInvoice: true },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
        setSaving(false);
      });
  };

  return (
    <Fragment>
      {sweetalert}

      <div>
        <div className="progress mt-10" style={{ height: "1px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: pages.width }}
          ></div>
        </div>

        <div className="mt-10">
          <Breadcrumb content={breadcrumb} />
        </div>

        <div className="row">
          <div className="col-md-8">
            <b className="btn-one-line">
              Накладная {altInvoiceNumber} от {invoiceDate}{" "}
            </b>
            {fromPoint.label && toPoint.label && (
              <p className="product-transfer-stocks">
                Откуда: {fromPoint.label}
                <br />
                Куда: {toPoint.label}
              </p>
            )}
          </div>

          <div className="col-md-4 text-right">
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDeleteInvoice}
            >
              Удалить накладную
            </button>
          </div>
        </div>

        <div className="empty-space"></div>

        <div
          className="row"
          style={{ padding: `10px 5px ${stateType ? "10px" : "0"} 0` }}
        >
          <div className="col-md-6">
            <button
              name="fromStock"
              onClick={handleType}
              disabled={stateType === "fromInvoice" && selectedGoods.length > 0}
              className={`btn btn-block ${
                stateType === "fromStock" ? "btn-info" : "btn-outline-info"
              }`}
            >
              Выбрать товары вручную со склада
            </button>
          </div>

          <div className="col-md-6">
            <button
              name="fromInvoice"
              onClick={handleType}
              disabled={stateType === "fromStock" && selectedGoods.length > 0}
              className={`btn btn-block ${
                stateType === "fromInvoice" ? "btn-info" : "btn-outline-info"
              }`}
            >
              Выбрать из существующей накладной
            </button>
          </div>
        </div>

        {stateType && <div className="empty-space"></div>}

        {pages.n1 && stateType === "fromInvoice" && (
          <PageN1Invoice
            fromPoint={fromPoint}
            selectedGoods={selectedGoods}
            selectedInvoice={selectedInvoice}
            selectedGoodsFunc={getSelectedGoods}
          />
        )}

        {pages.n1 &&
          stateType === "fromStock" &&
          fromPoint.value &&
          toPoint.value && (
            <PageN1
              toPointProps={toPoint}
              fromPointProps={fromPoint}
              invoiceNumberProps={invoiceNumber}
              selectedGoodsFuncProps={getSelectedGoods}
            />
          )}

        {pages.n2 && <PageN2 productList={selectedGoods} />}

        {stateType && (
          <div className="text-right mt-20">
            {!pages.n1 && (
              <button
                name="prevPgBtn"
                className="btn btn-info"
                onClick={paginate}
              >
                Назад
              </button>
            )}
            {!pages.n2 &&
              (selectedGoods.length > 0 || stateType === "fromInvoice") && (
                <button
                  name="nextPgBtn"
                  className="btn btn-success ml-10"
                  disabled={pages.n1 && selectedGoods.length === 0}
                  onClick={paginate}
                >
                  Далее
                </button>
              )}

            {pages.n2 && (
              <button
                name="submit"
                className="btn btn-success ml-10"
                disabled={isSaving}
                onClick={handleSubmitInvoice}
              >
                {isSaving ? "Идет сохранение..." : "Переместить товары"}
              </button>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
}
