import React, { Fragment } from "react";
import PropTypes from "prop-types";
import OrderArrowMaterial from "../../../ReusableComponents/OrderArrowMaterial";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import Grid from "@material-ui/core/Grid";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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

export default function TransactionsTable({
  orderByFunction,
  orderBy,
  ascending,
  filter,
  transactions,
  openDetails,
  isInvoiceExcelLoading,
  getInvoice,
  isExcelLoading,
  getTransactionsExcel,
}) {
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectedID, setSelectedID] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Дата</StyledTableCell>
                <StyledTableCell align="center">Способ оплаты</StyledTableCell>
                <StyledTableCell align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("tickettype")}
                  >
                    Тип операции
                  </span>
                  {orderBy === "tickettype" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("price")}
                  >
                    Общая сумма
                  </span>
                  {orderBy === "price" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("cashboxuser")}
                  >
                    Кассир
                  </span>
                  {orderBy === "cashboxuser" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">Детали</StyledTableCell>
                {filter.value === "jur" && (
                  <StyledTableCell align="center">Накладная</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tr, idx) => (
                  <TableRow
                    key={tr.id}
                    selected={selectedID === tr.id}
                    onClick={() => setSelectedID(tr.id)}
                  >
                    <StyledTableCell>{idx + 1 + page * 10}</StyledTableCell>
                    <StyledTableCell>
                      {Moment(tr.date).format("DD.MM.YYYY HH:mm:ss")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <span
                        className={`btn btn-w-big-icon ${
                          tr.paymenttype === "card"
                            ? "paycard-item"
                            : tr.paymenttype === "cash"
                            ? "tenge-item"
                            : tr.paymenttype === "mixed"
                            ? "mixed-item"
                            : tr.paymenttype === "debt"
                            ? "debt-item"
                            : "debit-item"
                        }`}
                        title={`${
                          tr.paymenttype === "card"
                            ? "Карта"
                            : tr.paymenttype === "cash"
                            ? "Наличными"
                            : tr.paymenttype === "mixed"
                            ? "Смешанная"
                            : tr.paymenttype === "debt"
                            ? "Долг"
                            : "Перевод"
                        }`}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {tr.tickettype === "0" ? "Покупка" : "Возврат"}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="tenge">
                      {parseFloat(tr.price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {tr.cashboxuser}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <button
                        className="btn btn-w-icon detail-item"
                        onClick={() => openDetails(tr)}
                      ></button>
                    </StyledTableCell>
                    {filter.value === "jur" && (
                      <StyledTableCell align="center">
                        {tr.tickettype === "0" && (
                          <button
                            disabled={isInvoiceExcelLoading}
                            className="btn btn-w-icon excel-item"
                            onClick={() => getInvoice(tr.id, tr.ticketid)}
                          ></button>
                        )}
                      </StyledTableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={transactions.length}
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
      </Grid>

      <Grid item xs={12}>
        <button
          className="btn btn-sm btn-outline-success"
          disabled={isExcelLoading}
          onClick={getTransactionsExcel}
        >
          Выгрузить в excel
        </button>
      </Grid>
    </Fragment>
  );
}
