import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from '@material-ui/core/Grid';
import Alert from "react-s-alert";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function ManualAdd({
    point,
    revNumber,
    getRevisionProducts
}) {

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            overflow: 'hidden',
            padding: theme.spacing(0, 3),
        },
        paper: {
            maxWidth: 480,
            margin: `${theme.spacing(1)}px auto`,
            padding: theme.spacing(2),
        },
    }));
    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [units, setUnits] = useState("");
    const [listProducts, setListProducts] = useState([]);
    const [selectedProd, setSelectedProd] = useState("");

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (barcode === "") {
            // setName("")
            getProducts();
        }
    }, [barcode]);

    useEffect(() => {
        if (name === "") {
            // setBarcode("")
            getProducts();
        }
    }, [name]);

    const getProducts = () => {
        Axios.get("/api/products/bypoint", { params: { point } })
            .then((res) => res.data)
            .then((list) => {
                setListProducts(list);
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    const selectProduct = ({ value, param }) => {
        if (param === "barcode") {
            listProducts.forEach((prod) => {
                if (prod.code === value) {
                    setSelectedProd(
                        {
                            product: prod.id,
                            unitswas: parseInt(prod.units),
                            attributes: prod.attributes,
                            revnumber: revNumber,
                            point: point
                        }
                    );
                    setName(prod.name);
                };
            })
        }
        else {
            if (param === "name") {
                listProducts.forEach((prod) => {
                    if (prod.name === value) {
                        setSelectedProd(
                            {
                                product: prod.id,
                                unitswas: parseInt(prod.units),
                                attributes: prod.attributes,
                                revnumber: revNumber,
                                point: point
                            }
                        );
                        setBarcode(prod.code);
                    };
                })
            };
        };
    };

    const searchProduct = ({ e, param }) => {
        if (e.keyCode === 13) {
            console.log(param);
            if (param === "barcode") {
                console.log({ barcode, point });
                Axios.get("/api/products/bypoint", { params: { barcode, point } })
                    .then((res) => res.data)
                    .then((list) => {
                        if (list.length > 0) {
                            setListProducts(list);
                        }
                    })
                    .catch((err) => {
                        ErrorAlert(err);
                        setLoading(false);
                    });
            };
            if (param === "name") {
                console.log({ name, point });
                Axios.get("/api/products/bypoint", { params: { name, point } })
                    .then((res) => res.data)
                    .then((list) => {
                        if (list.length > 0) {
                            setListProducts(list);
                        }
                    })
                    .catch((err) => {
                        ErrorAlert(err);
                        setLoading(false);
                    });
            };
        };
    };

    const addProduct = () => {
        if (units !== "" && units > 0) {
            console.log(selectedProd);
            let params = { ...selectedProd, units: units };
            Axios.post("/api/revision/revisiontemp/insert", params)
                .then((res) => res.data)
                .then((res) => {
                    console.log(res);
                    if (res.code === "success") {
                        getRevisionProducts();
                        setBarcode("");
                        setName("");
                        setUnits("");
                    }
                    else {
                        Alert.error(res.text, {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            Alert.warning("Введите корректное количество", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
    }

    return (
        <Fragment>
            <Paper className={classes.paper}>
                <Grid
                    direction="row"
                    container
                    // wrap="nowrap"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Autocomplete
                            value={barcode}
                            fullWidth
                            disabled={isLoading}
                            onKeyDown={(e) => searchProduct({ e, param: "barcode" })}
                            options={listProducts.map((option) => option.code)}
                            onChange={(e, value) => { selectProduct({ value, param: "barcode" }) }}
                            onInputChange={(e, value) => { setBarcode(value) }}
                            noOptionsText="Товар не найден"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Штрих-код"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            value={name}
                            fullWidth
                            disabled={isLoading}
                            onKeyDown={(e) => searchProduct({ e, param: "name" })}
                            options={listProducts.map((option) => option.name)}
                            onChange={(e, value) => { selectProduct({ value, param: "name" }) }}
                            onInputChange={(e, value) => { setName(value) }}
                            noOptionsText="Товар не найден"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Наименование"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={units}
                            onChange={(e) => { setUnits(e.target.value) }}
                            placeholder="Количество"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-success"
                            onClick={addProduct}
                        // disabled={isLoading || haveActive}
                        >
                            Добавить
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment>
    );
};