import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PrintButton from "./PrintButton";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function SecondType({
  classes,
  options,
  filterChange,
  productSelectValue,
  componentRef1,
  handleRotate,
  printType2Rotate,
  imgSrc,
  OS,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Autocomplete
                options={options}
                onChange={filterChange}
                noOptionsText="Выберите ширину бумаги"
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ширина бумаги"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={9}>
              <div
                style={{ paddingBottom: "3rem" }}
                className={`content-center ${
                  printType2Rotate ? "rotate-90" : ""
                } min-width`}
              >
                <img
                  src={imgSrc}
                  id="myimg"
                  alt=""
                  style={{
                    padding: "10px",
                    width: OS === "Linux" ? "270px" : "auto",
                  }}
                />
                <br />
                {productSelectValue.label.substr(0, 60)}
              </div>
            </Grid>
            <PrintButton
              componentRef={componentRef1}
              handleRotate={handleRotate}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
