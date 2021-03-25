import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import TablePagination from "@material-ui/core/TablePagination";
import Moment from "moment";

export default function Brands({
  inactive,
  classes,
  brands,
  handleDelete,
  StyledTableCell,
  StyledTableRow,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <p className={classes.notFound}>Бренды: </p>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Номер купона</StyledTableCell>
              <StyledTableCell align="center">Привязка</StyledTableCell>
              <StyledTableCell align="center">Тип купона</StyledTableCell>
              <StyledTableCell align="center">Срок действия</StyledTableCell>
              <StyledTableCell align="center">
                Размер скидки [%]
              </StyledTableCell>
              <StyledTableCell align="center">Статус</StyledTableCell>
              {!inactive && <StyledTableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {brands
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center">{row.number}</StyledTableCell>
                  <StyledTableCell align="center">{row.object}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.type} ({row.subtype})
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {Moment(row.expire).format("DD.MM.YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.discount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.active ? "активен" : "использован"}
                  </StyledTableCell>
                  {!inactive && (
                    <StyledTableCell align="center">
                      <IconButton
                        aria-label="delete item"
                        component="span"
                        onClick={(e) => handleDelete(row, e)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </StyledTableCell>
                  )}
                </StyledTableRow>
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
        count={brands.length}
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
