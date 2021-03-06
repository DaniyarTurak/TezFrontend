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
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function ProductTable({
  classes,
  currentPage,
  paginate,
  productsperiod,
  postsPerPage,
  totalPosts,
  selectedStock,
  onRowsPerPageChange,
}) {
  return (
    <Fragment>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} id="table-to-xls">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>??????????</StyledTableCell>
              <StyledTableCell align="center">??????????-??????</StyledTableCell>
              <StyledTableCell align="center">????????????????????????</StyledTableCell>
              <StyledTableCell align="center">
                ???????????? ???? ??????????, ????
              </StyledTableCell>
              <StyledTableCell align="center">
                ???????????? ???? ??????????, ????
              </StyledTableCell>
              <StyledTableCell align="center">??????????????</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsperiod.map((product, idx) => {
              return (
                <TableRow key={idx}>
                  <StyledTableCell>
                    {idx + 1 + currentPage * postsPerPage}
                  </StyledTableCell>
                  <StyledTableCell>
                    {selectedStock.value === "0"
                      ? "???????????????? ??????????"
                      : selectedStock.label}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.code}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.income}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.outcome}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.units}
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {typeof paginate !== "undefined" && (
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={totalPosts}
          backIconButtonText="???????????????????? ????????????????"
          labelRowsPerPage="?????????? ?? ????????????????"
          nextIconButtonText="?????????????????? ????????????????"
          page={currentPage}
          onPageChange={paginate}
          rowsPerPage={postsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={TablePaginationActions}
        />
      )}
    </Fragment>
  );
}

export default ProductTable;
