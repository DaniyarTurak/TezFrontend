import React, { useState, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from "@material-ui/core/IconButton";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import PropTypes from "prop-types";
import Moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ForwardIcon from '@material-ui/icons/Forward';

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


export default function ActiveRevisionTable({
    revisionList,
    setRevisionList,
    deleteRevision,
    setSweetAlert,
    continueRevision
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

    return (
        <Fragment>
            <TableContainer
                component={Paper}
                style={{ boxShadow: "0px -1px 1px 1px white" }}
            >
                <Table id="table-to-xls">
                    <TableHead>
                        <TableRow style={{ fontWeight: "bold" }} >
                            <StyledTableCell align="center">
                                Номер ревизии
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Торговая точка
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Тип
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Дата начала
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                Администратор
                            </StyledTableCell>
                            <StyledTableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {revisionList
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((rev, idx) => (
                                <TableRow key={idx}>
                                    <StyledTableCell align="center">
                                        {rev.revisionnumber}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {rev.point_name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {rev.type === 2 ? `По бренду (${rev.type_name})` : rev.type === 3 ? `По категории (${rev.type_name})` : "По всем товарам"}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {Moment(rev.createdate).format("DD.MM.YYYY HH:mm:ss")}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {rev.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton size="small" onClick={() => continueRevision(rev)} title="Продолжить ревизию">
                                            <ForwardIcon  style={{color: "#28a745"}} />
                                        </IconButton>
                                        &emsp;
                                        <IconButton size="small"
                                            onClick={() => {
                                                setSweetAlert(
                                                    <SweetAlert
                                                        warning
                                                        showCancel
                                                        confirmBtnText={"Удалить"}
                                                        cancelBtnText={"Отмена"}
                                                        confirmBtnBsStyle="success"
                                                        cancelBtnBsStyle="danger"
                                                        title={"Внимание"}
                                                        allowEscape={false}
                                                        closeOnClickOutside={false}
                                                        onConfirm={() => deleteRevision(rev.revisionnumber)}
                                                        onCancel={() => setSweetAlert(null)}
                                                    >
                                                        Вы действительно хотите удалить ревизию?
                                                    </SweetAlert>)
                                            }}
                                            title="Удалить ревизию"
                                            >
                                            <DeleteIcon fontSize="small" style={{color: "#dc3545"}}/>
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
                count={revisionList.length}
                backIconButtonText="Предыдущая страница"
                labelRowsPerPage="Строк в странице"
                nextIconButtonText="Следующая страница"
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        </Fragment>
    )
};
