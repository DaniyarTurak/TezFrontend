import React, { Fragment, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import SingleMaterialDate from "../../../ReusableComponents/SingleMaterialDate";
import Moment from "moment";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    buttonGrid: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      marginBottom: "0.5rem",
    },
    button: {
      width: "12rem",
      minHeight: "3.5rem",
      fontSize: ".875rem",
      textTransform: "none",
    },
  }));
function ReportDebtOptions() {
    const [date, setDate] = useState(Moment().format("YYYY-MM-DD"));
    const classes = useStyles();

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SingleMaterialDate value={date} label={"Дата"} />
          </Grid>
          <Grid item xs={2} className={classes.buttonGrid}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
            >
              Поиск
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
}

export default ReportDebtOptions