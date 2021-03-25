import React, { useState, useEffect, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";

export default function BrandOptions({ classes, getActiveMargins }) {
  const [marginPercentage, setMarginPercentage] = useState(0);
  const [marginSum, setMarginSum] = useState(0);
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    setMarginPercentage(brand.rate ? brand.rate : 0);
    setMarginSum(brand.sum ? brand.sum : 0);
  }, [brand]);

  useEffect(() => {
    if (marginPercentage && marginSum !== 0) {
      setMarginSum(0);
    }
  }, [marginPercentage]);

  useEffect(() => {
    if (marginSum && marginPercentage !== 0) {
      setMarginPercentage(0);
    }
  }, [marginSum]);

  const getBrands = (b) => {
    Axios.get("/api/brand/margin", {
      params: { brand: b },
    })
      .then((res) => res.data)
      .then((list) => {
        // const all = [{ label: "Все", value: "0" }];
        const brandsList = list.map((result) => {
          return {
            ...result,
            label: result.brand,
            value: result.id,
          };
        });
        setBrands([...brandsList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onPercentageChange = (e) => {
    let d = isNaN(e.target.value) ? 0 : e.target.value;
    if (d > 100) return;
    setMarginPercentage(d);
  };

  const onMarginSumChange = (e) => {
    let s = isNaN(e.target.value) ? 0 : e.target.value;
    setMarginSum(s);
  };

  const saveMargin = () => {
    Axios.post("/api/margin/add", {
      sum: parseFloat(marginSum),
      rate: parseFloat(marginPercentage),
      type: 2,
      object: parseInt(brand.value, 0),
    })
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Маржа успешно сохранена!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 5000,
        });
        getActiveMargins();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };
  const onBrandChange = (event, b) => {
    setBrand(b);
  };

  const onBrandListInput = (event, b, reason) => {
    if (reason === "input") getBrands(b);
  };

  return (
    <Fragment>
      <Grid item xs={3}>
        <Autocomplete
          options={brands}
          onChange={onBrandChange}
          onInputChange={onBrandListInput}
          disableClearable
          renderOption={(option) => (
            <Typography style={{ fontSize: ".875rem" }}>
              {option.label}
            </Typography>
          )}
          noOptionsText="Бренды не найдены"
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option) => option.label === brand.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Бренд"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                style: { fontSize: ".875rem" },
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="marginPercentage"
          fullWidth
          label="В процентном выражении"
          value={marginPercentage}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          onChange={onPercentageChange}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="marginSum"
          fullWidth
          label="В абсолютном выражении"
          value={marginSum}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          onChange={onMarginSumChange}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          style={{
            minHeight: "3.5rem",
            fontSize: ".875rem",
            textTransform: "none",
          }}
          variant="outlined"
          color="primary"
          fullWidth
          size="large"
          onClick={saveMargin}
        >
          Сохранить
        </Button>
      </Grid>
    </Fragment>
  );
}
