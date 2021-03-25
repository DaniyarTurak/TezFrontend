import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Searching from "../../Searching";
import Select from "react-select";
import Moment from "moment";
import ReactModal from "react-modal";
import TransactionDetails from "./Details/TransactionDetails";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

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

ReactModal.setAppElement("#root");

export default function ReportDiscounts({ companyProps }) {
  const [cashier, setCashier] = useState({
    value: "@",
    label: "Все",
    pointName: "",
  });
  const [cashiers, setCashiers] = useState([]);
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [discounts, setDiscounts] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [point, setPoint] = useState({ value: "0", label: "Все" });
  const [points, setPoints] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    if (!company) {
      getDiscounts();
      getCashboxUsers();
      getPoints();
    }
  }, []);

  useEffect(() => {
    if (company) {
      getDiscounts();
      getCashboxUsers();
      getPoints();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!isDateChanging) {
      getDiscounts();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

  const clean = () => {
    setCashier({ value: "@", label: "Все", pointName: "" });
    setCashiers([]);
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setDiscounts([]);
    setPoint({ value: "0", label: "Все" });
  };

  const onCashierChange = (c) => {
    setCashier(c);
  };

  const onPointChange = (p) => {
    setPoint(p);
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

  const dateFromChange = (e) => {
    setDateFrom(e.target.value);
    setDateChanging(true);
  };

  const dateToChange = (e) => {
    setDateTo(e.target.value);
    setDateChanging(true);
  };

  const getCashboxUsers = () => {
    setLoading(true);

    Axios.get("/api/cashboxuser", { params: { company } })
      .then((res) => res.data)
      .then((cashiersList) => {
        const all = [{ value: "@", label: "Все", pointName: "" }];
        const cashboxusers = cashiersList.map((cashier) => {
          return {
            value: cashier.id,
            label: cashier.name,
            pointName: cashier.pointName,
          };
        });
        setCashiers([...all, ...cashboxusers]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const pointsList = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints([...all, ...pointsList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDiscounts = () => {
    setLoading(true);
    Axios.get("/api/report/transactions/discounts", {
      params: {
        cashier: cashier.value,
        dateFrom,
        dateTo,
        point: point.value,
        company,
      },
    })
      .then((res) => res.data)
      .then((discountsList) => {
        setDiscounts(discountsList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setLoading(true);
    getDiscounts();
  };

  const openDetails = (t) => {
    setTransaction(t);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setTransaction("");
    setModalOpen(false);
  };

  return (
    <div className="report-cashbox-state">
      <ReactModal
        onRequestClose={() => {
          setModalOpen(false);
        }}
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <TransactionDetails
          companyProps={company}
          transaction={transaction}
          parentDetail={3}
          closeDetail={closeDetail}
        />
      </ReactModal>
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
        <div className="col-md-3 date-block">
          <label htmlFor="">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            className="form-control"
            name="dateFrom"
            onChange={dateFromChange}
          />
        </div>
        <div className="col-md-3 date-block">
          <label htmlFor="">Дата по</label>
          <input
            type="date"
            value={dateTo}
            className="form-control"
            name="dateFrom"
            onChange={dateToChange}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Кассир</label>
          <Select
            name="cashier"
            value={cashier}
            onChange={onCashierChange}
            options={cashiers}
            placeholder="Выберите Кассира"
            noOptionsMessage={() => "Кассир не найден"}
          />
        </div>

        <div className="col-md-3 point-block">
          <label htmlFor="">Торговая точка</label>
          <Select
            name="point"
            value={point}
            onChange={onPointChange}
            noOptionsMessage={() => "Выберите торговую точку из списка"}
            options={points}
            placeholder="Выберите торговую точку"
          />
        </div>

        <div className="col-md-1 text-right search-btn">
          <button
            className="btn btn-success mt-30"
            onClick={() => handleSearch()}
          >
            Поиск
          </button>
        </div>
      </div>
      {isLoading && <Searching />}

      {!isLoading && discounts.length === 0 && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">Скидки не найдены</div>
        </div>
      )}
      {!isLoading && discounts.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className=" table table-striped" id="table-to-xls">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <th style={{ width: "10%" }}>Кассир</th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Торговая точка
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    Номер чека
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Дата чека
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Сумма чека
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    Скидка
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Сумма скидки
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Итого оплачено
                  </th>
                  <th className="text-center" style={{ width: "5%" }}>
                    Детали
                  </th>
                </tr>
              </thead>
              <tbody>
                <Fragment>
                  {discounts.map((discount, idx) => (
                    <tr key={idx}>
                      <td>{discount.name}</td>
                      <td className="text-center">{discount.pointname}</td>
                      <td className="text-center">{discount.id}</td>
                      <td className="text-center">
                        {Moment(discount.date).format("DD.MM.YYYY HH:mm:ss")}
                      </td>
                      <td className="text-center">
                        {parseFloat(discount.price).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center">
                        {parseFloat(
                          discount.discount_percentage
                        ).toLocaleString("ru", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </td>
                      <td className="text-center">
                        {parseFloat(discount.discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center">
                        {parseFloat(discount.final_price).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-w-icon detail-item"
                          onClick={() => openDetails(discount)}
                        ></button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="4">Итого</td>
                  <td className="text-center tenge">
                    {discounts
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.price);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                  <td className="text-center tenge">
                    {discounts
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.discount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {discounts
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.final_price);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
            <ReactHTMLTableToExcel
              className="col-md-3 btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Примененные скидки за период с ${Moment(
                dateFrom
              ).format("DD.MM.YYYY")} по ${Moment(dateTo).format(
                "DD.MM.YYYY"
              )}`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
