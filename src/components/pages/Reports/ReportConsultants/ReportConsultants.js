import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Searching from "../../../Searching";
import Moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import ReportConsultantsDetails from "./ReportConsultantsDetails";

export default function ReportConsultants({ companyProps }) {
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [consultants, setConsultants] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const company = companyProps ? companyProps.value : "";
  const companyName = JSON.parse(sessionStorage.getItem("isme-user-data"))
    .companyname;
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  useEffect(() => {
    if (!company) {
      getConsultants();
    }
  }, []);

  useEffect(() => {
    if (company) {
      getConsultants();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!isDateChanging) {
      getConsultants();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

  const clean = () => {
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setConsultants([]);
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const getConsultants = () => {
    setLoading(true);
    Axios.get("/api/report/transactions/consultants", {
      params: { dateFrom, dateTo, company },
    })
      .then((res) => res.data)
      .then((consultantsList) => {
        consultantsList.forEach((consultant) => {
          consultant.show = false;
        });
        setConsultants(consultantsList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleClick = (id) => {
    const newConsultants = [...consultants];
    newConsultants.forEach((e) => {
      if (e.id === id) {
        e.show = !e.show;
      }
    });
    setConsultants([...newConsultants]);
  };
  return (
    <div className="report-stock-balance">
      <div className="row">
        <div className="col-md-3 today-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("month")}
          >
            Текущий месяц
          </button>
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            className="form-control"
            name="dateFrom"
            onChange={dateFromChange}
          />
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата по</label>
          <input
            type="date"
            value={dateTo}
            className="form-control"
            name="dateTo"
            onChange={dateToChange}
          />
        </div>

        <div className="col-md-1 text-right search-btn">
          <button
            className="btn btn-success mt-30"
            onClick={() => getConsultants(dateFrom, dateTo)}
          >
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && consultants.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && consultants.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead
                style={{
                  display: "none",
                }}
              >
                <tr>
                  <td className="text-center font-weight-bold">
                    Отчет по консультантам
                  </td>
                  <td colSpan="2"></td>
                </tr>
                <tr></tr>
                <tr>
                  <td className="text-center font-weight-bold">Компания:</td>
                  <td colSpan="2">{companyName}</td>
                </tr>
                <tr>
                  <th className="text-center font-weight-bold">За период:</th>
                  <td colSpan="2">
                    {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -{" "}
                    {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
                  </td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">
                    Время формирования отчёта:
                  </td>
                  <td colSpan="2">{now}.</td>
                </tr>
                <tr>
                  <td colSpan="9" style={{ height: "30px" }}></td>
                </tr>
              </thead>
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>№</td>
                  <td className="text-center">Консультант</td>
                  <td className="text-center">C учетом применёной скидки</td>
                  <td className="text-center">
                    C учетом применёной скидки(за минусом использованных
                    бонусов)
                  </td>
                </tr>
              </thead>
              <tbody>
                {consultants.map((consultant, idx) => (
                  <Fragment>
                    <tr
                      style={{ cursor: "pointer" }}
                      key={idx}
                      onClick={() => handleClick(consultant.id)}
                    >
                      <td>{idx + 1}</td>
                      <td className="text-center">{consultant.name}</td>
                      <td className="text-center">{consultant.sum}</td>
                      <td className="text-center">
                        {consultant.sum_without_bonus}
                      </td>
                    </tr>
                    {consultant.show && (
                      <tr style={{ transition: "transform 1s" }}>
                        <td colspan="4">
                          <ReportConsultantsDetails
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            id={consultant.id}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
              <tr style={{ fontWeight: "bold" }}>
                <th>Итого:</th>
                <th></th>
                <th className="text-center">
                  {consultants
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.sum);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </th>
                <th className="text-center">
                  {consultants
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.sum_without_bonus);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </th>
              </tr>
              <tfoot></tfoot>
            </table>
          </div>

          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Консультанты`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
