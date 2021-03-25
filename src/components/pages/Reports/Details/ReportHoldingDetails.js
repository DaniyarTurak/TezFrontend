import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";

export default function ReportHoldingDetails({
  dateFrom,
  dateTo,
  type,
  holding,
  user,
  bonusElement,
  closeDetail,
}) {
  const [holdingDetails, setHoldingDetails] = useState([]);

  useEffect(() => {
    getReportHoldingDetails();
  }, []);

  const getReportHoldingDetails = () => {
    Axios.get("/api/report/salesplan/individual/details", {
      params: { dateFrom, dateTo, type, holding, user },
    })

      .then((res) => res.data)
      .then((holdingDetails) => {
        setHoldingDetails(holdingDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="row">
      <div className="container">
        <p>Индивидуальный бонус</p>
        <p>Компания:{bonusElement.company}</p>
        <p>Точка:{bonusElement.point_name}</p>
        <p>Сотрудник:{bonusElement.name}</p>
        <p>ИИН: {bonusElement.iin}</p>
      </div>
      <table className="table" id="table-to-xls">
        <thead>
          <tr>
            <th className="text-center" style={{ width: "25%" }}>
              Дата
            </th>
            <th className="text-center" style={{ width: "25%" }}>
              {type === 1
                ? "Ежедневный план"
                : type === 2
                ? "Ежемесячный план"
                : type === 3
                ? "Ежеквартальный план"
                : "Ежегодный план"}
            </th>
            <th className="text-center" style={{ width: "25%" }}>
              Сумма продаж
            </th>
            <th className="text-center" style={{ width: "25" }}>
              Сумма бонусов
            </th>
          </tr>
        </thead>
        <tbody>
          {holdingDetails.map((detail, idx) => (
            <Fragment key={idx}>
              <tr className="">
                <td className="text-center">{detail.dat}</td>
                <td className="text-center">{detail.plan}</td>
                <td className="text-center">{detail.sold}</td>
                <td className="text-center">{detail.award}</td>
              </tr>
            </Fragment>
          ))}
        </tbody>
        <tfoot className="bg-info text-white">
          <td colSpan="2">Итого</td>
          <td className="text-center tenge">
            {holdingDetails
              .reduce((prev, cur) => {
                return prev + parseFloat(cur.sold);
              }, 0)
              .toLocaleString("ru", { minimumFractionDigits: 2 })}
          </td>
          <td className="text-center tenge">
            {holdingDetails
              .reduce((prev, cur) => {
                return prev + parseFloat(cur.award);
              }, 0)
              .toLocaleString("ru", { minimumFractionDigits: 2 })}
          </td>
        </tfoot>
      </table>
      <div className="col-md-12 text-right">
        <button className="btn btn-success" onClick={closeDetail}>
          Готово
        </button>
      </div>
    </div>
  );
}
