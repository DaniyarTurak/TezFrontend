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

function WeightPriceAdd({isWholesale, counterparty, object, getPrices}) {
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


    const [weightProductsList, setWeightProductsList] = useState([])
    const [weightProdName, setWeightProdName] = useState("")
    const [weightProdId, setWeightProdId] = useState();
    const [selectedProd, setSelectedProd] = useState(null);
    const [purchasePrice, setPurchasePrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [wholesalePrice, setWholesalePrice] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getWeightProductByName()
    }, [])


    const weightProdNameChange = ({ value, search }) => {
        if (!value || value.trim() === "") {
            setWeightProdName("");
            if (search) {
                getWeightProductByName("");
            }
        }
        else {
            setWeightProdName(value);
            let flag = false;
            weightProductsList.forEach(prod => {
                if (prod.name === value) {
                    setWeightProdId(prod.id)
                    flag = true;
                }
            });
            if (!flag && search) {
                getWeightProductByName(value);
            }
        }
    }

    const getWeightProductByName = (value) => {
        Axios.get("/api/pluproducts/names", {
            params: { name: value ? value.trim() : "" },
        })
            .then((res) => res.data)
            .then((data) => {
                setWeightProductsList(data);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const searchProduct = () => {
        setSelectedProd(null);
        Axios.get("/api/pluproducts/details", { params: { id: weightProdId } })
            .then((res) => res.data)
            .then((products) => {
                setSelectedProd(products);
                setWeightProdName(products.name);

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
                isweight: true,
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
                    if (res.prices_management.code !== "success") {
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
                        getPrices();
                    }
                    setPurchasePrice("");
                    setSellPrice("");
                    setWholesalePrice("");
                    setSelectedProd(null);
                    setWeightProdName(null);
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
                                value={weightProdName}
                                fullWidth
                                disabled={isLoading}
                                options={weightProductsList.map((option) => option.name)}
                                onChange={(e, value) => weightProdNameChange({ value, search: false })}
                                onInputChange={(e, value) => weightProdNameChange({ value, search: true })}
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
                            <IconButton  onClick={object === 1 ? searchProduct : getPrices}>
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
            </Grid>
        </Fragment >
    )
}

export default WeightPriceAdd
