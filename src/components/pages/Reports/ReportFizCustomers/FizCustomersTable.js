import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DescriptionIcon from "@material-ui/icons/Description";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import Grid from "@material-ui/core/Grid";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

const ColorButton = withStyles(() => ({
  root: {
    borderColor: "#17a2b8",
    color: "#17a2b8",
    fontSize: ".875rem",
    textTransform: "none",
    minWidth: "11rem",
    margin: ".1rem",
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

export default function FizCustomersTable({
  classes,
  customers,
  debtSum,
  openWriteOffDetails,
  invoiceDetails,
  handleProductDetails,
}) {
  const [selectedID, setSelectedID] = React.useState(null);

  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">ФИО</StyledTableCell>
                <StyledTableCell align="center">Телефон</StyledTableCell>
                <StyledTableCell align="center">Сумма покупок</StyledTableCell>
                <StyledTableCell align="center">
                  Накоплено Бонусов
                </StyledTableCell>
                <StyledTableCell align="center">
                  Потрачено Бонусов
                </StyledTableCell>
                <StyledTableCell align="center">
                  Остаток Бонусов
                </StyledTableCell>
                <StyledTableCell align="center">Общий долг</StyledTableCell>
                <StyledTableCell align="center">Списание</StyledTableCell>
                <StyledTableCell align="center">Чеки</StyledTableCell>
                <StyledTableCell align="center">Товары</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, idx) => {
                return (
                  <TableRow
                    key={customer.customer_id}
                    className={classes.tableRow}
                    selected={selectedID === customer.customer_id}
                    onClick={() => setSelectedID(customer.customer_id)}
                  >
                    <StyledTableCell>{customer.fio}</StyledTableCell>
                    <StyledTableCell align="center">
                      {customer.telephone}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {customer.details.price}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {customer.details.allbonuses}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {customer.details.spendbonuses}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {customer.details.currbonuses}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {debtSum[idx]}
                    </StyledTableCell>
                    <StyledTableCell>
                      <ColorButton
                        fullWidth
                        variant="outlined"
                        onClick={() => openWriteOffDetails(customer, idx)}
                      >
                        Погасить
                      </ColorButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        component="span"
                        onClick={() => invoiceDetails(customer, idx)}
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        component="span"
                        onClick={() => handleProductDetails(customer, idx)}
                      >
                        <LocalMallIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={3}>
        <ReactHTMLTableToExcel
          className="btn btn-sm btn-outline-success"
          table="table-to-xls"
          filename={`Бонусы покупателей`}
          sheet="tablexls"
          buttonText="Выгрузить в excel"
        />
      </Grid>
    </Fragment>
  );
}
