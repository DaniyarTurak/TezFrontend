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
import ReactAlert from "react-s-alert";
import GetAppIcon from '@material-ui/icons/GetApp';
import SweetAlert from "react-bootstrap-sweetalert";

export default function RevisonFinish({
    revNumber,
    point,
    type,
    object,
    activeStep,
    setActiveStep,
    admin
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
    const [sweetAlert, setSweetAlert] = useState(null);
    const [revisionProducts, setRevisionProducts] = useState([]);

    useEffect(() => {
        getRevisionProducts()
        compareProducts();
    }, []);

    const getRevisionProducts = () => {
        const params = {
            revisionnumber: revNumber,
            point: point,
            all: true
        }
        setLoading(true);
        Axios.get("/api/revision/revisiontemp/list", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                setRevisionProducts(products);
                setLoading(false);
            })
            .catch((err) => {
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    }

    const compareProducts = () => {
        Axios.get("/api/revision/comparetemprevision", { params: { point, type, object: object ? object.value : null } })
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
        if (admin !== JSON.parse(sessionStorage.getItem("isme-user-data")).id) {
            ReactAlert.warning("?????????????? ?????????? ?????????????????? ???????????? ??????????????????????????", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
            });
        }
        else {
            if (outOfRevisionProducts.length > 0) {
                if (condition !== "") {
                    setLoading(true);
                    Axios.post("/api/revision/revisiondiary/add", {
                        outofrevision: condition,
                        point: point,
                        revnumber: revNumber,
                    })
                        .then((data) => {
                            return data.data;
                        })
                        .then((resp) => {
                            if (resp[0].revisiondiary_add.code === "success") {
                                setSweetAlert(
                                    <SweetAlert
                                        success
                                        showCancel
                                        confirmBtnText={"???????????? ?????????? ??????????????"}
                                        cancelBtnText={"???????????????????? ??????????"}
                                        confirmBtnBsStyle="success"
                                        cancelBtnBsStyle="success"
                                        title={""}
                                        allowEscape={false}
                                        closeOnClickOutside={false}
                                        onConfirm={() => setActiveStep(0)}
                                        onCancel={toReport}
                                    >
                                        ?????????????? ?????????????? ??????????????????
                                    </SweetAlert>)
                                ReactAlert.success("??????????????", {
                                    position: "top-right",
                                    effect: "bouncyflip",
                                    timeout: 3000,
                                });
                                setLoading(false);
                            }
                            else {
                                ReactAlert.error(resp[0].revisiondiary_add.text, {
                                    position: "top-right",
                                    effect: "bouncyflip",
                                    timeout: 3000,
                                });
                                setLoading(false);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            ReactAlert.error("???????????? ???????????????? ???? ????????????????", {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 3000,
                            });
                            setLoading(false);
                        });
                }
                else {
                    ReactAlert.warning("???? ???????????? ???????????????? ???????????? ???? ?????????????????? ??????????????. ???????????????? ?????? ?? ???????? ??????????????.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 3000,
                    });
                    setLoading(false);
                }
            }
            else {
                setLoading(true);
                Axios.post("/api/revision/revisiondiary/add", {
                    outofrevision: 2,
                    point: point,
                    revnumber: revNumber,
                })
                    .then((data) => {
                        return data.data;
                    })
                    .then((resp) => {
                        if (resp[0].revisiondiary_add.code === "success") {
                            setSweetAlert(
                                <SweetAlert
                                    success
                                    showCancel
                                    confirmBtnText={"???????????? ?????????? ??????????????"}
                                    cancelBtnText={"???????????????????? ??????????"}
                                    confirmBtnBsStyle="success"
                                    cancelBtnBsStyle="success"
                                    title={""}
                                    allowEscape={false}
                                    closeOnClickOutside={false}
                                    onConfirm={() => setActiveStep(0)}
                                    onCancel={toReport}
                                >
                                    ?????????????? ?????????????? ??????????????????
                                </SweetAlert>)
                            ReactAlert.success("??????????????", {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 3000,
                            });
                            setLoading(false);
                        }
                        else {
                            ReactAlert.error(resp[0].revisiondiary_add.text, {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 3000,
                            });
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        ReactAlert.error("???????????? ???????????????? ???? ????????????????", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 3000,
                        });
                        setLoading(false);
                    });
            }
        }
    };

    const inRevisionToExcel = () => {
        setLoading(true);
        Axios({
            method: "POST",
            url: "/api/revision/inrevisiontoexcel",
            data: { revisionProducts },
            responseType: "blob",
        })
            .then((res) => res.data)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `???????????? ?????????????????? ??????????????.xlsx`);
                document.body.appendChild(link);
                link.click();
                setLoading(false);
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    const outOfRevisionToExcel = () => {
        setLoading(true);
        Axios({
            method: "POST",
            url: "/api/revision/outofrevisiontoexcel",
            data: { outOfRevisionProducts },
            responseType: "blob",
        })
            .then((res) => res.data)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `???????????? ?????????????????? ??????????????.xlsx`);
                document.body.appendChild(link);
                link.click();
                setLoading(false);
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    const toReport = () => {
        const url = "/usercabinet/stockreport";
        const link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.click();
    };

    return (
        <Fragment>
            {sweetAlert}
            <Paper className={classes.paper}>
                <Alert severity="info">
                    <AlertTitle>??????????!</AlertTitle>
                    ???????? ???? ?????????? ?????????????? ???????? ?????????????? ?????????????? ???? ????????????, ???? ?????? ?????????? ???????????? ??????????????????????????.</Alert>
            </Paper>
            <Paper className={classes.paper}>

                <Alert severity="info">
                    <AlertTitle>??????????!</AlertTitle>
                    ?????? ?????????????????????? ?????????? ???????????? ?? ??????????????:
                    1) ????????????????????, ???????????????????? ?????? ?????????????? ?? ?????????? ??????????????,
                    2) ????????????????????, ??????????????????, ?????? ?????????? ?????????????????? ?????????????? ???????????? ???? ?????????? 30 ????????????, ?????????? ???????? ?????????????? ???????????? "?????????????????? ??????????????".</Alert>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={8} style={{ padding: "10px" }}>
                        ???????????? ?????????????????? ??????????????
                    </Grid>
                    <Grid item xs={4} style={{ padding: "10px", textAlign: "right" }}>
                        <button
                            onClick={inRevisionToExcel}
                            style={{ maxWidth: "120px", padding: "0px" }}
                            className="btn btn-success"
                        >
                            &nbsp; Excel &nbsp;
                            <GetAppIcon size="small" />
                        </button>
                    </Grid>
                </Grid>
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
                            <AlertTitle>????????????????</AlertTitle>
                            ???? ???????????? ???????????????? ???????????? ???? ?????????????????? ??????????????.
                            ???????????????? ?????? ?? ???????? ??????????????: &nbsp;
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Select
                                    size="small"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    input={<BootstrapInput />}
                                >
                                    <MenuItem value={0}>???????????????? ??????????????</MenuItem>
                                    <MenuItem value={1}>???????????????? ?????? ????????</MenuItem>
                                </Select>
                            </FormControl>
                        </Alert>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={8} style={{ padding: "10px" }}>
                                ???????????? ???? ?????????????????? ??????????????
                            </Grid>
                            <Grid item xs={4} style={{ padding: "10px", textAlign: "right" }}>
                                <button
                                    disabled={isLoading}
                                    onClick={outOfRevisionToExcel}
                                    style={{ maxWidth: "120px", padding: "0px" }}
                                    className="btn btn-success"
                                >
                                    &nbsp; Excel &nbsp;
                                    <GetAppIcon size="small" />
                                </button>
                            </Grid>
                        </Grid>
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
                            disabled={isLoading}
                            style={{ width: "100%" }}
                            className="btn btn-outline-secondary"
                            onClick={() => setActiveStep(1)}
                        >
                            ??????????
                        </button>
                    </Grid>
                    <Grid item xs={6}>
                        <button
                            disabled={isLoading}
                            onClick={finishRevision}
                            style={{ width: "100%" }}
                            className="btn btn-success"
                        >
                            ?????????????????? ??????????????
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment >
    );
};