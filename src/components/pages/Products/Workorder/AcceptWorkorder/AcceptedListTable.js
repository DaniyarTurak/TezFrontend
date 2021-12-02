
import React, { useState, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Moment from "moment";
import VisibilityIcon from '@material-ui/icons/Visibility';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 2,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 2,
        backgroundColor: '#17a2b8',
    },
}))(LinearProgress);

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

export default function AcceptedListTable({
    workorderList,
    setWorkorderId,
    setOnlyView,
    setActivePage,
    isLoading,
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const viewWorkorder = (workorder_id) => {
        setWorkorderId(workorder_id);
        setOnlyView(true);
        setActivePage(2);
    }

    return (
        <Fragment>
            <Grid
                container
                spacing={2}
            >
                {isLoading &&
                    <Grid item xs={12}>
                        <BorderLinearProgress />
                    </Grid>
                }
                {workorderList.length === 0 && !isLoading ?
                    <Grid item xs={12}>
                        У Вас пока нет обработанных заказ-нарядов
                    </Grid>
                    :
                    <Grid item xs={12}>
                        Обработанные заказ-наряды
                    </Grid>
                }
                {!isLoading && workorderList.length > 0 && <Grid item xs={12}>
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
                                        Дата обработки
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
                                                {wo.approve_date ? Moment(wo.approve_date).format("DD.MM.YYYY HH:mm:ss") : "-"}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <IconButton onClick={() => viewWorkorder(wo.id)}
                                                    title="Посмотреть"
                                                >
                                                    <VisibilityIcon
                                                        size="small"
                                                    />
                                                </IconButton>
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
                </Grid>}
            </Grid>
        </Fragment >
    )
}
