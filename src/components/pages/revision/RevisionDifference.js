import React, { useState } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import useWindowsWidth from "../../customHooks/useWindowsWidth";

export default function RevisionDifference({
  differenceList,
  closeDetail,
  revisionDate,
  handleSend,
  isDifferenceSubmitting,
}) {
  const [writeOff, setWriteOff] = useState("");
  const width = useWindowsWidth();

  const writeOffList = [
    { label: "Обнулить остатки", value: 0 },
    { label: "Оставить как есть", value: 1 },
  ];

  const handleExcelDownload = () => {
    const excelDetails = differenceList.map((detail) => {
      return {
        code: detail.code,
        name: detail.name,
        attrvalue: detail.attrvalue,
        units: parseInt(detail.units, 0),
        purchaseprice: parseInt(detail.purchaseprice, 0),
        sellprice: parseInt(detail.sellprice, 0),
      };
    });

    const companyData =
      JSON.parse(sessionStorage.getItem("isme-user-data")) || {};
    const revParams =
      JSON.parse(sessionStorage.getItem("revision-params")) || {};
    const date = Moment(revisionDate).format("YYYY-MM-DD HH:mm:ss");
    const revisorData = `Компания: "${companyData.companyname}", торговая точка: "${revParams.pointLabel}", ревизор ${companyData.name}, дата проведения: ${date}`;
    Axios({
      method: "POST",
      url: "/api/revision/excel_difference",
      data: { excelDetails, revisorData },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((revisionExcel) => {
        const url = window.URL.createObjectURL(new Blob([revisionExcel]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Товары, не прошедшие ревизию за ${date}.xlsx`
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const writeOffChange = (writeOff) => {
    setWriteOff(writeOff);
  };

  const handleProceedWriteOff = () => {
    if (writeOff.value === 0) {
      handleSend(false);
    } else if (writeOff.value === 1) {
      handleSend(true);
    }
  };

  return (
    <div className="row">
      <span
        style={{
          fontSize: `${width > 480 ? "16px" : "12px"}`,
          marginBottom: "1rem",
        }}
      >
        На складе остались товары, не прошедшие ревизию. Что с ними сделать?
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: `${width > 480 ? "row" : "column"}`,
          justifyContent: "space-around",
          flexFlow: "row wrap",
          height: `${width <= 480 ? "14rem" : ""}`,
        }}
        className="col-md-12"
      >
        <button
          style={{ marginBottom: "1rem" }}
          className="btn btn-secondary"
          onClick={closeDetail}
        >
          Назад
        </button>
        <button
          style={{ marginBottom: "1rem" }}
          className="btn btn-success"
          onClick={handleExcelDownload}
        >
          Скачать Excel
        </button>
        <div style={{ marginBottom: "1rem" }} className="col-md-5">
          <Select
            value={writeOff}
            name="writeOff"
            onChange={writeOffChange}
            options={writeOffList}
            isSearchable={false}
            placeholder="Выберите одно из действий..."
          />
        </div>

        <button
          style={{ marginBottom: "1rem" }}
          className="btn btn-success"
          disabled={!writeOff || isDifferenceSubmitting}
          onClick={handleProceedWriteOff}
        >
          Завершить ревизию
        </button>
      </div>
      {width > 480 && (
        <table className="table" id="table-to-xls">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "20%" }}>
                Штрихкод
              </th>
              <th className="text-center" style={{ width: "25%" }}>
                Название
              </th>
              <th className="text-center" style={{ width: "25%" }}>
                Атрибут
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Количество
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Цена закупки
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Цена продажи
              </th>
            </tr>
          </thead>
          <tbody>
            {differenceList.map((difference) => (
              <tr key={difference.code + difference.attrvalue}>
                <td className="text-center">{difference.code}</td>
                <td className="text-center">{difference.name}</td>
                <td className="text-center">{difference.attrvalue}</td>
                <td className="text-center">{difference.units}</td>
                <td className="text-center tenge">
                  {difference.purchaseprice}
                </td>
                <td className="text-center tenge">{difference.sellprice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
