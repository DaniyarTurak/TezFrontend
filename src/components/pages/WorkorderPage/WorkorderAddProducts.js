
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Breadcrumb from "../../Breadcrumb";
import Alert from "react-s-alert";
import Modal from 'react-modal';

export default function PurchasePriceAdd({
    workorderId,
    point,
    setPoint,
    setCounterparty,
    getWorkorderProducts,
    setWorkorderId,
    onlyView,
    setOnlyView
}) {
    const useStylesAC = makeStyles(theme =>
        createStyles({
            root: {
                '& label.Mui-focused': {
                    color: '#17a2b8',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#17a2b8',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#ced4da',
                    },
                    '&:hover fieldset': {
                        borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#17a2b8',
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

    const [info, setInfo] = useState(null);
    const [prodName, setProdName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [units, setUnits] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProd, setSelectedProd] = useState(null);
    const [sweetalert, setSweetAlert] = useState(null);

    useEffect(() => {
        getInfo();
        getProducts();
    }, []);

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
        Axios.get("/api/products", { params: { productName: prodName, barcode: barcode } })
            .then((res) => res.data)
            .then((products) => {
                setSearchedProducts(products);
                if (products.length === 1) {
                    setSelectedProd(products[0]);
                    setProdName("");
                    setBarcode("");
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
                                                    setSweetAlert(null);
                                                    setProdName("");
                                                    setBarcode("");
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
        setLoading(true);
        Axios.post("/api/workorder/details/insert", { product: selectedProd.id, workorder_id: workorderId, units: units, point: point })
            .then((res) => res.data)
            .then((res) => {
                setUnits("");
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
                        { caption: "Заказ-наряд" },
                        { caption: "Новый заказ-наряд" },
                        { caption: "Добавление товаров", active: true },
                    ]} />
                </Grid>
                <Grid item xs={2} style={{ paddingBottom: "0px", textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={() => { setPoint(""); setCounterparty(""); setWorkorderId(""); setOnlyView(false) }}>
                        Назад
                    </button>
                </Grid>
                {info && <Grid item xs={12}>
                    <span style={{ color: "gray" }}>
                        Заказ-наряд: <b>{info.workorder_number}</b> | Контрагент: <b>{info.counterparty + " (" + info.bin + ")"}</b> | Торовая точка: <b>{info.point}</b> | Пользователь: <b>{info.username}</b>
                    </span>
                </Grid>}
                {!onlyView &&
                    <Fragment>
                        <Grid item xs={4}>
                            <Autocomplete
                                value={barcode}
                                defaultValue={barcode}
                                fullWidth
                                disabled={isLoading}
                                options={productList.map((option) => option.code)}
                                onChange={(e, value) => { setBarcode(value) }}
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
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                value={prodName}
                                fullWidth
                                disabled={isLoading}
                                options={productList.map((option) => option.name)}
                                onChange={(e, value) => { setProdName(value) }}
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
                        </Grid>
                        <Grid item xs={4}>
                            <button
                                className="btn btn-success"
                                onClick={searchProduct}
                            // disabled={point === "" || counterparty === "" || isLoading ? true : false}
                            >
                                Найти
                            </button>
                        </Grid>
                    </Fragment>}
                {selectedProd &&
                    <Fragment>
                        <Grid item xs={3}>
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Штрих-код"
                                label="Штрих-код"
                                variant="outlined"
                                size="small"
                                value={selectedProd.code}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Наименование"
                                label="Наименование"
                                variant="outlined"
                                size="small"
                                value={selectedProd.name}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Количество"
                                label="Количество"
                                variant="outlined"
                                size="small"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <button
                                className="btn btn-success"
                                onClick={addProduct}
                            >
                                Добавить
                            </button>
                        </Grid>
                    </Fragment>
                }
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
            </Grid>
        </Fragment >
    )
}