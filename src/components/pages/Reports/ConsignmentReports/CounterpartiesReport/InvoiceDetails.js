import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function InvoiceDetails({
  consignmentDetails,
  transaction,
  nds,
  closeDetail,
}) {
  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="center">
                Наименование товара
              </StyledTableCell>
              <StyledTableCell align="center">Штрих код</StyledTableCell>
              <StyledTableCell align="center">Цена закупки</StyledTableCell>
              <StyledTableCell align="center">Скидка</StyledTableCell>
              <StyledTableCell align="center">Количество</StyledTableCell>
              <StyledTableCell align="center">Сумма</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consignmentDetails.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell>{idx + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.name + " [" + row.shortname + ".]"}
                </StyledTableCell>
                <StyledTableCell align="center">{row.code}</StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {parseFloat(row.price).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {parseFloat(row.discount).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {parseFloat(row.units).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {parseFloat(row.totalprice).toFixed(2)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <StyledTableRow>
              <StyledTableCell>Итого:</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {consignmentDetails.reduce((prev, cur) => {
                  return prev + parseFloat(cur.price).toFixed(2);
                }, 0)}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {consignmentDetails.reduce((prev, cur) => {
                  return prev + parseFloat(cur.discount).toFixed(2);
                }, 0)}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {consignmentDetails.reduce((prev, cur) => {
                  return prev + parseFloat(cur.units).toFixed(2);
                }, 0)}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {consignmentDetails.reduce((prev, cur) => {
                  return prev + parseFloat(cur.totalprice).toFixed(2);
                }, 0)}
              </StyledTableCell>
            </StyledTableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <button
        style={{ width: "5rem", marginTop: "1rem" }}
        className="btn btn-success"
        onClick={closeDetail}
      >
        Готово
      </button>
    </Box>
  );
}
