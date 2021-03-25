import React from "react";
import Moment from "moment";

import "moment/locale/ru";
Moment.locale("ru");

export default function TableContents({
  invoices,
  invoiceDetails,
  invoicetype,
}) {
  return (
    <div className="row mt-20">
      <div className="col-md-12">
        <label style={{ color: "orange" }} className="hint">
          За выбранный период найдены следующие накладные:
        </label>
        <table className="table table-hover mt-10">
          <thead>
            <tr>
              <th style={{ width: "2%" }}></th>
              <th
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Номер накладной
              </th>
              {["2"].includes(invoicetype.value) && <th>Итого цена закупки</th>}
              {["2"].includes(invoicetype.value) && <th>Итого цена продажи</th>}
              {["16", "17"].includes(invoicetype.value) && (
                <th>Стоимость товаров в ценах реализации, тг.</th>
              )}
              <th className="text-center">ФИО</th>
              {["1", "7", "16", "17"].includes(invoicetype.value) && (
                <th>Со склада</th>
              )}
              {["1", "2", "16", "17"].includes(invoicetype.value) && (
                <th>На склад</th>
              )}
              {["2", "16", "17"].includes(invoicetype.value) && (
                <th>Контрагент</th>
              )}
            </tr>
          </thead>
          <tbody style={{ cursor: "pointer" }}>
            {invoices.map((invoice, idx) => (
              <tr key={idx} onClick={() => invoiceDetails(invoice)}>
                <td>{idx + 1}</td>
                <td className="text-center">
                  {invoice.altnumber ? "№ " + invoice.altnumber + " - " : ""}
                  {invoice.invoicenumber
                    ? "№ " + invoice.invoicenumber + " - "
                    : ""}
                  {Moment(invoice.invoicedate).format("DD.MM.YYYY")}
                </td>
                {["2"].includes(invoicetype.value) && (
                  <td className="tenge">
                    {invoice.purchaseprice &&
                      parseFloat(invoice.purchaseprice).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </td>
                )}
                {["2", "16", "17"].includes(invoicetype.value) && (
                  <td className="tenge">
                    {invoice.newprice &&
                      parseFloat(invoice.newprice).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </td>
                )}
                <td className="text-center">{invoice.name}</td>
                {["1", "7", "16", "17"].includes(invoicetype.value) && (
                  <td>{invoice.stockfrom}</td>
                )}
                {["1", "2", "16", "17"].includes(invoicetype.value) && (
                  <td>{invoice.stockto}</td>
                )}
                {["2", "16", "17"].includes(invoicetype.value) && (
                  <td>
                    {invoice.counterparty &&
                      `${invoice.bin} | ${invoice.counterparty}`}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {["2", "16", "17"].includes(invoicetype.value) && (
            <tfoot>
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan="2">Итого:</td>
                {["2"].includes(invoicetype.value) && (
                  <td className="tenge">
                    {invoices
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.purchaseprice);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                )}
                <td className="tenge">
                  {invoices
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.newprice);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </td>
                <td colSpan="4" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
