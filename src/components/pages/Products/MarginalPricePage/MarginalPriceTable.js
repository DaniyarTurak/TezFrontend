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
import InputBase from '@material-ui/core/InputBase';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const PriceInput = withStyles((theme) => ({
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

export default function MarginalPriceTable({ products, save, getProducts, makeDisabled, makeEnabled, selectState }) {

    const [productsWithPrice, setProductsWithPrice] = useState(products);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isChanged, setChanged] = useState(false);
    const [isSending, setSending] = useState(false);

    useEffect(() => {
        saveChanges();
    }, [save]);

    useEffect(() => {
        setProductsWithPrice(products);
    }, [products]);


    const saveChanges = () => {
        let changedProducts = [];
        if (isChanged) {
            setSending(true);
            productsWithPrice.forEach(element => {
                if (element.ischangedprice) {
                    changedProducts.push({ product: element.id, price: element.staticprice });
                }
            });
            let changes = changedProducts;
            Axios.post("/api/invoice/changestaticprice", {
                changes,
            })
                .then((result) => result.data)
                .then((result) => {
                    Alert.success("Изменения успешно сохранены", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    getProducts();
                    setSending(false);
                    makeEnabled();
                })
                .catch((err) => {
                    ErrorAlert(err);
                    setSending(false);
                });
        };
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const editStaticPrice = (idx) => {
        setProductsWithPrice(prevState => {
            let obj = prevState[idx];
            obj.ischangedprice = !obj.ischangedprice;
            return [...prevState];

        })
        checkState();
    };

    const staticPriceChange = (value, idx) => {
        setChanged(true);
        makeDisabled();
        setProductsWithPrice(prevState => {
            let obj = prevState[idx - 1];
            obj.staticprice = value;
            return [...prevState];
        });
    };

    const checkState = () => {
        let state = false;
        productsWithPrice.forEach(element => {
            if (element.ischangedprice) {
                state = true;
            }
        });
        selectState(state);
    };

    const staticPriceDelete = (product) => {
        setSending(true);
        Axios.post("/api/products/staticprice/deleteprod", {
            product: product.id,
        })
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Товар успешно удалён", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                getProducts();
                setSending(false);
                makeEnabled();
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
                    Alert.error("Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже", {
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
                <TableContainer component={Paper} style={{ boxShadow: "0px -1px 1px 1px white" }}>
                    <Table id="table-to-xls">
                        <TableHead >
                            <TableRow style={{ fontWeight: "bold" }} >
                                <StyledTableCell rowSpan="2" align="center" />
                                <StyledTableCell rowSpan="2" align="center">
                                    Наименование товара
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Штрих-код
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Текущая цена продажи
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                    Предельная цена
                                </StyledTableCell>
                                <StyledTableCell rowSpan="2" align="center">
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productsWithPrice
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((product, idx) => (
                                    <TableRow key={idx}>
                                        <StyledTableCell>{product.indx}</StyledTableCell>
                                        <StyledTableCell>{product.name}</StyledTableCell>
                                        <StyledTableCell>{product.code}</StyledTableCell>
                                        <StyledTableCell align="center">{product.price} тг.</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {product.ischangedprice === true ?
                                                <PriceInput
                                                    variant="outlined"
                                                    autoFocus={true}
                                                    value={product.staticprice}
                                                    onChange={(e) => staticPriceChange(e.target.value, product.indx)}
                                                /> : product.staticprice + " тг."
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                disabled={isSending}
                                                onClick={() => {
                                                    editStaticPrice(product.indx - 1);
                                                }}>
                                                {!product.ischangedprice &&
                                                    <EditIcon
                                                        fontSize="small"
                                                        title="Изменить цену"
                                                    />
                                                }
                                                {product.ischangedprice &&
                                                    <DoneIcon
                                                        fontSize="small"
                                                        title="Зафиксировать"
                                                    />
                                                }
                                            </IconButton>
                                            <IconButton
                                                disabled={isSending}
                                                onClick={() => { staticPriceDelete(product); }}
                                            >
                                                <DeleteIcon
                                                    fontSize="small"
                                                    title="Удалить"
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
            </Grid>
        </Fragment>
    );
}
