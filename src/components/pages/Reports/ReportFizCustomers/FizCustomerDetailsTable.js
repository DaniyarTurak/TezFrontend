import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Moment from "moment";
import "moment/locale/ru";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DescriptionIcon from "@material-ui/icons/Description";
import Grid from "@material-ui/core/Grid";
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

export default function FizCustomerDetailsTable({
  calculateTotalDebt,
  classes,
  dateFrom,
  dateTo,
  details,
  name,
  openDetails,
}) {
  const [selectedID, setSelectedID] = React.useState(null);
  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell align="center">Дата</StyledTableCell>
                <StyledTableCell align="center">Номер чека</StyledTableCell>
                <StyledTableCell align="center">Тип</StyledTableCell>
                <StyledTableCell align="center">Сумма чека</StyledTableCell>
                <StyledTableCell align="center">Сумма долга</StyledTableCell>
                <StyledTableCell align="center">
                  Бонусов начислено
                </StyledTableCell>
                <StyledTableCell align="center">
                  Бонусов потрачено
                </StyledTableCell>
                <StyledTableCell>Детали</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((detail, idx) => (
                <TableRow
                  key={idx}
                  className={classes.tableRow}
                  selected={selectedID === idx}
                  onClick={() => setSelectedID(idx)}
                >
                  <StyledTableCell>{idx + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                  </StyledTableCell>
                  <StyledTableCell align="center">{`${
                    detail.id ? detail.id : "-"
                  }`}</StyledTableCell>
                  <StyledTableCell align="center">{`${
                    detail.tickettype === "1"
                      ? "Возврат"
                      : Math.sign(detail.debt) === -1
                      ? "Возврат"
                      : Math.sign(detail.debttype) === -1
                      ? "Погашение долга"
                      : "Продажа"
                  }`}</StyledTableCell>
                  {detail.price ? (
                    <StyledTableCell align="center" className="tenge">
                      {detail.price}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">-</StyledTableCell>
                  )}

                  {detail.debt ? (
                    <StyledTableCell align="center" className="tenge">
                      {detail.tickettype === "1"
                        ? "-" + detail.debt
                        : Math.sign(detail.debt) === -1
                        ? "-" + detail.debt
                        : Math.sign(detail.debttype) === -1
                        ? "-" + detail.debt
                        : detail.debt}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">
                      {detail.debt === 0 ? "0" : "-"}
                    </StyledTableCell>
                  )}
                  {detail.bonusadd && detail.bonusadd !== 0 ? (
                    <StyledTableCell align="center" className="tenge">
                      {detail.bonusadd}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">-</StyledTableCell>
                  )}
                  {detail.bonuspay && detail.bonuspay !== 0 ? (
                    <StyledTableCell align="center" className="tenge">
                      {detail.bonuspay}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">-</StyledTableCell>
                  )}
                  <StyledTableCell>
                    <IconButton
                      component="span"
                      onClick={() => openDetails(detail, detail.id)}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <StyledTableCell colSpan="4">Итого</StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {details
                    .reduce((prev, cur) => {
                      return prev + cur.price;
                    }, 0)
                    .toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {calculateTotalDebt(details).toLocaleString("ru", {
                    maximumFractionDigits: 2,
                  })}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {details
                    .reduce((prev, cur) => {
                      return prev + cur.bonusadd;
                    }, 0)
                    .toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {details
                    .reduce((prev, cur) => {
                      return prev + cur.bonuspay;
                    }, 0)
                    .toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                </StyledTableCell>

                <StyledTableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={3}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Детали покупателя ${name} за период с ${dateFrom} по ${dateTo}`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
