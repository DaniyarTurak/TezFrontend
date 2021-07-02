import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

export default function ReportOptions({
  type,
  types,
  period,
  classes,
  onTypeChange,
  onPeriodChange,
  profitAmount,
  profitAmounts,
  onProfitAmountChange,
  periodsDaily,
  periodsWeekly,
  periodsMonthly,
  point,
  points,
  pointChange
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="point">Торговая точка</InputLabel>
            <Select
              labelId="point"
              id="point"
              value={point}
              style={{ fontSize: ".875rem" }}
              onChange={pointChange}
            >
              {points.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="profitAmount">Критерий</InputLabel>
            <Select
              labelId="profitAmount"
              id="profitAmount"
              value={profitAmount}
              style={{ fontSize: ".875rem" }}
              onChange={onProfitAmountChange}
            >
              {profitAmounts.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="type">На основе...</InputLabel>
            <Select
              labelId="type"
              id="type"
              style={{ fontSize: ".875rem" }}
              value={type}
              onChange={onTypeChange}
            >
              {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="period">За последние...</InputLabel>
            <Select
              labelId="period"
              id="period"
              style={{ fontSize: ".875rem" }}
              value={period}
              onChange={onPeriodChange}
              disabled={type ? false : true}
            >
              {(type === "1"
                ? periodsDaily
                : type === "2"
                  ? periodsWeekly
                  : periodsMonthly
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
