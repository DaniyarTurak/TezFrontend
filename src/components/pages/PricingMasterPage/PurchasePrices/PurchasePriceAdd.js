
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Alert from "react-s-alert";
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

export default function PurchasePriceAdd({
    getPrices,
    counterparty,
    brand,
    category,
    object,
    isWholesale,
    barcode,
    setBarcode,
    prodName,
    setProdName
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


    const [purchasePrice, setPurchasePrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [wholesalePrice, setWholesalePrice] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [selectedProd, setSelectedProd] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);


    const getProducts = () => {
        Axios.get("/api/products", {
            params: {
                productName: prodName,
                barcode: barcode,
                category: category ? category.value : null,
                brand: brand ? brand.value : null,
                counterparty: counterparty ? counterparty.value : null
            }
        })
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
                setSelectedProd(products[0]);
                setProdName(products[0].name);
                setBarcode(products[0].code);

            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addProduct = () => {
        if (!purchasePrice || purchasePrice === "") {
            Alert.warning("Введите цену закупки", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            setLoading(true);

            Axios.post("/api/prices", {
                deleted: false,
                sell: [
                    {
                        id: selectedProd.id,
                        price: sellPrice,
                        counterparty: counterparty.value,
                        wholesale_price: wholesalePrice !== "" ? wholesalePrice : null
                    }
                ],
                buy:
                    [{
                        id: selectedProd.id,
                        price: purchasePrice,
                        counterparty: counterparty.value,
                    }]
            })
                .then((res) => res.data)
                .then((res) => {
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
                    setPurchasePrice("");
                    setSellPrice("");
                    setSelectedProd(null);
                    setBarcode(null);
                    setProdName(null);
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
                                onChange={(e, value) => { setBarcode(value); setProdName(""); setSelectedProd(null); }}
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
                                onChange={(e, value) => { setProdName(value); setBarcode(""); setSelectedProd(null); }}
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
                            <IconButton onClick={object === 1 ? searchProduct : getPrices} className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                </Fragment>
                {selectedProd &&
                    <Grid item xs={12}>
                        <Paper className={classes.root}>
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Цена закупки (тг.)"
                                label="Цена закупки (тг.)"
                                variant="outlined"
                                size="small"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                fullWidth
                            />
                            <Divider className={classes.divider} orientation="vertical" />
                            <TextField
                                classes={{
                                    root: classesAC.root,
                                }}
                                placeholder="Цена реализации (тг.)"
                                label="Цена реализации (тг.)"
                                variant="outlined"
                                size="small"
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                                fullWidth
                            />
                            <Divider className={classes.divider} orientation="vertical" />
                            {isWholesale &&
                                <Fragment>
                                    <TextField
                                        classes={{
                                            root: classesAC.root,
                                        }}
                                        placeholder="Оптовая цена реализации (тг.)"
                                        label="Оптовая цена реализации (тг.)"
                                        variant="outlined"
                                        size="small"
                                        value={wholesalePrice}
                                        onChange={(e) => setWholesalePrice(e.target.value)}
                                        fullWidth
                                    />
                                    <Divider className={classes.divider} orientation="vertical" />
                                </Fragment>}
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