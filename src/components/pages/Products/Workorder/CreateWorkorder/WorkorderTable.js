
import React, { useState, Fragment, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from '@material-ui/core/InputBase';
import SaveIcon from '@material-ui/icons/Save';
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
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

    const [isLoading, setLoading] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);
    const [counterparties, setCounterparties] = useState([]);

    useEffect(() => {
        getCounterparties();
    }, [workorderProducts])

    const getCounterparties = () => {
        Axios.get("/api/workorder/cpsinworkorder", { params: { workorderId } })
            .then((res) => res.data)
            .then((cps) => {
                setCounterparties(cps);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const unitsChange = (value, idx) => {
        setWorkorderProducts(prevState => {
            let obj = prevState[idx];
            if (value === "" || value === "0" || Number(value)) {
                obj.units = value;
            }
            return [...prevState];
        });
    };

    const updateProduct = (product) => {
        setLoading(true);
        Axios.post("/api/workorder/details/update", {
            units: !product.units || product.units === "" ? 0 : product.units,
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
                getCounterparties();
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
                            // showCancel
                            // confirmBtnText={"Закрыть"}
                            // cancelBtnText={"Выгрузить в Excel"}
                            confirmBtnBsStyle="default"
                            cancelBtnBsStyle="success"
                            title={""}
                            allowEscape={false}
                            closeOnClickOutside={false}
                            onConfirm={() => clearOptions()}
                        // onCancel={workOrderToExcel}
                        >
                            Наряд-заказ успешно создан
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
                link.setAttribute("download", `Наряд-заказ.xlsx`);
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
                        В наряд-заказе пока нет товаров
                    </Grid>
                }
                {workorderProducts.length > 0 && !isLoading &&
                    <Fragment>
                        <Grid item xs={12}>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px -1px 1px 1px white" }}
                            >
                                <Table>
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
                                                Цена (тг.)
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Сумма (тг.)
                                            </StyledTableCell>
                                            {!onlyView && <StyledTableCell />}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {counterparties
                                            .map((cp, id) => (
                                                <Fragment key={id}>
                                                    <TableRow >
                                                        <StyledTableCell colSpan={!onlyView ? 6 : 5} align="center">
                                                            <b>{cp.name}</b>
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    {workorderProducts
                                                        .map((product, idx) => (
                                                            <Fragment key={idx}>
                                                                {cp.counterparty === product.counterparty &&
                                                                    <TableRow>
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
                                                                            {product.purchaseprice}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            {product.units * product.purchaseprice}
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
                                                                }
                                                            </Fragment>
                                                        ))}
                                                </Fragment>
                                            ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow style={{ fontWeight: "bold" }}>
                                            <StyledTableCell>Итого:</StyledTableCell>
                                            <StyledTableCell />
                                            <StyledTableCell />
                                            <StyledTableCell
                                                align="center"
                                            >
                                                {workorderProducts
                                                    .reduce((prev, cur) => {
                                                        return prev + parseFloat(cur.purchaseprice);
                                                    }, 0)
                                                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {workorderProducts
                                                    .reduce((prev, cur) => {
                                                        return prev + parseFloat(cur.purchaseprice*cur.units);
                                                    }, 0)
                                                    .toLocaleString("ru", { minimumFractionDigits: 2 })}
                                            </StyledTableCell>
                                            <StyledTableCell colSpan={4} />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Fragment>}
                {!onlyView && workorderProducts.length !== 0 &&
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <button
                            className="btn btn-success"
                            onClick={saveWorkorder}
                            disabled={isLoading}
                        >
                            Отправить наряд-заказ
                        </button>
                    </Grid>
                }
            </Grid>
        </Fragment>
    )
};