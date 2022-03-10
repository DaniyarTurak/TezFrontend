import React, { Fragment, useState } from "react";
import Moment from "moment";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import OrderArrowMaterial from "../../../../ReusableComponents/OrderArrowMaterial";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import "moment/locale/ru";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
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
    fontSize: ".875rem",
    fontWeight: "bold",
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

export default function SalesTable({
  ascending,
  companyData,
  dateFrom,
  dateTo,
  grouping,
  handleGrouping,
  now,
  orderBy,
  orderByFunction,
  point,
  sales,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);

    setPage(0);
  };

  const getSalesExcel = () => {
    setLoading(true);
    let date = `Продажи (${point.label}) с ${Moment(dateFrom).format(
      "DD.MM.YYYY"
    )} по ${Moment(dateTo).format("DD.MM.YYYY")}`;
    Axios({
      method: "POST",
      url: "/api/report/sales/prods_excel",
      data: { sales },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table id="table-to-xls">
            <TableHead
              style={{
                display: "none",
              }}
            >
              <TableRow align="center" className="font-weight-bold">
                <StyledTableCell>Отчет по проданым товарам</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  Компания:
                </StyledTableCell>
                <StyledTableCell colSpan="2">
                  {companyData.companyname}
                </StyledTableCell>
              </TableRow>
              <TableRow style={{ fontWeight: "bold" }}>
                <StyledTableCell align="center" className="font-weight-bold">
                  Торговая точка:
                </StyledTableCell>
                <StyledTableCell colSpan="2">{point.label}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  За период:
                </StyledTableCell>
                <StyledTableCell colSpan="2">
                  {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -
                  {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  Время формирования отчёта:
                </StyledTableCell>
                <StyledTableCell colSpan="2">{now}.</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan="9" style={{ height: "30px" }} />
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow style={{ fontWeight: "bold" }}>
                <StyledTableCell rowSpan="2" />
                <StyledTableCell rowSpan="2">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("type")}
                  >
                    Тип
                  </span>
                  {orderBy === "type" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("sell_date")}
                  >
                    Дата
                  </span>
                  {orderBy === "type" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("name")}
                  >
                    Наименование товара
                  </span>
                  {orderBy === "name" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("consultant")}
                  >
                    Консультант
                  </span>
                  {orderBy === "consultant" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell colSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("price")}
                  >
                    Итоговая сумма
                  </span>
                  {orderBy === "price" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                {handleGrouping && grouping && (
                  <StyledTableCell rowSpan="2" align="center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("taxrate")}
                    >
                      НДС
                    </span>
                    {orderBy === "taxrate" && (
                      <OrderArrowMaterial ascending={ascending} />
                    )}
                  </StyledTableCell>
                )}
                {handleGrouping && grouping && (
                  <StyledTableCell rowSpan="2" align="center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("tax")}
                    >
                      Итого НДС
                    </span>
                    {orderBy === "tax" && (
                      <OrderArrowMaterial ascending={ascending} />
                    )}
                  </StyledTableCell>
                )}
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("units")}
                  >
                    Количество
                  </span>
                  {orderBy === "units" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("stock")}
                  >
                    Текущий Остаток
                  </span>
                  {orderBy === "stock" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("counterparty")}
                  >
                    Контрагент
                  </span>
                  {orderBy === "counterparty" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("brand")}
                  >
                    Бренд
                  </span>
                  {orderBy === "brand" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
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
              </TableRow>
              <TableRow style={{ fontWeight: "bold" }}>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("price_discount")}
                  >
                    С учётом применённой скидки
                  </span>
                  {orderBy === "price_discount" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
                <StyledTableCell rowSpan="2" align="center">
                  <span
                    className="hand"
                    onClick={() => orderByFunction("price_discount_bonus")}
                  >
                    С учётом применённой скидки <br /> (за минусом
                    использованных бонусов)
                  </span>
                  {orderBy === "price_discount_bonus" && (
                    <OrderArrowMaterial ascending={ascending} />
                  )}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{product.num}</StyledTableCell>
                    <StyledTableCell
                      style={{
                        fontWeight: "bold",
                        color: product.type === "Продажа" ? "green" : "red",
                      }}
                    >
                      {product.type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {Moment(product.sell_date).format("lll")}
                    </StyledTableCell>
                    <StyledTableCell>{product.name}</StyledTableCell>
                    <StyledTableCell>
                      {product.consultant ? product.consultant : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="tenge">
                      {parseFloat(product.price_discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="tenge">
                      {parseFloat(
                        product.price_discount_bonus
                      ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </StyledTableCell>
                    {handleGrouping && grouping && (
                      <StyledTableCell align="center" className="tax">
                        {product.taxrate}
                      </StyledTableCell>
                    )}
                    {handleGrouping && grouping && (
                      <StyledTableCell align="center" className="tenge">
                        {parseFloat(product.tax).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="center">
                      {parseFloat(product.units).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {parseFloat(product.stock).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.counterparty}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.brand}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.category}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <StyledTableCell colSpan="2">Итого</StyledTableCell>
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell align="center" className="tenge">
                  {sales
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.price_discount);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                <StyledTableCell align="center" className="tenge">
                  {sales
                    .reduce((prev, cur) => {
                      return prev + parseFloat(cur.price_discount_bonus);
                    }, 0)
                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                </StyledTableCell>
                {handleGrouping && grouping && <StyledTableCell />}
                {handleGrouping && grouping && (
                  <StyledTableCell align="center" className="tenge">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.tax);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </StyledTableCell>
                )}
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
                      return prev + parseFloat(cur.stock);
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
      </Grid>
      <Grid item xs={12}>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={getSalesExcel}
          disabled={isLoading}
        >
          Выгрузить в Excel
        </button>
      </Grid>
    </Fragment>
  );
}
