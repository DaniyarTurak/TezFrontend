import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../Searching";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import Pagination from "react-js-pagination";

import OrderArrow from "../../OrderArrow";
import TransactionDetails from "./Details/TransactionDetails";

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

export default function ReportTransactions({
  companyProps,
  holding,
  parameters,
}) {
  const [activePage, setActivePage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [consignator, setConsignator] = useState(
    parameters
      ? { label: parameters.customer, value: parameters.id }
      : { label: "Все", value: 0 }
  );
  const [consignators, setConsignators] = useState([]);
  const [currentRange, setCurrentRange] = useState({ first: 0, last: 0 });
  const [dateFrom, setDateFrom] = useState(
    parameters
      ? Moment(parameters.date).format("YYYY-MM-DD")
      : Moment().format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [filter, setFilter] = useState(
    parameters
      ? {
          value: "jur",
          label: "По юр. лицам",
        }
      : {
          value: "fiz",
          label: "По физ. лицам",
        }
  );
  const [isDateChanging, setDateChanging] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [isInvoiceExcelLoading, setInvoiceExcelLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState({ label: "Все", value: "0" });
  const [points, setPoints] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [transactions, setTransactions] = useState([]);

  const company = companyProps ? companyProps.value : "";
  const options = [
    { value: "fiz", label: "По физ. лицам" },
    { value: "jur", label: "По юр. лицам" },
  ];

  if (!holding) {
    holding = false;
  }

  useEffect(() => {
    if (parameters) {
      getJurBuyers(parameters.customer);
    }
  }, [parameters]);

  useEffect(() => {
    if (company) {
      getPoints();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!company) {
      getPoints();
      setCurrentRange({
        first: activePage * 10 - 10,
        last: activePage * 10 - 1,
      });
    }
    getJurBuyers();
  }, []);

  useEffect(() => {
    if (!isDateChanging && point.value) {
      getTransactions();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo, point]);

  useEffect(() => {
    if (!point.value) return;
    handleSearch();
  }, [filter]);

  const clean = () => {
    setCurrentRange({
      first: activePage * 10 - 10,
      last: activePage * 10 - 1,
    });
    setTransactions([]);
    setPoint("");
    setPoints([]);
    setConsignator({ label: "Все", value: 0 });
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setFilter({
      value: "fiz",
      label: "По физ. лицам",
    });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company, holding } })
      .then((res) => res.data)
      .then((res) => {
        const all = { label: "Все", value: "0" };
        const p = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints([...all, ...p]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const orderByFunction = (order) => {
    let t = transactions;
    let asc = ascending;
    let prevOrderBy = orderBy;

    prevOrderBy === order ? (asc = !asc) : (asc = true);

    t.sort((a, b) => {
      let textA = parseFloat(a[order]) || a[order];
      let textB = parseFloat(b[order]) || b[order];

      let res = asc
        ? textA < textB
          ? -1
          : textA > textB
          ? 1
          : 0
        : textB < textA
        ? -1
        : textB > textA
        ? 1
        : 0;
      return res;
    });
    setTransactions(t);
    setAscending(asc);
    setOrderBy(order);
    setActivePage(1);
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const handleConsignatorChange = (c) => {
    setConsignator(c);
  };

  const pointsChange = (p) => {
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

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setCurrentRange({
      first: pageNumber * 10 - 10,
      last: pageNumber * 10 - 1,
    });
  }

  const handleSearch = () => {
    if (!point.value) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    getTransactions();
  };

  const getTransactions = () => {
    setLoading(true);
    Axios.get("/api/report/transactions", {
      params: {
        dateFrom,
        dateTo,
        point: point.value,
        client: filter.value,
        company,
        holding,
        consignator: consignator.value,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setTransactions(res);
        setLoading(false);
        setActivePage(1);
        setCurrentRange({
          first: 0,
          last: 9,
        });
        setOrderBy("");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getTransactionsExcel = () => {
    if (dateFrom && dateTo && point) {
      setExcelLoading(true);
      Axios.get("/api/report/transactions/excel", {
        responseType: "blob",
        params: {
          dateFrom,
          dateTo,
          point: point.value,
          client: filter.value,
          company,
          holding,
          consignator: consignator.value,
        },
      })
        .then((res) => res.data)
        .then((stockbalance) => {
          const url = window.URL.createObjectURL(new Blob([stockbalance]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Отчёт по чекам от (${dateFrom}-${dateTo}) ${point.label}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
          setExcelLoading(false);
        })
        .catch((err) => {
          setExcelLoading(false);
          console.log(err);
        });
    }
  };

  const openDetails = (tr) => {
    setTransaction(tr);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setTransaction("");
    setModalOpen(false);
  };

  const filterChange = (filterr) => {
    if (!filterr.value) return;
    setFilter(filterr);
    setConsignator({ label: "Все", value: "0" });
    setTransaction([]);
  };

  const getJurBuyers = (customer) => {
    Axios.get("/api/buyers", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        if (customer) {
          options.forEach((e) => {
            if (e.label === customer) {
              setConsignator({ value: e.value, label: e.label });
            }
          });
        }
        setConsignators([...all, ...options]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getInvoice = (transactionId, ticketId) => {
    setInvoiceExcelLoading(true);
    Axios.get("/api/report/transactions/jur/invoice", {
      responseType: "blob",
      params: { transactionId, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Накладная ${ticketId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setInvoiceExcelLoading(false);
      })
      .catch((err) => {
        setInvoiceExcelLoading(false);
        console.log(err);
        Alert.error("Данные по накладной не найдены", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      });
  };

  return (
    <div className="report-check">
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
          parentDetail={1}
          closeDetail={closeDetail}
          holding={holding}
        />
      </ReactModal>

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
        <div className="col-md-3 point-block">
          <label htmlFor="">Торговая точка</label>
          <Select
            value={point}
            name="point"
            onChange={pointsChange}
            noOptionsMessage={() => "Выберите торговую точку из списка"}
            options={points}
            placeholder="Выберите торговую точку"
          />
        </div>
        {filter.value === "jur" && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Консигнаторы</label>
            <Select
              name="consignator"
              value={consignator}
              onChange={handleConsignatorChange}
              options={consignators}
              placeholder="Выберите консигнатора"
              noOptionsMessage={() => "Консигнатор не найден"}
            />
          </div>
        )}
        <div className="col-md-3 sale-report-filter">
          <label htmlFor="">Фильтр</label>
          <Select
            value={filter}
            name="filter"
            onChange={filterChange}
            noOptionsMessage={() => "Выберите вариант из списка"}
            isSearchable={false}
            options={options}
            placeholder="Выберите фильтр"
          />
        </div>
        <div className="col-md-1 text-right search-btn">
          <button className="btn btn-success mt-30" onClick={handleSearch}>
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && !point && transactions.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            Выберите торговую точку
          </div>
        </div>
      )}

      {!isLoading && point && transactions.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table
              className="table table-striped table-hover"
              id="table-to-xls"
            >
              <thead>
                <tr>
                  <th style={{ width: "2%" }}></th>
                  <th style={{ width: "15%" }}>
                    <span
                      className="hand"
                      onClick={() => orderByFunction("date")}
                    >
                      Дата
                    </span>{" "}
                    {orderBy === "date" && <OrderArrow ascending={ascending} />}
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    Способ оплаты
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    <span
                      className="hand"
                      onClick={() => orderByFunction("tickettype")}
                    >
                      Тип операции
                    </span>
                    {orderBy === "tickettype" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </th>
                  <th className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("price")}
                    >
                      Общая сумма
                    </span>
                    {orderBy === "price" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </th>
                  <th className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("cashboxuser")}
                    >
                      Кассир
                    </span>{" "}
                    {orderBy === "cashboxuser" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </th>
                  <th className="text-center">Детали</th>
                  {filter.value === "jur" && (
                    <th className="text-center">Накладная</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tr, idx) => (
                  <tr
                    className={`${
                      currentRange.first <= idx && idx <= currentRange.last
                        ? ""
                        : "d-none"
                    }`}
                    key={idx}
                  >
                    <td>{idx + 1}</td>
                    <td>{Moment(tr.date).format("DD.MM.YYYY HH:mm:ss")}</td>
                    <td className="text-center">
                      <button
                        className={`btn btn-w-big-icon ${
                          tr.paymenttype === "card"
                            ? "paycard-item"
                            : tr.paymenttype === "cash"
                            ? "tenge-item"
                            : tr.paymenttype === "mixed"
                            ? "mixed-item"
                            : tr.paymenttype === "debt"
                            ? "debt-item"
                            : "debit-item"
                        }`}
                        title={`${
                          tr.paymenttype === "card"
                            ? "Карта"
                            : tr.paymenttype === "cash"
                            ? "Наличными"
                            : tr.paymenttype === "mixed"
                            ? "Смешанная"
                            : tr.paymenttype === "debt"
                            ? "Долг"
                            : "Перевод"
                        }`}
                      ></button>
                    </td>
                    <td className="text-center">
                      {tr.tickettype === "0" ? "Покупка" : "Возврат"}
                    </td>
                    <td className="text-center tenge">
                      {parseFloat(tr.price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">{tr.cashboxuser}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-w-icon detail-item"
                        onClick={() => openDetails(tr)}
                      ></button>
                    </td>
                    {filter.value === "jur" && (
                      <td className="text-center">
                        {tr.tickettype === "0" && (
                          <button
                            disabled={isInvoiceExcelLoading}
                            className="btn btn-w-icon excel-item"
                            onClick={() => getInvoice(tr.id, tr.ticketid)}
                          ></button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="col-md-12">
              <button
                className="btn btn-sm btn-outline-success"
                disabled={isExcelLoading}
                onClick={getTransactionsExcel}
              >
                Выгрузить в excel
              </button>
            </div>
          </div>

          {transactions.length > 10 && (
            <div className="col-md-12 text-right">
              <Pagination
                hideDisabled
                hideNavigation={transactions.length / 10 < 5}
                hideFirstLastPages={transactions.length / 10 < 5}
                activePage={activePage}
                itemsCountPerPage={10}
                totalItemsCount={transactions.length}
                pageRangeDisplayed={5}
                innerClass="pagination justify-content-center"
                itemClass="page-item"
                linkClass="page-link"
                onChange={handlePageChange.bind(this)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
