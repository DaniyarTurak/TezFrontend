
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Alert from "react-s-alert";
import Modal from 'react-modal';

export default function PurchasePriceAdd({
    getPrices,
    counterparty
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

    const [prodName, setProdName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProd, setSelectedProd] = useState(null);
    const [sweetalert, setSweetAlert] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);


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
                if (products.length > 1) {
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
        Axios.post("/api/prices", {
            product: selectedProd.id,
            price: price,
            type: 0,
            deleted: false,
            counterparty
        })
            .then((res) => res.data)
            .then((res) => {
                setPrice("");
                setSelectedProd(null);
                getPrices();
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
                <Fragment>
                    <Grid item xs={5}>
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
                    <Grid item xs={5}>
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
                    <Grid item xs={2}>
                        <button
                            className="btn btn-success"
                            onClick={searchProduct}
                            style={{ minWidth: "99.46px" }}
                        // disabled={point === "" || counterparty === "" || isLoading ? true : false}
                        >
                            Найти
                        </button>
                    </Grid>
                </Fragment>
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
                        <Grid item xs={4}>
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
                                placeholder="Цена закупки"
                                label="Цена закупки"
                                variant="outlined"
                                size="small"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
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