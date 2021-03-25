import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import DescriptionIcon from "@material-ui/icons/Description";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: 12,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledFooterCell = withStyles((theme) => ({
  root: {
    color: theme.palette.common.black,
    fontSize: 12,
    fontWeight: "bold",
  },
}))(TableCell);

export default function ConsignmentTable({
  classes,
  consignments,
  changeParentReportMode,
}) {
  return (
    <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Номер накладной</StyledTableCell>
            <StyledTableCell>Контрагент</StyledTableCell>
            <StyledTableCell>Наименование товара</StyledTableCell>
            <StyledTableCell align="center">Штрихкод</StyledTableCell>
            <StyledTableCell align="center">Количество</StyledTableCell>
            <StyledTableCell align="center">
              Текущая себестоимость по FIFO (тг/шт.)
            </StyledTableCell>
            <StyledTableCell align="center">
              Цена реализации в накладной (тг/шт.)
            </StyledTableCell>
            <StyledTableCell align="center">
              Товаров на консигнации в ценах реализации (тг.)
            </StyledTableCell>

            <StyledTableCell align="center">Бренд</StyledTableCell>
            <StyledTableCell align="center">Категория</StyledTableCell>
            <StyledTableCell align="center">Детали накладной</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consignments.map((row, idx) => (
            <StyledTableRow key={idx}>
              <StyledTableCell component="th" scope="row">
                {row.invoice}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.customer}
              </StyledTableCell>
              <StyledTableCell
                className={classes.hover}
                onClick={() =>
                  changeParentReportMode("reportproductmovement", row)
                }
              >
                {row.prodname +
                  (row.attributescaption && "[" + row.attributescaption + "]")}
              </StyledTableCell>
              <StyledTableCell align="center">{row.codename}</StyledTableCell>
              <StyledTableCell align="center">{row.units}</StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {row.purchaseFIFO}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {row.price}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {row.totalprice}
              </StyledTableCell>
              <StyledTableCell align="center">{row.brand}</StyledTableCell>
              <StyledTableCell align="center">{row.category}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton
                  aria-label="upload picture"
                  component="span"
                  onClick={() =>
                    changeParentReportMode("reportinvoicehistory", row)
                  }
                >
                  <DescriptionIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledFooterCell colSpan={4}>Итого:</StyledFooterCell>
            <StyledFooterCell align="center">
              {consignments
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.units);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell colSpan={2} />
            <StyledFooterCell align="center" className="tenge">
              {consignments
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.totalprice);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledFooterCell>
            <StyledFooterCell colSpan={3} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
