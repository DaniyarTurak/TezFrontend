import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

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
  button: { width: "12rem" },
}));

export default function SingleMaterialDate({ value, onChange, label }) {
  const classes = useStyles();
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <KeyboardDatePicker
          disableToolbar
          autoOk
          variant="inline"
          invalidDateMessage="Введите корректную дату"
          format="dd.MM.yyyy"
          margin="normal"
          id="date-from-default"
          label={label}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          inputProps={{
            style: { fontSize: ".875rem" },
          }}
          value={value}
          onChange={onChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
