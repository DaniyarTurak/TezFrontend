import React from "react";

import Table from "@material-ui/core/Table";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Moment from "moment";
import TableCell from "@material-ui/core/TableCell";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: "1rem",
  },
}))(TableCell);

export default function InvoicesTable({ classes, invoices, invoiceDetails }) {
  const [page, setPage] = React.useState(
    JSON.parse(sessionStorage.getItem("barcode-invoices"))
      ? JSON.parse(sessionStorage.getItem("barcode-invoices")).page
      : 0
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(
    JSON.parse(sessionStorage.getItem("barcode-invoices"))
      ? JSON.parse(sessionStorage.getItem("barcode-invoices")).rows
      : 10
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    //храню в session storage чтобы после перехода в детали и обратно сохранял предыдущий статус таблицы. По хорошему нужно использовать redux или context.
    sessionStorage.setItem(
      "barcode-invoices",
      JSON.stringify({
        rows: rowsPerPage,
        page: newPage,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    //храню в session storage чтобы после перехода в детали и обратно сохранял предыдущий статус таблицы. По хорошему нужно использовать redux или context.
    sessionStorage.setItem(
      "barcode-invoices",
      JSON.stringify({
        rows: event.target.value,
        page,
      })
    );
    setPage(0);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <p className={classes.notFound}>
        За выбранный период найдены следующие накладные:
      </p>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Номер накладной</StyledTableCell>
              <StyledTableCell align="center">Тип накладной</StyledTableCell>
              <StyledTableCell align="center">На склад</StyledTableCell>
              <StyledTableCell align="center">Контрагент</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ cursor: "pointer" }}>
            {invoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice, idx) => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={idx}
                  onClick={() => invoiceDetails(invoice)}
                >
                  <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    Накладная {invoice.altnumber} от{" "}
                    {Moment(invoice.invoicedate).format("DD.MM.YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {invoice.invoicetype}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {invoice.stockto}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {invoice.counterparty &&
                      `${invoice.bin} | ${invoice.counterparty}`}
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        classes={{
          root: classes.rootPagination,
          caption: classes.tablePaginationCaption,
          selectIcon: classes.tablePaginationSelectIcon,
          select: classes.tablePaginationSelect,
          actions: classes.tablePaginationActions,
        }}
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={invoices.length}
        backIconButtonText="Предыдущая страница"
        labelRowsPerPage="Строк в странице"
        nextIconButtonText="Следующая страница"
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
