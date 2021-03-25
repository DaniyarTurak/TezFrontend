import React, { Fragment } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Typography from "@material-ui/core/Typography";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
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

export default function MovemenStyledTableCelletailsTable({
  classes,
  dateFrom,
  dateTo,
  unchangedMovementDetails,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography className={classes.label}>Детализация движения:</Typography>

        <TableContainer component={Paper}>
          <Table id="table-to-xls">
            <TableHead className="bg-info text-white">
              <TableRow>
                <StyledTableCell>№ п/п</StyledTableCell>
                <StyledTableCell>Дата совершения</StyledTableCell>
                <StyledTableCell align="center">Тип</StyledTableCell>
                <StyledTableCell align="center">Количество</StyledTableCell>
                <StyledTableCell align="center">Накладная</StyledTableCell>
                <StyledTableCell>Характеристики</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unchangedMovementDetails.map((detail, idx) => (
                <TableRow key={idx}>
                  <StyledTableCell>{idx + 1}</StyledTableCell>
                  <StyledTableCell>
                    {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    data-toggle="tooltip"
                    title={
                      detail.name === "Перемещение со склада"
                        ? detail.sum === 0
                          ? "перемещения не было"
                          : detail.sum > 0
                          ? "переместился c: " + detail.stockfrom
                          : "переместился в: " + detail.stockto
                        : ""
                    }
                  >
                    {detail.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {detail.sum.toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {detail.invoice}
                  </StyledTableCell>
                  <StyledTableCell>{detail.atTableRow}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Движение товара за период:${Moment(dateFrom).format(
            "DD.MM.YYYY"
          )}-${Moment(dateTo).format("DD.MM.YYYY")}`}
          sheet="tablexls"
          buttonText="Выгрузить в Excel"
        />
      </Grid>
    </Fragment>
  );
}
