import React, { Fragment, useState, useEffect } from 'react'
import { reduxForm, reset} from "redux-form";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";

function WeightProductsAdd({ scale, getWeightProductsList }) {
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
            width: "80%",
            margin: "14px",
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
    const [isLoading, setLoading] = useState(false);
    const [barcode, setBarcode] = useState("Сгенерируйте штрих код")

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
                    generateBarcode();
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
            params: { name: value ? value.trim() : "", isweight: true, },
        })
            .then((res) => res.data)
            .then((data) => {
                setWeightProductsList(data);
            })
            .catch((err) => {
                ErrorAlert(err);
            })
    }

    const handleAdd = () => {
        Axios.post("/api/pluproducts/scale/invoice", {
            id: weightProdId,
            scale: scale.value,
            code: barcode[0].code
        })
            .then((res) => res.data)
            .then((data) => {
                if (data.code === "success") {
                    Alert.success("Товар успешно сохранен.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    getWeightProductsList()
                }
                setWeightProdName("");
            })
            .catch((err) => {
                ErrorAlert(err);
                setWeightProdName("");
            })
    }
    const generateBarcode = () => {
        Axios.get("/api/pluproducts/barcode_unused")
            .then((res) => res.data)
            .then((barcodeseq) => {
                setBarcode(barcodeseq)
            });
    }

    return (
        <Fragment >
            <Grid item xs={12}>
                <div className={classes.root}>
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

                    <div className="col-md-3 pw-adding-products-btn">
                        <button
                            style={{ flex: "auto" }}
                            className="btn btn-success"
                            onClick={handleAdd}
                        >
                            Сохранить
                        </button>
                    </div>

                </div>
            </Grid>
        </Fragment>
    )
}

WeightProductsAdd = reduxForm({
    form: "WeightProductsAdd",
    reset,
})(WeightProductsAdd);

export default WeightProductsAdd
