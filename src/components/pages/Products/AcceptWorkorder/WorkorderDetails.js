
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from '@material-ui/core/InputBase';
import Alert from "react-s-alert";
import Breadcrumb from "../../../Breadcrumb";
import LinearProgress from '@material-ui/core/LinearProgress';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';

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

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "650px",
        maxHeight: "700px",
        overlfow: "scroll",
        zIndex: 11,
    },
    overlay: { zIndex: 10 },
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

export default function WorkorderDetails({
    onlyView,
    setOnlyView,
    setActivePage,
    workorderId,
    setWorkorderId,
    getWorkorders
}) {

    const [isLoading, setLoading] = useState(false);
    const [workorderProducts, setWorkorderProducts] = useState([]);
    const [sweetalert, setSweetAlert] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [counterparties, setCounterparties] = useState([]);
    const [workorders, setWorkorders] = useState([]);

    useEffect(() => {
        getIds();
        getWorkorderProducts();
        getCounterparties();
    }, []);

    const getIds = () => {
        Axios.get("/api/workorder/ids", { params: { workorderId } })
            .then((res) => res.data)
            .then((list) => {
                setWorkorders(list);
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

    const getWorkorderProducts = () => {
        setLoading(true);
        let path = "";
        if (workorderId && workorderId !== "") {
            path = "/api/workorder/details"
        }
        else {
            path = "/api/workorder/details/grouped"
        }
        Axios.get(path, { params: { workorderId } })
            .then((res) => res.data)
            .then((list) => {
                let temp = [];
                list.forEach(el => {
                    temp.push({ ...el, temp_accepted_units: el.accepted_units })
                });
                setWorkorderProducts(temp)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

    const getCounterparties = () => {
        Axios.get("/api/workorder/cpsinworkorder", { params: { onlyView, workorderId: workorderId !== "" ? workorderId : null } })
            .then((res) => res.data)
            .then((cps) => {
                setCounterparties(cps);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const unitsChange = (value, idx) => {
        setProductDetails(prevState => {
            let obj = prevState[idx];
            console.log(value);
            if (value === "" || value === "0" || Number(value)) {
                obj.accepted_units = value;
            }
            return [...prevState];
        });

    };

    useEffect(() => {
        if (productDetails.length > 0) {
            setSweetAlert(
                <Modal
                    isOpen={true}
                    style={customStyles}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ textAlign: "center" }}>
                            <b> {productDetails[0].code} | {productDetails[0].name} </b>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "right" }}>
                            <button className="btn btn-link btn-sm" onClick={() => { setSweetAlert(null) }}>
                                Назад
                            </button>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px -1px 1px 1px white" }}
                            >
                                <Table id="table-to-xls">
                                    <TableHead>
                                        <TableRow style={{ fontWeight: "bold" }} >
                                            <StyledTableCell align="center">
                                                Торговая точка
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Количество в заказ-наряде
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Принятое количество
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productDetails
                                            .map((product, idx) => (
                                                <TableRow key={idx}>
                                                    <StyledTableCell align='center'>
                                                        {product.point_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        {product.units}
                                                    </StyledTableCell>
                                                    <StyledTableCell align='center'>
                                                        <UnitsInput
                                                            variant="outlined"
                                                            value={product.accepted_units || ""}
                                                            onChange={(e) => unitsChange(e.target.value, idx)}
                                                        />
                                                    </StyledTableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <button
                                    className="btn btn-success"
                                    onClick={saveChanges}
                                    disabled={isLoading}
                                >
                                    Сохранить изменения
                                </button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Modal>)
        }
    }, [productDetails])

    const getProductDetails = (product) => {
        console.log(product);
        setLoading(false);
        Axios.get("/api/workorder/details/product", { params: { product } })
            .then((res) => res.data)
            .then((products) => {
                console.log(products);
                let temp = [];
                products.forEach(el => {
                    temp.push({ ...el, w_units: el.units })
                });
                setProductDetails(temp);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err)
            });
    };

    const saveChanges = () => {
        setLoading(true);
        let temp = [];
        productDetails.forEach(el => {
            if (Number(el.accepted_units) !== Number(el.temp_accepted_units)) {
                temp.push(el);
            }
        });
        console.log(temp);
        if (temp.length > 0) {
            let workorders = [];
            temp.forEach(el => {
                workorders.push(el.workorder_id)
            });
            let uniqueWorkorders = [...new Set(workorders)];
            let sendData = [];
            if (uniqueWorkorders.length > 0) {
                uniqueWorkorders.forEach(wd => {
                    let products = [];
                    productDetails.forEach(prod => {
                        if (wd === prod.workorder_id) {
                            products.push({ id: prod.product, units: prod.accepted_units })
                        }
                    });
                    sendData.push({ workorder_id: wd, products });
                });
            };
            console.log(sendData);
            Axios.post("/api/workorder/details/update/units", { sendData })
                .then((res) => res.data)
                .then((res) => {
                    setLoading(false);
                    setSweetAlert(null);
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
        };
    };

    const acceptWorkorders = () => {
        console.log(workorderProducts);
        let flag = false;
        workorderProducts.forEach(element => {
            if (!element.accepted_units || element.accepted_units === "") {
                flag = true;
            }
        });
        if (flag) {
            Alert.warning("Необходимо установить все цены!", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            Axios.post("/api/workorder/update/status", { workorders })
                .then((res) => res.data)
                .then((res) => {
                    console.log(res);
                    getWorkorders();
                    setActivePage(1);
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
    }

    return (
        <Fragment>
            {sweetalert}
            <Grid
                container
                spacing={1}
            >
                <Grid item xs={10} style={{ paddingBottom: "0px" }}>
                    <Breadcrumb content={[
                        { caption: "Управление товарами" },
                        { caption: "Обработка заказ-нарядов" },
                        { caption: "Список заказ-нарядов", },
                        { caption: onlyView ? "Просмотр заказ-наряда" : "Прием заказ-наряда", active: true },
                    ]} />
                </Grid>
                <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={() => {
                        setOnlyView(false);
                        setWorkorderId(null);
                        setActivePage(1)
                    }}>
                        Назад
                    </button>
                </Grid>
                {isLoading &&
                    <Grid item xs={12}>
                        <BorderLinearProgress />
                    </Grid>
                }
                {workorderProducts.length === 0 && !isLoading &&
                    <Grid item xs={12} style={{ textAlign: "center", color: '#6c757d' }}>
                        В заказ-наряде пока нет товаров
                    </Grid>}
                {!isLoading && workorderProducts.length > 0 &&
                    <Fragment>
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
                                                {!onlyView ? "Количество в заказ-наряде" : "Количество"}
                                            </StyledTableCell>
                                            {!onlyView &&
                                                <StyledTableCell align="center">
                                                    Принятое количество
                                                </StyledTableCell>}
                                            <StyledTableCell>
                                                Цена (тг.)
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                Сумма (тг.)
                                            </StyledTableCell>
                                            {!onlyView &&
                                                <StyledTableCell align="right">
                                                </StyledTableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {counterparties
                                            .map((cp, id) => (
                                                <Fragment key={id}>
                                                    <TableRow >
                                                        <StyledTableCell colSpan={7} align="center">
                                                            <b>{cp.name}</b>
                                                        </StyledTableCell>
                                                    </TableRow>
                                                    {workorderProducts
                                                        .map((product, idx) => (
                                                            <Fragment key={idx}>
                                                                {
                                                                    product.counterparty === cp.counterparty && <TableRow key={idx}>
                                                                        <StyledTableCell>
                                                                            {product.code}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {product.name}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">
                                                                            {product.units}
                                                                        </StyledTableCell>
                                                                        {!onlyView &&
                                                                            <StyledTableCell align="center">
                                                                                {product.accepted_units ? product.accepted_units :
                                                                                    <span style={{ color: "gray" }}> Укажите количество </span>
                                                                                }
                                                                            </StyledTableCell>}
                                                                        <StyledTableCell>
                                                                            {product.purchaseprice}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {!onlyView ? product.purchaseprice * product.accepted_units :
                                                                                product.purchaseprice * product.units
                                                                            }
                                                                        </StyledTableCell>
                                                                        {!onlyView &&
                                                                            <StyledTableCell align="right">
                                                                                <IconButton onClick={() => getProductDetails(product.product)}>
                                                                                    <EditIcon size="small" />
                                                                                </IconButton>
                                                                            </StyledTableCell>}
                                                                    </TableRow>
                                                                }
                                                            </Fragment>
                                                        ))}
                                                </Fragment>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        {workorderProducts.length !== 0 &&
                            <Grid item xs={6} style={{ textAlign: 'left' }}>
                                <ReactHTMLTableToExcel
                                    className="btn btn-sm btn-outline-success"
                                    table="table-to-xls"
                                    filename={`Заказа-наряд`}
                                    sheet="tablexls"
                                    buttonText="Выгрузить в Excel"
                                />
                            </Grid>}
                        {!onlyView &&
                            <Grid item xs={6} style={{ textAlign: 'right' }}>
                                <button
                                    className="btn btn-success"
                                    onClick={acceptWorkorders}
                                    disabled={isLoading}
                                >
                                    Завершить обработку
                                </button>
                            </Grid>}
                    </Fragment>}
            </Grid >
        </Fragment >
    )
};