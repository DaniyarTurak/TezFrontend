import React from "react";
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
    "&:last-child th, &:last-child td": {
      borderBottom: 0,
      borderRight: 0,
    },
    fontSize: 12,
  },
});

const StyledCell = withStyles(() => ({
  head: {
    fontSize: 12,
  },
  body: {
    fontSize: 12,
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

function Sales({ sales, classes }) {
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      className={classes.root}
      style={{ marginTop: "2rem" }}
    >
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledCell
              className="border-right-material font-weight-bold"
              rowSpan={3}
            >
              Наименование
            </StyledCell>
            <StyledCell colSpan={5} align="center" className="font-weight-bold">
              Продажи
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell colSpan={5} align="center" className="font-weight-bold">
              Общая сумма товаров
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell align="center">Наличными после скидки</StyledCell>
            <StyledCell align="center">Картой после скидки</StyledCell>
            <StyledCell align="center">
              Безналичный перевод после скидки
            </StyledCell>
            <StyledCell align="center">Скидка</StyledCell>
            <StyledCell align="center">
              Сумма с учётом применённой скидки
            </StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((row, idx) => (
            <TableRow key={idx}>
              <StyledCell align="center">{row.name}</StyledCell>
              <StyledCell align="center" className="tenge">
                {row.cash}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.card}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.debitpay}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.discount}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.total_discount}
              </StyledCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.tableRow}>
            <StyledFooterCell align="center">Итого</StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {sales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.cash);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {sales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.card);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {sales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.debitpay);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {sales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.discount);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {sales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.total_discount);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

Sales.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sales);
