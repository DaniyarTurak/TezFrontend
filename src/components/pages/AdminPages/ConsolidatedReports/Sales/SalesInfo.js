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

function SalesInfo({ sales }) {
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
            <StyledHeaderCell />
            <StyledHeaderCell align="center">Наличными</StyledHeaderCell>
            <StyledHeaderCell align="center">Картой</StyledHeaderCell>
            <StyledHeaderCell align="center">Перевод</StyledHeaderCell>
            <StyledHeaderCell align="center">Смешанная</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledCell className="font-weight-bold border-right-material">
              Количество:
            </StyledCell>
            <StyledCell align="center" className="tenge">
              44
            </StyledCell>
            <StyledCell align="center" className="tenge">
              34
            </StyledCell>
            <StyledCell align="center" className="tenge">
              54
            </StyledCell>
            <StyledCell align="center" className="tenge">
              66
            </StyledCell>
          </TableRow>
          <TableRow>
            <StyledCell className="font-weight-bold border-right-material">
              Средний чек:
            </StyledCell>
            <StyledCell align="center" className="tenge">
              44
            </StyledCell>
            <StyledCell align="center" className="tenge">
              34
            </StyledCell>
            <StyledCell align="center" className="tenge">
              54
            </StyledCell>
            <StyledCell align="center" className="tenge">
              66
            </StyledCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SalesInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SalesInfo);
