import React, { Fragment, useState, useEffect } from "react";
import RevisionTable from "./RevisionTable";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { Alert, AlertTitle } from '@material-ui/lab';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import Moment from "moment";
import ReactAlert from "react-s-alert";

export default function RevisonFinish({
    revNumber,
    point,
    activeStep,
    setActiveStep,
    revisionProducts
}) {

    const BootstrapInput = withStyles((theme) => ({
        root: {
            minWidth: 175,
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #17a2b8',
            fontSize: 16,
            padding: '4px 26px 4px 4px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
            },
        },
    }))(InputBase);

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            overflow: 'hidden',
            padding: theme.spacing(0, 3),
        },
        paper: {
            maxWidth: 480,
            margin: `${theme.spacing(1)}px auto`,
            padding: 0,
        },
    }));
    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [outOfRevisionProducts, setOutOfRevisionProducts] = useState([]);
    const [isOutOfRevision, setOutOfRevision] = useState(false);
    const [condition, setCondition] = useState("");

    useEffect(() => {
        compareProducts();
    }, []);

    const compareProducts = () => {
        Axios.get("/api/revision/comparetemprevision", { params: { point } })
            .then((res) => res.data)
            .then((list) => {
                if (list.length > 0) {
                    setOutOfRevisionProducts(list);
                    setOutOfRevision(true);
                }
                setLoading(false);
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    const finishRevision = () => {
        const productsToSend = [];
        if (outOfRevisionProducts.length > 0) {
            if (condition !== "") {
                revisionProducts.forEach((product) => {
                    productsToSend.push(
                        {
                            attribute: product.attributes,
                            createdate: product.createdate,
                            prodid: product.product,
                            time: Moment(product.createdate).format("MM.DD.YYYY HH:mm:ss"),
                            units: product.units,
                            unitsSelled: 0,
                            unitswas: product.unitswas
                        })
                });
                const params = {
                    revisionnumber: revNumber,
                    outofrevision: condition,
                    products: outOfRevisionProducts
                };
                console.log(params);
                // Axios.post("/api/revision/revisiondiary/add", {
                //     user: JSON.parse(sessionStorage.getItem('isme-user-data')).id,
                //     pointid: point,
                //     revtype: '0',
                //     // condition,
                //     revisionnumber: revNumber,
                //     products: productsToSend,
                // })
                //     .then((data) => {
                //         return data.data;
                //     })
                //     .then((resp) => {
                //         console.log(resp[0]);
                //         if (resp[0].revisiondiary_add.text === "success") {
                //             ReactAlert.success("Успешно", {
                //                 position: "top-right",
                //                 effect: "bouncyflip",
                //                 timeout: 3000,
                //             });
                //         }
                //         else {
                //             ReactAlert.error(resp[0].revisiondiary_add.text, {
                //                 position: "top-right",
                //                 effect: "bouncyflip",
                //                 timeout: 3000,
                //             });
                //         }
                //     })
                //     .catch((err) => {
                //         console.log(err);
                //         ReactAlert.error("Сервис временно не доступен", {
                //             position: "top-right",
                //             effect: "bouncyflip",
                //             timeout: 3000,
                //         });
                //     });
            }
            else {
                ReactAlert.warning("На складе остались товары не прошедшие ревизию. Выберите что с ними сделать.", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 3000,
                });
            }
        }
        else {
            revisionProducts.forEach((product) => {
                productsToSend.push(
                    {
                        attribute: product.attributes,
                        createdate: product.createdate,
                        prodid: product.product,
                        time: Moment(product.createdate).format("MM.DD.YYYY HH:mm:ss"),
                        units: product.units,
                        unitsSelled: 0,
                        unitswas: product.unitswas
                    })
            });
            Axios.post("/api/revision/revisiondiary/add", {
                user: JSON.parse(sessionStorage.getItem('isme-user-data')).id,
                pointid: point,
                revtype: '0',
                // condition,
                revisionnumber: revNumber,
                products: productsToSend,
            })
                .then((data) => {
                    return data.data;
                })
                .then((resp) => {
                    console.log(resp[0]);
                    if (resp[0].revisiondiary_add.text === "success") {
                        ReactAlert.success("Успешно", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 3000,
                        });
                    }
                    else {
                        ReactAlert.error(resp[0].revisiondiary_add.text, {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 3000,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ReactAlert.error("Сервис временно не доступен", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 3000,
                    });
                });
        }
    };

    // const addToRevDiary = (productsToSend) => {
    //     Axios.post("/api/revision/revisiondiary/add", {
    //         pointid: point,
    //         products: productsToSend,
    //         revisionnumber: revNumber
    //     })
    //         .then((data) => {
    //             return data.data;
    //         })
    //         .then((resp) => {
    //             console.log(resp);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             Alert.error("Сервис временно не доступен", {
    //                 position: "top-right",
    //                 effect: "bouncyflip",
    //                 timeout: 3000,
    //             });
    //         });
    // }

    return (
        <Fragment>
            <Paper className={classes.paper}>
                <Alert severity="info">
                    <AlertTitle>ВАЖНО!</AlertTitle>
                    Если во время ревизии были продажи товаров на кассах, то они будут учтены автоматически.</Alert>
            </Paper>
            <Paper className={classes.paper}>

                <Alert severity="info">
                    <AlertTitle>ВАЖНО!</AlertTitle>
                    Для корректного учета продаж в ревизии:
                    1) пожалуйста, остановите все продажи с этого момента,
                    2) пожалуйста, убедитесь, что после последней продажи прошло не менее 30 секунд, после чего нажмите кнопку "Завершить ревизию".</Alert>
            </Paper>
            <Paper className={classes.paper}>
                <RevisionTable
                    revisionProducts={revisionProducts}
                    activeStep={activeStep}
                />
            </Paper>
            <br />
            {outOfRevisionProducts.length > 0 &&
                <Fragment>
                    <Paper className={classes.paper}>
                        <Alert severity="warning" style={{ paddingRight: "6px" }}>
                            <AlertTitle>Внимание</AlertTitle>
                            На складе остались товары не прошедшие ревизию.
                            Выберите что с ними сделать: &nbsp;
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Select
                                    size="small"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    input={<BootstrapInput />}
                                >
                                    <MenuItem value={0}>Обнулить остатки</MenuItem>
                                    <MenuItem value={1}>Оставить как есть</MenuItem>
                                </Select>
                            </FormControl>
                        </Alert>
                    </Paper>
                    <Paper className={classes.paper}>
                        <RevisionTable
                            revisionProducts={outOfRevisionProducts}
                            activeStep={activeStep}
                            isOutOfRevision={isOutOfRevision}
                        />
                    </Paper>
                </Fragment>
            }
            <Paper className={classes.paper} style={{ padding: "10px" }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={6}>
                        <button
                            style={{ width: "100%" }}
                            className="btn btn-outline-secondary"
                            onClick={() => setActiveStep(1)}
                        >
                            Назад
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button
                            onClick={finishRevision}
                            style={{ width: "100%" }}
                            className="btn btn-success"
                        >
                            Завершить ревизию
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment >
    );
};