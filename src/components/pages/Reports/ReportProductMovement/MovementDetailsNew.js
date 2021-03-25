import React, { Fragment } from "react";
import Moment from "moment";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "moment/locale/ru";
import { withStyles } from "@material-ui/core/styles";
Moment.locale("ru");

const StyledTableCell = withStyles((theme) => ({
  body: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: ".875rem",
  },
}))(TableCell);

export default function MovementDetailsNew({
  unchangedMovementDetails,
  movementDetails,
  dateFrom,
  dateTo,
  classes,
}) {
  return (
    <Grid item xs={12}>
      <Typography className={classes.label}>Движение товара:</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <StyledTableCell>
                Остаток на начало дня, {Moment(dateFrom).format("LL")}, шт.
              </StyledTableCell>
              <StyledTableCell>
                {unchangedMovementDetails[0].unitsfrom}
              </StyledTableCell>
            </TableRow>
            <Fragment>
              {movementDetails
                .sort(function (a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return textA < textB ? -1 : textA > textB ? 1 : 0;
                })
                .reduce((total, detail) => {
                  if (total.length === 0) {
                    total.push({
                      name: detail.name,
                      sum: parseFloat(detail.sum),
                    });
                  } else if (total[total.length - 1].name === detail.name) {
                    total[total.length - 1].sum += parseFloat(detail.sum);
                  } else {
                    total.push({
                      name: detail.name,
                      sum: parseFloat(detail.sum),
                    });
                  }
                  return total;
                }, [])
                .map((detail, idx) => {
                  return (
                    !(
                      detail.name.includes("Продажа") && detail.name.length > 7
                    ) && (
                      <TableRow key={idx}>
                        <TableCell>{detail.name}, шт.</TableCell>
                        <TableCell>
                          {Math.sign(parseInt(detail.sum, 0)) === 1
                            ? "+" + detail.sum
                            : detail.sum}
                        </TableCell>
                      </TableRow>
                    )
                  );
                })}
            </Fragment>
            <TableRow>
              <StyledTableCell>
                Остаток на конец дня, исключая товары находящиеся на консигнации
                на дату: {Moment(dateTo).format("LL")}, [шт.]
              </StyledTableCell>
              <StyledTableCell>
                {unchangedMovementDetails[0].unitsto}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>
                Остаток на конец дня, включая товары находящиеся на консигнации
                на дату: {Moment(dateTo).format("LL")}, [шт.]
              </StyledTableCell>
              <StyledTableCell>
                {unchangedMovementDetails[0].unitstowith}
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
