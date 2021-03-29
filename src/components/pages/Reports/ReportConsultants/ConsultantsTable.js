import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import ReportConsultantsDetails from "./ReportConsultantsDetails";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");
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

export default function ConsultantsTable({
  classes,
  companyName,
  dateFrom,
  dateTo,
  handleClick,
  now,
  consultants,
  selectedID,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Fragment>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} id="table-to-xls">
          <TableHead
            style={{
              display: "none",
            }}
          >
            <TableRow>
              <StyledTableCell align="center">
                Отчет по консультантам
              </StyledTableCell>
              <StyledTableCell colSpan={2} />
            </TableRow>
            <TableRow></TableRow>
            <TableRow>
              <StyledTableCell align="center">Компания:</StyledTableCell>
              <StyledTableCell colSpan="2">{companyName}</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell align="center">За период:</StyledTableCell>
              <StyledTableCell colSpan="2">
                {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -{" "}
                {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell align="center">
                Время формирования отчёта:
              </StyledTableCell>
              <StyledTableCell colSpan="2">{now}.</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell
                colSpan="9"
                style={{ height: "30px" }}
              ></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow style={{ fontWeight: "bold" }}>
              <StyledTableCell>№</StyledTableCell>
              <StyledTableCell align="center">Консультант</StyledTableCell>
              <StyledTableCell align="center">
                C учетом применёной скидки
              </StyledTableCell>
              <StyledTableCell align="center">
                C учетом применёной скидки(за минусом использованных бонусов)
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultants
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((consultant, idx) => (
                <Fragment>
                  <TableRow
                    hover
                    selected={selectedID === consultant.id}
                    key={consultant.id}
                    className={classes.tableRow}
                    onClick={() => handleClick(consultant.id)}
                  >
                    <StyledTableCell>{idx + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      {consultant.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {consultant.sum}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {consultant.sum_without_bonus}
                    </StyledTableCell>
                  </TableRow>
                  {consultant.show && (
                    <TableRow style={{ transition: "transform 1s" }}>
                      <StyledTableCell colspan="4">
                        <ReportConsultantsDetails
                          dateFrom={Moment(dateFrom).format("YYYY-MM-DD")}
                          dateTo={Moment(dateTo).format("YYYY-MM-DD")}
                          id={consultant.id}
                          classes={classes}
                        />
                      </StyledTableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
          </TableBody>
          <TableRow>
            <StyledTableCell>Итого:</StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="center">
              {consultants
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.sum);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledTableCell>
            <StyledTableCell align="center">
              {consultants
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.sum_without_bonus);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </StyledTableCell>
          </TableRow>

          <TableFooter></TableFooter>
        </Table>
      </TableContainer>

      {consultants.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={consultants.length}
          backIconButtonText="Предыдущая страница"
          labelRowsPerPage="Строк в странице"
          nextIconButtonText="Следующая страница"
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      )}

      <Grid item xs={12}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename="Консультанты"
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
