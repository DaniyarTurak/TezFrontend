import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { Alert, AlertTitle } from "@material-ui/lab";

export default function MarginAlerts() {
  return (
    <Fragment>
      <Grid item xs={12}>
        <Alert severity="error">
          <AlertTitle>
            <strong style={{ fontSize: "0.875rem" }}>Внимание!</strong>
          </AlertTitle>
          <p style={{ fontSize: "0.875rem" }}>
            Применение новой маржи не производит перерасчёт текущих цен!
          </p>
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>
            <strong style={{ fontSize: "0.875rem" }}>
              Выставление приоритета
            </strong>
          </AlertTitle>
          <p style={{ fontSize: "0.875rem" }}>
            Приоритет учёта маржи ведётся следующим образом:
            товар-бренд-категория.
          </p>
        </Alert>
      </Grid>
    </Fragment>
  );
}
