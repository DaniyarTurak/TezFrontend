import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import useDebounce from "../../../ReusableComponents/useDebounce";

const AddButton = withStyles((theme) => ({
    root: {
        color: "white",
        border: "1px solid #28a745",
        backgroundColor: "#28a745",
        '&:hover': {
            border: "1px solid #28a745",
            color: "#28a745",
            backgroundColor: "transparent",
        },
    },
}))(Button);

const StyledInput = withStyles((theme) => ({
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: "4.5px 4px 4.5px 6px",
        height: "29px",
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            border: '2px solid #17a2b8',
        },
    },
}))(InputBase);

export default function AddMarginalPrice({
    isLoading,
    added,
    setAdded,
}) {
    const useStyles = makeStyles(theme =>
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
    const classes = useStyles();

    const [barcode, setBarcode] = useState("");
    const [marginalPrice, setMarginalPrice] = useState("");
    const [prodName, setProdName] = useState("");
    const [prods, setProds] = useState([]);
    const [prodId, setProdId] = useState("");
    const debouncedSearchTerm = useDebounce(prodName, 500);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        refresh();
    }, [added]);

    useEffect(() => {
        prods.forEach(product => {
            if (product.name === prodName) {
                if (product.code) {
                    setBarcode(product.code)
                }
                if (product.staticprice) {
                    setMarginalPrice(product.staticprice);
                }
                else {
                    setMarginalPrice("");
                }
                if (product.id) {
                    setProdId(product.id)
                }
            }
        });
    }, [prodName]
    );

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                if (debouncedSearchTerm.trim().length === 0) {
                    Axios.get("/api/products/withprice", { params: { productName: "", type: "add" } })
                        .then((res) => res.data)
                        .then((list) => {
                            setProds(list);
                            setProdName("")
                        })
                        .catch((err) => {
                            ErrorAlert(err);
                        });
                }
                else {
                    if (debouncedSearchTerm.trim().length >= 3) {
                        Axios.get("/api/products/withprice", { params: { productName: prodName, type: "add" } })
                            .then((res) => res.data)
                            .then((list) => {
                                setProds(list);
                            })
                            .catch((err) => {
                                ErrorAlert(err);
                            });
                    };
                }
            }
        },
        [debouncedSearchTerm]
    );


    const getProducts = (productName) => {
        Axios.get("/api/products/withprice", { params: { productName, type: "add" } })
            .then((res) => res.data)
            .then((list) => {
                setProds(list);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const getProductByBarcode = () => {
        Axios.get("/api/products/barcode", { params: { barcode: barcode.trim() } })
            .then((res) => res.data)
            .then((product) => {
                setProdName(product.name);
                setProdId(product.id);
                if (product.staticprice) {
                    setMarginalPrice(product.staticprice)
                }
                else {
                    setMarginalPrice("")
                }
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const onBarcodeKeyDown = (e) => {
        if (e.keyCode === 13) {
            getProductByBarcode();
        }
    };

    const barcodeChange = (value) => {
        setBarcode(value);
        setProdName("");
        prods.forEach(element => {
            if (value.toString() === element.code) {
                setProdName(element.name);
                if (element.staticprice) {
                    setMarginalPrice(element.staticprice)
                }
                else {
                    setMarginalPrice("");
                }
            }
        });
    };

    const addProduct = () => {
        if (!barcode) {
            Alert.error("Введите штрих-код", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            if (!prodName) {
                Alert.error("Введите наименование товара", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            }
            else {
                if (!marginalPrice) {
                    Alert.error("Введите предельную цену", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                else {
                    changePrice();
                }
            }
        }
    };

    const refresh = () => {
        setProdName("");
        setMarginalPrice("");
        setBarcode("");
        getProducts();
    }

    const changePrice = () => {
        Axios.post("/api/invoice/changeprice", {
            isstaticprice: true,
            product: prodId,
            price: marginalPrice.toString().includes(",") ? marginalPrice.toString().replace(",", ".") : marginalPrice,
        })
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Предельная цена установлена успешно", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                //refresh();
                setAdded(!added);
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.code === "error"
                ) {
                    Alert.error(err.response.data.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                else {
                    Alert.error("Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
            });
    };

    const nameChange = (value) => {
        if (value === null) {
            setProdName(" ")
        }
        else {
            setProdName(value)
        }
    }
    return (
        <Fragment>
            <Grid item xs={12}>
                <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
                    Добавление предельной цены
                    </h6>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <label>Введите штрих-код:</label>
                    <StyledInput
                        fullWidth
                        variant="outlined"
                        placeholder="Штрих-код"
                        value={barcode}
                        onChange={(e) => barcodeChange(e.target.value)}
                        size="small"
                        onKeyDown={onBarcodeKeyDown}
                    />
                </Grid>
                <Grid item xs={9}>
                    <label>Выберите товар из списка: </label>
                    <Autocomplete
                        id="outlined-basic"
                        value={prodName}
                        noOptionsText="Товар не найден"
                        
                        onInputChange={(event, value) => { nameChange(value) }}
                        onChange={(event, value) => { nameChange(value) }}
                        options={prods.map((option) => option.name)}
                        renderInput={(params) => (
                            <TextField
                                classes={{
                                    root: classes.root,
                                }}
                                {...params}
                                placeholder="Наименование товара"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                </Grid>
            </Grid>
            {prods.length === 0 && (
                <Grid item xs={12}>
                    Товар не найден
                </Grid>
            )}
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
                Введите предельную цену товара:
                    </Grid>
            <Grid container spacing={3}>
                <Grid item xs={4} style={{ paddingBottom: "15px" }}>
                    <StyledInput
                        fullWidth
                        value={marginalPrice}
                        onChange={(e) => { setMarginalPrice(e.target.value) }}
                        variant="outlined"
                        placeholder="Предельная цена"
                        size="small"
                    />
                </Grid>
                <Grid item xs={8} style={{ paddingBottom: "15px" }}>
                    <AddButton
                        disabled={isLoading}
                        onClick={addProduct}
                    >
                        Добавить товар в справочник
                    </AddButton>
                </Grid>
            </Grid>
        </Fragment>
    );
};