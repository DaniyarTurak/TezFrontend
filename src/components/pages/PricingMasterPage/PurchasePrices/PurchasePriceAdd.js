
import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Select from "react-select";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import barcode from "barcode";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export default function PurchasePriceAdd({ workorderId }) {
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


    const [prodName, setProdName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        Axios.get("/api/products", { params: { productName: prodName } })
            .then((res) => res.data)
            .then((products) => {
                setProductList(products)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Fragment>
            <Grid
                container
                spacing={3}
            >
                <Grid item xs={3}>
                    <Autocomplete
                        value={barcode}
                        defaultValue={barcode}
                        fullWidth
                        disabled={isLoading}
                        // onKeyDown={(e) => searchProduct({ e, param: "barcode" })}
                        // options={listProducts.map((option) => option.code)}
                        // onChange={(e, value) => { selectProduct({ value, param: "barcode" }) }}
                        // onInputChange={(e, value) => { setBarcode(value) }}
                        noOptionsText="Товар не найден"
                        options={[]}
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
                <Grid item xs={3}>
                    <Autocomplete
                        value={prodName}
                        fullWidth
                        disabled={isLoading}
                        options={[]}
                        // onKeyDown={(e) => searchProduct({ e, param: "name" })}
                        // options={listProducts.map((option) => option.name + " " + option.attributescaption)}
                        // onChange={(e, value) => { selectProduct({ value, param: "name" }) }}
                        // onInputChange={(e, value) => { setName(value) }}
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
                <Grid item xs={3}>
                    <TextField
                        classes={{
                            root: classesAC.root,
                        }}
                        placeholder="Цена закупа"
                        label="Цена закупа"
                        variant="outlined"
                        size="small"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Grid>
                <Grid item xs={3}>
                    <button
                        className="btn btn-success"
                    // onClick={createWorkorder}
                    // disabled={point === "" || counterparty === "" || isLoading ? true : false}
                    >
                        Добавить
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    )
}
