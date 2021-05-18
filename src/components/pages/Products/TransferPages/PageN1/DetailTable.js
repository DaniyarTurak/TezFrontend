import React, { Fragment } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Input from "@material-ui/core/Input";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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
}))(TableCell);

export default function DetailTable({
  fromPointProps,
  toPointProps,
  detail,
  newAmount,
  onAmountChange,
  oldPriceCheck,
  handleCheckboxChange,
  newPriceCheck,
  handleCheckboxChange1,
  addProduct,
}) {
  return (
    <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan="3">
              {fromPointProps.label}
            </StyledTableCell>
            <StyledTableCell colSpan="3">{toPointProps.label}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell colSpan="2">Количество</StyledTableCell>
            <StyledTableCell align="left">
              {detail && (
                <span className="inputText">
                  {detail.units === 0
                    ? "Товар на складе отсутствует"
                    : "Товаров на складе: " + detail.units}
                </span>
              )}
            </StyledTableCell>

            <StyledTableCell colSpan="2">Переместить</StyledTableCell>

            <StyledTableCell colSpan="3">
              <Input
                type="text"
                name="newAmount"
                placeholder="Внесите количество для перемещения"
                value={newAmount}
                onChange={onAmountChange}
              />
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Цена</StyledTableCell>
            <StyledTableCell>
              <input
                type="checkbox"
                checked={oldPriceCheck}
                onChange={handleCheckboxChange}
              ></input>
            </StyledTableCell>
            <StyledTableCell className={detail.price && "tenge"}>
              {detail.price}
            </StyledTableCell>
            {detail.priceto && <Fragment>
              <StyledTableCell>Цена</StyledTableCell>
              <StyledTableCell>
                <input
                  type="checkbox"
                  checked={newPriceCheck}
                  onChange={handleCheckboxChange1}
                ></input>
              </StyledTableCell>
              <StyledTableCell className={detail.priceto && "tenge"}>
                {detail.priceto}
              </StyledTableCell>
            </Fragment>
            }
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan="7" align="center">
              <button className="btn btn-info" onClick={addProduct}>
                Добавить
              </button>
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
