import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Searching from "../../Searching";
import Alert from "react-s-alert";
import Moment from "moment";

import ReactModal from "react-modal";

import WriteOffDetails from "./Details/WriteOffDetails";
import TransactionDetails from "./Details/TransactionDetails";
import DebtTransactionDetails from "./Details/DebtTransactionDetails";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import FizProductDetails from "./Details/FizProductDetails";

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

const customStylesFiz = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "850px",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

ReactModal.setAppElement("#root");

export default function ReportLoyalty({ companyProps, holding }) {
  const [currentBonuses, setCurrentBonuses] = useState("");
  const [currentDebt, setCurrentDebt] = useState("");
  const [currentDetails, setCurrentDetails] = useState(false);
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerInfo, setCustomerInfo] = useState("");
  const [debtModalIsOpen, setDebtModalIsOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [fizProductModalIsOpen, setFizProductModalIsOpen] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [toggleDetails, setToggleDetails] = useState(false);
  const [transaction, setTransaction] = useState("");
  //writeOff стейты ниже используется только для подтягивания информации по списанию, после нажатия на "Погасить". Желательно переделать.
  const [maxValue, setMaxValue] = useState("");
  const [writeOff, setWriteOff] = useState([]);
  const [inputWriteOff, setInputWriteOff] = useState([]);
  const [writeOffIdx, setWriteOffIdx] = useState("");
  const [writeOffModalIsOpen, setWriteOffModalIsOpen] = useState(false);
  const [debtSum, setDebtSum] = useState([]);

  const company = companyProps ? companyProps.value : "";
  const user = JSON.parse(sessionStorage.getItem("isme-user-data")) || null;

  const companyID =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || null;

  useEffect(() => {
    getCustomersInfo();
  }, [company]);

  const getCustomersInfo = () => {
    if (!holding) {
      holding = false;
    }
    setLoading(true);
    Axios.get("/api/report/fizcustomers", {
      params: { holding, company },
    })
      .then((res) => res.data)
      .then((customersList) => {
        let formattedDebt = [];
        let debtSum = [];

        customersList.map((e, idx) => {
          return formattedDebt.push(e.details.debt);
        });

        // ниже прерписать код
        formattedDebt.forEach((e) => {
          if (e.length > 1) {
            debtSum.push(
              e.reduce((d, next) => {
                return d.debt + next.debt;
              })
            );
          } else debtSum.push(e[0].debt);
        });

        setDebtSum(debtSum);

        let newWriteOff = [];
        for (let i = 0; i <= customers.length; i++) {
          newWriteOff[i] = 0;
        }
        setCustomers(customersList);
        setWriteOff([...newWriteOff]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const invoiceDetails = (customerData, idx) => {
    setCustomer(customerData.customer_id);
    setName(customerData.fio);
    setTelephone(customerData.telephone);
    setCurrentDebt(debtSum[idx]);
    setCurrentBonuses(customerData.details.currbonuses);
    if (!holding) {
      holding = false;
    }

    const dF = Moment().startOf("month").format("YYYY-MM-DD");
    const dT = Moment().format("YYYY-MM-DD");
    setLoading(true);
    Axios.get("/api/report/fizcustomers/details", {
      params: {
        dateFrom: dF,
        dateTo: dT,
        customer: customerData.customer_id,
        holding,
        company,
      },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        setLoading(false);
        if (detailsList.length === 0) {
          setCurrentDetails(false);
          setToggleDetails(true);
        } else {
          setDetails(detailsList);
          setCurrentDetails(true);
          setToggleDetails(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (!holding) {
      holding = false;
    }
    setLoading(true);
    Axios.get("/api/report/fizcustomers/details", {
      params: {
        dateFrom,
        dateTo,
        customer,
        holding,
        company,
      },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        if (detailsList.length === 0) {
          Alert.info("Чеки отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          setCurrentDetails(false);
          setToggleDetails(true);
        } else {
          setDetails(detailsList);
          setCurrentDetails(true);
          setToggleDetails(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const backToList = () => {
    setDetails([]);
    setToggleDetails(false);
    setDateFrom(Moment().startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
  };

  const dateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
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

  const openWriteOffDetails = (customerData, idx) => {
    const fill = [];
    customerData.details.debt.map((e, idx) => {
      return fill.push(0);
    });
    setInputWriteOff([...fill]);
    setCustomerInfo(customerData);
    setWriteOffIdx(idx);
    setMaxValue(customerData.details.debt);
    setWriteOffModalIsOpen(true);
  };

  const handleWriteOff = (debtElement) => {
    let debt = inputWriteOff[0];
    const writeOffResult = {
      company: debtElement.company,
      writeoff_debt_customers: {
        id: debtElement.id,
        debt,
        user: user.id,
      },
    };
    Axios.post("/api/report/fizcustomers/writeoff_debt", writeOffResult)
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Списание прошло успешно", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCustomersInfo();
        closeWriteOffDetail();
        setDetails(false);
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Непредвиденная ошибка, обратитесь к администратору"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        console.log(err);
      });
  };

  const handleProductDetails = (c, idx) => {
    const newCustomer = { ...c, debtSumById: debtSum[idx] };
    setCustomer(newCustomer);
    setFizProductModalIsOpen(true);
  };

  const openDetails = (t, id) => {
    if (id) {
      setTransaction(t);
      setDebtModalIsOpen(false);
      setModalOpen(true);
    } else {
      setTransaction(t);
      setDebtModalIsOpen(true);
      setModalOpen(false);
    }
  };

  const onWriteOffChange = (idx, e) => {
    let inputChanged = [];
    let check = isNaN(e.target.value) ? 0 : e.target.value;
    inputWriteOff.forEach((el, index) => {
      if (index === idx) {
        inputChanged[index] = check;
      } else inputChanged[index] = el;
    });
    if (parseFloat(inputChanged[0]) > parseFloat(maxValue[0].debt)) {
      return Alert.info("Сумма списание не может быть больше.", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else setInputWriteOff([...inputChanged]);
  };

  const closeFizProductDetail = () => {
    setFizProductModalIsOpen(false);
  };

  const closeWriteOffDetail = () => {
    setWriteOffModalIsOpen(false);
  };

  const closeDetail = () => {
    setTransaction(null);
    setModalOpen(false);
  };

  const closeDebtDetail = () => {
    setTransaction(null);
    setDebtModalIsOpen(false);
  };

  const calculateTotalDebt = (info) => {
    let total = 0;
    let debt = 0;
    let clear = 0;
    let back = 0;

    info.forEach((cur) => {
      if (Math.sign(cur.debt) !== -1 && cur.debttype === 1) {
        debt += cur.debt;
      }
    });

    info.forEach((cur) => {
      if (Math.sign(cur.debt) !== -1 && cur.debttype !== 1) {
        clear += cur.debt;
      }
    });

    info.forEach((cur) => {
      if (Math.sign(cur.debt) === -1) {
        back += cur.debt;
      }
    });

    if (Math.sign(back) === -1) {
      total = debt - clear + back;
    } else total = debt - clear - back;
    return total;
  };

  return (
    <div className="report-cashbox-state">
      {fizProductModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setFizProductModalIsOpen(false);
          }}
          isOpen={fizProductModalIsOpen}
          style={customStylesFiz}
        >
          <FizProductDetails
            customer={customer}
            debtSum={debtSum}
            company={company}
            holding={holding}
            closeFizProductDetail={closeFizProductDetail}
          />
        </ReactModal>
      )}

      {writeOffModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setWriteOffModalIsOpen(false);
          }}
          isOpen={writeOffModalIsOpen}
          style={customStyles}
        >
          <WriteOffDetails
            customerInfo={customerInfo}
            writeOffIdx={writeOffIdx}
            writeOff={writeOff}
            inputWriteOff={inputWriteOff}
            handleWriteOff={handleWriteOff}
            onWriteOffChange={onWriteOffChange}
            closeWriteOffDetail={closeWriteOffDetail}
            companyID={companyID}
          />
        </ReactModal>
      )}

      {modalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setModalOpen(false);
          }}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <TransactionDetails
            transaction={transaction}
            parentDetail={2}
            holding={holding}
            closeDetail={closeDetail}
          />
        </ReactModal>
      )}

      {debtModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setDebtModalIsOpen(false);
          }}
          isOpen={debtModalIsOpen}
          style={customStyles}
        >
          <DebtTransactionDetails
            transaction={transaction}
            closeDebtDetail={closeDebtDetail}
          />
        </ReactModal>
      )}
      {isLoading && <Searching />}

      {!isLoading && customers.length === 0 && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">
            Произошла ошибка. Попробуйте позже.
          </div>
        </div>
      )}

      {!isLoading && customers.length === 0 && (
        <div className="row text-center">
          <div className="col-md-12 not-found-text">Покупатели не найдены</div>
        </div>
      )}

      {!isLoading && customers.length > 0 && !toggleDetails && (
        <div className="row">
          <div className="col-md-12">
            <table className=" table table-hover" id="table-bonuses">
              <thead>
                <tr className="table-analytics">
                  <th style={{ width: "20%" }} className="text-center">
                    ФИО
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Телефон
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Сумма покупок
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Накоплено Бонусов
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Потрачено Бонусов
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Остаток Бонусов
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Общий долг
                  </th>
                  <th style={{ width: "10%" }} className="text-center">
                    Списание
                  </th>
                  <th style={{ width: "5%" }} className="text-center">
                    Чеки
                  </th>
                  <th style={{ width: "5%" }} className="text-center">
                    Товары
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, idx) => {
                  return (
                    <Fragment key={idx}>
                      <tr key={idx}>
                        <td>{c.fio}</td>
                        <td className="text-center">{c.telephone}</td>
                        <td className="text-center">{c.details.price}</td>
                        <td className="text-center">{c.details.allbonuses}</td>
                        <td className="text-center">
                          {c.details.spendbonuses}
                        </td>
                        <td className="text-center">{c.details.currbonuses}</td>
                        <td className="text-center">{debtSum[idx]}</td>
                        <td
                          style={{ justifyContent: "center" }}
                          className="form-inline"
                        >
                          <button
                            style={{}}
                            className="btn btn-success"
                            onClick={() => openWriteOffDetails(c, idx)}
                          >
                            Погасить
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-w-icon detail-item"
                            onClick={() => invoiceDetails(c, idx)}
                          ></button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-w-icon products-item"
                            onClick={() => handleProductDetails(c, idx)}
                          ></button>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-bonuses"
              filename={`Бонусы покупателей`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}

      {toggleDetails && (
        <div className="mt-20">
          <div className="col-md-8">
            <div>
              <b className="btn-one-line">
                Покупатель: {name}, номер телефона: {telephone}
              </b>
            </div>
            <div>
              <b className="btn-one-line">
                Остаток бонусов на текущий момент: {currentBonuses} тенге
              </b>
            </div>
            <div>
              <b className="btn-one-line">
                Сумма долга на текущий момент: {currentDebt} тенге
              </b>
            </div>
          </div>
          <div className="col-md-12 text-right">
            <button className="btn btn-secondary" onClick={() => backToList()}>
              Вернуться назад
            </button>
          </div>
          <div style={{ marginRight: "0px" }} className="row">
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
            <div className="col-md-3 date-block">
              <label htmlFor="">Дата с</label>
              <input
                type="date"
                value={dateFrom}
                className="form-control"
                name="datefrom"
                onChange={dateFromChange}
              />
            </div>
            <div className="col-md-3 date-block">
              <label htmlFor="">Дата по</label>
              <input
                type="date"
                value={dateTo}
                className="form-control"
                name="dateto"
                onChange={dateToChange}
              />
            </div>
            <div className="col-md-1 text-right search-btn">
              <button className="btn btn-success mt-30" onClick={handleSearch}>
                Поиск
              </button>
            </div>
            {!currentDetails && (
              <div className="col-md-12 not-found-text  text-center">
                За указанный период информация не найдена
              </div>
            )}
            {currentDetails && (
              <div className="col-md-12">
                <div>
                  <table className="table table-hover" id="table-bonus-details">
                    <thead>
                      <tr>
                        <th />
                        <th className="text-center">Дата</th>
                        <th className="text-center">Номер чека</th>
                        <th className="text-center">Тип</th>
                        <th className="text-center">Сумма чека</th>
                        <th className="text-center">Сумма долга</th>
                        <th className="text-center">Бонусов начислено</th>
                        <th className="text-center">Бонусов потрачено</th>
                        <th className="text-right">Детали</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((detail, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="text-center">
                            {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                          </td>
                          <td className="text-center">{`${
                            detail.id ? detail.id : "-"
                          }`}</td>
                          <td className="text-center">{`${
                            detail.tickettype === "1"
                              ? "Возврат"
                              : Math.sign(detail.debt) === -1
                              ? "Возврат"
                              : Math.sign(detail.debttype) === -1
                              ? "Погашение долга"
                              : "Продажа"
                          }`}</td>
                          {detail.price ? (
                            <td className="text-center tenge">
                              {detail.price}
                            </td>
                          ) : (
                            <td className="text-center">-</td>
                          )}

                          {detail.debt ? (
                            <td className="text-center tenge">
                              {detail.tickettype === "1"
                                ? "-" + detail.debt
                                : Math.sign(detail.debt) === -1
                                ? "-" + detail.debt
                                : Math.sign(detail.debttype) === -1
                                ? "-" + detail.debt
                                : detail.debt}
                            </td>
                          ) : (
                            <td className="text-center">
                              {detail.debt === 0 ? "0" : "-"}
                            </td>
                          )}
                          {detail.bonusadd && detail.bonusadd !== 0 ? (
                            <td className="text-center tenge">
                              {detail.bonusadd}
                            </td>
                          ) : (
                            <td className="text-center">-</td>
                          )}
                          {detail.bonuspay && detail.bonuspay !== 0 ? (
                            <td className="text-center tenge">
                              {detail.bonuspay}
                            </td>
                          ) : (
                            <td className="text-center">-</td>
                          )}
                          <td className="text-right">
                            <button
                              className="btn btn-w-icon detail-item"
                              onClick={() => openDetails(detail, detail.id)}
                            ></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="bg-info text-white">
                      <tr>
                        <td colSpan="4">Итого</td>
                        <td className="text-center tenge">
                          {details
                            .reduce((prev, cur) => {
                              return prev + cur.price;
                            }, 0)
                            .toLocaleString("ru", {
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="text-center tenge">
                          {calculateTotalDebt(details).toLocaleString("ru", {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-center tenge">
                          {details
                            .reduce((prev, cur) => {
                              return prev + cur.bonusadd;
                            }, 0)
                            .toLocaleString("ru", {
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="text-center tenge">
                          {details
                            .reduce((prev, cur) => {
                              return prev + cur.bonuspay;
                            }, 0)
                            .toLocaleString("ru", {
                              maximumFractionDigits: 2,
                            })}
                        </td>

                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="col-md-12">
                  <ReactHTMLTableToExcel
                    className="btn btn-sm btn-outline-success"
                    table="table-bonus-details"
                    filename={`Детали покупателя ${name} за период с ${dateFrom} по ${dateTo}`}
                    sheet="tablexls"
                    buttonText="Выгрузить в excel"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
