import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Axios from "axios";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import Button from '@material-ui/core/Button';
import Alert from "react-s-alert";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function RevisionSettings(
    {
        handleNext,
        handleBack,
        steps,
        activeStep,
        point,
        setPoint,
        hardware,
        setHardware
    }) {
    const classes = useStyles();
    const [points, setPoints] = useState([]);

    useEffect(() => {
        getPoints();
    }, []);

    const getPoints = () => {
        Axios.get("/api/revision/point")
            .then((res) => res.data)
            .then((points) => {
                setPoints(points);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const startRevision = () => {
        console.log(point);
        console.log(hardware);
        if (point === "") {
            Alert.warning(`Выберите торговую точку`, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
            });
        }
        else {
            if (hardware === "") {
                Alert.warning(`Выберите оборудование ввода`, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 3000,
                });
            }
            else {
                handleNext();
            }
        }
    };

    return (
        <Fragment>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs={12}>
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel id="point">Торговая точка</InputLabel>
                        <Select
                            labelId="point"
                            value={point}
                            onChange={(e) => setPoint(e.target.value)}
                            label="Торговая точка"
                        >
                            {points.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>)
                            )}

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel id="hardware">Оборудование ввода</InputLabel>
                        <Select
                            labelId="hardware"
                            value={hardware}
                            onChange={(e) => setHardware(e.target.value)}
                            label="Оборудование ввода"
                        >
                            <MenuItem value={"camera"}>Камера</MenuItem>
                            <MenuItem value={"scanner"}>Сканер</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                        Назад
                        </Button>
                    <button
                        className="btn btn-success"
                        onClick={startRevision}
                    >
                        {activeStep === steps.length - 1 ? 'Завершить ревизию' : 'Далее'}
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    )
}