import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "react-s-alert";

export default function CategoryOptions({ classes, getActiveMargins }) {
  const [marginPercentage, setMarginPercentage] = useState(0);
  const [marginSum, setMarginSum] = useState(0);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setMarginPercentage(category.rate ? category.rate : 0);
    setMarginSum(category.sum ? category.sum : 0);
  }, [category]);

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

  const getCategories = (c) => {
    Axios.get("/api/categories/margin", {
      params: { category: c },
    })
      .then((res) => res.data)
      .then((list) => {
        // const all = [{ label: "Все", value: "0" }];
        const categoriesList = list.map((result) => {
          return {
            ...result,
            label: result.name,
            value: result.id,
          };
        });
        setCategories([...categoriesList]);
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
      type: 1,
      object: parseInt(category.value, 0),
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
  const onCategoryChange = (event, c) => {
    setCategory(c);
  };

  const onCategoryListInput = (event, c, reason) => {
    if (reason === "input") getCategories(c);
  };

  return (
    <Fragment>
      <Grid item xs={3}>
        <Autocomplete
          options={categories}
          onChange={onCategoryChange}
          onInputChange={onCategoryListInput}
          disableClearable
          renderOption={(option) => (
            <Typography style={{ fontSize: ".875rem" }}>
              {option.label}
            </Typography>
          )}
          noOptionsText="Категории не найдены"
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option) => option.label === category.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Категория"
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
