import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import InputLabel from '@material-ui/core/InputLabel';

export default function RevisionSettings({
    setRevNumber,
    point,
    setPoint,
    hardware,
    setHardware,
    setActiveStep
}) {


    const [points, setPoints] = useState([]);
    const [haveActive, setHaveActive] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);

    useEffect(() => {
        getPoints();
    }, []);

    //список торговых точек
    const getPoints = () => {
        Axios.get("/api/point")
            .then((res) => res.data)
            .then((list) => {
                setPoints(list);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    //при выборе точки проверить наличие открытой на ней ревизии 
    const pointChange = (e) => {
        let point = e.target.value;
        setPoint(point);
        Axios.get("/api/revision/checkactive", { params: { point: point } })
            .then((res) => res.data)
            .then((revision) => {
                if (revision.length > 0) {
                    setHaveActive(true);
                    setSweetAlert(
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText={"Продолжить"}
                            cancelBtnText={"Нет, удалить ревизию"}
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            title={"Внимание"}
                            allowEscape={false}
                            closeOnClickOutside={false}
                            onConfirm={() => continueRevision(revision[0].revisionnumber)}
                            onCancel={() => deleteRevision(revision[0].revisionnumber)}
                        >
                            У Вас имеется незавершенная ревизия, хотите продолжить заполнение?
                        </SweetAlert>)
                }
                else {
                    setHaveActive(false);
                }
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    }

    const hardwareChange = (e) => {
        setHardware(e.target.value);
    }

    //запуск ревизии
    const startRevision = () => {
        if (point === "") {
            Alert.warning(`Выберите торговую точку`, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
            });
        }
        else {
            if (hardware === "") {
                Alert.warning(`Выберите устройство ввода`, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 3000,
                });
            }
            else {
                console.log({ point, hardware });
                Axios.post("/api/revision/revisionlist/add", { point })
                    .then((res) => res.data)
                    .then((res) => {
                        let response = JSON.parse(res[0].revisionlist_add);
                        if (response.code === "success") {
                            setActiveStep(1);
                            return Alert.success("Ревизия успешно начата", {
                                position: "top-right",
                                effect: "bouncyflip",
                                timeout: 2000,
                            });

                        } else {
                            return Alert.error("Возникла непредвиденная ошибка", {
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
        }
    };

    //удаление активной ревизии на точке
    const deleteRevision = (revisionnumber) => {
        Axios.post("/api/revision/revisionlist/delete", { revisionnumber })
            .then((res) => res.data)
            .then((res) => {
                let response = JSON.parse(res);
                if (response.result === "success") {
                    setHaveActive(false);
                    setSweetAlert(null);
                    return Alert.success("Ревизия успешно удалена", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });

                } else {
                    return Alert.error("Возникла непредвиденная ошибка", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //продолжение активной ревизии на точке
    const continueRevision = (revisionnumber) => {
        setRevNumber(revisionnumber);
        setActiveStep(1);
    };

    return (
        <Fragment>
            {sweetAlert}
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs={12}>
                    <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
                        <InputLabel>Торговая точка</InputLabel>
                        <Select
                            value={point}
                            onChange={pointChange}
                            label="Торговая точка"
                            placeholder="Торговая точка"
                            fullWidth
                        >
                            {points.map((pnt) => (
                                <MenuItem key={pnt.id} value={pnt.id}>{pnt.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
                        <InputLabel>Оборудование для ввода</InputLabel>
                        <Select
                            fullWidth
                            value={hardware}
                            onChange={hardwareChange}
                            label="Оборудование для ввода"
                            placeholder="Оборудование для ввода"
                        >
                            <MenuItem value={"camera"}>Камера</MenuItem>
                            <MenuItem value={"scanner"}>Сканер</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <button
                        className="btn btn-success"
                        onClick={startRevision}
                        disabled={haveActive}
                    >
                        Начать ревизию
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    );
};