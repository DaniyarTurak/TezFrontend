import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Moment from "moment";
import Axios from "axios";
import Breadcrumb from "../../../Breadcrumb";
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import Searching from "../../../Searching";
import useComponentWillMount from "../../../customHooks/useComponentWillMount";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function CreateTransferInvoice({ history }) {
  const [fromPointOptions, setFromPointOptions] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [pages, setPages] = useState({
    n1: true,
    n2: false,
  });
  const [sweetalert, setSweetAlert] = useState(null);
  const [selectFromValue, setSelectFromValue] = useState("");
  const [selectToValue, setSelectToValue] = useState("");
  const [toPointOptions, setPointOptions] = useState([]);

  const breadcrumb = [
    { caption: "Товары" },
    { caption: "Перемещение между складами" },
    { caption: "Новая накладная", active: true },
  ];

  useEffect(() => {
    getPointFrom();
  }, []);

  useComponentWillMount(() => {
    getFormationInvoice();
  });

  function getFormationInvoice() {
    setLoading(true);
    Axios.get("/api/invoice", {
      params: { status: "FORMATION", type: "1" },
    })
      .then((res) => res.data)
      .then((activeInvoice) => {
        if (Object.keys(activeInvoice).length === 0) {
          setLoading(false);
        } else {
          setSweetAlert(
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Продолжить"
              cancelBtnText="Нет, удалить накладную"
              confirmBtnBsStyle="success"
              cancelBtnBsStyle="danger"
              title="Внимание"
              allowEscape={false}
              closeOnClickOutside={false}
              onConfirm={() => continueFilling(activeInvoice)}
              onCancel={() => deleteInvoice(activeInvoice)}
            >
              У Вас имеется незавершенная накладная, хотите продолжить
              заполнение?
            </SweetAlert>
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  const continueFilling = (invoice) => {
    history.push({
      pathname: "invoicetransfer",
      state: {
        invoiceNumber: invoice.invoicenumber,
        invoiceDate: Moment(invoice.invoicedate).format("DD.MM.YYYY"),
        // invoiceDate: Moment(invoice.invoicedate).utc().format("DD.MM.YYYY"),  => из-за utc был баг что показывал дату на день раньше,не понятно зачем было вставлено.
        altInvoiceNumber: invoice.altnumber,
        toPoint: invoice.stockto,
        fromPoint: invoice.stockfrom,
      },
    });
  };

  const deleteInvoice = (invoice) => {
    const req = { invoice: invoice.invoicenumber };
    setLoading(true);
    Axios.post("/api/invoice/delete", req)
      .then(() => {
        setLoading(false);
        setSweetAlert(null);
        Alert.success("Накладная успешно удалена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getPointFrom = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((points) => {
        const fromPointOptionsChanged = points.map((point) => {
          return { value: point.id, label: point.name };
        });
        setFromPointOptions(fromPointOptionsChanged);
      });
  };

  const getPointTo = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((points) => {
        const newPoints = points.filter((point) => {
          return point.id !== selectFromValue.value;
        });
        const toPointOptionsChanged = newPoints.map((point) => {
          return { value: point.id, label: point.name };
        });
        setPointOptions(toPointOptionsChanged);
      });
  };

  const paginate = () => {
    if (pages.n1) {
      if (selectFromValue.length === 0) {
        Alert.warning("Выберите откуда переместить товары", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      } else if (selectToValue.length === 0) {
        Alert.warning("Выберите куда переместить товары", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      } else {
        setPages({ n1: false, n2: true });
      }
    } else {
      setPages({ n2: false, n1: true });
    }
  };

  const handleCreateInvoice = () => {
    const reqdata = {
      stockfrom: selectFromValue.value,
      stockto: selectToValue.value,
      altinvoice: invoiceNumber,
      invoicedate: Moment(invoiceDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
      type: "1",
    };

    Axios.post("/api/invoice/create", reqdata)
      .then((res) => res.data)
      .then((serverResponse) => {
        history.push({
          pathname: "invoicetransfer",
          state: {
            invoiceNumber: serverResponse.text,
            invoiceDate: Moment(invoiceDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
            altInvoiceNumber: invoiceNumber,
            fromPoint: selectFromValue,
            toPoint: selectToValue,
          },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleInvoiceNumberChange = (e) => {
    setInvoiceNumber(e.target.value);
  };

  const handleInvoiceDateChange = (e) => {
    setInvoiceDate(e.target.value);
  };

  const handleFromPointChange = (value) => {
    setSelectFromValue(value);
    setSelectToValue("");
    getPointTo();
  };

  const handleToPointChange = (value) => {
    setSelectToValue(value);
  };

  return (
    <Fragment>
      {sweetalert}

      <Breadcrumb content={breadcrumb} />

      {isLoading && <Searching />}

      {!isLoading && (
        <div className="create-transfer-invoice">
          {pages.n1 && (
            <div className="first-page">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="">
                    Выберите склад откуда переместить товары
                  </label>
                  <Select
                    name="fromPoint"
                    value={selectFromValue}
                    noOptionsMessage={() => "Склады не найдены"}
                    onChange={handleFromPointChange}
                    placeholder="Выберите склад из списка"
                    options={fromPointOptions}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="">
                    Выберите склад куда переместить товары
                  </label>
                  <Select
                    name="toPoint"
                    value={selectToValue}
                    noOptionsMessage={() =>
                      "Необходимо выбрать склад откуда Вы хотите переместить товар"
                    }
                    onChange={handleToPointChange}
                    placeholder="Выберите склад из списка"
                    options={toPointOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {pages.n2 && (
            <div className="second-page">
              <div className="row">
                <div className="col-md-8">
                  <label>Номер накладной</label>
                  <input
                    type="text"
                    name="invoice-num"
                    value={invoiceNumber}
                    className="form-control"
                    onChange={handleInvoiceNumberChange}
                  />
                </div>
                <div className="col-md-4">
                  <label>Дата</label>
                  <input
                    type="date"
                    name="invoice-date"
                    defaultValue={invoiceDate}
                    className="form-control"
                    onChange={handleInvoiceDateChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="row mt-20">
            <div className="col-md-12 text-right">
              {pages.n1 && (
                <button
                  className="btn btn-outline-success ml-10"
                  onClick={paginate}
                >
                  Далее
                </button>
              )}

              {pages.n2 && (
                <Fragment>
                  <button className="btn btn-outline-info" onClick={paginate}>
                    Назад
                  </button>

                  {!invoiceNumber && (
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleCreateInvoice}
                    >
                      Продолжить без ввода номера
                    </button>
                  )}

                  <button
                    className="btn btn-outline-success ml-10"
                    onClick={handleCreateInvoice}
                    disabled={!invoiceNumber}
                  >
                    Далее
                  </button>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
