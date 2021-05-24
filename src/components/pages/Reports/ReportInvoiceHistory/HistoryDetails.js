import React, { Fragment } from "react";
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
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

import "moment/locale/ru";
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

export default function HistoryDetails({
  markedInvoice,
  backToList,
  details,
  invoicetype,
  dateFrom,
  dateTo,
  classes,
}) {
  return (
    <Fragment>
      <Grid item xs={8}>
        <Typography className={classes.invoiceOptions}>
          Накладная {markedInvoice.altnumber} от{" "}
          {Moment(markedInvoice.invoicedate).format("DD.MM.YYYY")}
        </Typography>

        <Typography className={classes.invoiceOptions}>
          {markedInvoice.invoicetype} <br />
          {["1", "7"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              Откуда: {markedInvoice.stockfrom} <br />
            </Fragment>
          )}
          {["1", "2"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              Куда: {markedInvoice.stockto} <br />
            </Fragment>
          )}
          {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
            <Fragment>
              {markedInvoice.invoicetypeid === "2"
                ? "Контрагент: "
                : "Консигнатор: "}
              {markedInvoice.counterparty &&
                `${markedInvoice.bin} | ${markedInvoice.counterparty}`}{" "}
              <br />
            </Fragment>
          )}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Button
          fullWidth
          className={classes.button}
          variant="outlined"
          onClick={backToList}
        >
          Вернуться назад
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table id="table-transfer">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Наименование товара</StyledTableCell>
                <StyledTableCell align="center">Штрих код</StyledTableCell>
                {["1", "2", "7", "16", "17"].includes(
                  markedInvoice.invoicetypeid
                ) && (
                  <StyledTableCell align="center">Количество</StyledTableCell>
                )}
                {["1", "2", "7", "16", "17"].includes(
                  markedInvoice.invoicetypeid
                ) && (
                  <StyledTableCell align="center">Общая сумма</StyledTableCell>
                )}
                {["7"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Причина</StyledTableCell>
                )}

                {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">
                    Налоговая категория
                  </StyledTableCell>
                )}
                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Код ТН ВЭД</StyledTableCell>
                )}

                {["2"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Цена закупки</StyledTableCell>
                )}
                {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Цена продажи</StyledTableCell>
                )}
                {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">
                    Цена за штуку
                  </StyledTableCell>
                )}
                {["0"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Старая цена</StyledTableCell>
                )}
                {["0"].includes(markedInvoice.invoicetypeid) && (
                  <StyledTableCell align="center">Новая цена</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((detail, idx) => (
                <TableRow key={idx}>
                  <StyledTableCell>{idx + 1}</StyledTableCell>
                  <StyledTableCell>
                    {detail.name +
                      (detail.attributescaption
                        ? ", " + detail.attributescaption
                        : detail.attributescaption)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {detail.code}
                  </StyledTableCell>

                  {["1", "2", "7", "16", "17"].includes(
                    markedInvoice.invoicetypeid
                  ) && (
                    <StyledTableCell align="center">
                      {parseFloat(detail.units).toLocaleString("ru", {
                        maximumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                  )}
                  {["1", "2", "7", "16", "17"].includes(
                    markedInvoice.invoicetypeid
                  ) && (
                    <StyledTableCell align="center">
                      {parseFloat(
                        detail.newprice * detail.units
                      ).toLocaleString("ru", {
                        maximumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                  )}
                  {["7"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center">
                      {detail.reason}
                    </StyledTableCell>
                  )}

                  {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center">
                      {detail.taxid === "0" ? "Без НДС" : "Стандартный НДС"}
                    </StyledTableCell>
                  )}

                  {["2"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center">
                      {detail.cnofeacode}
                    </StyledTableCell>
                  )}

                  {["2"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell
                      align="center"
                      className={`${detail.purchaseprice ? "tenge" : ""}`}
                    >
                      {detail.purchaseprice &&
                        parseFloat(detail.purchaseprice).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                    </StyledTableCell>
                  )}

                  {["16", "17"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell
                      align="center"
                      className={`${detail.price ? "tenge" : ""}`}
                    >
                      {detail.price &&
                        parseFloat(detail.price).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                    </StyledTableCell>
                  )}
                  {["0"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center" className="tenge">
                      {detail.oldprice ? detail.oldprice : "-"}
                    </StyledTableCell>
                  )}
                  {["0", "2"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center" className="tenge">
                      {detail.newprice}
                    </StyledTableCell>
                  )}
                  {["2", "16", "17"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell
                      align="center"
                      className={`${detail.pieceprice ? "tenge" : ""}`}
                    >
                      {detail.pieceprice !== 0
                        ? parseFloat(detail.pieceprice).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })
                        : "-"}
                    </StyledTableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            {["1", "2", "7", "16", "17"].includes(
              markedInvoice.invoicetypeid
            ) && (
              <TableFooter>
                <TableRow>
                  <StyledTableCell
                    colSpan={
                      markedInvoice.invoicetypeid === "7"
                        ? 3
                        : markedInvoice.invoicetypeid === "2"
                        ? 3
                        : 3
                    }
                  >
                    Итого
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {details
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.units);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {details
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.newprice * cur.units);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                  {["2", "7"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell colSpan="2" />
                  )}

                  {["16", "17"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell />
                  )}
                  {["2"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center" className="tenge">
                      {details
                        .reduce((prev, cur) => {
                          return prev + cur.purchaseprice * cur.units;
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                  )}
                  {["16", "17"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center" className="tenge">
                      {details
                        .reduce((prev, cur) => {
                          return prev + cur.price * cur.units;
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                  )}
                  {["2"].includes(markedInvoice.invoicetypeid) && (
                    <StyledTableCell align="center" className="tenge">
                      {details
                        .reduce((prev, cur) => {
                          return prev + cur.newprice * cur.units;
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                  )}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-transfer"
          filename={`${
            invoicetype.value === "1"
              ? "Перемещение товара"
              : invoicetype.value === "2"
              ? "Добавление товара"
              : invoicetype.value === "0"
              ? "Смена цен"
              : invoicetype.value === "16" || invoicetype.value === "17"
              ? "Детали консигнации"
              : "Списание товара"
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
