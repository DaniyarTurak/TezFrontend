import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

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

//вся эта функция TablePaginationActions используется исключительно для того чтобы иметь возможность
//перепригивать между последней и первой страницей в пагинации. Ridiculous.
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function ReportTable({
  isClicked,
  reports,
  getStockbalanceExcel,
  isExcelLoading,
  profitAmount,
  getDetailsExcel
}) {
  const [page, setPage] = React.useState(
    JSON.parse(sessionStorage.getItem("abc_xyz_pagination"))
      ? JSON.parse(sessionStorage.getItem("abc_xyz_pagination")).page
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(
    JSON.parse(sessionStorage.getItem("abc_xyz_pagination"))
      ? JSON.parse(sessionStorage.getItem("abc_xyz_pagination")).rows
      : 50
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    //храню в session storage чтобы после перехода в детали и обратно сохранял предыдущий статус таблицы. По хорошему нужно использовать redux или context.
    sessionStorage.setItem(
      "abc_xyz_pagination",
      JSON.stringify({
        rows: rowsPerPage,
        page: newPage,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    //храню в session storage чтобы после перехода в детали и обратно сохранял предыдущий статус таблицы. По хорошему нужно использовать redux или context.
    sessionStorage.setItem(
      "abc_xyz_pagination",
      JSON.stringify({
        rows: event.target.value,
        page,
      })
    );
    setPage(0);
  };

  return (
    <Grid container spacing={3} style={{ marginTop: "1rem" }}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Наименование товара</StyledTableCell>
                <StyledTableCell>Штрихкод</StyledTableCell>
                <StyledTableCell align="center">
                  Всего
                  {isClicked === "units"
                    ? " продаж, шт."
                    : " валовая прибыль, тг."}
                </StyledTableCell>
                <StyledTableCell align="center">
                  Доля в общем результате
                </StyledTableCell>
                <StyledTableCell align="center">
                  Доля нарастающим итогом
                </StyledTableCell>
                <StyledTableCell align="center">
                  Коэффициент вариации продаж
                </StyledTableCell>
                <StyledTableCell align="center">ABC</StyledTableCell>
                <StyledTableCell align="center">XYZ</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.code}</StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(row.total_line).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(row.share).toLocaleString("ru", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }) + "%"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(row.cum_share).toLocaleString("ru", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) + "%"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.coeff
                        ? parseFloat(row.coeff).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        }) + "%"
                        : "n/a"}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        backgroundColor:
                          row.abc === "A"
                            ? "#81c784"
                            : row.abc === "B"
                              ? "#ffb74d"
                              : row.abc === "C"
                                ? "#e57373"
                                : "white",
                      }}
                    >
                      {row.abc}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        backgroundColor:
                          row.xyz === "X"
                            ? "#81c784"
                            : row.xyz === "Y"
                              ? "#ffb74d"
                              : row.xyz === "Z"
                                ? "#e57373"
                                : "white",
                      }}
                    >
                      {row.xyz ? row.xyz : "n/a"}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow style={{ fontWeight: "bold" }}>
                <StyledTableCell>Итого:</StyledTableCell>
                <StyledTableCell />
                <StyledTableCell
                  className={profitAmount === "units" ? "" : "tenge"}
                  align="center"
                >
                  {reports
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.total_line);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {reports
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.share);
                    }, 0)
                    .toLocaleString("ru", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }) + "%"}
                </StyledTableCell>
                <StyledTableCell colSpan={4} />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={reports.length}
          backIconButtonText="Предыдущая страница"
          labelRowsPerPage="Строк в странице"
          nextIconButtonText="Следующая страница"
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Grid>
      <Grid item xs={12}>
        <button
          className="btn btn-sm btn-outline-success"
          disabled={isExcelLoading}
          onClick={getStockbalanceExcel}
        >
          Выгрузить в excel
        </button>
        &emsp;
        <button
          className="btn btn-sm btn-outline-success"
          disabled={isExcelLoading}
          onClick={getDetailsExcel}
        >
          Выгрузить детали
        </button>
      </Grid>
    </Grid>
  );
}
