import React, { Fragment } from "react";
import Moment from "moment";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import "moment/locale/ru";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
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
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
//конец пагинации

export default function PeriodTable({ products, background }) {

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: background,
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
        <Fragment>
            <Grid item xs={12}>
                <TableContainer component={Paper} style={{boxShadow: "0px -1px 1px 1px white"}}>
                    <Table id="table-to-xls">
                        <TableHead >
                            <TableRow style={{ fontWeight: "bold" }} >
                                <StyledTableCell rowSpan="2">
                                    <span className="hand">
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" style={{fontWeight: "bold", color: "black"}}>
                                    <span className="hand">
                                        Штрих-код
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center" style={{fontWeight: "bold", color: "black"}}>
                                    <span className="hand">
                                        Наименование товара
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center" style={{fontWeight: "bold", color: "black"}}>
                                    <span className="hand">
                                        Количество
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center" style={{fontWeight: "bold", color: "black"}}>
                                    <span className="hand">
                                        Годен до
                                    </span>
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((product, idx) => (
                                    <TableRow key={idx}>
                                        <StyledTableCell>{idx + 1}</StyledTableCell>
                                        <StyledTableCell>
                                            {product.code}
                                        </StyledTableCell>
                                        <StyledTableCell>{product.name}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {product.units}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {product.dt}
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {products.length > rowsPerPage && (
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
                )}
            </Grid>
        </Fragment>
    );
}
