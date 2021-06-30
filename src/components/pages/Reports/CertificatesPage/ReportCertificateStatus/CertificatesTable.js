import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

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

//вся эта функция TablePaginationActions используется исключительно для того чтобы иметь возможность
//перепригивать между последней и первой страницей в пагинации. Ridiculous.
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CertificatesTable({
  classes,
  certificates,
  handleActivate,
  status,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedID, setSelectedID] = React.useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} id="table-to-xls">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Номер</StyledTableCell>
                <StyledTableCell align="center">Номинал</StyledTableCell>
                <StyledTableCell align="center">Дата истечения</StyledTableCell>
                <StyledTableCell align="center">Тип</StyledTableCell>
                <StyledTableCell align="center">Дата продажи</StyledTableCell>
                <StyledTableCell align="center">Статус</StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((certificate, idx) => (
                  <TableRow
                    selected={selectedID === certificate.id}
                    key={certificate.id}
                    onClick={() => setSelectedID(certificate.id)}
                  >
                    <StyledTableCell>{idx + 1 + page * rowsPerPage}</StyledTableCell>

                    <StyledTableCell>{certificate.code}</StyledTableCell>
                    <StyledTableCell align="center">
                      {certificate.denomination}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {certificate.expiredate}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {certificate.type}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {certificate.selldate}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontWeight: "bold",
                        color:
                          certificate.status === "Доступен для продажи"
                            ? "green"
                            : certificate.status === "Использован"
                              ? "black"
                              : certificate.status === "Продан (Активен)"
                                ? "blue"
                                : "red",
                      }}
                    >
                      {certificate.status}
                    </StyledTableCell>
                    <StyledTableCell>
                      {certificate.status === "Доступен для продажи" ||
                        certificate.status === "Использован" ? (
                        <Button
                          fullWidth
                          className={classes.button}
                          variant="outlined"
                          onClick={() => handleActivate(certificate)}
                        >
                          Активировать
                        </Button>
                      ) : (
                        ""
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {certificates.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={certificates.length}
            backIconButtonText="Предыдущая страница"
            labelRowsPerPage="Строк в странице"
            nextIconButtonText="Следующая страница"
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        )}
      </Grid>
    </Fragment>
  );
}
