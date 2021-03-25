import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

export default function CouponBinding({
  bindingType,
  bindingTypes,
  brand,
  brands,
  category,
  categories,
  classes,
  isLoading,
  productBarcode,
  productSelectValue,
  productOptions,
  handleBindingTypeChange,
  onBarcodeKeyDown,
  onBarcodeChange,
  onBrandChange,
  onBrandListInput,
  onCategoryChange,
  productListChange,
  onProductListInput,
  onCategoryListInput,
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Привязка купона
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={bindingType}
              onChange={handleBindingTypeChange}
            >
              {bindingTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {(bindingType === "1" || bindingType === "2" || bindingType === "3") &&
        !isLoading ? (
          <Grid item xs={9}>
            {bindingType === "1" ? (
              <Autocomplete
                options={categories}
                value={category}
                onChange={onCategoryChange}
                noOptionsText="Категории не найдены"
                onInputChange={onCategoryListInput.bind(this)}
                filterOptions={(options) =>
                  options.filter((option) => option !== "")
                }
                getOptionLabel={(option) =>
                  option && option !== undefined ? option.label : ""
                }
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите категорию"
                    variant="outlined"
                  />
                )}
              />
            ) : bindingType === "2" ? (
              <Autocomplete
                options={brands}
                value={brand}
                onChange={onBrandChange}
                noOptionsText="Бренды не найдены"
                onInputChange={onBrandListInput.bind(this)}
                filterOptions={(options) =>
                  options.filter((option) => option !== "")
                }
                getOptionLabel={(option) =>
                  option && option !== undefined ? option.label : ""
                }
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите бренд"
                    variant="outlined"
                  />
                )}
              />
            ) : bindingType === "3" ? (
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      type="text"
                      name="barcode"
                      value={productBarcode}
                      className="form-control"
                      label="Штрих код"
                      onChange={onBarcodeChange}
                      onKeyDown={onBarcodeKeyDown}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={[...productSelectValue, ...productOptions]}
                    value={productSelectValue}
                    onChange={productListChange}
                    noOptionsText="Товар не найден"
                    onInputChange={onProductListInput}
                    filterOptions={(options) =>
                      options.filter((option) => option !== "")
                    }
                    getOptionLabel={(option) =>
                      option && option !== undefined ? option.label : ""
                    }
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
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        ) : (
          isLoading && (
            <Grid item xs={9}>
              <Typography component="div" key="h1" variant="h3">
                <Skeleton />
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Paper>
  );
}
