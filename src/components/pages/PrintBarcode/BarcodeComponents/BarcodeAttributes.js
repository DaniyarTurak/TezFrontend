import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function BarcodeAttributes({
  classes,
  selectedPrintType,
  brand,
  onBrandChange,
  attr,
  onAttrChange,
  fontSizes,
  onFontSizeChange,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container justify="center" spacing={1}>
            {selectedPrintType.value === "3" && (
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Название бренда (не обязательно)"
                    value={brand}
                    onChange={onBrandChange}
                  />
                </FormControl>
              </Grid>
            )}
            {selectedPrintType.value === "5" && (
              <Grid item xs={4}>
                <Autocomplete
                  options={fontSizes}
                  disableClearable
                  onChange={onFontSizeChange}
                  noOptionsText="Выберите размер"
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Размер текста"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  label="Введите дополнительный атрибут"
                  value={attr}
                  onChange={onAttrChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
