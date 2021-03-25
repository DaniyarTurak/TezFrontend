import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Moment from "moment";
import Alert from "react-s-alert";
import _ from "lodash";
import Searching from "../../../Searching";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function ReportSalesSection({ companyProps, holding }) {
  const [cashboxSalesResult, setCashboxSalesResult] = useState([]);
  const [cashboxSalesResultNDS, setCashboxSalesResultNDS] = useState([]);
  const [client, setClient] = useState("");
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [filterType, setFilterType] = useState({
    value: "cashboxuser",
    label: "По пользователям",
  });
  const [filter, setFilter] = useState({
    value: "cashboxFiz",
    label: "По физ. лицам",
  });
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [salesResult, setSalesResult] = useState([]);
  const [salesResultNDS, setSalesResultNDS] = useState([]);

  const company = companyProps ? companyProps.value : "";

  const options = [
    { value: "cashboxFiz", label: "По физ. лицам" },
    { value: "cashboxJur", label: "По юр. лицам" },
  ];
  const typeOptions = [
    { value: "cashboxuser", label: "По пользователям" },
    { value: "cashbox", label: "По кассам" },
  ];

  const companyData = JSON.parse(sessionStorage.getItem("isme-user-data"))
    ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
    : "";

  let totalResults =
    filterType.value === "cashbox" ? cashboxSalesResult : salesResult;
  let totalResultsNDS =
    filterType.value === "cashbox" ? cashboxSalesResultNDS : salesResultNDS;

  const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  if (!holding) {
    holding = false;
  }

  useEffect(() => {
    if (!company) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (!isDateChanging) {
      handleSearch();
    }
    return () => {
      setDateChanging(false);
    };
  }, [filterType, filter, dateFrom, dateTo, company]);

  useEffect(() => {
    if (filterType.value === "cashbox" && client) {
      getCashboxBonus();
      getCashboxBonusNDS();
    } else if (client) {
      getCashboxuserBonus();
      getCashboxuserBonusNDS();
    }
    return () => {
      setClient("");
      setLoading(false);
      cleanSales();
    };
  }, [client]);

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const cleanSales = () => {
    setSalesResult([]);
    setSalesResultNDS([]);
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

  const filterChange = (f) => {
    setFilter(f);
    cleanSales();
  };

  const filterTypeChange = (ft) => {
    setFilterType(ft);
    cleanSales();
  };

  const handleSearch = () => {
    if (!dateFrom || !dateTo || filter.length === 0) {
      const text = !dateFrom ? "Дата с" : !dateTo ? "Дата по" : "Фильтр";
      return Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setLoading(true);
    cleanSales();
    switch (filter.value) {
      case "cashboxFiz": {
        setClient("fiz");
        break;
      }
      case "cashboxJur": {
        setClient("jur");
        break;
      }
      default:
        console.log("Error: filter not detected");
    }
  };

  const getCashboxuserBonus = () => {
    Axios.get("/api/report/sales/cashboxuser", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        setSalesResult(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCashboxBonus = () => {
    Axios.get("/api/report/sales/cashbox", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((sales) => {
        const temp = _.mapValues(_.groupBy(sales, "point"), (list) =>
          list.map((bs) => _.omit(bs, "point"))
        );
        const salesResultList = Object.keys(temp).map((key) => {
          return {
            point: key,
            cashboxes: temp[key],
          };
        });
        setSalesResult(salesResultList);
        setCashboxSalesResult(sales);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCashboxuserBonusNDS = () => {
    Axios.get("/api/report/sales/ndscashboxuser", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        setSalesResultNDS(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCashboxBonusNDS = () => {
    Axios.get("/api/report/sales/ndscashbox", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((salesNDS) => {
        const temp = _.mapValues(_.groupBy(salesNDS, "point"), (list) =>
          list.map((bs) => _.omit(bs, "point"))
        );

        const salesResultNDSList = Object.keys(temp).map((key) => {
          return {
            point: key,
            cashboxesNDS: temp[key],
          };
        });
        setSalesResultNDS(salesResultNDSList);
        setCashboxSalesResultNDS(salesNDS);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="report-sales">
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
        <div className="col-md-3 sale-report-filter">
          <label htmlFor="">Фильтр</label>
          <Select
            value={filter}
            name="filter"
            onChange={filterChange}
            noOptionsMessage={() => "Выберите вариант из списка"}
            options={options}
            placeholder="Выберите фильтр"
          />
        </div>
        <div className="col-md-3 sale-report-filter">
          <label htmlFor="">Фильтр 2</label>
          <Select
            value={filterType}
            name="filterType"
            onChange={filterTypeChange}
            noOptionsMessage={() => "Выберите вариант из списка"}
            options={typeOptions}
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

      {!isLoading && salesResult.length === 0 && salesResultNDS.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && salesResult.length > 0 && salesResultNDS.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table
              className="table table-bordered table-tfoot"
              id="table-to-xls"
            >
              <thead
                style={{
                  display: "none",
                }}
              >
                <tr>
                  <td className="text-center font-weight-bold">Компания:</td>
                  <td colSpan="2">{companyData}</td>
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
              <thead className="font-weight-bold">
                <tr>
                  <th rowSpan="4" style={{ width: "25%" }}>
                    Наименование
                  </th>
                  <td
                    style={{ width: "75%" }}
                    className="text-center"
                    colSpan="8"
                  >
                    Продажи (Возвраты не учитываются)
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="8"
                    style={{ width: "75%" }}
                    className="text-center"
                  >
                    Общая сумма товаров
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Наличными <br /> после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Картой
                    <br /> после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Безналичный перевод <br />
                    после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Скидка
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Бонусы
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Долг
                  </td>
                  <td colSpan="2" className="text-center font-weight-normal">
                    Сумма
                  </td>
                </tr>
                <tr>
                  <td className="text-center font-weight-normal">
                    С учётом применённой скидки
                  </td>
                  <td className="text-center font-weight-normal">
                    С учётом применённой скидки <br /> (за минусом
                    использованных бонусов)
                  </td>
                </tr>
              </thead>
              <tbody>
                {filterType.value !== "cashbox" &&
                  salesResult.map((sales, idx) => (
                    <tr key={idx}>
                      <td>{sales.name}</td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.cash).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.card).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.debitpay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.bonuspay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.debtpay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.total_discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(
                          sales.total_discount_bonus
                        ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                {filterType.value === "cashbox" &&
                  salesResult.map((sales, idx) => {
                    return (
                      <Fragment key={idx}>
                        <tr className="bg-grey">
                          <td>{sales.point}</td>

                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.cash);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.card);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.debitpay);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.discount);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.bonuspay);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.debtpay);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>

                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.total_discount);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return (
                                  prev + parseFloat(cur.total_discount_bonus)
                                );
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                        {sales.cashboxes.map((sl, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{sl.name}</td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.cash).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.card).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.debitpay).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.discount).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.bonuspay).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.debtpay).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.total_discount).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(
                                  sl.total_discount_bonus
                                ).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </tbody>
              <tbody className="bg-info text-white">
                <Fragment>
                  <tr>
                    <td>Итого</td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.cash);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.card);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.debitpay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.discount);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.bonuspay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.debtpay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.total_discount);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.total_discount_bonus);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </Fragment>
              </tbody>

              <thead className="font-weight-bold">
                <tr>
                  <td colSpan="9" style={{ height: "30px" }}></td>
                </tr>
                <tr>
                  <th rowSpan="4" style={{ width: "20%" }}>
                    Наименование
                  </th>
                  <td className="text-center" colSpan="8">
                    Продажи (Возвраты не учитываются)
                  </td>
                </tr>
                <tr>
                  <td colSpan="8" className="text-center">
                    В том числе
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Общая сумма товаров, освобожденных от НДС
                  </td>
                  <td colSpan="2" className="text-center font-weight-normal">
                    Общая сумма товаров, облагаемых НДС
                  </td>
                  <td colSpan="4" className="text-center font-weight-normal">
                    Итого
                  </td>
                </tr>
                <tr>
                  <td className="text-center font-weight-normal">
                    Общая сумма товаров
                  </td>
                  <td className="text-center font-weight-normal">
                    в том числе НДС
                  </td>
                  <td colSpan="2" className="text-center font-weight-normal">
                    С учётом применённой скидки
                  </td>
                  <td colSpan="2" className="text-center font-weight-normal">
                    С учётом применённой скидки <br /> (за минусом
                    использованных бонусов)
                  </td>
                </tr>
              </thead>
              <tbody>
                {filterType.value !== "cashbox" &&
                  salesResultNDS.map((sales, idx) => (
                    <tr key={idx}>
                      <td>{sales.name}</td>
                      <td colSpan="2" className="text-center tenge">
                        {parseFloat(sales.withoutvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {parseFloat(sales.withvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {parseFloat(sales.vat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="2" className="text-center tenge">
                        {parseFloat(sales.total_discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="2" className="text-center tenge">
                        {parseFloat(
                          sales.total_discount_bonus
                        ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                {filterType.value === "cashbox" &&
                  salesResultNDS.length > 0 &&
                  salesResultNDS.map((salesNDS, idx) => {
                    return (
                      <Fragment key={idx}>
                        <tr className="bg-grey">
                          <td>{salesNDS.point}</td>

                          <td colSpan="2" className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.withoutvat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.withvat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.vat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="2" className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.total_discount);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="2" className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return (
                                  prev + parseFloat(cur.total_discount_bonus)
                                );
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                        {salesNDS.cashboxesNDS.map((sl, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{sl.name}</td>
                              <td colSpan="2" className="text-center tenge">
                                {parseFloat(sl.withoutvat).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="text-center tenge">
                                {parseFloat(sl.withvat).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td className="text-center tenge">
                                {parseFloat(sl.vat).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="2" className="text-center tenge">
                                {parseFloat(sl.total_discount).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td colSpan="2" className="text-center tenge">
                                {parseFloat(
                                  sl.total_discount_bonus
                                ).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </tbody>
              <tbody className="bg-info text-white">
                <Fragment>
                  <tr>
                    <td>Итого</td>
                    <td colSpan="2" className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.withoutvat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.withvat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.vat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="2" className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.total_discount);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="2" className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.total_discount_bonus);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </Fragment>
              </tbody>
              <thead className="font-weight-bold">
                <tr>
                  <td colSpan="9" style={{ height: "30px" }}></td>
                </tr>
                <tr>
                  <th rowSpan="4" style={{ width: "25%" }}>
                    Наименование
                  </th>
                  <td
                    style={{ width: "75%" }}
                    className="text-center"
                    colSpan="8"
                  >
                    Возвраты
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="8"
                    style={{ width: "75%" }}
                    className="text-center"
                  >
                    Общая сумма товаров
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Наличными <br /> после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Картой
                    <br /> после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Безналичный перевод <br /> после скидки
                  </td>
                  <td
                    colSpan="1"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Бонусы
                  </td>
                  <td
                    colSpan="4"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Сумма возвратов
                    <br />С учётом применённой скидки
                  </td>
                </tr>
              </thead>
              <tbody>
                {filterType.value !== "cashbox" &&
                  salesResult.map((sales, idx) => (
                    <tr key={idx}>
                      <td>{sales.name}</td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.retcash).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.retcard).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.retdebitpay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="1" className="text-center tenge">
                        {parseFloat(sales.retbonuspay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="4" className="text-center tenge">
                        {parseFloat(sales.rettotal).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                {filterType.value === "cashbox" &&
                  salesResult.map((sales, idx) => {
                    return (
                      <Fragment key={idx}>
                        <tr className="bg-grey">
                          <td>{sales.point}</td>

                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retcash);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retcard);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retdebitpay);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="1" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retbonuspay);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="4" className="text-center tenge">
                            {sales.cashboxes
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.rettotal);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                        {sales.cashboxes.map((sl, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{sl.name}</td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.retcash).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.retcard).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>

                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.retdebitpay).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td colSpan="1" className="text-center tenge">
                                {parseFloat(sl.retbonuspay).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>

                              <td colSpan="4" className="text-center tenge">
                                {parseFloat(sl.rettotal).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </tbody>
              <tbody className="bg-info text-white">
                <Fragment>
                  <tr>
                    <td>Итого</td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retcash);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retcard);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retdebitpay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="1" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retbonuspay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="4" className="text-center tenge">
                      {totalResults
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.rettotal);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </Fragment>
              </tbody>
              <thead className="font-weight-bold">
                <tr>
                  <td colSpan="9" style={{ height: "30px" }}></td>
                </tr>
                <tr>
                  <th rowSpan="4" style={{ width: "20%" }}>
                    Наименование
                  </th>
                  <td className="text-center" colSpan="8">
                    Возвраты
                  </td>
                </tr>
                <tr>
                  <td colSpan="8" className="text-center">
                    В том числе
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Общая сумма товаров, освобожденных от НДС
                  </td>
                  <td colSpan="2" className="text-center font-weight-normal">
                    Общая сумма товаров, облагаемых НДС
                  </td>
                  <td
                    colSpan="4"
                    rowSpan="2"
                    className="text-center font-weight-normal"
                  >
                    Итого возвратов <br />С учётом применённой скидки
                  </td>
                </tr>
                <tr>
                  <td className="text-center font-weight-normal">
                    Общая сумма товаров
                  </td>
                  <td className="text-center font-weight-normal">
                    в том числе НДС
                  </td>
                </tr>
              </thead>
              <tbody>
                {filterType.value !== "cashbox" &&
                  salesResultNDS.map((sales, idx) => (
                    <tr key={idx}>
                      <td>{sales.name}</td>
                      <td colSpan="2" className="text-center tenge">
                        {parseFloat(sales.retwithoutvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {parseFloat(sales.retwithvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {parseFloat(sales.retvat).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan="4" className="text-center tenge">
                        {parseFloat(sales.rettotal).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                {filterType.value === "cashbox" &&
                  salesResultNDS.length > 0 &&
                  salesResultNDS.map((salesNDS, idx) => {
                    return (
                      <Fragment key={idx}>
                        <tr className="bg-grey">
                          <td>{salesNDS.point}</td>

                          <td colSpan="2" className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retwithoutvat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retwithvat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.retvat);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                          <td colSpan="4" className="text-center tenge">
                            {salesNDS.cashboxesNDS
                              .reduce((prev, cur) => {
                                return prev + parseFloat(cur.rettotal);
                              }, 0)
                              .toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                        {salesNDS.cashboxesNDS.map((sl, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{sl.name}</td>
                              <td colSpan="2" className="text-center tenge">
                                {parseFloat(sl.retwithoutvat).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="text-center tenge">
                                {parseFloat(sl.retwithvat).toLocaleString(
                                  "ru",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="text-center tenge">
                                {parseFloat(sl.retvat).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td colSpan="4" className="text-center tenge">
                                {parseFloat(sl.rettotal).toLocaleString("ru", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </tbody>
              <tfoot className="bg-info text-white">
                <Fragment>
                  <tr>
                    <td>Итого</td>
                    <td colSpan="2" className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retwithoutvat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retwithvat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.retvat);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan="4" className="text-center tenge">
                      {totalResultsNDS
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.rettotal);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </Fragment>
              </tfoot>
            </table>
          </div>

          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Продажи в разрезе ${filter.label.toLowerCase()} c ${Moment(
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
