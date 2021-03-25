import React, { useState, useEffect } from "react";
import Breadcrumb from "../../Breadcrumb";
import PageN1 from "./WrifeoffPages/PageN1";
import PageN2 from "./WrifeoffPages/PageN2";

import Axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

export default function ProductWriteoff({ location, history }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [pages, setPages] = useState({
    n1: true,
    n2: false,
    width: "50%",
  });
  const [productList, setProductList] = useState([]);
  const [stockFrom, setStockFrom] = useState(location.state.stockFrom);
  const [sweetalert, setSweetAlert] = useState(null);

  const altInvoiceNumber = location.state.altInvoiceNumber;
  const invoiceNumber = location.state.invoiceNumber;
  const invoiceDate = location.state.invoiceDate;
  const breadcrumb = [
    { caption: "Товары" },
    { caption: "Списание товара со склада" },
  ];

  useEffect(() => {
    if (!stockFrom.value) {
      Axios.get("/api/stock", {
        params: { id: stockFrom },
      })
        .then((res) => res.data[0])
        .then((stock) => {
          setStockFrom({ value: stock.id, label: stock.name });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const hideAlert = () => {
    setSweetAlert(null);
  };

  const productListFunction = (p) => {
    setProductList([...p]);
  };

  const paginate = (e) => {
    switch (e.target.name) {
      case "prevPgBtn":
        setPages({ n1: true, n2: false, width: "50%" });
        break;
      case "nextPgBtn":
        setPages({ n1: false, n2: true, width: "100%" });
        break;
      default:
        setPages({
          n1: true,
          n2: false,
          width: "50%",
        });
    }
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

  const handleSubmit = () => {
    setSubmitting(true);
    saveInvoiceList();
  };

  const saveInvoiceList = () => {
    const req = {
      invoice: invoiceNumber,
    };

    Axios.post("/api/invoice/submit/writeoff", req)
      .then(() => {
        history.push({
          pathname: "/usercabinet/product",
          state: { fromSubmitInvoice: true },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
        setSubmitting(false);
      });
  };

  return (
    <div className="product-write-off">
      {sweetalert}

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
          {stockFrom.label && (
            <p className="product-transfer-stocks">
              Списание товара со склада: {stockFrom.label}
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

      {stockFrom.value && <div className="empty-space"></div>}

      {pages.n1 && stockFrom.value && (
        <PageN1
          invoicenumber={invoiceNumber}
          productListProps={productListFunction}
          stockFrom={stockFrom}
        />
      )}
      {pages.n2 && <PageN2 productListProps={productList} />}

      {productList.length > 0 && (
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

          {!pages.n2 && (
            <button
              name="nextPgBtn"
              className="btn btn-success ml-10"
              disabled={pages.n1 && productList.length === 0}
              onClick={paginate}
            >
              Далее
            </button>
          )}
          {pages.n2 && (
            <button
              name="submit"
              disabled={isSubmitting}
              className="btn btn-success ml-10"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Пожалуйста подождите..." : "Списать товары"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
