
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
import InputBase from '@material-ui/core/InputBase';
import SaveIcon from '@material-ui/icons/Save';
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
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

export default function WorkorderTable({
    workorderId,
    workorderProducts,
    setWorkorderProducts,
    getWorkorderProducts,
    clearOptions,
    onlyView
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

    const unitsChange = (value, idx) => {
        setWorkorderProducts(prevState => {
            let obj = prevState[idx];
            obj.units = value;
            return [...prevState];
        });
    };

    const priceChange = (value, idx) => {
        setWorkorderProducts(prevState => {
            let obj = prevState[idx];
            obj.price = value;
            return [...prevState];
        });
    };

    const updateProduct = (product) => {
        setLoading(true);
        Axios.post("/api/workorder/details/update", {
            units: product.units,
            product: product.product,
            workorder_id: product.workorder_id,
            attributes: product.attributes
        })
            .then((res) => res.data)
            .then((res) => {
                setLoading(false);
                getWorkorderProducts();
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
    }

    const deleteProduct = (product) => {
        setLoading(true);
        Axios.post("/api/workorder/details/delete", {
            product: product.product,
            workorder_id: product.workorder_id,
            attributes: product.attributes
        })
            .then((res) => res.data)
            .then((res) => {
                getWorkorderProducts();
                setLoading(false);
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

    const saveWorkorder = () => {
        setLoading(true);
        Axios.post("/api/workorder/manage", {
            workorder_id: workorderId,
            status: 'CREATED'
        })
            .then((res) => res.data)
            .then((res) => {
                if (res[0].workorder_management.code === 'success') {
                    setSweetAlert(
                        <SweetAlert
                            success
                            showCancel
                            confirmBtnText={"Закрыть"}
                            cancelBtnText={"Выгрузить в Excel"}
                            confirmBtnBsStyle="default"
                            cancelBtnBsStyle="success"
                            title={""}
                            allowEscape={false}
                            closeOnClickOutside={false}
                            onConfirm={() => clearOptions()}
                            onCancel={workOrderToExcel}
                        >
                            Заказ-наряд успешно создан
                        </SweetAlert>)
                    setLoading(false);
                }
                else {
                    Alert.error(res[0].workorder_management.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);
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

    const workOrderToExcel = () => {
        setLoading(true);
        Axios({
            method: "POST",
            url: "/api/workorder/createdtoexcel",
            data: { workorderProducts },
            responseType: "blob",
        })
            .then((res) => res.data)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Заказ-наряд.xlsx`);
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
                {workorderProducts.length === 0 && !isLoading &&
                    <Grid item xs={12} style={{ textAlign: "center", color: '#6c757d' }}>
                        В заказ-наряде пока нет товаров
                    </Grid>
                }
                {workorderProducts.length > 0 && !isLoading && <Fragment>
                    <Grid item xs={12}>
                        <TableContainer
                            component={Paper}
                            style={{ boxShadow: "0px -1px 1px 1px white" }}
                        >
                            <Table id="table-to-xls">
                                <TableHead>
                                    <TableRow style={{ fontWeight: "bold" }} >
                                        <StyledTableCell align="center">
                                            Штрих-код
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Наименование
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Количество
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            Цена закупки
                                        </StyledTableCell>
                                        {!onlyView && <StyledTableCell />}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {workorderProducts
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((product, idx) => (
                                            <TableRow key={idx}>
                                                <StyledTableCell>
                                                    {product.code}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {product.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {!onlyView ? <UnitsInput
                                                        variant="outlined"
                                                        value={product.units}
                                                        onChange={(e) => unitsChange(e.target.value, idx)}
                                                    /> : product.units
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {product.purchaseprice} тг.
                                                </StyledTableCell>
                                                {!onlyView && <StyledTableCell align="right">
                                                    {product.units.toString() !== product.temp_units.toString() &&
                                                        <IconButton
                                                            size="small"
                                                            disabled={isLoading}
                                                            onClick={() => {
                                                                updateProduct(product);
                                                            }}>
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton>}
                                                    <IconButton
                                                        size="small"
                                                        disabled={isLoading}
                                                        onClick={() => {
                                                            deleteProduct(product);
                                                        }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </StyledTableCell>}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={workorderProducts.length}
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
                </Fragment>}
                {workorderProducts.length !== 0 &&
                    <Grid item xs={12} style={{ paddingTop: "10px" }}>
                        <button
                            className="btn btn-sm btn-outline-success"
                            onClick={workOrderToExcel}
                        >
                            Выгрузить в Excel
                        </button>
                    </Grid>}
                {!onlyView && workorderProducts.length !== 0 &&
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <button
                            className="btn btn-success"
                            onClick={saveWorkorder}
                            disabled={isLoading}
                        >
                            Сохранить заказ-наряд
                        </button>
                    </Grid>
                }
            </Grid>
        </Fragment>
    )
};