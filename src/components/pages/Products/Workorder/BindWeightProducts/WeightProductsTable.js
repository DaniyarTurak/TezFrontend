import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 700,
    },
    head: {
      backgroundColor: "#17a2b8",
      color: theme.palette.common.white,
      fontSize: 14,
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    rowEdited: {
      color: theme.palette.warning.main,
    },
  }));

function WeightProductsTable({weightProductsList, handleEdit, handleDelete}) {
    const classes = useStyles(weightProductsList);

    return (
        <TableContainer className="mt-4" component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>Номер на весах</TableCell>
              <TableCell className={classes.head}>Штрихкод</TableCell> 
              <TableCell className={classes.head} align="left">
                Наименование товара
              </TableCell>
              <TableCell className={classes.head} align="center">
                Цена закупа (1кг.)
              </TableCell>
              <TableCell className={classes.head} align="center">
                Цена за 1кг.
              </TableCell>
              <TableCell className={classes.head} align="center">
                НДС
              </TableCell>
              <TableCell className={classes.head} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weightProductsList.map((row, idx) => {
              return (
                <TableRow
                  key={row.name + row.attributescaption}
                  className={classes.row}
                >
                  <TableCell align="center">{row.hotkey}</TableCell>
                  <TableCell align="center">{row.code}</TableCell>
                  <TableCell align="left">
                    {row.name + " "}
                    {row.attributescaption && (
                      <label style={{ opacity: "60%" }}>
                        [{row.attributescaption}]
                      </label>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.purchaseprice} тг.
                  </TableCell>
                  <TableCell align="center">{row.sellprice} тг.</TableCell>
                  <TableCell align="center">
                    {row.tax === 0 ? "Без НДС" : "Стандартный НДС"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="редактировать"
                      component="span"
                      onClick={() => handleEdit(idx, row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="удалить"
                      component="span"
                      onClick={() => handleDelete(idx)}
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
              <TableCell  align="center">
                Итого:
              </TableCell>
              <TableCell colspan= {2}/>
              <TableCell className="tenge" align="center">
                {weightProductsList
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.purchaseprice);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="tenge" align="center">
                {weightProductsList
                  .reduce((prev, cur) => {
                    return prev + parseFloat(cur.sellprice);
                  }, 0)
                  .toLocaleString("ru", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    )
}

export default WeightProductsTable
