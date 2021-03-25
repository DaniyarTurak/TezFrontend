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
  type,
}) {
  const buttonArr = [
    { id: 1, name: "Ежедневный план" },
    { id: 2, name: "Ежемесячный план" },
    { id: 3, name: "Ежеквартальный план" },
    { id: 4, name: "Ежегодный план" },
  ];
  return (
    <Fragment>
      <Grid item xs={12}>
        <AutocompleteSelect
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговые точки не найдены"
          label="Торговая точка"
        />
      </Grid>

      {buttonArr.map((b) => {
        return (
          <Grid key={b.id} item xs={3} className={classes.buttonGrid}>
            <Button
              fullWidth
              className={classes.button}
              variant={b.id === type ? "contained" : "outlined"}
              color="primary"
              onClick={() => changePlanDate(b.id)}
            >
              {b.name}
            </Button>
          </Grid>
        );
      })}

      {(type === 1 || type === 2) && (
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

      {type === 3 && (
        <Grid item xs={3}>
          <DatePickerQuarter handleQuarter={handleQuarter} />
        </Grid>
      )}

      {type === 4 && (
        <Grid item xs={3}>
          <DatePickerYear handleYear={handleYear} />
        </Grid>
      )}

      {(type === 3 || type === 4) && (
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
