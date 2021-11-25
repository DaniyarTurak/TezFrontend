import React, { useState, useEffect } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";

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



export default function PageN2({ productList }) {

  const [isWholesale, setWholeSale] = useState(false);

  useEffect(() => {
    if ( JSON.parse(sessionStorage.getItem("isme-company-data")) && JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale) {
      setWholeSale(true);
    }
  }, [])

  return (
    <div>
      <label style={{ marginTop: "1rem" }}>
        Вы установили следующие товары/услуги :{" "}
      </label>
      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Продукт</StyledTableCell>
              <StyledTableCell>Штрих код</StyledTableCell>
              <StyledTableCell>Новая розничная цена</StyledTableCell>
              {isWholesale && <StyledTableCell>Оптовая цена</StyledTableCell>}
              <StyledTableCell>Количество</StyledTableCell>
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
                  <StyledTableCell
                    align="center"
                    className={product.price && "tenge"}
                  >
                    {product.wholesale_price}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.amount}
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
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
