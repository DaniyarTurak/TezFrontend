import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  tableRow: {
    backgroundColor: "#17a2b8",
    "&:last-child th, &:last-child StyledCell": {
      borderBottom: 0,
      borderRight: 0,
    },
    fontSize: ".875rem",
  },
  notFound: {},
});

const StyledCell = withStyles(() => ({
  head: {
    fontSize: ".875rem",
  },
  body: {
    fontSize: ".875rem",
  },
  root: {
    verticalAlign: "middle!important",
    borderBottom: "1px solid rgba(224, 224, 224, 1)!important",
  },
}))(TableCell);

const StyledFooterCell = withStyles((theme) => ({
  root: {
    border: 0,
    color: theme.palette.common.white,
  },
}))(TableCell);

function Sales({ salesResult, classes, filterType, totalResults }) {
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      className={classes.root}
      style={{ marginTop: "1rem" }}
    >
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledCell
              className="border-right-material font-weight-bold"
              rowSpan={4}
              style={{ width: "20%" }}
            >
              Наименование
            </StyledCell>
            <StyledCell colSpan={8} align="center" className="font-weight-bold">
              Продажи (Возвраты не учитываются)
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell colSpan={8} align="center" className="font-weight-bold">
              Общая сумма товаров
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Наличными <br /> после скидки
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Картой <br /> после скидки
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Безналичный перевод <br /> после скидки
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Скидка
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Бонусы
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Долг
            </StyledCell>
            <StyledCell align="center" colSpan={2}>
              Сумма
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell className="border-right-material" align="center">
              С учётом применённой скидки
            </StyledCell>
            <StyledCell align="center">
              С учётом применённой скидки <br /> (за минусом использованных
              бонусов)
            </StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterType.value !== "cashbox" &&
            salesResult.map((row, idx) => (
              <TableRow key={idx}>
                <StyledCell>{row.name}</StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.cash).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.card).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.debitpay).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.discount).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.bonuspay).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.debtpay).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.total_discount).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
                <StyledCell align="center" className="tenge">
                  {parseFloat(row.total_discount_bonus).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledCell>
              </TableRow>
            ))}

          {filterType.value === "cashbox" &&
            salesResult.map((row, idx) => (
              <Fragment key={idx}>
                <TableRow key={idx} className="bg-light-grey">
                  <StyledCell>{row.point}</StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.cash);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.card);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.debitpay);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.discount);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.bonuspay);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.debtpay);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                  <StyledCell align="center" className="tenge">
                    {row.cashboxes
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.total_discount_bonus);
                      }, 0)
                      .toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledCell>
                </TableRow>
                {row.cashboxes.map((sl, idx) => {
                  return (
                    <TableRow key={idx}>
                      <StyledCell>{sl.name}</StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.cash).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.card).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.debitpay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.bonuspay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.debtpay).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.total_discount).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledCell>
                      <StyledCell align="center" className="tenge">
                        {parseFloat(sl.total_discount_bonus).toLocaleString(
                          "ru",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </StyledCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.tableRow}>
            <StyledFooterCell>Итого</StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.cash);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.card);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.debitpay);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.discount);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.bonuspay);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.debtpay);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.total_discount);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {totalResults
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.total_discount_bonus);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

Sales.propTypes = {
  classes: PropTypes.object.isRequired,
  salesResult: PropTypes.array.isRequired,
  filterType: PropTypes.object.isRequired,
  totalResults: PropTypes.array.isRequired,
};

export default withStyles(styles)(Sales);
