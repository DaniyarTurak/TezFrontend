import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import TextField from '@material-ui/core/TextField';
import Scanner from "./Scanner";
import useDebounce from "../../../ReusableComponents/useDebounce";
import Alert from "react-s-alert";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RevisionTable from "./RevisionTable";
import { makeStyles } from '@material-ui/core/styles';
import ManualAdd from "./ManualAdd";

export default function RevisonProducts({
    barcode,
    setBarcode,
    hardware,
    setHardware,
    point,
    revNumber,
    setActiveStep,
    revisionProducts,
    setRevisionProducts
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
    const debouncedBarcode = useDebounce(barcode, 150);
    const [restartScanner, setRestartScanner] = useState(false);
    const debouncedRestartScanner = useDebounce(restartScanner, 200);
    useEffect(() => {
        getRevisionProducts();
    }, []);

    useEffect(() => {
        if (barcode !== "") {
            searchByBarcode();
        }
    }, [debouncedBarcode]);

    const getRevisionProducts = () => {
        const params = {
            revisionnumber: revNumber,
            point: point
        }
        Axios.get("/api/revision/revisiontemp/list", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                let temp = [];
                products.forEach((product) => {
                    temp.push({ ...product, isChanging: false })
                })
                setRevisionProducts(products);
            })
            .catch((err) => {
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            });
    }

    const barcodeChange = (e) => {
        setBarcode(e.target.value);
    };

    const searchByBarcode = () => {
        const params = {
            barcode,
            point
        }
        Axios.get("/api/revision/unitsbybarcode", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                if (products.length > 0) {
                    addToRevisionTemp(products[0]);
                }
                else {
                    Alert.warning(`Товар со штрих-кодом ${barcode} отсутствует на складе`, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                setBarcode("");
                setRestartScanner(!restartScanner);

            })
            .catch((err) => {
                Alert.warning(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setBarcode("");
                setRestartScanner(!restartScanner);
            });
    };

    const addToRevisionTemp = (product) => {
        Axios.post("/api/revision/revisiontemp/update", {
            revnumber: revNumber,
            point,
            id: product.product,
            attribute: product.attributes,
            unitswas: parseInt(product.units)
        })
            .then((res) => res.data)
            .then((res) => {
                console.log(res);
                if (res[0].revisiontemp_update.code === "success") {
                    getRevisionProducts();
                }
                else {
                    Alert.error(res[0].update_revisiontemp.text, {
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
    return (
        <Fragment>
            <Paper className={classes.paper}>
                <Grid
                    direction="column"
                    container
                    wrap="nowrap"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Оборудование для ввода</FormLabel>
                            <RadioGroup row name="harware"
                                value={hardware}
                                onChange={(e) => setHardware(e.target.value)}
                            >
                                <FormControlLabel
                                    value="camera"
                                    control={<Radio color="primary" />}
                                    label="Камера"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="scanner"
                                    control={<Radio color="primary" />}
                                    label="Сканер"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="manual"
                                    control={<Radio color="primary" />}
                                    label="Ручной ввод"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper} elevation={hardware === 'camera' ? 3 : 0}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={12}>
                        <Scanner
                            barcode={barcode}
                            setBarcode={setBarcode}
                            debouncedRestartScanner={debouncedRestartScanner}
                            hardware={hardware}
                        />
                    </Grid>
                </Grid>
            </Paper>
            {hardware === "scanner" &&
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                label={"Штрих-код"}
                                value={barcode}
                                autoFocus={true}
                                onChange={barcodeChange}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            }
            {hardware === "manual" &&
                <ManualAdd
                    point={point}
                    revNumber={revNumber}
                    getRevisionProducts={getRevisionProducts}
                />
            }
            {revisionProducts.length > 0 &&
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={12} style={{ padding: "0px" }}>
                            <RevisionTable
                                revisionProducts={revisionProducts}
                                setRevisionProducts={setRevisionProducts}
                                point={point}
                                revNumber={revNumber}
                                getRevisionProducts={getRevisionProducts}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            }
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={6}>
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-outline-secondary"
                            onClick={() => setActiveStep(0)}
                        >
                            Назад
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button
                            onClick={() => setActiveStep(2)}
                            style={{ width: "100%" }}
                            className="btn btn-success"
                        >
                            Далее
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment >
    );
};