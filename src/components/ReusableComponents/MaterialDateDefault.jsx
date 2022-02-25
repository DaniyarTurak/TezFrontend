import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from 'moment';
import ErrorAlert from "./ErrorAlert";

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    fontSize: "1.2rem",
  },
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
  button_invisible: {
    display: "none"
  }
}));

export default function MaterialDateDefault({
  changeDate,
  dateFrom,
  dateFromChange,
  dateTo,
  dateToChange,
  searchInvoices,
  disableButton,
  maxDate,
  invisibleButton,
}) {
  const classes = useStyles();

  const checkDates = () => {
    if (moment(dateFrom).format("L") === "Invalid date" || moment(dateTo).format("L") === "Invalid date") {
      ErrorAlert("Введите корректную дату");
    }
    else {
      searchInvoices();
    }
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={2} className={classes.buttonGrid}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </Button>
        </Grid>
        <Grid item xs={2} className={classes.buttonGrid}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={() => changeDate("month")}
          >
            Текущий месяц
          </Button>
        </Grid>
        <Grid item xs={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDatePicker
              disableToolbar
              autoOk
              variant="inline"
              invalidDateMessage="Введите корректную дату"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-from-default"
              label=" Дата с:"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              inputProps={{
                style: { fontSize: ".875rem" },
              }}
              value={dateFrom}
              onChange={dateFromChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDatePicker
              disableToolbar
              autoOk
              variant="inline"
              invalidDateMessage="Введите корректную дату"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-to-default"
              label=" Дата по:"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              inputProps={{
                style: { fontSize: ".875rem" },
              }}
              value={dateTo}
              onChange={dateToChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              maxDate={maxDate}
              maxDateMessage={"Период можно задавать не более 1 месяца"}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2} className={classes.buttonGrid}>
          <Button
            className={invisibleButton? classes.button_invisible : classes.button}
            variant="outlined"
            color="primary"
            disabled={disableButton}
            // onClick={searchInvoices}
            onClick={checkDates}

          >
            Поиск
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
