import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function SalesPlanOptions({
  cashboxuser,
  cashboxUsers,
  cashboxUsersChange,
  changeDate,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  getDailyBonus,
  isSubmitting,
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
          searchInvoices={getDailyBonus}
          disableButton={isSubmitting}
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={cashboxuser}
          onChange={cashboxUsersChange}
          options={cashboxUsers}
          noOptions="Пользователи не найдены"
          label="Пользователь"
        />
      </Grid>
    </Fragment>
  );
}
