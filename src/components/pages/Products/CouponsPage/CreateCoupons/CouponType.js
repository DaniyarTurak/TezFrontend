import React, { Fragment } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

export default function CouponType({
  couponType,
  couponTypes,
  couponApplying,
  couponApplyings,
  classes,
  number,
  numberFrom,
  numberTo,
  handleCouponTypeChange,
  handleCouponApplyingChange,
  handleNumberChange,
  handleNumberFromChange,
  handleNumberToChange,
}) {
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="couponType">Тип купона</InputLabel>
            <Select
              labelId="couponType"
              id="couponType"
              value={couponType}
              onChange={handleCouponTypeChange}
            >
              {couponTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="couponApplying">Применение</InputLabel>
            <Select
              labelId="couponApplying"
              id="couponApplying"
              value={couponApplying}
              onChange={handleCouponApplyingChange}
            >
              {couponApplyings.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} />
        {couponType === "1" ? (
          <Grid item xs={3}>
            <FormControl fullWidth>
              <TextField
                label="Номер купона"
                value={number}
                onChange={handleNumberChange}
              />
            </FormControl>
          </Grid>
        ) : (
          couponType === "2" && (
            <Fragment>
              <Grid item xs={3}>
                <label style={{ marginTop: "1.5rem" }}>Диапазон номеров:</label>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <TextField
                    id="numberFrom"
                    label="С:"
                    value={numberFrom}
                    onChange={handleNumberFromChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <TextField
                    id="numberTo"
                    label="По:"
                    value={numberTo}
                    onChange={handleNumberToChange}
                  />
                </FormControl>
              </Grid>
            </Fragment>
          )
        )}
      </Grid>
    </Paper>
  );
}
