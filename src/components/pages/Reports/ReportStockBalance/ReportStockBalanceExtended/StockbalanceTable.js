import React, { Fragment } from "react";
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
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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

export default function StockbalanceTable({
  stockbalance,
  activePage,
  itemsPerPage,
  handleProductDtl,
  totalcost,
  totalprice,
  totalunits,
  totalCount,
  isPaginationLoading,
  handlePageChange,
  classes,
  handleChangeRowsPerPage,
  stock
}) {
  return (
    <Fragment>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} id="table-to-xls">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Склад</StyledTableCell>
              <StyledTableCell align="center">
                Наименование товара
              </StyledTableCell>
              <StyledTableCell align="center">Штрих код</StyledTableCell>
              <StyledTableCell align="center">
                Общая себестоимость
              </StyledTableCell>
              <StyledTableCell align="center">
                Остаток в ценах реализации
              </StyledTableCell>
              <StyledTableCell align="center">
                Наценка
              </StyledTableCell>
              <StyledTableCell align="center">Количество</StyledTableCell>
              <StyledTableCell align="center">Бренд</StyledTableCell>
              <StyledTableCell align="center">Категория</StyledTableCell>
              <StyledTableCell align="center">НДС</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockbalance.map((product, idx) => (
              <TableRow key={idx}>
                <StyledTableCell>
                  {idx + 1 + activePage * itemsPerPage}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {product.pointname === `Склад точки ""`
                    ? "Центральный Склад"
                    : product.pointname}
                </StyledTableCell>

                <StyledTableCell
                  className={classes.hover}
                  onClick={() => {
                    handleProductDtl(product);
                  }}
                >
                  {product.productname +
                    (product.attributescaption
                      ? ", " + product.attributescaption
                      : "")}
                </StyledTableCell>
                <StyledTableCell align="center">{product.code}</StyledTableCell>
                <StyledTableCell className="text-center tenge">
                  {parseFloat(product.cost).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledTableCell>
                <StyledTableCell className="text-center tenge">
                  {parseFloat(product.price).toLocaleString("ru", {
                    minimumFractionDigits: 2,
                  })}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {isFinite(parseFloat((product.price - product.cost) / product.cost * 100)) ? parseFloat((product.price - product.cost) / product.cost * 100).toLocaleString("ru", {
                    minimumFractionDigits: 1, maximumFractionDigits: 2
                  }) + " %": "n/a"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {Number(product.units ? product.units : 0)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {product.brand}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {product.category}
                </StyledTableCell>
                <StyledTableCell align="center">{product.nds}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan="4">Общий итог</StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {parseFloat(totalcost).toLocaleString("ru", {
                  maximumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell align="center" className="tenge">
                {parseFloat(totalprice).toLocaleString("ru", {
                  maximumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="center">
                {parseFloat(totalunits).toLocaleString("ru", {
                  maximumFractionDigits: 2,
                })}
              </StyledTableCell>
              <StyledTableCell colSpan="3"></StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {totalCount !== 0 && !isPaginationLoading && (
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={totalCount * itemsPerPage}
          backIconButtonText="Предыдущая страница"
          labelRowsPerPage="Строк в странице"
          nextIconButtonText="Следующая страница"
          rowsPerPage={itemsPerPage}
          page={activePage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      )}
    </Fragment>
  );
}
