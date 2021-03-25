import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ABC from "./ABC";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1rem",
    flexGrow: 1,
  },
  paper: {
    height: 180,
    padding: theme.spacing(2),
    width: "35vh",
  },
  control: {
    padding: theme.spacing(2),
  },
}));

export default function ReportOptionsABCXYZ({
  abc_a,
  abc_b,
  xyz_x,
  xyz_y,
  onAbc_AChange,
  onAbc_BChange,
  onXyz_XChange,
  onXyz_YChange,
  isValidationError,
}) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={3}>
          {[0, 1].map((value) => (
            <Grid key={value} item>
              <Paper className={classes.paper}>
                <ABC
                  type={value}
                  abc_a={abc_a}
                  abc_b={abc_b}
                  onAbc_AChange={onAbc_AChange}
                  onAbc_BChange={onAbc_BChange}
                  xyz_x={xyz_x}
                  xyz_y={xyz_y}
                  onXyz_XChange={onXyz_XChange}
                  onXyz_YChange={onXyz_YChange}
                  isValidationError={isValidationError}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
