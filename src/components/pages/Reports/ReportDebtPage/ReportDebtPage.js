import React, { Fragment, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import SingleMaterialDate from "../../../ReusableComponents/SingleMaterialDate";
import Moment from "moment";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ReportDebtOptions from './ReportDebtOptions';
import ReportDebtTable from './ReportDebtTable';


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
function ReportDebtPage() {
    

    return (
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ReportDebtOptions />
          </Grid>
          <Grid item xs={12}>
              <ReportDebtTable />
          </Grid>
        </Grid>
      </Fragment>
    );
}

export default ReportDebtPage
