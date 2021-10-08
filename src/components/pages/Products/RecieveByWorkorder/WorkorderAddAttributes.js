
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
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "moment";
import Breadcrumb from "../../../Breadcrumb";
import Modal from 'react-modal';
import AttributeWindow from "./AttributeWindow";
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

export default function WorkorderAddAttributes({
    workorderId,
    setWorkorderId,
    setActivePage
}) {

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            minHeight: "400px",
            maxWidth: "700px",
            maxHeight: "700px",
            overlfow: "scroll",
            zIndex: 11,
        },
        overlay: { zIndex: 10 },
    };


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setLoading] = useState(false);
    const [workorderProducts, setWorkorderProducts] = useState([]);
    const [info, setInfo] = useState(null);
    const [sweetalert, setSweetAlert] = useState(null);
    const [modalWindow, setModalWindow] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (workorderId !== "") {
            getInfo();
            getWorkorderProducts();
        }
    }, [workorderId]);

    useEffect(() => {
        if (modalWindow === null) {
            getWorkorderProducts();
        }
    }, [modalWindow]);

    const getInfo = () => {
        Axios.get("/api/workorder/info", { params: { workorder_id: workorderId } })
            .then((res) => res.data)
            .then((info) => {
                setInfo(info[0])
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getWorkorderProducts = () => {
        setLoading(true);
        Axios.get("/api/workorder/details", { params: { workorder_id: workorderId } })
            .then((res) => res.data)
            .then((products) => {
                let prods = [];
                products.forEach(product => {
                    if (product.attr_json.length > 0) {
                        let temp = [];
                        product.attr_json.forEach(attr => {
                            temp.push(JSON.parse(attr));
                        });
                        product.attr_json = temp;
                    }
                    prods.push(product);
                });
                setWorkorderProducts(prods);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const showModal = (product) => {
        setModalWindow(
            <Modal
                isOpen={true}
                style={customStyles}
            >
                <AttributeWindow
                    product={product}
                    setModalWindow={setModalWindow}
                    workorderId={workorderId}
                />
            </Modal>
        )
    };

    const receiveWorkorder = () => {
        setLoading(true);
        Axios.post("/api/workorder/invoice", { workorder_id: workorderId })
            .then((res) => res.data)
            .then((res) => {
                console.log(res);
                setSweetAlert(
                    <SweetAlert
                        success
                        showCancel
                        confirmBtnText={"Закрыть"}
                        cancelBtnText={"Выгрузить в Excel"}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="success"
                        title={""}
                        allowEscape={false}
                        closeOnClickOutside={false}
                        onConfirm={() => { setWorkorderId(""); setLoading(false); setSweetAlert(null); setActivePage(1) }}
                        onCancel={() => { setWorkorderId(""); setLoading(false); setSweetAlert(null); setActivePage(1) }}
                    >
                        Товары по заказ-наряду успешно приняты на склад
                    </SweetAlert>);
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

    const changeStatus = () => {
        Axios.post("/api/workorder/manage", {
            workorder_id: workorderId,
            status: 'ACCEPTED'
        })
            .then((res) => res.data)
            .then((res) => {
                console.log(res);
                receiveWorkorder();
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            });
    };

    return (
        <Fragment>
            {sweetalert}
            {modalWindow}
            <Grid
                container
                spacing={1}
            >
                <Grid item xs={10} style={{ paddingBottom: "0px" }}>
                    <Breadcrumb content={[
                        { caption: "Управление товарами" },
                        { caption: "Прием товара по заказ-наряду" },
                        { caption: "Список заказ-нарядов", },
                        { caption: "Просмотр заказ-наряда", },
                        { caption: "Добавление атрибутов", active: true },
                    ]} />
                </Grid>
                <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={() => { setActivePage(2) }}>
                        Назад
                    </button>
                </Grid>
                {info &&
                    <Fragment>
                        <Grid item xs={2}>
                            <span style={{ color: "gray" }}>
                                Заказ-наряд № <br />
                                Контрагент <br />
                                Торовая точка <br />
                                Пользователь <br />
                                Дата создания
                            </span>
                        </Grid>
                        <Grid item xs={10}>
                            <span style={{ color: "gray" }}>
                                <b>{info.workorder_number}</b><br />
                                <b>{info.counterparty + " (" + info.bin + ")"}</b><br />
                                <b>{info.point}</b> <br />
                                <b>{info.username}</b><br />
                                <b>{Moment(info.date).format("MM.DD.YYYY HH:mm:ss")}</b>
                            </span>
                        </Grid>

                    </Fragment>
                }
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
                {workorderProducts.length > 0 && !isLoading &&
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
                                                Количество
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Атрибуты
                                            </StyledTableCell>
                                            <StyledTableCell align="center" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workorderProducts
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((product, idx) => (
                                                <TableRow key={idx}>
                                                    <StyledTableCell align="center">
                                                        {product.code}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {product.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {product.units}
                                                    </StyledTableCell>
                                                    <StyledTableCell align={product.attributes !== "0" ? 'left' : 'center'}>
                                                        {product.attributes === "0" ? "Нет атрибутов" :
                                                            product.attr_json.map((attr, idx) => (
                                                                <span key={idx}>{attr.name + ": " + attr.value + " "}<br /> </span>
                                                            ))}

                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <button className="btn btn-link btn-sm" onClick={() => showModal(product)}>
                                                            {product.attributes === "0" ? "Добавить атрибуты" : "Изменить атрибуты"}
                                                        </button>
                                                    </StyledTableCell>
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
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <button
                                className="btn btn-success"
                                onClick={changeStatus}>
                                ПРИНЯТЬ ТОВАРЫ НА СКЛАД
                            </button>
                        </Grid>
                    </Fragment>}
            </Grid>
        </Fragment>
    )
}