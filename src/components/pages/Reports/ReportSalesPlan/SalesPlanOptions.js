import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default function SalesPlanOptions({
  cashboxuser,
  cashboxUsers,
  cashboxUsersChange,
  changeDate,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  getBonus,
  isSubmitting,
  planType,
  setPlanType,
  setBonusResult
}) {
  const planTypes = [
    { value: 1, label: "Ежедневный" },
    { value: 2, label: "Ежемесячный" },
    { value: 3, label: "Ежеквартальный" }
  ];

  return (
    <Fragment>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={getBonus}
          disableButton={isSubmitting}
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={cashboxuser}
          onChange={(e, value) => cashboxUsersChange(value)}
          options={cashboxUsers}
          noOptions="Пользователи не найдены"
          label="Пользователь"
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={planType}
          onChange={(e, value) => { setPlanType(value); setBonusResult([]); }}
          options={planTypes}
          noOptions=""
          label="Тип плана"
        />
      </Grid>
    </Fragment>
  );
}
