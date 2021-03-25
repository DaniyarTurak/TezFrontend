import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function InvoiceOptions({
  selectedPrintType,
  printTypesChanged,
  printTypes,
  classes,
  useBrand,
  handleUseBrandChange,
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="printTypes">Формат штрихкода</InputLabel>
            <Select
              labelId="printTypes"
              id="printTypes"
              value={selectedPrintType}
              onChange={printTypesChanged}
            >
              {printTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {(selectedPrintType === "1" || selectedPrintType === "3") && (
          <Grid item xs={4}>
            <FormControlLabel
              style={{ marginTop: "1rem" }}
              control={
                <Checkbox
                  checked={useBrand}
                  onChange={handleUseBrandChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Показывать бренд"
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
