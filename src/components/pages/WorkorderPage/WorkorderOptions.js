
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from "react-select";
import Axios from "axios";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import Breadcrumb from "../../Breadcrumb";
import TextField from "@material-ui/core/TextField";
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';

export default function WorkorderOptions({
    point,
    setPoint,
    counterparty,
    setCounterparty,
    workorderId,
    setWorkorderId,
    workorderNumber,
    setWorkorderNumber,
    setWorkorderProducts,
    getWorkorderProducts
}) {
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            // border: '2px solid #17a2b8',
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                border: '2px solid #17a2b8',

            }
        })
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

    const [points, setPoints] = useState([]);
    const [counterparties, setCounterparties] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [haveActive, setHaveActive] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);

    useEffect(() => {
        setWorkorderNumber("");
        getPoints();
        getCounterparties();
    }, []);

    useEffect(() => {
        if (point !== "" && counterparty !== "") {
            checkActive();
        }
    }, [point, counterparty]);

    const getPoints = () => {
        Axios.get("/api/revision/points")
            .then((res) => res.data)
            .then((points) => {
                let temp = [];
                points.forEach(pnt => {
                    temp.push({ label: pnt.name, value: pnt.stockid })
                });
                setPoints(temp);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const getCounterparties = () => {
        Axios.get("/api/counterparties")
            .then((res) => res.data)
            .then((counterparties) => {
                let temp = [];
                counterparties.forEach(ct => {
                    temp.push({ label: ct.name + " | " + ct.bin, value: ct.id })
                });
                setCounterparties(temp);
            })
            .catch((err) => console.log(err));
    };



    const pointChange = (e) => {
        setPoint(e.value);
    };

    const counterpartyChange = (e) => {
        setCounterparty(e.value)
    };

    const checkActive = () => {
        setLoading(true);
        Axios.get("/api/workorder/checkactive", { params: { point: point, counterparty: counterparty } })
            .then((res) => res.data)
            .then((workorder) => {
                console.log(workorder);
                if (workorder.length > 0) {
                    setHaveActive(true);
                    setSweetAlert(
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText={"Продолжить"}
                            cancelBtnText={"Нет, удалить заказ-наряд"}
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            title={"Внимание"}
                            allowEscape={false}
                            closeOnClickOutside={false}
                            onConfirm={() => continueWorkorder(workorder[0])}
                            onCancel={() => deleteWorkorder(workorder[0])}
                        >
                            У Вас имеется незавершенный заказ-наряд с такими параметрами, хотите продолжить заполнение?
                        </SweetAlert>)
                }
                else {
                    setHaveActive(false);
                    setLoading(false);

                }
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

    const continueWorkorder = (workorder) => {
        setWorkorderId(workorder.id);
        setWorkorderNumber(workorder.workorder_number);
        getWorkorderProducts(workorder.id);
        setSweetAlert(null);
        setLoading(false);
    };

    const deleteWorkorder = (workorder) => {
        console.log(workorder.id);
        Axios.post("/api/workorder/delete", { workorderId: workorder.id })
            .then((res) => res.data)
            .then((res) => {
                console.log(res);
                if (res.code === "success") {
                    setWorkorderId(res.workorder_id);
                    setSweetAlert(null);
                    setLoading(false);
                }
                else {
                    Alert.error(res.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSweetAlert(null);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setSweetAlert(null);
                setLoading(false);
            });
    };


    const createWorkorder = () => {
        console.log(point, counterparty);
        Axios.post("/api/workorder/manage", { point, counterparty })
            .then((res) => res.data[0].workorder_management)
            .then((res) => {
                console.log(res);
                if (res.code === "success") {
                    setWorkorderId(res.workorder_id);
                    setLoading(false);
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
                Alert.error(err, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
                setLoading(false);
            });
    };

    return (
        <Fragment>
            {sweetAlert}
            <Grid
                container
                spacing={2}
            >
                <Grid item xs={12} style={{ paddingBottom: "0px" }}>
                    <Breadcrumb content={[
                        { caption: "Настройки" },
                        { caption: "Заказ-наряд" },
                        { caption: "Новый заказ-наряд", active: true },
                    ]} />
                </Grid>
                <Grid item xs={3}>
                    <label style={{ fontSize: "12px", color: point === "" || !point ? "red" : "black" }}>*Торговая точка</label>
                    <Select
                        styles={customStyles}
                        options={points}
                        onChange={pointChange}
                        placeholder="Торговая точка"
                    />
                </Grid>
                <Grid item xs={3}>
                    <label style={{ fontSize: "12px", color: counterparty === "" || !counterparty ? "red" : "black" }}>*Контрагент</label>
                    <Select
                        styles={customStyles}
                        options={counterparties}
                        onChange={counterpartyChange}
                        placeholder="Контрагент"
                    />
                </Grid>
                <Grid item xs={3}>
                    <label style={{ fontSize: "12px" }}>Номер заказ-наряда</label>
                    <TextField
                        classes={{
                            root: classesAC.root,
                        }}
                        placeholder="Номер заказ-наряда"
                        variant="outlined"
                        size="small"
                        value={workorderNumber}
                        onChange={(e) => setWorkorderNumber(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3} style={{ marginTop: "24px" }}>
                    <button
                        className="btn btn-success"
                        onClick={createWorkorder}
                        disabled={point === "" || counterparty === "" || isLoading || haveActive ? true : false}

                    >
                        Далее
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    )
}