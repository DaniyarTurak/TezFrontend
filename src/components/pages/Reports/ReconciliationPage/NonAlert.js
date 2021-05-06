import React, { Fragment, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Alert, AlertTitle } from "@material-ui/lab";
import Link from '@material-ui/core/Link';
import NonTable from "./NonTable";

export default function NonAlert({ products }) {
    const [show, setShow] = useState(false);

    return (
        <Fragment>
            <Grid item xs={12}>
                <Alert severity="error">
                    <AlertTitle>
                        <strong style={{ fontSize: "0.875rem" }}>Внимание!</strong>
                    </AlertTitle>
                    <p style={{ fontSize: "0.875rem" }}>
                        Имеются товары не прошедшие сверку!
                    </p>
                    <Link href="#"  style={{ fontSize: "0.875rem" }} onClick={() => { setShow(!show) }}>
                        {show ? "Скрыть" : "Показать"}
                    </Link>
                    {show && <Grid item xs={12}>
                        <NonTable products={products} />
                    </Grid>}
                </Alert>
            </Grid>

        </Fragment>
    );
}