
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Select from "react-select";
import Axios from "axios";
import WorkorderListTable from "./WorkorderListTable";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

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
            {workorderList.length === 0 ?
                <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
                    Заказ-наряды не найдены
                </Grid>
                :
                <Grid item xs={12}>
                    <WorkorderListTable
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
