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

export default function AddMarginalPrice({ getProducts, listForSelect, isLoading, products }) {

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

    const [productNameForSelect, setProductNameForSelect] = useState("");
    const [barcode, setBarcode] = useState("");
    const [marginalPrice, setMarginalPrice] = useState("");
    const [prodName, setProdName] = useState("");

    const getProductByBarcode = () => {
        Axios.get("/api/products/barcode", { params: { barcode: barcode.trim() } })
            .then((res) => res.data)
            .then((product) => {
                setProdName(product.name);
                setProductNameForSelect({ value: product.id, label: product.name });
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
        setProductNameForSelect("");
        products.forEach(element => {
            if (value.toString() === element.code) {
                setProductNameForSelect({ label: element.name, value: element.id });
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

    const productOnChange = (e, data) => {
        if (data) {
            products.forEach(product => {
                if (product.id === data.value) {
                    setBarcode(product.code);
                    setProdName(product.name);
                    setProductNameForSelect({ label: product.name, value: product.id });
                    if (product.staticprice) {
                        setMarginalPrice(product.staticprice)
                    }
                    else {
                        setMarginalPrice("")
                    }
                }
            });
        }
    };

    const productOnInputChange = (e, name) => {
        setProdName(name);
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

    const changePrice = () => {
        // setLoading(true);
        Axios.post("/api/invoice/changeprice", {
            isstaticprice: true,
            product: productNameForSelect.value,
            price: marginalPrice,
        })
            .then((result) => result.data)
            .then((result) => {
                Alert.success("Предельная цена установлена успешно", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setProdName("");
                // setLoading(false);
                getProducts();
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
                // setLoading(false);
            });
    };

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
                        options={listForSelect}
                        value={productNameForSelect}
                        onChange={productOnChange}
                        noOptionsText="Товар не найден"
                        onInputChange={productOnInputChange}
                        filterOptions={(options) =>
                            options.filter((option) => option !== "")
                        }
                        getOptionLabel={(option) => (option ? option.label : "")}
                        getOptionSelected={(option, value) =>
                            option.label === value.value
                        }
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
            {products.length === 0 && (
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