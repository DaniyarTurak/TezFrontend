import React, { Fragment } from "react";
import Moment from "moment";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

import "moment/locale/ru";
Moment.locale("ru");

export default function HistoryDetails({
  markedInvoice,
  backToList,
  details,
  invoicetype,
  dateFrom,
  dateTo,
}) {
  return (
    <div className="row mt-20">
      <div className="col-md-8">
        <b className="btn-one-line">
          Накладная {markedInvoice.altnumber} от{" "}
          {Moment(markedInvoice.invoicedate).format("DD.MM.YYYY")}
        </b>

        <p className="product-transfer-stocks">
          {markedInvoice.invoicetype} <br />
          {["1", "7"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              Откуда: {markedInvoice.stockfrom} <br />
            </Fragment>
          )}
          {["1", "2"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              Куда: {markedInvoice.stockto} <br />
            </Fragment>
          )}
          {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              {markedInvoice.invoicetypeid === "2"
                ? "Контрагент: "
                : "Консигнатор: "}
              {markedInvoice.counterparty &&
                `${markedInvoice.bin} | ${markedInvoice.counterparty}`}{" "}
              <br />
            </Fragment>
          )}
        </p>
      </div>
      <div className="col-md-4 text-right">
        <button className="btn btn-secondary" onClick={() => backToList()}>
          Вернуться назад
        </button>
      </div>
      <div className="col-md-12">
        <table className="table table-hover" id="table-transfer">
          <thead>
            <tr>
              <th style={{ width: "2%" }}></th>
              <th style={{ width: "30%" }}>Наименование товара</th>
              <th style={{ width: "20%" }}>Штрих код</th>
              {["1", "2", "7", "16", "17"].includes(
                markedInvoice.invoicetypeid
              ) && (
                <th style={{ width: "10%" }} className="text-center">
                  Количество
                </th>
              )}
              {["7"].includes(markedInvoice.invoicetypeid) && (
                <th style={{ width: "30%" }}>Причина</th>
              )}

              {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                <th>Налоговая категория</th>
              )}
              {["2"].includes(markedInvoice.invoicetypeid) && (
                <th>Код ТН ВЭД</th>
              )}

              {["2"].includes(markedInvoice.invoicetypeid) && (
                <th>Цена закупки</th>
              )}
              {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                <th>Цена продажи</th>
              )}
              {["0"].includes(markedInvoice.invoicetypeid) && (
                <th>Новая цена</th>
              )}
            </tr>
          </thead>
          <tbody>
            {details.map((detail, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  {detail.name +
                    (detail.attributescaption
                      ? ", " + detail.attributescaption
                      : detail.attributescaption)}
                </td>
                <td>{detail.code}</td>

                {["1", "2", "7", "16", "17"].includes(
                  markedInvoice.invoicetypeid
                ) && (
                  <td className="text-center">
                    {parseFloat(detail.units).toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                )}
                {["7"].includes(markedInvoice.invoicetypeid) && (
                  <td>{detail.reason}</td>
                )}

                {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <td>
                    {detail.taxid === "0" ? "Без НДС" : "Стандартный НДС"}
                  </td>
                )}

                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <td>{detail.cnofeacode}</td>
                )}

                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <td className={`${detail.purchaseprice ? "tenge" : ""}`}>
                    {detail.purchaseprice &&
                      parseFloat(detail.purchaseprice).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </td>
                )}

                {["16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <td className={`${detail.price ? "tenge" : ""}`}>
                    {detail.price &&
                      parseFloat(detail.price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </td>
                )}

                {["0", "2"].includes(markedInvoice.invoicetypeid) && (
                  <td className="tenge">{detail.newprice}</td>
                )}
              </tr>
            ))}
          </tbody>
          {["1", "2", "7", "16", "17"].includes(
            markedInvoice.invoicetypeid
          ) && (
            <tfoot className="bg-info text-white">
              <tr>
                <td
                  colSpan={
                    markedInvoice.invoicetypeid === "7"
                      ? 3
                      : markedInvoice.invoicetypeid === "2"
                      ? 3
                      : 3
                  }
                >
                  Итого
                </td>
                <td className="text-center">
                  {details
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.units);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </td>
                {["2", "7"].includes(markedInvoice.invoicetypeid) && (
                  <td colSpan="2" />
                )}

                {["16", "17"].includes(markedInvoice.invoicetypeid) && <td />}
                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <td className="tenge">
                    {details
                      .reduce((prev, cur) => {
                        return prev + cur.purchaseprice * cur.units;
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                )}
                {["16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <td className="tenge">
                    {details
                      .reduce((prev, cur) => {
                        return prev + cur.price * cur.units;
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                )}
                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <td className="text-center tenge">
                    {details
                      .reduce((prev, cur) => {
                        return prev + cur.newprice * cur.units;
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                )}
              </tr>
            </tfoot>
          )}
        </table>

        <div>
          <ReactHTMLTableToExcel
            className="btn btn-sm btn-outline-success"
            table="table-transfer"
            filename={`${
              invoicetype.value === "1"
                ? "Перемещение товара"
                : invoicetype.value === "2"
                ? "Добавление товара"
                : invoicetype.value === "0"
                ? "Смена цен"
                : invoicetype.value === "16" || invoicetype.value === "17"
                ? "Детали консигнации"
                : "Списание товара"
            } c ${Moment(dateFrom).format("DD.MM.YYYY")} по ${Moment(
              dateTo
            ).format("DD.MM.YYYY")}`}
            sheet="tablexls"
            buttonText="Выгрузить в excel"
          />
        </div>
      </div>
    </div>
  );
}
