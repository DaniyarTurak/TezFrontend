import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
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
import OrderArrowMaterial from "../../../ReusableComponents/OrderArrowMaterial";
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

export default function IncomeTable({
  ascending,
  classes,
  dateFrom,
  dateTo,
  orderBy,
  orderByFunction,
  point,
  sales,
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
              <StyledTableCell colSpan="12" style={{ display: "none" }}>
                Торговая точка: "{point.label}". Выбранный период: С "
                {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")}" По "
                {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}"
              </StyledTableCell>
            </TableRow>
            <TableRow style={{ fontWeight: "bold" }}>
              <StyledTableCell />
              <StyledTableCell>
                <span className="hand" onClick={() => orderByFunction("name")}>
                  Наименование товара
                </span>
                {orderBy === "name" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell>Штрихкод</StyledTableCell>
              <StyledTableCell align="center">
                <span className="hand" onClick={() => orderByFunction("units")}>
                  Количество
                </span>
                {orderBy === "units" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span className="hand" onClick={() => orderByFunction("cost")}>
                  Себестоимость проданного товара
                </span>
                {orderBy === "cost" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span
                  className="hand"
                  onClick={() => orderByFunction("salesamount")}
                >
                  Сумма реализации
                </span>
                {orderBy === "salesamount" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">Наценка</StyledTableCell>
              <StyledTableCell align="center">
                <span
                  className="hand"
                  onClick={() => orderByFunction("gross_profit")}
                >
                  Валовая прибыль
                </span>
                {orderBy === "gross_profit" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span className="hand" onClick={() => orderByFunction("brand")}>
                  Бренд
                </span>
                {orderBy === "brand" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span
                  className="hand"
                  onClick={() => orderByFunction("category")}
                >
                  Категория
                </span>
                {orderBy === "category" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span className="hand" onClick={() => orderByFunction("nds")}>
                  НДС
                </span>
                {orderBy === "nds" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span
                  className="hand"
                  onClick={() => orderByFunction("datefrom_units")}
                >
                  Остаток на начало
                </span>
                {orderBy === "datefrom_units" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <span
                  className="hand"
                  onClick={() => orderByFunction("dateto_units")}
                >
                  Остаток на конец
                </span>
                {orderBy === "dateto_units" && (
                  <OrderArrowMaterial ascending={ascending} />
                )}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, idx) => (
                <TableRow
                  selected={selectedID === idx}
                  key={idx}
                  onClick={() => setSelectedID(idx)}
                >
                  <StyledTableCell>
                    {idx + 1 + page * rowsPerPage}
                  </StyledTableCell>
                  <StyledTableCell>{product.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {product.code}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {parseFloat(product.units).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {parseFloat(product.cost).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {parseFloat(product.salesamount).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {parseFloat(
                      ((product.salesamount - product.cost) /
                        (Number(product.salesamount) === 0
                          ? 1
                          : product.salesamount)) *
                        100
                    ).toLocaleString("ru", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2,
                    })}{" "}
                    %
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {parseFloat(product.gross_profit).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.brand}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.category}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.nds}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.datefrom_units}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.dateto_units}
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan="3">Итого</StyledTableCell>
              <StyledTableCell align="center">
                {sales
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.units);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell align="center">
                {sales
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.salesamount);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell align="center">
                {sales
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.cost);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="center">
                {sales
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.gross_profit);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </StyledTableCell>
              <StyledTableCell colSpan={3} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {sales.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={sales.length}
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
          filename={`Валовая прибыль "(${point.label})" с ${Moment(
            dateFrom
          ).format("DD.MM.YYYY")} по ${Moment(dateTo).format("DD.MM.YYYY")}`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
