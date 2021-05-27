import React, { Fragment, useState, useEffect } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TablePagination from "@material-ui/core/TablePagination";
import "moment/locale/ru";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
Moment.locale("ru");


const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

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
};

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
//конец пагинации

export default function NonTable({ products }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [prods, setProds] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        let arr = [];
        products.forEach((product, i) => {
            arr.push({ ...product, n: i + 1 });
        });
        setProds(arr)
    }, [products]);

    const StyledTableCell = withStyles((theme) => ({
        head: {
            background: "#17a2b8",
            color: theme.palette.common.white,
            fontSize: ".875rem",
        },
        body: {
            fontSize: ".875rem",
        },
        footer: {
            fontSize: ".875rem",
            fontWeight: "bold",
        },
    }))(TableCell);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    const getNoneExcel = () => {
        setLoading(true);
        Axios({
          method: "POST",
          url: "/api/reconciliation/none_toexcel",
          data: { prods },
          responseType: "blob",
        })
          .then((res) => res.data)
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Не прошедшие сверку.xlsx`);
            document.body.appendChild(link);
            link.click();
            setLoading(false);
          })
          .catch((err) => {
            ErrorAlert(err);
            setLoading(false);
          });
      };

    return (
        <Fragment>
            <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                <Table>
                    <TableHead >
                        <TableRow style={{ fontWeight: "bold" }} >
                            <StyledTableCell align="center" />
                            <StyledTableCell align="center">
                                Штрих-код
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Наименование
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Остаток на складе
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prods
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((prod, idx) => (
                                <TableRow key={idx}>
                                    <StyledTableCell align="center">
                                        {prod.n}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {prod.code}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {prod.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {prod.stock_units}
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={products.length}
                backIconButtonText="Предыдущая страница"
                labelRowsPerPage="Строк в странице"
                nextIconButtonText="Следующая страница"
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
                <Grid item xs={12} style={{ paddingTop: "10px" }}>
                    <button
                        className="btn btn-sm btn-outline-success"
                        onClick={getNoneExcel}
                    >
                        Выгрузить в Excel
                    </button>
                </Grid>
        </Fragment>
    );
}
