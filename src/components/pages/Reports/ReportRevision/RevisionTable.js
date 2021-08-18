import React, { Fragment } from "react";
import OrderArrowMaterial from "../../../ReusableComponents/OrderArrowMaterial";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
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

export default function RevisionTable({
  classes,
  orderByFunction,
  ascending,
  orderBy,
  revisions,
  handleDetails,
  getReportExcel,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <span
                    className="hand"
                    onClick={() => orderByFunction("username")}
                  >
                    Ревизор
                  </span>
                  {orderBy === "username" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">Дата начала</StyledTableCell>
                <StyledTableCell align="center">Дата завершения</StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody style={{ cursor: "pointer" }}>
              {revisions.map((revision, idx) => (
                <TableRow
                  hover
                  className={classes.tableRow}
                  key={idx}
                  onClick={() => {
                    handleDetails(
                      revision.revisionnumber
                    );
                  }}
                >
                  <StyledTableCell>{revision.username}</StyledTableCell>
                  <StyledTableCell align="center">
                    {Moment(revision.createdate).format("DD.MM.YYYY HH:mm:ss")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {Moment(revision.submitdate).format("DD.MM.YYYY HH:mm:ss")}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <button
          onClick={getReportExcel}
          className="btn btn-sm btn-outline-success"
        >
          Выгрузить в Excel
        </button>
      </Grid>
    </Fragment>
  );
}
