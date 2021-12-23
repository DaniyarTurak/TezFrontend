import React, { useState, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";



const useStyles = makeStyles((theme) => ({
  topDiv: {
    borderRadius: "4px",
    border: "solid",
    borderColor: "lightgrey",
    borderWidth: "1px",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      borderColor: "black",
    },
  },

  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  errorText: {
    color: "red",
    display: "flex",
    fontSize: ".875rem",
    marginLeft: "1rem",
  },

  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
}));
const useStyles2 = makeStyles((theme) => ({
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
}));

function WeightProducts() {
  const [isLoading, setLoading] = useState(false);
  const [isValidate, setValidate] = useState(false);
  const [unitOptions, setUnitOptions] = useState(false);useState([{ id: 1, name: "Килограмм", label: "Килограмм" }]);
  const [productName, setProductName] = useState("");
  const [unitspr, setUnitspr] = useState(1);
  const [tax, setTax] = useState(1);
  const classes = useStyles();
  const classes2 = useStyles2();


  const onProductNameChange = (e) => {
    let pn = e.target.value;
    if (pn.length > 100) {
      return Alert.warning(
        `Название товара не может содержать символы: ' ; ' ' , '`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    }
    setProductName(pn);
  };
  const clearForm = () => {
    setProductName("");
    setUnitspr(1)
  };
  const unitListChange = (e, unitsprChanged) => {
    setUnitspr(unitsprChanged);
  };
  const onUnitListInput = (e, unitspr) => {
    if (unitspr.lenght > 0) setUnitspr(unitspr);
  };
  const onTaxChange = (e, t) => {
    setTax(e.target.value);
  };

  const taxes = [
    { label: "Без НДС", value: "0" },
    { label: "Стандартный НДС", value: "1" },
  ];


  const createProduct = () => {
    if (!productName) {
      Alert.warning("Заполните наименование товара!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    else {
      Axios.post("/api/pluproducts/create", {
        name: productName,
        tax: tax
      })
        .then((res) => {
          return res.data
        })
        .then((data) => {
          if(data.code==="success") {
            Alert.success("Товар успешно сохранен", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
            setProductName("");
            setUnitspr(1)
          } else {
            ErrorAlert(data.text);
          }
        })
        .catch((err) => {
          ErrorAlert(err);
          console.log(err);
        });
    }
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Наименование</label>
              <div className={classes.topDiv}>
                <TextField
                  size="small"
                  onChange={onProductNameChange}
                  value={productName}
                  error={isValidate}
                  className={classes.input}
                  InputProps={{
                    classes: classes2,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                      </React.Fragment>
                    ),
                  }}
                  type="text"
                  placeholder="Введите название товара"
                />
              </div>
              {isValidate && (
                <span className={classes.errorText}>
                  Поле обязательно для заполнения
                </span>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              style={{ paddingBottom: "20px", paddingTop: "20px" }}
            >
              <label> Налоговая категория</label>
              <FormControl
                style={{ paddingBottom: "5px", paddingTop: "10px" }}
                fullWidth
                variant="outlined"
                size="small"
                value="Выберите налоговую катергию"
              >
                <Select
                  fullWidth
                  size="small"
                  value={tax}
                  onChange={onTaxChange}
                >
                  {taxes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={6}>
                <Typography
                  style={{ paddingBottom: "10px", paddingTop: "8px" }}
                >
                  Единица измерения
                </Typography>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={unitOptions}
                  value={unitspr}
                  onChange={unitListChange}
                  noOptionsText="Единица измерения не найдена"
                  onInputChange={onUnitListInput.bind(this)}
                  filterOptions={(options) =>
                    options.filter((option) => option.unitOptions !== "")
                  }
                  getOptionLabel={(option) => (option ? option.name : "")}
                  getOptionSelected={(option, value) =>
                    option.label === value.label
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Килограмм"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} />
        <Grid
          container
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
          spacing={1}
          justify="center"
          alignItems="center">
          <button
            type="button"
            className="btn mr-10"
            onClick={clearForm}
          >
            Очистить
          </button>
          &emsp;
          <button className="btn btn-success"
            onClick={() => {
              createProduct()
            }}
          >
            Сохранить
          </button>
        </Grid>
      </Grid>
    </Fragment >
  )
}

export default WeightProducts
