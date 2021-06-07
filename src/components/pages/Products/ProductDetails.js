import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

export default function ProductDetails({
  companyProps,
  invoiceNumber,
  product,
  shop,
  closeDetail,
  parentDetail,
  transaction,
}) {
  const [details, setDetails] = useState("");
  const [attribute, setAttribute] = useState([]);
  const company = companyProps ? companyProps : "";
  const pleaseWait = "Пожалуйста подождите...";

  useEffect(() => {
    invoiceNumber ? getDetailsByInvoice() : getDetails();
  }, []);

  const getDetailsByInvoice = () => {
    Axios.get("/api/invoice/product/details", {
      params: {
        company,
        invoiceNumber,
        productId: product.stock,
      },
    })
      .then((res) => res.data)
      .then((det) => {
        if (!!det.purchaseprice && det.newprice === 0) {
          det.surcharge = "0";
          det.surcharge = det.surcharge + "%";
        } else if (det.purchaseprice) {
          det.surcharge = Math.round(
            ((+det.newprice - +det.purchaseprice) * 100) / +det.purchaseprice
          );
          det.surcharge = det.surcharge + "%";
        } else {
          det.surcharge = "0";
        }
        det.purchaseprice = det.purchaseprice ? det.purchaseprice : "0";
        det.newprice = det.newprice;
        setDetails(det);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDetails = () => {
    Axios.get("/api/products/barcode", {
      params: {
        barcode: product.code,
        company,
        point: product.id,
        shop,
        attributes: product.attributes,
      },
    })
      .then((res) => res.data)
      .then((det) => {
        if (det.purchaseprice) {
          det.surcharge = Math.round(
            ((+det.price - +det.purchaseprice) * 100) / +det.purchaseprice
          );
          det.surcharge = det.surcharge + "%";
        } else {
          det.surcharge = "0";
        }

        det.purchaseprice = det.purchaseprice ? det.purchaseprice : "0";
        det.newprice = det.price;
        setDetails(det);
        setAttribute(det.attributescaption);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="product-details">
      <div className="row">
        <div className="col-md-12">
          <label>Штрих код</label>
          <p className={`${!details.code ? "hint" : ""} `}>
            {details.code || pleaseWait}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <label>Наименование</label>
          <p className={`${!details.name ? "hint" : ""} `}>
            {details.name || pleaseWait}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <label>Категория</label>
          <p className={`${!details.category ? "hint" : ""} `}>
            {details.category || pleaseWait}
          </p>
        </div>
      </div>

      {details.brand && (
        <div className="row">
          <div className="col-md-12">
            <label>Бренд</label>
            <p>{details.brand}</p>
          </div>
        </div>
      )}
      {details.counterparty && details.counterparty !== "" && (
        <div className="row">
          <div className="col-md-12">
            <label>Контрагент</label>
            <p>{details.counterparty}</p>
          </div>
        </div>
      )}

      {details.cnofeacode && (
        <div className="row">
          <div className="col-md-12">
            <label>Код ТН ВЭД</label>
            <p className={`${!details.cnofeacode ? "hint" : ""} `}>
              {details.cnofeacode || pleaseWait}
            </p>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <label>Текущая себестоимость по FIFO</label>
          <p className={`${!details.purchaseprice ? "hint" : "tenge"} `}>
            {details.purchaseprice || pleaseWait}
          </p>
        </div>
        <div className="col-md-2">
          <label>Надбавка</label>
          <p className={`${!details.surcharge ? "hint" : ""} `}>
            {details.surcharge}
          </p>
        </div>
        <div className="col-md-4">
          <label>Цена продажи</label>
          <p className="tenge">{details.newprice}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>Налоговая категория</label>
          <p className={`${!details.taxid ? "hint" : ""} `}>
            {details.taxid
              ? details.taxid === "0"
                ? "Без НДС"
                : "Стандартный НДС"
              : pleaseWait}
          </p>
        </div>
      </div>

      {details.attributes && details.attributes !== "0" && (
        <div className="row">
          <div className="col-md-12">
            <label>Дополнительная информация</label>
            {attribute.map(e => {
              return (
                <p>{e.attribute_name}: {e.attribute_format === "DATE" ? Moment(e.attribute_value).format('L') : e.attribute_value} </p>
              )
            })}
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-12">
          <button
            className="btn btn-block btn-outline-success"
            onClick={() => closeDetail(true)}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
