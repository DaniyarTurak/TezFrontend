import React, { useState, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import InputBase from '@material-ui/core/InputBase';
import Axios from "axios";
import Alert from "react-s-alert";
import SaveIcon from '@material-ui/icons/Save';
import SweetAlert from "react-bootstrap-sweetalert";

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

export default function PurchasePricesList({
    priceList,
    setPriceList,
    isLoading,
    setLoading,
    getPrices,
    counterparty,
    isWholesale,
    byCounterparty,
    setBarcode,
    setProdName
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sweetAlert, setSweetAlert] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deleteProduct = (product) => {
        setLoading(true);
        Axios.post("/api/prices", {
            product: product.product,
            deleted: true,
            counterparty: counterparty.value
        })
            .then((res) => res.data)
            .then((res) => {
                getPrices();
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    };

    const purchase_priceChange = (value, pc) => {
        let idx = null;
        priceList.forEach((el, id) => {
            if (el.product === pc.product) {
                idx = id;
            }
        });
        setPriceList(prevState => {
            let obj = prevState[idx];
            obj.purchase_price = value;
            obj.sell_price = obj.rate ? value !== "" ? Number(value) * obj.rate / 100 + Number(value) : "" : obj.sell_price;
            return [...prevState];
        });
    };

    const sell_priceChange = (value, pc) => {
        let idx = null;
        priceList.forEach((el, id) => {
            if (el.product === pc.product) {
                idx = id;
            }
        });
        setPriceList(prevState => {
            let obj = prevState[idx];
            obj.sell_price = value;
            return [...prevState];
        });
    };

    const wholesale_priceChange = (value, pc) => {
        let idx = null;
        priceList.forEach((el, id) => {
            if (el.product === pc.product) {
                idx = id;
            }
        });
        setPriceList(prevState => {
            let obj = prevState[idx];
            obj.wholesale_price = value;
            return [...prevState];
        });
    };

    const savePrices = () => {
        let sell = [];
        let buy = [];
        priceList.forEach(el => {
            if (((el.purchase_price.toString() !== el.temp_purchase_price.toString())
                || (el.sell_price.toString() !== el.temp_sell_price.toString())
                || (el.wholesale_price.toString() !== el.temp_wholesale_price.toString()))) {
                sell.push(
                    {
                        id: el.product,
                        price: el.sell_price,
                        counterparty: el.counterparty,
                        wholesale_price: el.wholesale_price
                    }
                );
                buy.push({
                    id: el.product,
                    price: el.purchase_price,
                    counterparty: el.counterparty,
                })
            }
        });
        const data = {
            deleted: false,
            sell,
            buy
        };
        Axios.post("/api/prices", data)
            .then((res) => res.data)
            .then((res) => {
                setBarcode(null);
                setProdName(null);
                setSweetAlert(null);
                if (res.prices_management.code === "exception" || res.prices_management.code === "error") {
                    Alert.error(res.prices_management.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    }); 
                }
                else {
                    Alert.success("Цены успешно сохранены", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    }); 
                }
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    };

    const showConfiramtion = () => {
        setSweetAlert(
            <SweetAlert
                warning
                showCancel
                confirmBtnText={"Сохранить"}
                cancelBtnText={"Отмена"}
                confirmBtnBsStyle="success"
                cancelBtnBsStyle="default"
                title={"Внимание"}
                allowEscape={false}
                closeOnClickOutside={false}
                onConfirm={() => savePrices()}
                onCancel={() => setSweetAlert(null)}
            >
                Измененные цены будут отправлены на кассы. Сохранить изменения?
            </SweetAlert>)
    }

    return (
        <Fragment>
            {sweetAlert}
            <Grid
                container
                spacing={2}
            >
                {isLoading &&
                    <Grid item xs={12}>
                        <BorderLinearProgress />
                    </Grid>
                }
                {counterparty !== "" && priceList.length === 0 && !isLoading &&
                    <Grid item xs={12} style={{ textAlign: "center", color: '#6c757d' }}>
                        У Вас пока не установлены закупочные цены на товары
                    </Grid>
                }
                {priceList.length > 0 && !isLoading &&
                    <Grid item xs={12}>
                        <TableContainer
                            component={Paper}
                            style={{ boxShadow: "0px -1px 1px 1px white" }}
                        >
                            <Table id="table-to-xls">
                                <TableHead>
                                    <TableRow style={{ fontWeight: "bold" }} >
                                        <StyledTableCell />
                                        <StyledTableCell align="center">
                                            Штрих-код
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Наименование товара
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Закупочная цена
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Маржа
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Цена реализации
                                        </StyledTableCell>
                                        {isWholesale &&
                                            <StyledTableCell align="center">
                                                Оптовая цена реализации
                                            </StyledTableCell>}
                                        <StyledTableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {priceList
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((pc, idx) => (
                                            <TableRow key={idx} style={{
                                                backgroundColor:
                                                    ((pc.purchase_price.toString() !== pc.temp_purchase_price.toString())
                                                        || (pc.sell_price.toString() !== pc.temp_sell_price.toString())
                                                        || (pc.wholesale_price.toString() !== pc.temp_wholesale_price.toString())) ?
                                                        '#EBFFE9' : 'white'
                                            }}>
                                                <StyledTableCell align="center">
                                                    {pc.num}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {pc.code}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {pc.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <PriceInput
                                                        value={pc.purchase_price}
                                                        onChange={(e) => purchase_priceChange(e.target.value, pc)}
                                                    /> &nbsp;
                                                    тг.
                                                </StyledTableCell>
                                                <StyledTableCell align="center" >
                                                    {pc.rate ? <span> <span style={{ fontSize: 16 }}> {pc.rate}  </span> % </span> : '-'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <PriceInput
                                                        value={pc.sell_price}
                                                        onChange={(e) => sell_priceChange(e.target.value, pc)}
                                                    /> &nbsp;
                                                    тг.
                                                </StyledTableCell>
                                                {isWholesale &&
                                                    <StyledTableCell align="center">
                                                        <PriceInput
                                                            value={pc.wholesale_price}
                                                            onChange={(e) => wholesale_priceChange(e.target.value, pc)}
                                                        /> &nbsp;
                                                        тг.
                                                    </StyledTableCell>}
                                                <StyledTableCell align="center">
                                                    {/* {((pc.purchase_price.toString() !== pc.temp_purchase_price.toString())
                                                        || (pc.sell_price.toString() !== pc.temp_sell_price.toString())
                                                        || (pc.wholesale_price.toString() !== pc.temp_wholesale_price.toString()))
                                                        &&
                                                        <IconButton
                                                            size="small"
                                                            disabled={isLoading}
                                                            onClick={() => {
                                                                updatePrice(pc);
                                                            }}>
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton>} */}
                                                    {byCounterparty && <IconButton
                                                        size="small"
                                                        disabled={isLoading}
                                                        onClick={() => {
                                                            deleteProduct(pc);
                                                        }}>
                                                        <DeleteIcon fontSize="small" />
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
                            count={priceList.length}
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
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <button
                        className="btn btn-success"
                        onClick={showConfiramtion}
                    >
                        Сохранить изменения
                    </button>
                </Grid>
            </Grid>
        </Fragment >
    )
};