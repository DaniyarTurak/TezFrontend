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
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "moment/locale/ru";
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
    fontSize: ".875rem",
    fontWeight: "bold",
  },
}))(TableCell);

export default function SalesPlanTable({
  cashboxuser,
  companyData,
  dateFrom,
  dateTo,
  now,
  bonusResult,
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
                <StyledTableCell>
                  Отчет по Индивидуальным бонусам
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  Компания:
                </StyledTableCell>
                <StyledTableCell colSpan="2">{companyData}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  Кассир-оператор
                </StyledTableCell>
                <StyledTableCell colSpan="2">
                  {cashboxuser.label}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  За период:
                </StyledTableCell>
                <StyledTableCell colSpan="2">
                  {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -{" "}
                  {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
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
            <TableHead>
              <TableRow>
                <StyledTableCell>Пользователь</StyledTableCell>
                {cashboxuser.value !== "0" && (
                  <StyledTableCell>Дата</StyledTableCell>
                )}
                <StyledTableCell>Ежедневный план продаж</StyledTableCell>
                <StyledTableCell>Сумма продаж</StyledTableCell>
                <StyledTableCell>Сумма бонусов</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bonusResult.map((bonus, idx) => (
                <TableRow key={idx}>
                  <StyledTableCell>{bonus.name}</StyledTableCell>
                  {cashboxuser.value !== "0" && (
                    <StyledTableCell>{bonus.dat}</StyledTableCell>
                  )}
                  <StyledTableCell className="tenge">
                    {bonus.daily &&
                      bonus.daily.toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                  </StyledTableCell>
                  <StyledTableCell className="tenge">
                    {parseFloat(bonus.sold).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>
                  <StyledTableCell className="tenge">
                    {parseFloat(bonus.award).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <StyledTableCell
                  colSpan={`${cashboxuser.value !== "0" ? "3" : "2"}`}
                >
                  Итого
                </StyledTableCell>
                <StyledTableCell className="tenge">
                  {bonusResult
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.sold);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell className="tenge">
                  {bonusResult
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.award);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
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
      </Grid>
    </Fragment>
  );
}
