import React, { Fragment } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "moment/locale/ru";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { withStyles } from "@material-ui/core/styles";
Moment.locale("ru");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: ".875rem",
  },
  body: {
    fontSize: ".875rem",
  },
  footer: {
    fontWeight: "bold",
    fontSize: ".875rem",
  },
}))(TableCell);

export default function SectionsTableBig({
  companyData,
  dateFrom,
  dateTo,
  now,
  filterType,
  salesResult,
  totalResults,
  salesResultNDS,
  totalResultsNDS,
  filter,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table id="table-to-xls">
            <TableHead
              style={{
                display: "none",
              }}
            >
              <TableRow>
                <StyledTableCell className="text-center font-weight-bold">
                  Компания:
                </StyledTableCell>
                <StyledTableCell colSpan="2">{companyData}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="text-center font-weight-bold">
                  За период:
                </StyledTableCell>
                <StyledTableCell colSpan="2">
                  {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -{" "}
                  {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="text-center font-weight-bold">
                  Время формирования отчёта:
                </StyledTableCell>
                <StyledTableCell colSpan="2">{now}.</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="9"
                  style={{ height: "30px" }}
                ></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead className="font-weight-bold">
              <TableRow>
                <StyledTableCell rowSpan="4" style={{ width: "25%" }}>
                  Наименование
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "75%" }}
                  className="text-center"
                  colSpan="8"
                >
                  Продажи (Возвраты не учитываются)
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="8"
                  style={{ width: "75%" }}
                  className="text-center"
                >
                  Общая сумма товаров
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Наличными <br /> после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Картой
                  <br /> после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Безналичный перевод <br />
                  после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Скидка
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Бонусы
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Долг
                </StyledTableCell>
                <StyledTableCell
                  colSpan="2"
                  className="text-center font-weight-normal"
                >
                  Сумма
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="text-center font-weight-normal">
                  С учётом применённой скидки
                </StyledTableCell>
                <StyledTableCell className="text-center font-weight-normal">
                  С учётом применённой скидки <br /> (за минусом использованных
                  бонусов)
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterType.value !== "cashbox" &&
                salesResult.map((sales, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{sales.name}</StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.cash).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.card).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.debitpay).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.bonuspay).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.debtpay).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.total_discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.total_discount_bonus).toLocaleString(
                        "ru",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
              {filterType.value === "cashbox" &&
                salesResult.map((sales, idx) => {
                  return (
                    <Fragment key={idx}>
                      <TableRow className="bg-grey">
                        <StyledTableCell>{sales.point}</StyledTableCell>

                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.cash);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.card);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.debitpay);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.discount);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.bonuspay);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.debtpay);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>

                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.total_discount);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return (
                                prev + parseFloat(cur.total_discount_bonus)
                              );
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                      </TableRow>
                      {sales.cashboxes.map((sl, idx) => {
                        return (
                          <TableRow key={idx}>
                            <StyledTableCell>{sl.name}</StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.cash).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.card).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.debitpay).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.discount).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.bonuspay).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.debtpay).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.total_discount).toLocaleString(
                                "ru",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(
                                sl.total_discount_bonus
                              ).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </Fragment>
                  );
                })}
            </TableBody>
            <TableBody className="bg-info text-white">
              <Fragment>
                <TableRow>
                  <StyledTableCell>Итого</StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.cash);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.card);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.debitpay);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.discount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.bonuspay);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.debtpay);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount_bonus);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                </TableRow>
              </Fragment>
            </TableBody>

            <TableHead className="font-weight-bold">
              <TableRow>
                <StyledTableCell
                  colSpan="9"
                  style={{ height: "30px" }}
                ></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell rowSpan="4" style={{ width: "20%" }}>
                  Наименование
                </StyledTableCell>
                <StyledTableCell className="text-center" colSpan="8">
                  Продажи (Возвраты не учитываются)
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan="8" className="text-center">
                  В том числе
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="2"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Общая сумма товаров, освобожденных от НДС
                </StyledTableCell>
                <StyledTableCell
                  colSpan="2"
                  className="text-center font-weight-normal"
                >
                  Общая сумма товаров, облагаемых НДС
                </StyledTableCell>
                <StyledTableCell
                  colSpan="4"
                  className="text-center font-weight-normal"
                >
                  Итого
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="text-center font-weight-normal">
                  Общая сумма товаров
                </StyledTableCell>
                <StyledTableCell className="text-center font-weight-normal">
                  в том числе НДС
                </StyledTableCell>
                <StyledTableCell
                  colSpan="2"
                  className="text-center font-weight-normal"
                >
                  С учётом применённой скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="2"
                  className="text-center font-weight-normal"
                >
                  С учётом применённой скидки <br /> (за минусом использованных
                  бонусов)
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterType.value !== "cashbox" &&
                salesResultNDS.map((sales, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{sales.name}</StyledTableCell>
                    <StyledTableCell colSpan="2" className="text-center tenge">
                      {parseFloat(sales.withoutvat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell className="text-center tenge">
                      {parseFloat(sales.withvat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell className="text-center tenge">
                      {parseFloat(sales.vat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="2" className="text-center tenge">
                      {parseFloat(sales.total_discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="2" className="text-center tenge">
                      {parseFloat(sales.total_discount_bonus).toLocaleString(
                        "ru",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
              {filterType.value === "cashbox" &&
                salesResultNDS.length > 0 &&
                salesResultNDS.map((salesNDS, idx) => {
                  return (
                    <Fragment key={idx}>
                      <TableRow className="bg-grey">
                        <StyledTableCell>{salesNDS.point}</StyledTableCell>

                        <StyledTableCell
                          colSpan="2"
                          className="text-center tenge"
                        >
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.withoutvat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell className="text-center tenge">
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.withvat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell className="text-center tenge">
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.vat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          className="text-center tenge"
                        >
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.total_discount);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          className="text-center tenge"
                        >
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return (
                                prev + parseFloat(cur.total_discount_bonus)
                              );
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                      </TableRow>
                      {salesNDS.cashboxesNDS.map((sl, idx) => {
                        return (
                          <TableRow key={idx}>
                            <StyledTableCell>{sl.name}</StyledTableCell>
                            <StyledTableCell
                              colSpan="2"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.withoutvat).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell className="text-center tenge">
                              {parseFloat(sl.withvat).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell className="text-center tenge">
                              {parseFloat(sl.vat).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="2"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.total_discount).toLocaleString(
                                "ru",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="2"
                              className="text-center tenge"
                            >
                              {parseFloat(
                                sl.total_discount_bonus
                              ).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </Fragment>
                  );
                })}
            </TableBody>
            <TableBody className="bg-info text-white">
              <Fragment>
                <TableRow>
                  <StyledTableCell>Итого</StyledTableCell>
                  <StyledTableCell colSpan="2" className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.withoutvat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.withvat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.vat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="2" className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="2" className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount_bonus);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                </TableRow>
              </Fragment>
            </TableBody>
            <TableHead className="font-weight-bold">
              <TableRow>
                <StyledTableCell
                  colSpan="9"
                  style={{ height: "30px" }}
                ></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell rowSpan="4" style={{ width: "25%" }}>
                  Наименование
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "75%" }}
                  className="text-center"
                  colSpan="8"
                >
                  Возвраты
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="8"
                  style={{ width: "75%" }}
                  className="text-center"
                >
                  Общая сумма товаров
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Наличными <br /> после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Картой
                  <br /> после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Безналичный перевод <br /> после скидки
                </StyledTableCell>
                <StyledTableCell
                  colSpan="1"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Бонусы
                </StyledTableCell>
                <StyledTableCell
                  colSpan="4"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Сумма возвратов
                  <br />С учётом применённой скидки
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterType.value !== "cashbox" &&
                salesResult.map((sales, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{sales.name}</StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.retcash).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.retcard).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.retdebitpay).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="1" className="text-center tenge">
                      {parseFloat(sales.retbonuspay).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="4" className="text-center tenge">
                      {parseFloat(sales.rettotal).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                  </TableRow>
                ))}
              {filterType.value === "cashbox" &&
                salesResult.map((sales, idx) => {
                  return (
                    <Fragment key={idx}>
                      <TableRow className="bg-grey">
                        <StyledTableCell>{sales.point}</StyledTableCell>

                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retcash);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retcard);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retdebitpay);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="1"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retbonuspay);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="4"
                          className="text-center tenge"
                        >
                          {sales.cashboxes
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.rettotal);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                      </TableRow>
                      {sales.cashboxes.map((sl, idx) => {
                        return (
                          <TableRow key={idx}>
                            <StyledTableCell>{sl.name}</StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.retcash).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.retcard).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>

                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.retdebitpay).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="1"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.retbonuspay).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>

                            <StyledTableCell
                              colSpan="4"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.rettotal).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </Fragment>
                  );
                })}
            </TableBody>
            <TableBody className="bg-info text-white">
              <Fragment>
                <TableRow>
                  <StyledTableCell>Итого</StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retcash);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retcard);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retdebitpay);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="1" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retbonuspay);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="4" className="text-center tenge">
                    {totalResults
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.rettotal);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                </TableRow>
              </Fragment>
            </TableBody>
            <TableHead className="font-weight-bold">
              <TableRow>
                <StyledTableCell
                  colSpan="9"
                  style={{ height: "30px" }}
                ></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell rowSpan="4" style={{ width: "20%" }}>
                  Наименование
                </StyledTableCell>
                <StyledTableCell className="text-center" colSpan="8">
                  Возвраты
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan="8" className="text-center">
                  В том числе
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell
                  colSpan="2"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Общая сумма товаров, освобожденных от НДС
                </StyledTableCell>
                <StyledTableCell
                  colSpan="2"
                  className="text-center font-weight-normal"
                >
                  Общая сумма товаров, облагаемых НДС
                </StyledTableCell>
                <StyledTableCell
                  colSpan="4"
                  rowSpan="2"
                  className="text-center font-weight-normal"
                >
                  Итого возвратов <br />С учётом применённой скидки
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="text-center font-weight-normal">
                  Общая сумма товаров
                </StyledTableCell>
                <StyledTableCell className="text-center font-weight-normal">
                  в том числе НДС
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterType.value !== "cashbox" &&
                salesResultNDS.map((sales, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{sales.name}</StyledTableCell>
                    <StyledTableCell colSpan="2" className="text-center tenge">
                      {parseFloat(sales.retwithoutvat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell className="text-center tenge">
                      {parseFloat(sales.retwithvat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell className="text-center tenge">
                      {parseFloat(sales.retvat).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell colSpan="4" className="text-center tenge">
                      {parseFloat(sales.rettotal).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                  </TableRow>
                ))}
              {filterType.value === "cashbox" &&
                salesResultNDS.length > 0 &&
                salesResultNDS.map((salesNDS, idx) => {
                  return (
                    <Fragment key={idx}>
                      <TableRow className="bg-grey">
                        <StyledTableCell>{salesNDS.point}</StyledTableCell>

                        <StyledTableCell
                          colSpan="2"
                          className="text-center tenge"
                        >
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retwithoutvat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell className="text-center tenge">
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retwithvat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell className="text-center tenge">
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.retvat);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="4"
                          className="text-center tenge"
                        >
                          {salesNDS.cashboxesNDS
                            .reduce((prev, cur) => {
                              return prev + parseFloat(cur.rettotal);
                            }, 0)
                            .toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                        </StyledTableCell>
                      </TableRow>
                      {salesNDS.cashboxesNDS.map((sl, idx) => {
                        return (
                          <TableRow key={idx}>
                            <StyledTableCell>{sl.name}</StyledTableCell>
                            <StyledTableCell
                              colSpan="2"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.retwithoutvat).toLocaleString(
                                "ru",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </StyledTableCell>
                            <StyledTableCell className="text-center tenge">
                              {parseFloat(sl.retwithvat).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell className="text-center tenge">
                              {parseFloat(sl.retvat).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                            <StyledTableCell
                              colSpan="4"
                              className="text-center tenge"
                            >
                              {parseFloat(sl.rettotal).toLocaleString("ru", {
                                minimumFractionDigits: 2,
                              })}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </Fragment>
                  );
                })}
            </TableBody>
            <TableFooter className="bg-info text-white">
              <Fragment>
                <TableRow>
                  <StyledTableCell>Итого</StyledTableCell>
                  <StyledTableCell colSpan="2" className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retwithoutvat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retwithvat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.retvat);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell colSpan="4" className="text-center tenge">
                    {totalResultsNDS
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.rettotal);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                </TableRow>
              </Fragment>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Продажи в разрезе ${filter.toLowerCase()} c ${Moment(
            dateFrom
          ).format("DD.MM.YYYY")} по ${Moment(dateTo).format("DD.MM.YYYY")}`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
