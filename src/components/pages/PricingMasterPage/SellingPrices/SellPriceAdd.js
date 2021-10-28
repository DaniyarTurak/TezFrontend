
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Alert from "react-s-alert";
import Modal from 'react-modal';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

export default function SellPriceAdd({
    getPrices,
    point
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

    const [prodName, setProdName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
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
                if (products.length === 1) {
                    setSelectedProd(products[0]);
                    setProdName(products[0].name);
                    setBarcode(products[0].code);
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
        if (!price || price === "") {
            Alert.warning("Введите цену закупки", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            setLoading(true);
            Axios.post("/api/prices", {
                product: selectedProd.id,
                price: price,
                type: 1,
                deleted: false,
                point
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
        }
    };

    return (
        <Fragment>
            {sweetalert}
            <Grid
                container
                spacing={2}
            >
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
                            <IconButton onClick={searchProduct} className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                </Fragment>
                {selectedProd &&
                    <Grid item xs={6}>
                        <Paper className={classes.root}>
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Цена закупки (тг.)"
                                label="Цена закупки (тг.)"
                                variant="outlined"
                                size="small"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
            </Grid>
        </Fragment >
    )
}