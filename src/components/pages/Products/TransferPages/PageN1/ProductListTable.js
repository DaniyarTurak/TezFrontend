import React, { Fragment, useEffect } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: "1rem",
  },
  body: {
    fontSize: "1rem",
  },
  footer: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
}))(TableCell);

export default function ProductListTable({ productList, removeProduct }) {

  useEffect(() => {
    console.log(productList);
  }, [productList]);

  return (
    <Fragment>
      <div className="empty-space"></div>

      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" >Продукт</StyledTableCell>
              <StyledTableCell align="center">Штрих код</StyledTableCell>
              <StyledTableCell align="center">Новая цена</StyledTableCell>
              <StyledTableCell align="center">Количество</StyledTableCell>
              <StyledTableCell align="center">Сумма</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product) => {
              return (
                <TableRow key={product.id}>
                  <StyledTableCell>{product.name}</StyledTableCell>
                  <StyledTableCell>{product.code}</StyledTableCell>
                  <StyledTableCell
                    align="center"
                    className={product.price && "tenge"}
                  >
                    {product.price}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.amount}
                  </StyledTableCell>
                  <StyledTableCell
                    className={product.price && "tenge"}
                    align="center"
                  >
                    {product.amount * product.price}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      aria-label="delete item"
                      component="span"
                      onClick={() => {
                        removeProduct(product);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan="3">Итого:</StyledTableCell>

              <StyledTableCell align="center">
                {productList.reduce((prev, cur) => {
                  return prev + parseFloat(cur.amount);
                }, 0)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {productList.reduce((prev, cur) => {
                  return prev + parseFloat(cur.price);
                }, 0)}
              </StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
