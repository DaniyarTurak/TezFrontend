import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
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

export default function RevisionTableDetails({
  classes,
  username,
  dateRev,
  backToList,
  revisionDetails,
}) {
  return (
    <Fragment>
      <Grid item xs={8}>
        <Typography className={classes.label}>
          Ревизор {username} от {dateRev}
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
          <Table id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Наименование товара</StyledTableCell>
                <StyledTableCell>До ревизии</StyledTableCell>
                <StyledTableCell>После ревизии</StyledTableCell>
                <StyledTableCell>
                  Цена реализации на момент ревизии
                </StyledTableCell>
                <StyledTableCell>Остаток в ценах реализации</StyledTableCell>
                <StyledTableCell>Результат ревизии в шт.</StyledTableCell>
                <StyledTableCell>Результат ревизии в тг.</StyledTableCell>
                <StyledTableCell>Время проведения ревизии</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revisionDetails.map((detail, idx) => (
                <TableRow key={idx}>
                  <StyledTableCell>{idx + 1}</StyledTableCell>
                  <StyledTableCell>{detail.name + " " + detail.attributescaption}</StyledTableCell>
                  <StyledTableCell>{detail.unitswas}</StyledTableCell>
                  <StyledTableCell>{detail.units}</StyledTableCell>
                  <StyledTableCell className="tenge">
                    {parseFloat(detail.price).toLocaleString("ru", {
                      minimumFractionDigits: 1,
                    })}
                  </StyledTableCell>
                  <StyledTableCell className="tenge">
                    {(
                      parseFloat(detail.price) * parseFloat(detail.units)
                    ).toLocaleString("ru", {
                      minimumFractionDigits: 1,
                    })}
                  </StyledTableCell>
                  <StyledTableCell>
                    {detail.units - detail.unitswas}
                  </StyledTableCell>
                  <StyledTableCell className="tenge">
                    {parseFloat(
                      (detail.units - detail.unitswas) * detail.price
                    ).toLocaleString("ru", {
                      minimumFractionDigits: 1,
                    })}
                  </StyledTableCell>
                  <StyledTableCell>
                    {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <StyledTableCell colSpan="2">Итого</StyledTableCell>
                <StyledTableCell>
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.unitswas);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell>
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.units);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell className="tenge">
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.price);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell className="tenge">
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return (
                        prev + parseFloat(cur.price) * parseFloat(cur.units)
                      );
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell>
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return (
                        prev +
                        (parseFloat(cur.units) - parseFloat(cur.unitswas))
                      );
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell className="tenge">
                  {revisionDetails
                    .reduce((prev, cur) => {
                      return (
                        prev +
                        (parseFloat(cur.units) - parseFloat(cur.unitswas)) *
                        parseFloat(cur.price)
                      );
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={6}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Ревизия ${username} от ${dateRev}`}
          sheet="tablexls"
          buttonText="Выгрузить в Excel"
        />
      </Grid>
    </Fragment>
  );
}
