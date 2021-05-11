import React, { Fragment, useState, useEffect } from "react";
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
import NonAlert from "../../Reports/ReconciliationPage/NonAlert";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TableSkeleton from "../../../Skeletons/TableSkeleton";
Moment.locale("ru");

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const MyCheckbox = withStyles({
    root: {
        color: "#17a2b8",
        '&$checked': {
            color: "#17a2b8",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

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

export default function CompareTable({ products, none }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [prods, setProds] = useState([]);
    const [showDiff, setShowDiff] = useState(false);
    const [allProds, setAllProds] = useState([]);
    const [withDiff, setWithDiff] = useState([]);

    useEffect(() => {
        let all = [];
        let onlyDiff = [];

        products.forEach((product, i) => {
            all.push({ ...product, n: i + 1, difference: product.stock_units + product.sale_units - product.tsd_units });
        });
        setAllProds(all);
        let n = 0;
        all.forEach((element, i) => {
            if (element.difference !== 0) {
                n = n + 1
                onlyDiff.push({ ...element, n: n })
            }
        });
        setWithDiff(onlyDiff);
        setProds(all);
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
    };

    const filtering = (event) => {
        setShowDiff(event.target.checked);
        if (event.target.checked) {
            setProds(withDiff);
        }
        else {
            setProds(allProds);
        }
    };

    return (
        < Fragment >
            { prods.length === 0 &&
                <TableSkeleton />
            }
            { prods.length > 0 &&
                <Fragment>
                    {none.length > 0 &&
                        <NonAlert products={none} />
                    }
                    < Grid item xs={12}>
                        <FormControlLabel
                            control={<MyCheckbox checked={showDiff} onChange={filtering} name="checkedG" />}
                            label="Показать только товары с расхождением"
                        />
                    </Grid>
                    < Grid item xs={12} style={{ paddingTop: "15px" }} >
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
                                            Текущий остаток на складе
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Продано во время сверки
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Данные из ТСД
                                        </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Разница
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prods
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((prod, idx) => (
                                            <TableRow key={idx}>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.n}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.code}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.name}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.stock_units}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.sale_units}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.tsd_units}</StyledTableCell>
                                                <StyledTableCell
                                                    style={{ color: (prod.difference) !== 0 ? "black" : "#bbc0c4" }}
                                                    align="center">{prod.difference}</StyledTableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={prods.length}
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
                </Fragment >
            }
        </Fragment >
    );
}
