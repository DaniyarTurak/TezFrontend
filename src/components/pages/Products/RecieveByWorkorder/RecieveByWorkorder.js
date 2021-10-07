import React, { useState, Fragment } from "react";
import WorkorderListTable from "./WorkorderListTable";
import WorkorderDetails from "./WorkorderDetails";
import WorkorderAddAttributes from "./WorkorderAddAttributes";

export default function RecieveByWorkorder() {
    const [workorderId, setWorkorderId] = useState("")
    const [workorderList, setWorkorderList] = useState([]);
    const [onlyView, setOnlyView] = useState(false);
    const [activePage, setActivePage] = useState(1);

    return (
        <Fragment>
            {activePage === 1 &&
                <WorkorderListTable
                    setOnlyView={setOnlyView}
                    workorderList={workorderList}
                    setWorkorderList={setWorkorderList}
                    setWorkorderId={setWorkorderId}
                    setActivePage={setActivePage}
                />}
            {activePage === 2 && <WorkorderDetails
                workorderId={workorderId}
                setWorkorderId={setWorkorderId}
                onlyView={onlyView}
                setOnlyView={setOnlyView}
                setActivePage={setActivePage}
            />}
            {activePage === 3 && <WorkorderAddAttributes
                workorderId={workorderId}
                setWorkorderId={setWorkorderId}
                setActivePage={setActivePage}
            />}
        </Fragment>
    )
}