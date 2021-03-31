import React, { Fragment } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
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
import DescriptionIcon from "@material-ui/icons/Description";
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
export default function DiscountsTable({
  classes,
  dateFrom,
  dateTo,
  discounts,
  openDetails,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedID, setSelectedID] = React.useState(null);

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
          <TableHead>
            <TableRow style={{ fontWeight: "bold" }}>
              <StyledTableCell>Кассир</StyledTableCell>
              <StyledTableCell align="center">Торговая точка</StyledTableCell>
              <StyledTableCell align="center">Номер чека</StyledTableCell>
              <StyledTableCell align="center">Дата чека</StyledTableCell>
              <StyledTableCell align="center">Сумма чека</StyledTableCell>
              <StyledTableCell align="center">Скидка</StyledTableCell>
              <StyledTableCell align="center">Сумма скидки</StyledTableCell>
              <StyledTableCell align="center">Итого оплачено</StyledTableCell>
              <StyledTableCell align="center">Детали</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Fragment>
              {discounts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((discount, idx) => (
                  <TableRow
                    selected={selectedID === idx}
                    key={idx}
                    onClick={() => setSelectedID(idx)}
                  >
                    <StyledTableCell>{discount.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {discount.pointname}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {discount.id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {Moment(discount.date).format("DD.MM.YYYY HH:mm:ss")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(discount.price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(discount.discount_percentage).toLocaleString(
                        "ru",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                      %
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(discount.discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(discount.final_price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        component="span"
                        onClick={() => openDetails(discount)}
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
            </Fragment>
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan="4">Итого</StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {discounts
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.price);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="center" className="tenge">
                {discounts
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.discount);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {discounts
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.final_price);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {discounts.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={discounts.length}
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
          className="col-md-3 btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Примененные скидки за период с ${Moment(dateFrom).format(
            "DD.MM.YYYY"
          )} по ${Moment(dateTo).format("DD.MM.YYYY")}`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
