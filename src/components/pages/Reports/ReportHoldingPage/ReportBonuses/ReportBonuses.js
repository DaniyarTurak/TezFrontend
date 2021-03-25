import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";

import Alert from "react-s-alert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactModal from "react-modal";
import ReportHodlingDetails from "../../Details/ReportHoldingDetails";

import DatePickerQuarter from "./DatePickerQuarter";
import DatePickerYear from "./DatePickerYear";
import "./report-bonuses.sass";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

export default function ReportBonuses({ holding, company }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bonusWithoutChange, setBonusWithoutChange] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [bonusElement, setBonusElement] = useState({ id: "" });
  const [type, setType] = useState(1);
  const [isDateChanging, setDateChanging] = useState(false);

  useEffect(() => {
    if (!isDateChanging) {
      handleSearch();
    }
    return () => {
      setDateChanging(false);
    };
  }, [type, dateFrom, dateTo, company]);

  const checkDateRange = () => {
    const dateFromVal = new Date(dateFrom);
    const dateFromPlusThree = dateFromVal.setMonth(dateFromVal.getMonth() + 3);
    const dateToVal = new Date(dateTo);
    return dateFromPlusThree >= dateToVal ? true : false;
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const handleQuarter = (date) => {
    setDateFrom(Moment(date).startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment(date).startOf("month").add(3, "M").format("YYYY-MM-DD"));
  };

  const handleYear = (date) => {
    setDateFrom(Moment(date).startOf("year").format("YYYY-MM-DD"));
    setDateTo(Moment(date).startOf("year").add(12, "M").format("YYYY-MM-DD"));
  };

  const resetDate = () => {
    setDateFrom(Moment().startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
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
    setLoading(false);
  };

  const changePlanDate = (type) => {
    resetDate();
    if (type === 3) {
      setDateFrom(Moment().startOf("quarter").format("YYYY-MM-DD"));
      setDateTo(Moment().startOf("quarter").add(3, "M").format("YYYY-MM-DD"));
    }

    if (type === 4) {
      setDateFrom(Moment().startOf("year").format("YYYY-MM-DD"));
      setDateTo(Moment().startOf("year").add(12, "M").format("YYYY-MM-DD"));
    }
    setType(type);
  };

  const handleSearch = () => {
    let comp = company.value;
    if ((type === 1 || type === 2) && !checkDateRange()) {
      return Alert.warning("Максимальный период 3 месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else if (
      type === 2 &&
      ((Moment().month() !== Moment(dateTo).month() &&
        dateTo !== Moment(dateTo).startOf("month").format("YYYY-MM-DD")) ||
        (Moment().month() !== Moment(dateFrom).month() &&
          dateFrom !== Moment(dateFrom).startOf("month").format("YYYY-MM-DD")))
    ) {
      return Alert.warning("Выберите 1-ое число месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    Axios.get("/api/report/salesplan/individual/list", {
      params: { dateFrom, dateTo, company: comp, holding, type },
    })
      .then((res) => res.data)
      .then((bonusSevice) => {
        setLoading(false);
        setBonusWithoutChange(bonusSevice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openDetails = (bE) => {
    setBonusElement(bE);
    setModalIsOpen(true);
  };

  const closeDetail = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="report-sales-plan">
      <ReactModal
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <ReportHodlingDetails
          bonusElement={bonusElement}
          user={bonusElement.id}
          closeDetail={closeDetail}
          type={type}
          dateFrom={dateFrom}
          dateTo={dateTo}
          holding={holding}
          company={company ? company : null}
        />
      </ReactModal>

      <div className="row">
        <div className="col-md-3 today-btn">
          <button
            className={`btn btn-block mt-30 ${
              type === 1 ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => changePlanDate(1)}
          >
            Ежедневный план
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className={`btn btn-block mt-30 ${
              type === 2 ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => changePlanDate(2)}
          >
            Ежемесячный план
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className={`btn btn-block mt-30 ${
              type === 3 ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => changePlanDate(3)}
          >
            Ежеквартальный план
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className={`btn btn-block mt-30 ${
              type === 4 ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => changePlanDate(4)}
          >
            Ежегодный план
          </button>
        </div>
      </div>
      {(type === 1 || type === 2) && (
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
          <div className="col-md-2">
            <label htmlFor="">Дата с</label>
            <input
              type="date"
              value={dateFrom}
              className="form-control"
              name="dateFrom"
              onChange={dateFromChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="">Дата по</label>
            <input
              type="date"
              value={dateTo}
              className="form-control"
              name="dateTo"
              onChange={dateToChange}
            />
          </div>
          <div className="col-md-2 today-btn">
            <button
              className="btn btn-block btn-outline-success mt-30"
              onClick={handleSearch}
            >
              поиск
            </button>
          </div>
        </div>
      )}

      {type === 3 && (
        <div className="row">
          <DatePickerQuarter handleQuarter={handleQuarter} />

          <div className="col-md-2 today-btn">
            <button
              className="btn btn-block btn-outline-success mt-30"
              onClick={handleSearch}
            >
              поиск
            </button>
          </div>
        </div>
      )}

      {type === 4 && (
        <div className="row">
          <DatePickerYear handleYear={handleYear} />

          <div className="col-md-2 today-btn">
            <button
              className="btn btn-block btn-outline-success mt-30"
              onClick={handleSearch}
            >
              поиск
            </button>
          </div>
        </div>
      )}

      {!isLoading && bonusWithoutChange.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && bonusWithoutChange.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table
              className="table table-bordered table-tfoot"
              id="table-to-xls"
            >
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "15%" }}>
                    Компания
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    ИИН
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Сотрудник
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Торговая точка
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Сумма продаж
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Сумма бонусов
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Детали
                  </th>
                </tr>
              </thead>
              <tbody>
                {bonusWithoutChange.map((bonus, idx) => {
                  return (
                    <Fragment key={idx}>
                      <tr className="">
                        <td className="text-center">{bonus.company}</td>
                        <td className="text-center">{bonus.iin}</td>
                        <td className="text-center">{bonus.name}</td>
                        <td className="text-center">{bonus.point_name}</td>
                        <td className="text-center">{bonus.sold}</td>
                        <td className="text-center">{bonus.award}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-w-icon detail-item"
                            onClick={() => openDetails(bonus)}
                          ></button>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="4">Итого</td>
                  <td className="text-center tenge">
                    {bonusWithoutChange
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.sold);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {bonusWithoutChange
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.award);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename="Бонусы"
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
