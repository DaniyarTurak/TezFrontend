
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Breadcrumb from "../../../../Breadcrumb";
import Alert from "react-s-alert";
import Modal from 'react-modal';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';


export default function WorkorderAddProducts({
    workorderId,
    point,
    setPoint,
    setCounterparty,
    getWorkorderProducts,
    setWorkorderId,
    onlyView,
    setOnlyView,
    setWorkorderProducts
}) {
    const useStylesAC = makeStyles(theme =>
        createStyles({
            root: {
                '& label.Mui-focused': {
                    color: 'gray',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: 'white',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'white',
                    },
                    '&:hover fieldset': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white',
                    },
                },
            },
        })
    );
    const classesAC = useStylesAC();

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "500px",
            maxHeight: "700px",
            overlfow: "scroll",
            zIndex: 11,
        },
        overlay: { zIndex: 10 },
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: "100%",
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }));

    const classes = useStyles();

    const [info, setInfo] = useState(null);
    const [prodName, setProdName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [units, setUnits] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [selectedProd, setSelectedProd] = useState(null);
    const [sweetalert, setSweetAlert] = useState(null);


    useEffect(() => {
        getInfo();
        getProducts();
    }, []);

    useEffect(() => {
        if (selectedProd) {
            if (!selectedProd.counterparty || selectedProd.counterparty === "0") {
                Alert.warning("Не указан контрагент", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSelectedProd(null);
            }
            else {
                if (!selectedProd.price || selectedProd.price === "0") {
                    Alert.warning("Не установлена закупочная цена", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSelectedProd(null);
                }
                else {
                    setSweetAlert(null);
                    setProdName(selectedProd.name);
                    setBarcode(selectedProd.code);
                }
            }
        }
    }, [selectedProd])

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

    const getProducts = () => {
        Axios.get("/api/products", { params: { productName: prodName, barcode: barcode } })
            .then((res) => res.data)
            .then((products) => {
                setProductList(products)
            })
            .catch((err) => {
                console.log(err);
            });
    };



    const searchProduct = () => {
        setSelectedProd(null);
        Axios.get("/api/workorder/searchproduct", { params: { productName: prodName, barcode: barcode } })
            .then((res) => res.data)
            .then((products) => {
                if (products.length === 1) {
                    setSelectedProd(products[0]);
                    setProdName(products[0].name);
                    setBarcode(products[0].code);
                }
                else {
                    setSweetAlert(
                        <Modal
                            isOpen={true}
                            style={customStyles}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Найдено несколько товаров {prodName !== "" ? `c наименованием "${prodName}"` : `со штрих-кодом "${barcode}"`}
                                </Grid>
                                <Grid item xs={4} style={{ textAlign: "center" }}>
                                    <b>Штрих-код</b>
                                </Grid>
                                <Grid item xs={6} style={{ textAlign: "center" }}>
                                    <b>Наименование</b>
                                </Grid>
                                <Grid item xs={2} />
                                <Grid item xs={12}>
                                    <hr style={{ margin: "0px" }} />
                                </Grid>
                                {products.map((product) => (
                                    <Fragment>
                                        <Grid item xs={4}>
                                            {product.code}
                                        </Grid>
                                        <Grid item xs={5}>
                                            {product.name}
                                        </Grid>
                                        <Grid item xs={3}>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => {
                                                    setSelectedProd(product);
                                                }}
                                            >
                                                Выбрать
                                            </button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <hr style={{ margin: "0px" }} />
                                        </Grid>
                                    </Fragment>

                                ))}
                                <Grid item xs={12} style={{ textAlign: "right" }}>
                                    <button
                                        className="btn btn-default"
                                        onClick={() => {
                                            setSweetAlert(null);
                                            setProdName("");
                                            setBarcode("");
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </Grid>
                            </Grid>
                        </Modal>)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addProduct = () => {
        if (!units || units === "") {
            Alert.warning("Введите количество товара", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            setLoading(true);
            insertProduct();

        }
    };

    // добавление товара в наряд-заказ
    const insertProduct = () => {
        Axios.post("/api/workorder/details/insert",
            {
                product: selectedProd.id,
                workorder_id: workorderId,
                units: units,
                price: selectedProd.price,
                counterparty: selectedProd.counterparty,
                point: point
            })
            .then((res) => res.data)
            .then((res) => {
                setUnits("");
                setProdName("");
                setBarcode("");
                setSelectedProd(null);
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

    const goBack = () => {
        setPoint("");
        setCounterparty("");
        setWorkorderId("");
        setWorkorderProducts([]);
        setOnlyView(false);
    };

    return (
        <Fragment>
            {sweetalert}
            <Grid
                container
                spacing={2}
            >
                <Grid item xs={10} style={{ paddingBottom: "0px" }}>
                    <Breadcrumb content={[
                        { caption: "Настройки" },
                        { caption: "Наряд-заказ" },
                        { caption: "Новый наряд-заказ" },
                        { caption: "Добавление товаров", active: true },
                    ]} />
                </Grid>
                <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={goBack}>
                        Назад
                    </button>
                </Grid>
                {info && <Grid item xs={12}>
                    <span style={{ color: "gray" }}>
                        Наряд-заказ: <b>{info.workorder_number}</b> | Контрагент: <b>{info.counterparty + " (" + info.bin + ")"}</b> | Торовая точка: <b>{info.point}</b> | Пользователь: <b>{info.username}</b>
                    </span>
                </Grid>}
                {!onlyView &&
                    <Fragment>
                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <Autocomplete
                                    value={barcode}
                                    defaultValue={barcode}
                                    fullWidth
                                    disabled={isLoading}
                                    options={productList.map((option) => option.code)}
                                    onChange={(e, value) => { setBarcode(value); setProdName(""); setSelectedProd(null) }}
                                    onInputChange={(e, value) => { setBarcode(value) }}
                                    noOptionsText="Товар не найден"
                                    renderInput={(params) => (
                                        <TextField
                                            classes={{
                                                root: classesAC.root,
                                            }}
                                            {...params}
                                            placeholder="Штрих-код"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                                <Divider className={classes.divider} orientation="vertical" />
                                <Autocomplete
                                    value={prodName}
                                    fullWidth
                                    disabled={isLoading}
                                    options={productList.map((option) => option.name)}
                                    onChange={(e, value) => { setProdName(value); setBarcode(""); setSelectedProd(null) }}
                                    onInputChange={(e, value) => { setProdName(value) }}
                                    noOptionsText="Товар не найден"
                                    renderInput={(params) => (
                                        <TextField
                                            classes={{
                                                root: classesAC.root,
                                            }}
                                            {...params}
                                            placeholder="Наименование товара"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                                <IconButton onClick={searchProduct}>
                                    <SearchIcon />
                                </IconButton>

                            </Paper>
                        </Grid>
                        {selectedProd &&
                            <Grid item xs={6}>
                                <Paper className={classes.root}>
                                    <TextField
                                        classes={{
                                            root: classesAC.root,
                                        }}
                                        placeholder="Количество (шт.)"
                                        label="Количество (шт.)"
                                        variant="outlined"
                                        size="small"
                                        value={units}
                                        onChange={(e) => setUnits(e.target.value)}
                                        fullWidth
                                    />
                                    <Divider className={classes.divider} orientation="vertical" />
                                    <button
                                        className="btn btn-success"
                                        onClick={addProduct}
                                    >
                                        Добавить
                                    </button>
                                </Paper>
                            </Grid>
                        }
                    </Fragment>}
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
            </Grid>
        </Fragment >
    )
}