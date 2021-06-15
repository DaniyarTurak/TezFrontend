import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "600px",
    width: "700px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

const CancelButton = withStyles((theme) => ({
  root: {
    color: "black",
    backgroundColor: "#DCDCDC",
    '&:hover': {
      backgroundColor: "#D3D3D3",
    },
  },
}))(Button);

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

export default function AttributeDetails({
  modalIsOpen,
  setModalOpen,
  products,
  selectAttribute,
}) {

  return (
    <ReactModal isOpen={modalIsOpen} style={customStyles}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h6>Для товара <span style={{ color: "#17a2b8" }}>{products[0].name}</span>  найдены следующие характеристики:</h6>
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
                  <TableRow
                    key={
                      product.attributes +
                      product.attributescaption +
                      product.unitspr_shortname
                    }>
                    <StyledTableCell>
                      {product.attributes === "0"
                        ? "Единица Измерения: " +
                        (product.unitspr_shortname
                          ? " [" + product.unitspr_shortname + "]"
                          : "")
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center">
            <CancelButton onClick={() => { setModalOpen(false); }}>
              Отмена
            </CancelButton>
          </Grid>
        </Grid>
      </Grid>
    </ReactModal>
  );
}
