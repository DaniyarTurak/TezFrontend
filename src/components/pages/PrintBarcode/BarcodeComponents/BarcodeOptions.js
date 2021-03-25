import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";

export default function BarcodeOptions({
  classes,
  selectedPrintType,
  points,
  pointsChange,
  handleInvoice,
  productBarcode,
  onBarcodeKeyDown,
  onBarcodeChange,
  productOptions,
  productListChange,
  onProductListChange,
  printTypes,
  printTypesChanged,
  productSelectValue,
}) {
  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={points}
                onChange={pointsChange}
                noOptionsText="Выберите торговую точку из списка"
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Торговая точка"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{ minHeight: "3.5rem" }}
                variant="outlined"
                color="primary"
                fullWidth
                size="large"
                onClick={handleInvoice}
              >
                Печать по накладной
              </Button>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  type="text"
                  name="barcode"
                  value={productBarcode}
                  className="form-control"
                  label="Введите или отсканируйте штрих код"
                  onChange={onBarcodeChange}
                  onKeyDown={onBarcodeKeyDown}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={[...productSelectValue, ...productOptions]}
                value={productSelectValue}
                onChange={productListChange}
                noOptionsText="Товар не найден"
                onInputChange={onProductListChange}
                filterOptions={(options) =>
                  options.filter((option) => option !== "")
                }
                getOptionLabel={(option) => (option ? option.label : "")}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Наименование товара"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                value={selectedPrintType}
                options={printTypes}
                onChange={printTypesChanged}
                noOptionsText="Формат не найден"
                getOptionLabel={(option) => (option ? option.label : "")}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Формат штрихкода"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
