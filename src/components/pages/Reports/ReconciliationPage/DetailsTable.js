import React, { Fragment, useState } from "react";
import Moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TablePagination from "@material-ui/core/TablePagination";
import "moment/locale/ru";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Axios from "axios";

const CryptoJS = require("crypto-js");
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

export default function DetailsTable({ details, closeDetails }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setLoading] = useState(false);

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
    };

    const decryptName = () => {
        let user = "test";
        const key = CryptoJS.lib.WordArray.create("$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6");
        const iv = CryptoJS.lib.WordArray.create("A?D(G+KbPeShVmYq3t6v9y$B&E)H@McQ");
        let bytes = CryptoJS.AES.decrypt(details.result.user_name, key, { iv });
        user = bytes.toString(CryptoJS.enc.Utf8);
        return user
    };

    const getReconciliationExcel = () => {
        let summDataResult = details.result.result;
        let date = Moment(details.begin_date).format('DD-MM-YYYY').toString().replaceAll("-", "_");
        setLoading(true);
        Axios({
            method: "POST",
            url: "/api/reconciliation/toexcel",
            data: { summDataResult },
            responseType: "blob",
        })
            .then((res) => res.data)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Сверка ${date}.xlsx`);
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
        < Fragment >
            { details.result.result.length > 0 &&
                <Fragment>
                    <Grid item xs={8}>
                        <Typography >
                            Номер сверки: {details.id}
                        </Typography>
                        <Typography >
                            Дата начала: {Moment(details.begin_date).format('LLL')}
                        </Typography>
                        <Typography >
                            Дата окончания: {Moment(details.end_date).format('LLL')}
                        </Typography>
                        <Typography >
                            Пользователь: {decryptName()}
                        </Typography>
                        <Typography >
                            Статус:  {details.status === 0 ? <span style={{ color: "#fd7e14" }}>Не завершена</span> :
                                details.status === 1 ? <span style={{ color: "#28a745" }}>Завершена</span> :
                                    <span style={{ color: "#dc3545" }}>Удалена</span>}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            variant="outlined"
                            onClick={closeDetails}
                        >
                            Вернуться назад
                        </Button>
                    </Grid>
                    < Grid item xs={12}>
                        <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                            <Table id="table-to-xls">
                                <TableHead >
                                    <TableRow style={{ fontWeight: "bold" }} >
                                        <StyledTableCell rowSpan="2" align="center">
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Штрих-код
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Наименование
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Количество во время загрузки в ТСД
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Продано во время сверки
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Текущий остаток
                                </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details.result.result
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((prod, idx) => (
                                            <TableRow key={idx}>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{idx + 1}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.code}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.name}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.tsd_units}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.sale_units}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.tsd_units - prod.sale_units) !== prod.stock_units ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.stock_units}</StyledTableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={details.result.result.length}
                            backIconButtonText="Предыдущая страница"
                            labelRowsPerPage="Строк в странице"
                            nextIconButtonText="Следующая страница"
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </Grid>
                    < Grid item xs={12}>
                        <button
                            disabled={isLoading}
                            className="btn btn-sm btn-outline-success"
                            onClick={getReconciliationExcel}
                        >
                            Выгрузить в Excel
                        </button>
                    </Grid>
                </Fragment >
            }
        </Fragment >
    );
}
