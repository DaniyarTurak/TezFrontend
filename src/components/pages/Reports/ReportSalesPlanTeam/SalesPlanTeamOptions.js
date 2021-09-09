import React, { Fragment } from "react";
import DatePickerQuarter from "./DatePickerQuarter";
import DatePickerYear from "./DatePickerYear";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function SalesPlanTeamOptions({
  changeDate,
  changePlanDate,
  classes,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  handleSearch,
  handleQuarter,
  handleYear,
  onPointChange,
  point,
  points,
  planType,
  setPlanType
}) {

  const planTypes = [
    { value: 1, label: "Ежедневный" },
    { value: 2, label: "Ежемесячный" },
    { value: 3, label: "Ежеквартальный" }
  ];

  return (
    <Fragment>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговые точки не найдены"
          label="Торговая точка"
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={planType}
          onChange={(e, value) => setPlanType(value)}
          options={planTypes}
          noOptions="Торговые точки не найдены"
          label="Тип плана"
        />
      </Grid>
      {(planType.value === 1 || planType.value === 2) && (
        <Grid item xs={12}>
          <MaterialDateDefault
            changeDate={changeDate}
            dateFrom={dateFrom}
            dateTo={dateTo}
            dateFromChange={dateFromChange}
            dateToChange={dateToChange}
            searchInvoices={handleSearch}
          />
        </Grid>
      )}

      {planType.value === 3 && (
        <Grid item xs={3}>
          <DatePickerQuarter handleQuarter={handleQuarter} />
        </Grid>
      )}

      {planType.value === 4 && (
        <Grid item xs={3}>
          <DatePickerYear handleYear={handleYear} />
        </Grid>
      )}
      {(planType.value === 3 || planType.value === 4) && (
        <Grid item xs={3}>
          <Button
            fullWidth
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={handleSearch}
          >
            Поиск
          </Button>
        </Grid>
      )}
    </Fragment>
  );
}
