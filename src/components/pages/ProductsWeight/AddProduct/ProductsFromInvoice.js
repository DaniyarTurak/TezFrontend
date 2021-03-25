import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },

  container: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
}));

export default function ProductsFromInvoice({
  invoiceList,
  handleEdit,
  handleDelete,
}) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.head}></TableCell>
            <TableCell className={classes.head} align="left">
              Наименование товара
            </TableCell>
            <TableCell className={classes.head} align="center">
              Штрихкод
            </TableCell>
            <TableCell className={classes.head} align="center">
              Цена закупа (1кг.)
            </TableCell>
            <TableCell className={classes.head} align="center">
              Цена за 1кг.
            </TableCell>
            <TableCell className={classes.head} align="center">
              Количество
            </TableCell>
            <TableCell className={classes.head} align="center">
              Итого цена закупки
            </TableCell>
            <TableCell className={classes.head} align="center">
              Итого цена продажи
            </TableCell>
            <TableCell className={classes.head} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceList.map((row, idx) => {
            return (
              <TableRow
                key={row.name + row.attributescaption}
                className={classes.row}
              >
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="center">{row.code}</TableCell>
                <TableCell align="center" className="tenge">
                  {row.purchaseprice}
                </TableCell>
                <TableCell align="center" className="tenge">
                  {row.newprice}
                </TableCell>
                <TableCell align="center">{parseFloat(row.amount)}</TableCell>
                <TableCell align="center" className="tenge">
                  {row.purchaseprice * row.amount}
                </TableCell>
                <TableCell align="center" className="tenge">
                  {row.newprice * row.amount}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="редактировать"
                    component="span"
                    onClick={() => handleEdit(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="удалить"
                    component="span"
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Итого:</TableCell>
            <TableCell className="tenge" align="center">
              {invoiceList
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.purchaseprice);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell className="tenge" align="center">
              {invoiceList
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.newprice);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell align="center">
              {invoiceList
                .reduce((prev, cur) => {
                  return prev + parseFloat(cur.amount);
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell className="tenge" align="center">
              {invoiceList
                .reduce((prev, cur) => {
                  return (
                    prev +
                    parseFloat(cur.purchaseprice) * parseFloat(cur.amount)
                  );
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell className="tenge" align="center">
              {invoiceList
                .reduce((prev, cur) => {
                  return (
                    prev + parseFloat(cur.newprice) * parseFloat(cur.amount)
                  );
                }, 0)
                .toLocaleString("ru", { minimumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
