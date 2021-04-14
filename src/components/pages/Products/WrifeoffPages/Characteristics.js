import React, { Fragment } from "react";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell"
import Table from "@material-ui/core/Table";
import { withStyles } from "@material-ui/core/styles";

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

export default function Characteristics({ prodName, products, selectAttribute }) {

  return (
    <Fragment>
      <h6>Для товара <span style={{ color: "#17a2b8" }}>{prodName}</span>  найдены следующие характеристики:</h6>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Характеритика</StyledTableCell>
              <StyledTableCell align="center">Количество</StyledTableCell>
              <StyledTableCell align="center">Цена реализации</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              product.units > 0 ?
                <TableRow key={product.attributes + product.attributescaption}>
                  <StyledTableCell>
                    {product.attributes === "0"
                      ? "Без дополнительных характеристик"
                      : product.attributescaption}
                  </StyledTableCell>
                  <StyledTableCell align="center" >{product.units} {product.unitspr_shortname}</StyledTableCell>
                  <StyledTableCell align="center">{product.price} тг.</StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="btn btn-sm btn-block btn-outline-secondary"
                      onClick={() => selectAttribute(product)}
                    >
                      Выбрать
                    </button>
                  </StyledTableCell>
                </TableRow>
                : ""
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};
