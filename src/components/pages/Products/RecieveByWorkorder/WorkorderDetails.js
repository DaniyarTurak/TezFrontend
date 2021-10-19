
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
import InputBase from '@material-ui/core/InputBase';
import Alert from "react-s-alert";
import Checkbox from '@material-ui/core/Checkbox';
import Moment from "moment";
import Breadcrumb from "../../../Breadcrumb";
import LinearProgress from '@material-ui/core/LinearProgress';
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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

const GreenCheckbox = withStyles({
    root: {
        color: 'green',
        '&$checked': {
            color: 'green',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const WhiteCheckbox = withStyles({
    root: {
        color: 'white',
        '&$checked': {
            color: 'white',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

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

export default function WorkorderDetails({
    workorderId,
    setWorkorderId,
    onlyView,
    setOnlyView,
    setActivePage
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setLoading] = useState(false);
    const [workorderProducts, setWorkorderProducts] = useState([]);
    const [info, setInfo] = useState(null);

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
            getWorkorderProducts()
        }
    }, [workorderId]);

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
                if (!onlyView) {
                    let temp = [];
                    products.forEach(el => {
                        temp.push({ ...el, isChecked: false, w_units: el.units, units: el.units })
                    });
                    setWorkorderProducts(temp);
                }
                else {
                    setWorkorderProducts(products);
                }
                setLoading(false);

            })
            .catch((err) => {
                setLoading(false);
                console.log(err)
            });
    };

    const unitsChange = (value, idx) => {
        setWorkorderProducts(prevState => {
            let obj = prevState[idx];
            obj.units = value;
            return [...prevState];
        });
    };

    const checkChange = (e, idx) => {
        let temp;
        setWorkorderProducts(prevState => {
            let obj = prevState[idx];
            temp = prevState[idx];
            obj.isChecked = e.target.checked;
            return [...prevState];
        });
        if (e.target.checked === true) {
            Axios.post("/api/workorder/details/update/units",
                { workorder_id: workorderId, products: [{ id: temp.product, units: temp.units }] })
                .then((res) => res.data)
                .then((res) => {
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
        }
    };

    const checkAll = (e) => {
        setLoading(true);
        let temp = [];
        workorderProducts.forEach(el => {
            temp.push({ ...el, isChecked: e.target.checked })
        });
        setWorkorderProducts(temp);
        if (e.target.checked === true) {
            let sendProds = [];
            temp.forEach(el => {
                sendProds.push({ id: el.product, units: el.units })
            });
            Axios.post("/api/workorder/details/update/units",
                { workorder_id: workorderId, products: sendProds })
                .then((res) => res.data)
                .then((res) => {
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
        }
        setLoading(false);
    };

    const nextPage = () => {
        let flag = true;
        workorderProducts.forEach(el => {
            if (el.isChecked === false) {
                flag = false;
            }
        });

        if (flag) {
            setActivePage(3)
        }
        else {
            Alert.warning(`Для продолжения выберите все товары`, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
            });
        }
    };

    const workOrderToExcel = () => {
        setLoading(true);
        Axios({
            method: "POST",
            url: "/api/workorder/receivingtoexcel",
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
            <Grid
                container
                spacing={1}
            >
                <Grid item xs={10} style={{ paddingBottom: "0px" }}>
                    <Breadcrumb content={[
                        { caption: "Управление товарами" },
                        { caption: "Прием товара по заказ-наряду" },
                        { caption: "Список заказ-нарядов", },
                        { caption: onlyView ? "Просмотр заказ-наряда" : "Прием заказ-наряда", active: true },
                    ]} />
                </Grid>
                <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={() => {
                        setWorkorderId(""); setOnlyView(false);
                        setActivePage(1)
                    }}>
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
                                <b>{Moment(info.date).format("DD.MM.YYYY HH:mm:ss")}</b>
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
                                            {!onlyView &&
                                                <StyledTableCell align="center">
                                                    <WhiteCheckbox
                                                        disabled={isLoading}
                                                        color="default"
                                                        onChange={(e) => checkAll(e)}
                                                    />
                                                </StyledTableCell>}
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
                                                        {!onlyView ? product.w_units : product.units}
                                                    </StyledTableCell>
                                                    {!onlyView &&
                                                        <StyledTableCell align="center">
                                                            {product.isChecked ? product.units :
                                                                <UnitsInput
                                                                    variant="outlined"
                                                                    value={product.units}
                                                                    onChange={(e) => unitsChange(e.target.value, idx)}
                                                                />}
                                                        </StyledTableCell>}
                                                    {!onlyView &&
                                                        <StyledTableCell align="center">
                                                            <GreenCheckbox
                                                                disabled={isLoading}
                                                                checked={product.isChecked}
                                                                onChange={(e) => checkChange(e, idx)}
                                                            />
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
                                    onClick={nextPage}
                                    disabled={isLoading}
                                >
                                    Далее
                                </button>
                            </Grid>}
                    </Fragment>}
            </Grid >
        </Fragment >
    )
}