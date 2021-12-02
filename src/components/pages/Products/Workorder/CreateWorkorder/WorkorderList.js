
import React, { useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import WorkorderListTable from "./WorkorderListTable";


export default function WorkorderList({
    setPoint,
    setCounterparty,
    setWorkorderNumber,
    getWorkorderProducts,
    setWorkorderId,
    setOnlyView,
    getWorkorders,
    workorderList
}) {

    useEffect(() => {
        getWorkorders();
    }, [])

    return (
        <Fragment>
            {workorderList.length === 0 &&
                <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
                    Наряд-заказы не найдены
                </Grid>}
            {workorderList.length > 0 &&
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