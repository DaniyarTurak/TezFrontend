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
  getBonus,
  isSubmitting,
  planType,
  setPlanType,
  setBonusResult,
  isLoading,
  setSearched
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
          disableButton={isLoading}
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
          onChange={(e, value) => { 
            setPlanType(value);  
            setSearched(false);
            setBonusResult([]);
          }}
          options={planTypes}
          noOptions=""
          label="Тип плана"
        />
      </Grid>
    </Fragment>
  );
}
