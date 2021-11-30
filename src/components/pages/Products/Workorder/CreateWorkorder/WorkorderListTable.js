
import React, { useState, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Alert from "react-s-alert";
import Moment from "moment";
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SweetAlert from "react-bootstrap-sweetalert";

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
        <div
            className={classes.root}
        >
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

export default function WorkorderListTable({
    workorderList,
    setWorkorderId,
    setPoint,
    setWorkorderNumber,
    setCounterparty,
    getWorkorderProducts,
    setOnlyView,
    getWorkorders
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setLoading] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const editWorkorder = (workorder) => {
        setPoint(workorder.point);
        setCounterparty(workorder.counterparty);
        setWorkorderId(workorder.id);
        setWorkorderNumber(workorder.workorder_number);
        getWorkorderProducts(workorder.id);
    };

    const viewWorkorder = (workorder) => {
        setOnlyView(true);
        setPoint(workorder.point);
        setCounterparty(workorder.counterparty);
        setWorkorderId(workorder.id);
        setWorkorderNumber(workorder.workorder_number);
        getWorkorderProducts(workorder.id);
    };

    const deleteWorkorder = (workorder) => {
        setLoading(true);
        Axios.post("/api/workorder/delete", { workorderId: workorder.id })
            .then((res) => res.data)
            .then((res) => {
                setSweetAlert(null);
                setLoading(false);
                getWorkorders();
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSweetAlert(null);
                setLoading(false);
                getWorkorders();
            });
    };

    const showConfiramtion = (workorder) => {
        setSweetAlert(
            <SweetAlert
                warning
                showCancel
                confirmBtnText={"Да, удалить"}
                cancelBtnText={"Нет"}
                confirmBtnBsStyle="success"
                cancelBtnBsStyle="default"
                title={"Внимание"}
                allowEscape={false}
                closeOnClickOutside={false}
                onConfirm={() => deleteWorkorder(workorder)}
                onCancel={() => setSweetAlert(null)}
            >
                Заказ-наряд будет удалён без возможности восстановления. Удалить?
            </SweetAlert>)
    }

    return (
        <Fragment>
            {sweetAlert}
            <Grid
                container
                spacing={2}
            >
                {workorderList.length === 0 &&
                    <Grid item xs={12} style={{ textAlign: "center", color: '#6c757d' }}>
                        У Вас пока нет заказ-нарядов
                    </Grid>
                }
                <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px -1px 1px 1px white" }}
                    >
                        <Table id="table-to-xls">
                            <TableHead>
                                <TableRow style={{ fontWeight: "bold" }} >
                                    <StyledTableCell align="center">
                                        № заказ-наряда
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Торговая точка
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Пользователь
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Дата создания
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Дата принятия
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Статус
                                    </StyledTableCell>
                                    <StyledTableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workorderList
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((wo, idx) => (
                                        <TableRow key={idx}>
                                            <StyledTableCell align="center">
                                                {wo.workorder_number}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {wo.point_name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {wo.username}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {Moment(wo.date).format("DD.MM.YYYY HH:mm:ss")}
                                            </StyledTableCell >
                                            <StyledTableCell align="center">
                                                {wo.accept_date ? Moment(wo.accept_date).format("DD.MM.YYYY HH:mm:ss") : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {wo.status === 'CREATED' ? <span style={{ color: "#17a2b8" }}>Создан</span>
                                                    : wo.status === 'FORMATION' ? <span style={{ color: "#ffc107" }}>Формирование</span>
                                                        : wo.status === 'INPROCESS' ? <span style={{ color: "#28a745" }}>В обработке</span>
                                                            : wo.status === 'APPROVED' ? <span style={{ color: "#28a745" }}>Обработан</span>
                                                                : wo.status === 'ACCEPTED' ? <span style={{ color: "#" }}>Принят</span> : ''}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {(wo.status === 'FORMATION' || wo.status === 'CREATED') &&
                                                    <IconButton
                                                        title="Редактировать"
                                                        disabled={isLoading}
                                                        onClick={() => editWorkorder(wo)}>
                                                        <EditIcon size="small" />
                                                    </IconButton>}
                                                <IconButton
                                                    title="Посмотреть"
                                                    onClick={() => viewWorkorder(wo)}>
                                                    <VisibilityIcon size="small" />
                                                </IconButton>
                                                {(wo.status === 'FORMATION' || wo.status === 'CREATED') &&
                                                    <IconButton
                                                        title="Удалить"
                                                        disabled={isLoading} onClick={() => showConfiramtion(wo)}>
                                                        <DeleteIcon size="small" />
                                                    </IconButton>}
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={workorderList.length}
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
            </Grid>
        </Fragment >
    )
};