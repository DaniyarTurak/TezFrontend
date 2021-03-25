import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}))(Button);

export default function LimitAlert({
  topLimit,
  bottomLimit,
  closeLimitAlert,
  submitData,
}) {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>
            <strong style={{ fontSize: "0.875rem" }}>Лимит превышен!</strong>
          </AlertTitle>
          <p style={{ fontSize: "0.875rem" }}>
            Внимание, на данный товар установлен
            {topLimit && bottomLimit ? ` верхний наценочный лимит ${topLimit}% и нижний наценочный лимит ${bottomLimit}%`
              : topLimit && !bottomLimit ? ` верхний наценочный лимит ${topLimit}%`
                : !topLimit && bottomLimit ? ` нижний наценочный лимит ${bottomLimit}%` : ""}
            , убедитесь что цена продажи установлена верно!
          </p>
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Button fullWidth onClick={closeLimitAlert}>
          Назад
        </Button>
      </Grid>
      <Grid item xs={12}>
        <ColorButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={submitData}
        >
          Сохранить товар
        </ColorButton>
      </Grid>
    </Grid>
  );
}
