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
    fontSize: 12,
  },
}))(TableCell);

function NDSSales({ ndsSales, classes }) {
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
              rowSpan={4}
            >
              Наименование
            </StyledCell>
            <StyledCell colSpan={5} align="center" className="font-weight-bold">
              Продажи
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell colSpan={5} align="center" className="font-weight-bold">
              В том числе
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell
              className="border-right-material"
              align="center"
              rowSpan={2}
            >
              Общая сумма товаров, освобожденных от НДС
            </StyledCell>
            <StyledCell
              className="border-right-material"
              align="center"
              colSpan={2}
            >
              Общая сумма товаров, облагаемых НДС
            </StyledCell>
            <StyledCell align="center" colSpan={2}>
              Итого
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell className="border-right-material" align="center">
              Общая сумма товаров
            </StyledCell>
            <StyledCell className="border-right-material" align="center">
              в том числе НДС
            </StyledCell>
            <StyledCell className="border-right-material" align="center">
              С учётом применённой скидки
            </StyledCell>
            <StyledCell align="center">
              С учётом применённой скидки (за минусом использованных бонусов)
            </StyledCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ndsSales.map((row, idx) => (
            <TableRow key={idx}>
              <StyledCell align="center">{row.name}</StyledCell>
              <StyledCell align="center" className="tenge">
                {row.withoutvat}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.withvat}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.vat}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.total_discount}
              </StyledCell>
              <StyledCell align="center" className="tenge">
                {row.total_discount_bonus}
              </StyledCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classes.tableRow}>
            <StyledFooterCell align="center">Итого</StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {ndsSales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.withoutvat);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {ndsSales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.withvat);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {ndsSales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.vat);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {ndsSales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.total_discount);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
            <StyledFooterCell align="center" className="tenge">
              {ndsSales
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.total_discount_bonus);
                }, 0)
                .toFixed(2)}
            </StyledFooterCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

NDSSales.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NDSSales);
