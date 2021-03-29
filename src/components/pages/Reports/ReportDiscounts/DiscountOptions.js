import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function DiscountOptions({
  cashier,
  cashiers,
  changeDate,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  handleSearch,
  isLoading,
  onCashierChange,
  onPointChange,
  point,
  points,
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
          value={cashier}
          onChange={onCashierChange}
          options={cashiers}
          noOptions="Кассир не найден"
          label="Кассир"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговая точка не найдена"
          label="Торговая точка"
        />
      </Grid>
    </Fragment>
  );
}
