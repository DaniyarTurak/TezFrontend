import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from '@material-ui/core/Grid';
import Alert from "react-s-alert";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ReactModal from "react-modal";
import AddIcon from '@material-ui/icons/Add';
export default function ManualAdd({
    point,
    revNumber,
    getRevisionProducts,
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

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            marginLeft: "40px",
            transform: "translate(-50%, -50%)",
            maxWidth: "400px",
            maxHeight: "80vh",
            overlfow: "scroll",
            zIndex: 11,
        },
        overlay: { zIndex: 10 },
    };

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

    const [isLoading, setLoading] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [units, setUnits] = useState("");
    const [listProducts, setListProducts] = useState([]);
    const [selectedProd, setSelectedProd] = useState("");
    const [fewProducts, setFewProducts] = useState("");
    const [isSelectProduct, setSelectProduct] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        Axios.get("/api/products/stockcurrent/stock", { params: { stockid: point } })
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
            let temp = [];
            listProducts.forEach((prod) => {
                if (prod.code === value) {
                    temp.push(
                        {
                            product: prod.prodid,
                            unitswas: Number(prod.units),
                            attributes: prod.attributes,
                            attrvalue: prod.attributescaption,
                            revnumber: revNumber,
                            point: point,
                            name: prod.name,
                            code: prod.code
                        }
                    );
                    if (temp.length > 1) {
                        setFewProducts(temp);
                        setSelectProduct(true);
                    }
                    else {
                        setSelectedProd(
                            temp[0]
                        );
                        setName(temp[0].name);
                    }
                };
            })
        }
        else {
            if (param === "name") {
                listProducts.forEach((prod) => {
                    if (prod.name + " " + prod.attributescaption === value) {
                        setSelectedProd(
                            {
                                product: prod.prodid,
                                unitswas: Number(prod.units),
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
            if (param === "barcode") {
                Axios.get("/api/revision/unitsbybarcode", { params: { barcode: barcode.trim(), point } })
                    .then((res) => res.data)
                    .then((list) => {
                        if (list.length > 0) {
                            if (list.length > 1) {
                                setFewProducts(list);
                                setSelectProduct(true);
                            }
                            else {
                                setSelectedProd(list[0]);
                                setName(list[0].name + " " + list[0].attrvalue);
                                setBarcode(list[0].code);
                                setBarcode(list[0].code);
                            }
                        }
                        else {
                            Alert.warning(`Товар со штрих-кодом ${barcode} не найден`, {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 2000,
                            });
                        }
                    })
                    .catch((err) => {
                        ErrorAlert(err);
                        setLoading(false);
                    });
            };
            if (param === "name") {
                Axios.get("/api/revision/unitsbybarcode", { params: { name: name.trim(), point } })
                    .then((res) => res.data)
                    .then((list) => {
                        if (list.length > 0) {
                            if (list.length > 1) {
                                setFewProducts(list);
                                setSelectProduct(true);
                            }
                            else {
                                setSelectedProd(list[0]);
                                setName(list[0].name + " " + list[0].attrvalue);
                                setBarcode(list[0].code);
                                setBarcode(list[0].code);
                            }
                        }
                        else {
                            Alert.warning(`Товар со наименование ${name} не найден`, {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 2000,
                            });
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
        if (barcode === "" || name === "") {
            Alert.warning("Выберите товар", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            if (units !== "" && units > 0) {
                let params = { ...selectedProd, unitswas: selectedProd.unitswas ? selectedProd.unitswas : Number(selectedProd.units), revnumber: revNumber, point: point, units: units };
                Axios.post("/api/revision/revisiontemp/insert", params)
                    .then((res) => res.data)
                    .then((res) => {
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
                            setBarcode("");
                            setName("");
                            setUnits("");
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
            };
        };
    };

    const closeModal = () => {
        setName("");
        setBarcode("");
        setSelectProduct(false);
        setFewProducts([]);
    };

    const selectOneProduct = (prod) => {
        setSelectedProd(prod);
        setName(prod.name + " " + prod.attrvalue);
        setBarcode(prod.code);
        setSelectProduct(false);
        setFewProducts([]);
    }

    return (
        <Fragment>
            {fewProducts.length > 0 &&
                < ReactModal
                    isOpen={isSelectProduct}
                    style={customStyles}
                >
                    <Grid container>
                        <Grid item xs={12} style={{ textAlign: "center" }}><b>Выберите товар</b></Grid>
                    </Grid>
                    <Grid container spacing={1} style={{ paddingTop: "15px" }}>
                        <Grid item xs={5}><b>Наименование</b></Grid>
                        <Grid item xs={7}>{fewProducts[0].name}</Grid>
                        <Grid item xs={5}><b>Штрих-код</b></Grid>
                        <Grid item xs={7}>{fewProducts[0].code}</Grid>
                    </Grid>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={6} style={{ textAlign: "center" }}><b>Характеристики</b></Grid>
                        {
                            fewProducts.map((prod, idx) => (
                                <Fragment key={idx}>
                                    <Grid item xs={8}>{prod.attrvalue ? prod.attrvalue : "Без характеристик"}</Grid>
                                    <Grid item xs={2} style={{ textAlign: "right" }} >
                                        <button
                                            className="btn btn-success"
                                            onClick={() => selectOneProduct(prod)}
                                            style={{ padding: "0px" }}
                                            disabled={isLoading}
                                        >
                                            <AddIcon size="small" />
                                        </button></Grid>
                                </Fragment>
                            ))
                        }
                    </Grid>
                    <hr />
                    <Grid container spacing={3}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                        </Grid>
                    </Grid>
                </ReactModal>
            }
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
                            defaultValue={barcode}
                            fullWidth
                            disabled={isLoading}
                            onKeyDown={(e) => searchProduct({ e, param: "barcode" })}
                            options={listProducts.map((option) => option.code)}
                            onChange={(e, value) => { selectProduct({ value, param: "barcode" }) }}
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
                    <Grid item xs={12}>
                        <Autocomplete
                            value={name}
                            fullWidth
                            disabled={isLoading}
                            onKeyDown={(e) => searchProduct({ e, param: "name" })}
                            options={listProducts.map((option) => option.name + " " + option.attributescaption)}
                            onChange={(e, value) => { selectProduct({ value, param: "name" }) }}
                            onInputChange={(e, value) => { setName(value) }}
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
                    <Grid item xs={6}>
                        <TextField
                            value={units}
                            classes={{
                                root: classesAC.root,
                            }}
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
                        >
                            Добавить
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment>
    );
};