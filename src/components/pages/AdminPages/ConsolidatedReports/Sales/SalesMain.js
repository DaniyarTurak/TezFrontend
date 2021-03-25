import React from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  paragraph: {
    display: "flex",
    justifyContent: "center",
    opacity: "60%",
  },
});

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

const StyledHeaderCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

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

function SalesMain({ sales }) {
  const classes = useStyles();

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
            <StyledHeaderCell
              colSpan={3}
              align="center"
              className="border-right-material"
            >
              Продажи
            </StyledHeaderCell>
            <StyledHeaderCell colSpan={3} align="center">
              Возвраты
            </StyledHeaderCell>
          </TableRow>

          <TableRow>
            <StyledCell align="center" className="font-weight-bold">
              Сумма
            </StyledCell>
            <StyledCell align="center" className="font-weight-bold">
              Количество
            </StyledCell>
            <StyledCell
              align="center"
              className="font-weight-bold border-right-material"
            >
              Средний чек
            </StyledCell>
            <StyledCell align="center" className="font-weight-bold">
              Сумма
            </StyledCell>
            <StyledCell align="center" className="font-weight-bold">
              Количество
            </StyledCell>{" "}
            <StyledCell align="center" className="font-weight-bold">
              Средний чек
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
              <StyledCell
                align="center"
                className="tenge border-right-material"
              >
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
      </Table>
    </TableContainer>
  );
}

SalesMain.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SalesMain);
