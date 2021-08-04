import React, { Fragment, useState, useEffect } from "react";
import RevisionTable from "./RevisionTable";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function RevisonFinish({
    revNumber,
    point,
    activeStep,
    setActiveStep,
    revisionProducts
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

    const [isLoading, setLoading] = useState(false);
    const [comparedProducts, setComparedProducts] = useState([]);

    useEffect(() => {
        compareProducts();
    }, []);

    const compareProducts = () => {
        Axios.get("/api/revision/comparetemprevision", { params: { point } })
            .then((res) => res.data)
            .then((list) => {
                if (list.length > 0) {
                    console.log("товары без ревизии");
                    setComparedProducts(list);
                }
            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    }

    return (
        <Fragment>
            <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={12} style={{ padding: "0px" }}>
                        <RevisionTable
                            revisionProducts={revisionProducts}
                            activeStep={activeStep}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
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
                            onClick={compareProducts}
                            style={{ width: "100%" }}
                            className="btn btn-success"
                        >
                            Завершить ревизию
                        </button>
                    </Grid>
                </Grid>
            </Paper>
        </Fragment>
    );
};