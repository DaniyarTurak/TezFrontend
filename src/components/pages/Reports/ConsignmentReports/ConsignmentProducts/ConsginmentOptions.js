import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CategorySelect from "../../../../ReusableComponents/CategorySelect";

export default function ConsginmentOptions({
  brand,
  brands,
  category,
  classes,
  consignator,
  categories,
  consignators,
  handleConsignment,
  onBrandChange,
  onBrandListInput,
  onCategoryChange,
  onCategoryListInput,
  onConsignatorChange,
  onConsignatorListInput,
  isLoading,
  setCategory
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Autocomplete
            value={consignator}
            defaultValue={consignator}
            options={consignators}
            onChange={onConsignatorChange}
            disableClearable
            renderOption={(option) => (
              <Typography style={{ fontSize: ".875rem" }}>
                {option.label}
              </Typography>
            )}
            noOptionsText="Контрагенты не найдены"
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.label === consignator.label}
            onInputChange={onConsignatorListInput}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Контрагент"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: ".875rem" },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            value={brand}
            defaultValue={brand}
            options={brands}
            onChange={onBrandChange}
            onInputChange={onBrandListInput}
            disableClearable
            renderOption={(option) => (
              <Typography style={{ fontSize: ".875rem" }}>
                {option.label}
              </Typography>
            )}
            noOptionsText="Бренды не найдены"
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.label === brand.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Бренд"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: ".875rem" },
                }}
              />
            )}
          />
        </Grid>
        {/* <Grid item xs={3}>
          <Autocomplete
            value={category}
            defaultValue={category}
            options={categories}
            onChange={onCategoryChange}
            onInputChange={onCategoryListInput}
            disableClearable
            renderOption={(option) => (
              <Typography style={{ fontSize: ".875rem" }}>
                {option.label}
              </Typography>
            )}
            noOptionsText="Категории не найдены"
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.label === category.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Категория"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: ".875rem" },
                }}
              />
            )}
          />
        </Grid> */}
        <Grid item xs={8}>
          <CategorySelect setCategory={setCategory} category={category} />
        </Grid>
        <Grid item xs={3}>
          <Button
            style={{
              minHeight: "3.5rem",
              fontSize: ".875rem",
              textTransform: "none",
            }}
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            onClick={handleConsignment}
            disabled={isLoading}
          >
            Поиск
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
