import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ marginTop: "2rem" }}>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function AttributeDetails({
  modalIsOpen,
  setModalOpen,
  closeDetail,
  products,
  selectAttribute,
}) {
  const closeModal = () => {
    closeDetail(true);
  };

  return (
    <Dialog onClose={closeModal} keepMounted open={modalIsOpen} maxWidth="lg">
      <DialogTitle
        onClose={() => {
          setModalOpen(false);
        }}
      >
        Для данного товара, найдены следующие характеристики:
      </DialogTitle>

      <DialogContent>
        <Table>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={
                  product.attributes +
                  product.attributescaption +
                  product.unitspr_shortname
                }
              >
                <TableCell>
                  {product.attributes === "0"
                    ? "Единица Измерения: " +
                      (product.unitspr_shortname
                        ? " [" + product.unitspr_shortname + "]"
                        : "")
                    : product.attributescaption}
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  <Button
                    variant="outlined"
                    onClick={() => selectAttribute(product)}
                  >
                    Выбрать
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
