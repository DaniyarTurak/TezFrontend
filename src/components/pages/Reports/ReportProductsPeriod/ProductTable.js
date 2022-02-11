import React, { Fragment } from "react";
//import PropTypes from "prop-types";
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
// import FirstPageIcon from "@material-ui/icons/FirstPage";
// import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
// import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// import LastPageIcon from "@material-ui/icons/LastPage";
// import IconButton from "@material-ui/core/IconButton";

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

function ProductTable({
  classes,
  productsperiod,
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
  onChangeRowsPerPage,
}) {
  console.log("Current Page: ", currentPage);

  return (
    <Fragment>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} id="table-to-xls">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Штрих-код</StyledTableCell>
              <StyledTableCell align="center">Наименование</StyledTableCell>
              <StyledTableCell align="center">
                Приход за месяц, шт
              </StyledTableCell>
              <StyledTableCell align="center">
                Расход за месяц, шт
              </StyledTableCell>
              <StyledTableCell align="center">Остаток</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsperiod.map((product, idx) => {
              return (
                <TableRow key={idx}>
                  <StyledTableCell>{idx + 1}</StyledTableCell>
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
      <TablePagination
        rowsPerPageOptions={[20, 50, 100]}
        component="div"
        count={totalPosts}
        page={currentPage}
        onChangePage={paginate}
        rowsPerPage={postsPerPage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </Fragment>
  );
}

export default React.memo(ProductTable);
