import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

export default function ABC({
  type,
  abc_a,
  abc_b,
  xyz_x,
  xyz_y,
  onAbc_AChange,
  onAbc_BChange,
  onXyz_XChange,
  onXyz_YChange,
  isValidationError,
}) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
        <Typography
          gutterBottom
          style={{ opacity: "60%", fontSize: ".875rem" }}
        >
          {!type ? "A" : "X"}: 0% -
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <TextField
          error={!type ? isValidationError[0] : isValidationError[2]}
          id={!type ? "abc_a" : "xyz_x"}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            min: 0,
            fontSize: ".875rem",
          }}
          style={{ width: "5rem", fontSize: ".875rem" }}
          value={!type ? abc_a : xyz_x}
          onChange={!type ? onAbc_AChange : onXyz_XChange}
          helperText={
            !type && isValidationError[0]
              ? "Введите корректное значение"
              : type && isValidationError[2]
              ? "Введите корректное значение"
              : ""
          }
        />
      </Grid>
      <Grid item xs={5}>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ opacity: "60%", fontSize: ".875rem" }}
        >
          {!type ? "B" : "Y"}: {!type ? abc_a : xyz_x}% -
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <TextField
          error={!type ? isValidationError[1] : isValidationError[3]}
          id={!type ? "abc_b" : "xyz_y"}
          InputProps={{
            min: 0,
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            fontSize: ".875rem",
          }}
          style={{ width: "5rem", fontSize: ".875rem" }}
          value={!type ? abc_b : xyz_y}
          onChange={!type ? onAbc_BChange : onXyz_YChange}
          helperText={
            !type && isValidationError[1]
              ? "Введите корректное значение"
              : type && isValidationError[3]
              ? "Введите корректное значение"
              : ""
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ opacity: "60%", fontSize: ".875rem" }}
        >
          {!type ? "C" : "Z"}: {!type ? abc_b : xyz_y}% - 100%
        </Typography>
      </Grid>
    </Grid>
  );
}
