import React, { useState, useEffect } from "react";
import Axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import { Button } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
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

export default function Details({
  date,
  closeDetails,
  classes,
  companyDetail,
}) {
  const [isLoading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const getCompanyDetails = () => {
    setLoading(true);
    Axios.get("/api/adminpage/companiesrep_det", {
      params: { date, type: companyDetail.type },
    })
      .then((res) => res.data)
      .then((res) => {
        setCompanies(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return !isLoading && companies.length > 0 ? (
    <div>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={closeDetails}
      >
        Вернуться
      </Button>
      <p className={classes.notFound}>{companyDetail.title}:</p>

      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Название</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={companies.length}
        backIconButtonText="Предыдущая страница"
        labelRowsPerPage="Строк в странице"
        nextIconButtonText="Следующая страница"
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  ) : !isLoading && companies.length === 0 ? (
    <div className={classes.notFound}>Данные не найдены</div>
  ) : (
    <div>
      <TableSkeleton />
    </div>
  );
}
