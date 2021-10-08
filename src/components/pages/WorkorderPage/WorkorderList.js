
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from "react-select";
import Axios from "axios";
import WorkorderListTable from "./WorkorderListTable";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 2,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 2,
        backgroundColor: '#17a2b8',
    },
}))(LinearProgress);

export default function WorkorderList({
    setPoint,
    setCounterparty,
    setWorkorderNumber,
    getWorkorderProducts,
    setWorkorderId,
    setOnlyView
}) {

    const [workorderList, setWorkorderList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getWorkorders();
    }, [])

    const getWorkorders = () => {
        setLoading(true);
        Axios.get("/api/workorder/list")
            .then((res) => res.data)
            .then((list) => {
                setWorkorderList(list);
                setLoading(false);
                console.log(list);
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

    return (
        <Fragment>
            {isLoading &&
                <Grid item xs={12}>
                    <BorderLinearProgress />
                </Grid>
            }
            {workorderList.length === 0 && !isLoading &&
                <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
                    Заказ-наряды не найдены
                </Grid>}
            {workorderList.length > 0 && !isLoading &&
                <Grid item xs={12}>
                    <WorkorderListTable
                        getWorkorders={getWorkorders}
                        setPoint={setPoint}
                        setCounterparty={setCounterparty}
                        workorderList={workorderList}
                        setOnlyView={setOnlyView}
                        getWorkorderProducts={getWorkorderProducts}
                        setWorkorderId={setWorkorderId}
                        setWorkorderNumber={setWorkorderNumber}
                    />
                </Grid>}
        </Fragment>
    )
}
