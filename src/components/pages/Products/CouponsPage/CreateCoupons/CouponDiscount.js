import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import FormControl from "@material-ui/core/FormControl";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function CouponDiscount({
  classes,
  discount,
  handleDateChange,
  handleDiscountChange,
  selectedDate,
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <TextField
              style={{ marginTop: "1.02rem" }}
              id="discount"
              label="Скидка [%]"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              value={discount}
              onChange={handleDiscountChange}
            />
          </FormControl>
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
              label=" Годен по:"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </Paper>
  );
}
