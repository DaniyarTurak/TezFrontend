import React from "react";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  labelRoot: {
    fontSize: ".875rem",
  },
});

export default function AutocompleteSelect({
  value,
  defaultValue,
  options,
  onChange,
  onInputChange,
  noOptions,
  label,
  isDisabled,
}) {
  const classes = useStyles();
  return (
    <Autocomplete
      value={value}
      defaultValue={defaultValue}
      options={options}
      disableClearable
      disabled={isDisabled}
      onChange={onChange}
      onInputChange={onInputChange}
      noOptionsText={noOptions}
      renderOption={(option) => (
        <Typography style={{ fontSize: ".875rem" }}>{option.label}</Typography>
      )}
      getOptionSelected={(option, value) => option.label === value.label}
      getOptionLabel={(option) => (option ? option.label : "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          inputProps={{
            ...params.inputProps,
            style: { fontSize: ".875rem" },
          }}
        />
      )}
    />
  );
}
