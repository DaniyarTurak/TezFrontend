import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#bdbdbd",
    color: theme.palette.common.white,
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
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  notFountd: {
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    marginTop: "1rem",
    maxHeight: 440,
  },
});

export default function OnlyRefundsTable({ sales, refundsAggregated }) {
  const [salesResult, setSalesResult] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const res = refundsAggregated.length > 0 ? refundsAggregated : sales;
    setSalesResult(res);
  }, [refundsAggregated]);

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table
        stickyHeader
        className={classes.table}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Период</StyledTableCell>
            <StyledTableCell align="center">Возвраты</StyledTableCell>
            <StyledTableCell align="center">Количество</StyledTableCell>
            <StyledTableCell align="center">СрЗнач</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesResult.map((row, idx) => (
            <StyledTableRow key={idx}>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">{row.returnsum}</StyledTableCell>
              <StyledTableCell align="center">
                {" "}
                {row.returncount}
              </StyledTableCell>
              <StyledTableCell align="center">{row.returnavg}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
