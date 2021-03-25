import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { Button } from "@material-ui/core";

export default function DateTime({
  dateFrom,
  dateTo,
  classes,
  dateFromChange,
  dateToChange,
  getCompanies,
}) {
  return (
    <Fragment>
      <Grid item xs={3}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          <KeyboardDatePicker
            disableToolbar
            autoOk
            variant="inline"
            invalidDateMessage="Введите корректную дату"
            format="dd.MM.yyyy"
            margin="normal"
            id="date-picker-inline"
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
              },
            }}
            label=" Дата с:"
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
            id="date-picker-inline"
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
              },
            }}
            label=" Дата по:"
            value={dateTo}
            onChange={dateToChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={3} className={classes.buttonGrid}>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          size="large"
          onClick={getCompanies}
        >
          Поиск
        </Button>
      </Grid>
    </Fragment>
  );
}
