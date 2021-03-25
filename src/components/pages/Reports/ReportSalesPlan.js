import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../Searching";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function ReportSalesPlan({ companyProps }) {
  const [bonusResult, setBonusResult] = useState([]);
  const [cashboxUsers, setCashboxUsers] = useState([]);
  const [cashboxuser, setCashboxuser] = useState({
    value: "0",
    label: "Все пользователи",
  });
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const company = companyProps ? companyProps.value : "";
  const companyData = JSON.parse(sessionStorage.getItem("isme-user-data"))
    ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
    : "";
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  useEffect(() => {
    getCashboxUsers();
    getDailyBonus();
  }, []);

  useEffect(() => {
    if (!isDateChanging) {
      getDailyBonus();
    }
    return () => {
      setDateChanging(false);
    };
  }, [cashboxuser]);

  const getCashboxUsers = () => {
    Axios.get("/api/cashboxuser/individual/bonus", { params: { company } })
      .then((res) => res.data)
      .then((users) => {
        const all = [{ label: "Все пользователи", value: "0" }];
        const cashboxUsersList = users.map((user) => {
          return {
            label: user.name,
            value: user.id,
          };
        });
        setCashboxUsers([...all, ...cashboxUsersList]);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const cashboxUsersChange = (c) => {
    setCashboxuser(c);
  };

  const getDailyBonus = () => {
    setLoading(true);
    Axios.get(
      `/api/report/salesplan/daily${cashboxuser.value === "0" ? "/all" : ""}`,
      {
        params: { dateFrom, dateTo, cashboxuser: cashboxuser.value },
      }
    )
      .then((res) => res.data)
      .then((res) => {
        setBonusResult(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="report-sales-plan">
      <div className="row">
        <div className="col-md-2 today-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </button>
        </div>
        <div className="col-md-2 month-btn">
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
        <div className="col-md-3">
          <label htmlFor="">Пользователь</label>
          <Select
            value={cashboxuser}
            name="cashboxuser"
            onChange={cashboxUsersChange}
            noOptionsMessage={() => "Выберите пользователя из списка"}
            options={cashboxUsers}
            placeholder="Выберите фильтр"
          />
        </div>
        <div className="col-md-1 text-right search-btn">
          <button className="btn btn-success mt-30" onClick={getDailyBonus}>
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && bonusResult.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && bonusResult.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped" id="table-to-xls">
              <thead
                style={{
                  display: "none",
                }}
              >
                <tr>
                  <td>Отчет по Индивидуальным бонусам</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">Компания:</td>
                  <td colSpan="2">{companyData}</td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">
                    Кассир-оператор
                  </td>
                  <td colSpan="2">{cashboxuser.label}</td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">За период:</td>
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
                <tr>
                  <th style={{ width: "20%" }}>Пользователь</th>
                  {cashboxuser.value !== "0" && (
                    <th style={{ width: "20%" }}>Дата</th>
                  )}
                  <th style={{ width: "20%" }}>Ежедневный план продаж</th>
                  <th style={{ width: "20%" }}>Сумма продаж</th>
                  <th style={{ width: "20%" }}>Сумма бонусов</th>
                </tr>
              </thead>
              <tbody>
                {bonusResult.map((bonus, idx) => (
                  <tr key={idx}>
                    <td>{bonus.name}</td>
                    {cashboxuser.value !== "0" && <td>{bonus.dat}</td>}
                    <td className="tenge">
                      {bonus.daily &&
                        bonus.daily.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                    </td>
                    <td className="tenge">
                      {parseFloat(bonus.sold).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="tenge">
                      {parseFloat(bonus.award).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan={`${cashboxuser.value !== "0" ? "3" : "2"}`}>
                    Итого
                  </td>
                  <td className="tenge">
                    {bonusResult
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.sold);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {bonusResult
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.award);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Индивидуальный бонус ${
                cashboxuser.value !== "0" ? `(${cashboxuser.label})` : ""
              } c ${Moment(dateFrom).format("DD.MM.YYYY")} по ${Moment(
                dateTo
              ).format("DD.MM.YYYY")}`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
