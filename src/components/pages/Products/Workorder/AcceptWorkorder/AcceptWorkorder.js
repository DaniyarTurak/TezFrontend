import React, { useState, Fragment, useEffect } from "react";
import AcceptedListTable from "./AcceptedListTable";
import CreatedListTable from "./CreatedListTable";
import WorkorderDetails from "./WorkorderDetails";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from '@material-ui/core/Grid';
import Breadcrumb from "../../../../Breadcrumb";

export default function AcceptWorkorder() {
    const [workorderId, setWorkorderId] = useState("")
    const [acceptedList, setAcceptedList] = useState([]);
    const [createdList, setCreatedList] = useState([]);
    const [onlyView, setOnlyView] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getWorkorders();
    }, [])

    const getWorkorders = () => {
        setLoading(true);
        Axios.get("/api/workorder/list")
            .then((res) => res.data)
            .then((list) => {
                let c = [];
                let a = [];
                list.forEach(el => {
                    if (el.status === 'CREATED' || el.status === 'INPROCESS') {
                        c.push(el)
                    }
                    else {
                        if (el.status === 'APPROVED')
                        a.push(el)
                    }
                    setAcceptedList(a);
                    setCreatedList(c)
                });
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                ErrorAlert(err);
            });
    };

    return (
        <Fragment>
            {activePage === 1 &&
                <Fragment>
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid item xs={12} style={{ paddingBottom: "0px" }}>
                            <Breadcrumb content={[
                                { caption: "Управление товарами" },
                                { caption: "Обработка наряд-заказова" },
                                { caption: "Список наряд-заказова", active: true },
                            ]} />
                        </Grid>
                        <Grid item xs={12}>
                            <CreatedListTable
                                workorderId={workorderId}
                                isLoading={isLoading}
                                setLoading={setLoading}
                                workorderList={createdList}
                                setOnlyView={setOnlyView}
                                setWorkorderList={setCreatedList}
                                setWorkorderId={setWorkorderId}
                                setActivePage={setActivePage}
                                getWorkorders={getWorkorders}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <AcceptedListTable
                                is={isLoading}
                                setLoading={setLoading}
                                setOnlyView={setOnlyView}
                                workorderList={acceptedList}
                                setWorkorderList={setAcceptedList}
                                setWorkorderId={setWorkorderId}
                                setActivePage={setActivePage}
                            />
                        </Grid>
                    </Grid>
                </Fragment>
            }
            {activePage === 2 && <WorkorderDetails
                isLoading={isLoading}
                workorderId={workorderId}
                setLoading={setLoading}
                workorderProducts={createdList}
                setWorkorderId={setWorkorderId}
                onlyView={onlyView}
                setOnlyView={setOnlyView}
                setActivePage={setActivePage}
                getWorkorders={getWorkorders}

            />}
        </Fragment>
    )
}