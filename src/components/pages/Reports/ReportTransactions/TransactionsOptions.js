import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function InvoiceOptions({
  changeDate,
  consignator,
  consignators,
  point,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  onPointsChange,
  points,
  filter,
  onFilterChange,
  onConsignatorChange,
  handleSearch,
  options,
  isLoading
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={handleSearch}
          disableButton={isLoading}
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          defaultValue={point}
          onChange={onPointsChange}
          options={points}
          noOptions="Торговые точки не найдены"
          label="Торговая точка"
        />
      </Grid>

      {filter.value === "jur" && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={consignator}
            onChange={onConsignatorChange}
            options={consignators}
            noOptions="Консигнаторы не найдены"
            label="Консигнаторы"
          />
        </Grid>
      )}

      <Grid item xs={3}>
        <AutocompleteSelect
          value={filter}
          onChange={onFilterChange}
          options={options}
          noOptions="Фильтры не найдены"
          label="Фильтр"
        />
      </Grid>
    </Fragment>
  );
}
