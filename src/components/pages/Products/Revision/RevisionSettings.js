import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Select from "react-select";
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";

export default function RevisionSettings({
    setRevNumber,
    point,
    setPoint,
    hardware,
    setActiveStep,
    setAdmin
}) {

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            border: '2px solid #17a2b8',
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                border: '2px solid #17a2b8',

            }
        })
    };

    const [points, setPoints] = useState([]);
    const [haveActive, setHaveActive] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setPoint("");
        getPoints();
    }, []);

    //список торговых точек
    const getPoints = () => {
        Axios.get("/api/revision/points")
            .then((res) => res.data)
            .then((list) => {
                let temp = [];
                list.forEach(pnt => {
                    temp.push({ label: pnt.name, value: pnt.stockid })
                });
                setPoints(temp);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    //при выборе точки проверить наличие открытой на ней ревизии 
    const pointChange = (e) => {
        let point = e.value;
        setPoint(point);
        setLoading(true);
        Axios.get("/api/revision/checkactive", { params: { point: point } })
            .then((res) => res.data)
            .then((revision) => {
                if (revision.length > 0) {
                    setAdmin(revision[0].admin);
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
                    setLoading(false);

                }
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

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
            Axios.post("/api/revision/revisionlist/add", { point })
                .then((res) => res.data)
                .then((res) => {
                    let response = res[0].revisionlist_add;
                    if (response.code === "success") {
                        setAdmin(JSON.parse(sessionStorage.getItem("isme-user-data")).id);
                        setRevNumber(response.revisionnumber);
                        setActiveStep(1);
                        setSweetAlert(null);
                        Alert.success("Ревизия успешно начата", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
                        setLoading(false);

                    } else {
                        Alert.error("Возникла непредвиденная ошибка", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
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
                    setLoading(false);
                });
        }
    };

    //удаление активной ревизии на точке
    const deleteRevision = (revisionnumber) => {
        Axios.post("/api/revision/revisionlist/delete", { revisionnumber })
            .then((res) => res.data)
            .then((res) => {
                if (res.revlist_delete.code === "success") {
                    setHaveActive(false);
                    setSweetAlert(null);
                    setLoading(false);
                    Alert.success("Ревизия успешно удалена", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                } else {
                    Alert.error("Возникла непредвиденная ошибка", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
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
            });
    };

    //продолжение активной ревизии на точке
    const continueRevision = (revisionnumber) => {
        setRevNumber(revisionnumber);
        setActiveStep(1);
        setLoading(false);
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
                        <Select
                            styles={customStyles}
                            options={points}
                            onChange={pointChange}
                            placeholder="Торговая точка"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <button
                        className="btn btn-success"
                        onClick={startRevision}
                        disabled={isLoading || haveActive}
                    >
                        Начать ревизию
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    );
};