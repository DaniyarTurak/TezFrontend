import React, { Fragment, useState, useEffect } from "react";
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
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import InputBase from '@material-ui/core/InputBase';
import Axios from "axios";
import Alert from "react-s-alert";
import TableSkeleton from '../../Skeletons/TableSkeleton';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const UnitsInput = withStyles((theme) => ({
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '150px',
        padding: '5px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderColor: "#17a2b8",
        },
    },
}))(InputBase);

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

export default function StockMonitoringTable({ products, getMinimalStock }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [prods, setProds] = useState([]);
    const [pagEnabled, setPagEnabled] = useState(true);
    const [isSending, setSending] = useState(false);

    useEffect(() => {
        if (products && products.length !== 0) {
            let arr = [];
            products.forEach((element, i) => {
                arr.push({ ...element, indx: i + 1, editing: false, temp_units: element.units })
            });
            setProds(arr);
        }
    }, [products]
    );

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

    const editMinCount = (idx) => {
        setProds(prevState => {
            let obj = prevState[idx];
            obj.editing = !obj.editing;
            return [...prevState];
        })
        checkState();
    };

    const unitsChange = (value, idx) => {
        setProds(prevState => {
            let obj = prevState[idx - 1];
            obj.temp_units = value;
            return [...prevState];
        });
    };

    const cancelChanges = (idx) => {
        setProds(prevState => {
            let obj = prevState[idx];
            obj.temp_units = obj.units;
            obj.editing = false;
            return [...prevState];
        });
        checkState();
    };

    const saveUnits = (idx) => {
        let product = {};
        setProds(prevState => {
            let obj = prevState[idx];
            obj.units = obj.temp_units;
            obj.editing = false;
            product = { id: obj.id, units: obj.units };
            return [...prevState];
        });
        sendChanges(product);
        checkState();
    };

    const sendChanges = (product) => {
        setSending(true);
        Axios.post("/api/stock/stockm/update", product)
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Минимальный остаток успешно установлен", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSending(false);
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.code === "error"
                ) {
                    Alert.error(err.response.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
                else {
                    Alert.error("Возникла ошибка при обработке вашего запроса.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
            });
    };

    const checkState = () => {
        let state = true;
        prods.forEach(element => {
            if (element.editing) {
                state = false;
            }
        });
        setPagEnabled(state);
    };

    const deleteProduct = (id) => {
        setSending(true);
        Axios.post("/api/stock/stockm/delete", { id: id })
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Минимальный остаток успешно удалён", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSending(false);
                getMinimalStock();
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.code === "error"
                ) {
                    Alert.error(err.response.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
                else {
                    Alert.error("Возникла ошибка при обработке вашего запроса.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSending(false);
                }
            });
    };

    return (
        <Fragment>
            <Grid item xs={12}>
                {prods.length === 0 &&
                    <TableSkeleton />
                }
                {prods.length > 0 &&
                    <Fragment>
                        <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                            <Table id="table-to-xls">
                                <TableHead >
                                    <TableRow style={{ fontWeight: "bold" }} >
                                        <StyledTableCell rowSpan="2" />
                                        <StyledTableCell rowSpan="2">
                                            Штрих-код
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Наименование товара
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center">
                                            Минимальный остаток
                                </StyledTableCell>
                                        <StyledTableCell rowSpan="2" align="center" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prods
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((product, idx) => (
                                            <TableRow key={idx}>
                                                <StyledTableCell>{product.indx}</StyledTableCell>
                                                <StyledTableCell>{product.code}</StyledTableCell>
                                                <StyledTableCell>{product.name}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {product.editing === true ?
                                                        <UnitsInput
                                                            variant="outlined"
                                                            autoFocus={true}
                                                            value={product.temp_units}
                                                            onChange={(e) => unitsChange(e.target.value, product.indx)}
                                                        /> : product.units
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {product.editing &&
                                                        <IconButton
                                                            onClick={() => saveUnits(product.indx - 1)}
                                                            disabled={isSending}
                                                        >
                                                            <DoneIcon />
                                                        </IconButton>
                                                    }
                                                    {!product.editing &&
                                                        <IconButton onClick={() => editMinCount(product.indx - 1)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    }
                                            &emsp;
                                            {!product.editing &&
                                                        <IconButton
                                                            onClick={() => deleteProduct(product.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    }
                                                    {product.editing &&
                                                        <IconButton onClick={() => cancelChanges(product.indx - 1)}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    }
                                                </StyledTableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {pagEnabled &&
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
                        }
                    </Fragment>}
            </Grid>
        </Fragment>
    );
}
