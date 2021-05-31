import React from "react";
import Moment from "moment";
import Typography from "@material-ui/core/Typography";
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

export default function HistoryTable({
  invoices,
  invoiceDetails,
  invoicetype,
  classes,
  selectedID,
}) {
  return (
    <Grid item xs={12}>
      <Typography className={classes.label}>
        За выбранный период найдены следующие накладные:
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Номер накладной</StyledTableCell>
              {["2"].includes(invoicetype.value) && (
                <StyledTableCell align="center">
                  Итого цена закупки
                </StyledTableCell>
              )}
              {["2"].includes(invoicetype.value) && (
                <StyledTableCell align="center">
                  Итого цена продажи
                </StyledTableCell>
              )}
              {["16", "17"].includes(invoicetype.value) && (
                <StyledTableCell align="center">
                  Стоимость товаров в ценах реализации, тг.
                </StyledTableCell>
              )}
              <StyledTableCell align="center">ФИО</StyledTableCell>
              {["1", "2", "16", "17"].includes(invoicetype.value) && (
                <StyledTableCell align="center">Сумма</StyledTableCell>
              )}
              {["1", "7", "16", "17"].includes(invoicetype.value) && (
                <StyledTableCell align="center">Со склада</StyledTableCell>
              )}
              {["1", "2", "16", "17"].includes(invoicetype.value) && (
                <StyledTableCell align="center">На склад</StyledTableCell>
              )}
              {["2", "16", "17"].includes(invoicetype.value) && (
                <StyledTableCell align="center">Контрагент</StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody style={{ cursor: "pointer" }}>
            {invoices.map((invoice, idx) => (
              <TableRow
                hover
                selected={selectedID === invoice.invoicenumber}
                className={classes.tableRow}
                key={invoice.invoicenumber}
                onClick={() => invoiceDetails(invoice)}
              >
                <StyledTableCell>{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  {invoice.altnumber ? "№ " + invoice.altnumber + " - " : ""}
                  {invoice.invoicenumber
                    ? "№ " + invoice.invoicenumber + " - "
                    : ""}
                  {Moment(invoice.invoicedate).format("DD.MM.YYYY")}
                </StyledTableCell>
                {["2"].includes(invoicetype.value) && (
                  <StyledTableCell
                    align="center"
                    className={`${invoice.purchaseprice && "tenge"}`}
                  >
                    {invoice.purchaseprice
                      ? parseFloat(invoice.purchaseprice).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })
                      : "Н/Д"}
                  </StyledTableCell>
                )}
                {["2", "16", "17"].includes(invoicetype.value) && (
                  <StyledTableCell
                    align="center"
                    className={`${invoice.newprice && "tenge"}`}
                  >
                    {invoice.newprice
                      ? parseFloat(invoice.newprice).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })
                      : "Н/Д"}
                  </StyledTableCell>
                )}
                <StyledTableCell align="center">{invoice.name}</StyledTableCell>
                {["1", "2", "16", "17"].includes(invoicetype.value) && (
                  <StyledTableCell
                    align="center"
                    className={`${invoice.newprice && "tenge"}`}
                  >
                    {invoice.newprice}
                  </StyledTableCell>
                )}
                {["1", "7", "16", "17"].includes(invoicetype.value) && (
                  <StyledTableCell align="center">
                    {invoice.stockfrom}
                  </StyledTableCell>
                )}
                {["1", "2", "16", "17"].includes(invoicetype.value) && (
                  <StyledTableCell align="center">
                    {invoice.stockto}
                  </StyledTableCell>
                )}
                {["2", "16", "17"].includes(invoicetype.value) && (
                  <StyledTableCell align="center">
                    {invoice.counterparty &&
                      `${invoice.bin} | ${invoice.counterparty}`}
                  </StyledTableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          {["2", "16", "17"].includes(invoicetype.value) && (
            <TableFooter>
              <TableRow style={{ fontWeight: "bold" }}>
                <StyledTableCell colSpan="2">Итого:</StyledTableCell>
                {["2"].includes(invoicetype.value) && (
                  <StyledTableCell align="center" className="tenge">
                    {invoices
                      .reduce((prev, cur) => {
                        return (
                          prev +
                          parseFloat(cur.purchaseprice ? cur.purchaseprice : 0)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                )}
                <StyledTableCell align="center" className="tenge">
                  {invoices
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.newprice ? cur.newprice : 0);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell colSpan="4" />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Grid>
  );
}
