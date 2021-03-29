import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import TableSkeleton from "../../../Skeletons/TableSkeleton";
import Table from "@material-ui/core/Table";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";

import Moment from "moment";
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

export default function ReportConsultantsDetails({
  dateFrom,
  dateTo,
  id,
  classes,
}) {
  useEffect(() => {
    getConsdetails();
  }, []);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);

  const getConsdetails = () => {
    setLoading(true);
    Axios.get("/api/report/transactions/consultantdetails", {
      params: { dateFrom, dateTo, id },
    })
      .then((res) => res.data)
      .then((consultantDetails) => {
        setDetails(consultantDetails);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Fragment>
      {loading && <TableSkeleton />}
      {!loading && (
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">№</StyledTableCell>
                <StyledTableCell align="center">Штрих-код</StyledTableCell>
                <StyledTableCell align="center">Наименование</StyledTableCell>
                <StyledTableCell align="center">Количество</StyledTableCell>
              </TableRow>
            </TableHead>
            {details.length !== 0 && (
              <TableBody>
                {details.map((detail, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{idx + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      {detail.code}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {detail.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {detail.units}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
}
