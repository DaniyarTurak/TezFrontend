import React, { Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  option: {
    marginTop: "1rem",
    color: theme.palette.text.secondary,
  },
  labelRoot: {
    fontSize: ".875rem",
  },
  paragraph: {
    display: "flex",
    justifyContent: "center",
    opacity: "60%",
  },
}));

export default function AutocompleteProductBarcode({
  barcode,
  onBarcodeChange,
  onBarcodeKeyDown,
  productSelectValue,
  onProductChange,
  onProductListInput,
  products,
  isLoadingProducts,
}) {
  const classes = useStyles();
  return (
    <Fragment>
      <Grid item xs={6}>
        <TextField
          type="text"
          fullWidth
          name="barcode"
          value={barcode}
          className="form-control"
          label="Штрих код"
          onChange={onBarcodeChange}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          onKeyDown={onBarcodeKeyDown}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          value={productSelectValue}
          disableClearable
          onChange={onProductChange}
          onInputChange={onProductListInput}
          noOptionsText="Товары не найдены"
          options={
            productSelectValue === ""
              ? products
              : [...productSelectValue, ...products]
          }
          filterSelectedOptions
          filterOptions={(options) => options.filter((option) => option !== "")}
          getOptionLabel={(option) => (option ? option.label : "")}
          getOptionSelected={(option) =>
            option
              ? option.label === productSelectValue.label
              : productSelectValue
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Наименование товара"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoadingProducts ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Grid>
    </Fragment>
  );
}
