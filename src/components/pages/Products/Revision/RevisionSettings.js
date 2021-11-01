import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Select from "react-select";
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import ActiveRevisionTable from "./ActiveRevisionTable";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

export default function RevisionSettings({
    setRevNumber,
    point,
    setPoint,
    setActiveStep,
    setAdmin,
    type,
    setType,
    object,
    setObject
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

    const CustomRadio = withStyles({
        root: {
            color: "#17a2b8",
            '&$checked': {
                color: "#28a745",
            },
        },
        checked: {},
    })((props) => <Radio color="default" {...props} />);

    const [points, setPoints] = useState([]);
    const [haveActive, setHaveActive] = useState(false);
    const [sweetAlert, setSweetAlert] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [revisionList, setRevisionList] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setPoint("");
        setType(1);
        getPoints();
        getBrands();
        getCategories();
        getActiveRevision();
    }, []);

    const getActiveRevision = () => {
        Axios.get("/api/revision/listactive")
            .then((res) => res.data)
            .then((list) => {
                setRevisionList(list)
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

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

    const getBrands = (e) => {
        Axios.get("/api/brand/search", {
            params: { deleted: false, brand: e ? e : "" },
        })
            .then((res) => res.data)
            .then((list) => {
                let temp = [];
                list.forEach(br => {
                    temp.push({ label: br.brand, value: br.id })
                });
                temp.unshift({ label: "Без бренда", value: 0 });
                setBrands(temp);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const getCategories = (e) => {
        Axios.get("/api/categories/search", {
            params: { category: e ? e : "" },
        })
            .then((res) => res.data)
            .then((res) => {
                let temp = [];
                res.forEach(cat => {
                    temp.push({ label: cat.name, value: cat.id })
                });
                temp.unshift({ label: "Без категории", value: 0 });
                setCategories(temp);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //при выборе точки проверить наличие открытой на ней ревизии 
    const pointChange = (e) => {
        setType(1);
        setObject(null);
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
                            onConfirm={() => continueRevision(revision[0])}
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
            if ((type === 2 && (!object || Array.isArray(object))) || (type === 3 && (!object || Array.isArray(object)))) {
                Alert.warning(`Выберите ${type === 2 ? "бренд" : type === 3 ? "категорию" : ""}`, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 3000,
                });
            }
            else {
                Axios.post("/api/revision/revisionlist/add", { point, type, object: object ? object.value : null })
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
        }
    };

    //удаление активной ревизии на точке
    const deleteRevision = (revisionnumber) => {
        Axios.post("/api/revision/revisionlist/delete", { revisionnumber })
            .then((res) => res.data)
            .then((res) => {
                if (res.revisionlist_delete.code === "success") {
                    setHaveActive(false);
                    setSweetAlert(null);
                    setLoading(false);
                    Alert.success("Ревизия успешно удалена", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    getActiveRevision();
                    setLoading(false);
                } else {
                    Alert.error(res.revisionlist_delete.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setSweetAlert(null);
                    getActiveRevision();
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
    const continueRevision = (revision) => {
        console.log(revision);
        setAdmin(revision.admin)
        setRevNumber(revision.revisionnumber);
        setPoint(revision.point);
        setType(revision.type);
        setObject({ value: revision.type_id, label: revision.type_name });
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
                        <Select
                            styles={customStyles}
                            options={points}
                            onChange={pointChange}
                            placeholder="Торговая точка"
                        />
                    </FormControl>
                </Grid>

                {point !== "" && <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup row name="type"
                            value={type}
                            onChange={(e) => { setType(Number(e.target.value)); setObject(null) }}
                        >
                            <FormControlLabel
                                value={1}
                                control={<CustomRadio />}
                                label="Все товары"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value={2}
                                control={<CustomRadio />}
                                label="По бренду"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value={3}
                                control={<CustomRadio />}
                                label="По категории"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>}
                {type !== 1 && <Grid item xs={12}>
                    <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
                        <Select
                            styles={customStyles}
                            options={type === 2 ? brands : (type === 3 ? categories : [])}
                            onChange={(e) => { setObject(e) }}
                            onInputChange={(e) => {
                                if (type === 2) {
                                    getBrands(e);
                                }
                                else {
                                    if (type === 3) {
                                        getCategories(e);
                                    }
                                }
                            }
                            }
                            placeholder={type === 2 ? "Бренд" : type === 3 ? "Категория" : ""}
                        />
                    </FormControl>
                </Grid>}
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
            <Grid
                container
                spacing={3}
            >
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
                {revisionList.length > 0 &&
                    <Grid item xs={12}>
                        <ActiveRevisionTable
                            revisionList={revisionList}
                            setRevisionList={setRevisionList}
                            deleteRevision={deleteRevision}
                            setSweetAlert={setSweetAlert}
                            continueRevision={continueRevision}
                        />
                    </Grid>}
            </Grid>
        </Fragment>
    );
};