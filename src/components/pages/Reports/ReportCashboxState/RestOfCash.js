import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import _ from "lodash";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function RestOfCash({shiftnumber, cashbox }) {
    useEffect(() => {
        getRestOfCash();
    }, []);

    const [cash, setCash] = useState();

    const getRestOfCash = () => {
        Axios.get("/api/report/cashbox/get_cash", {
            params: { cashbox, shiftnumber },
        })
            .then((res) => res.data)
            .then((result) => {
                console.log(result.rows[0].cash);
                setCash(result.rows[0].cash);
            })
            .catch((err) => {
                console.log(err);
                ErrorAlert(err);
            });
    };

    return (
        <Fragment>
            {cash ? <Fragment> {cash} тг. </Fragment> : <Fragment>0 тг.</Fragment>}
        </Fragment>
    );
}
