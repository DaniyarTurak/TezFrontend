import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import { isAllowed } from "../../../../../barcodeTranslate";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddAttribute from "./AddAttribute";
import AddAttributeChar from "./AddAttributeChar";
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

function WeightProducts() {
    const [isLoading, setLoading] = useState(false);
    const [isValidate, setValidate] = useState(false);
    const [isValidateName, setValidateName] = useState(false);
    const [isValidateUnit, setValidateUnit] = useState(false);
    const [unitOptions, setUnitOptions] = useState([]);
    const [productName, setProductName] = useState("");

    
  const onProductNameChange = (e) => {
    let pn = e.target.value;
    if (!pn === 0) {
      setValidateName(true);
      return;
    } else if (!pn) {
      setValidateName(true);
    } else {
      setValidateName(false);
    }
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

  const getProductByName = (name) => {
    Axios.get("/api/", {
      params: { barcode: barcodeChanged, all: 1 },
    })
      .then((res) => res.data)
      .then((product) => {
        if (product !== "") {
          Alert.info(`Товар с названием ${name} уже существует. Вы не можете его добавить.`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          setLoading(false);
          clearForm();
        }
        else {
          Axios.get("/api/nomenclature/spr", {
            params: { barcode: barcode },
          })
            .then((res) => res.data)
            .then((res) => {
              if (res !== "") {
                setProductName(res.name);
                 
                setLoading(false);
              }
              else {
                Alert.warning(`Товар со штрих-кодом ${barcode} не найден. Вы можете его добавить.`, {
                  position: "top-right",
                  effect: "bouncyflip",
                  timeout: 4000,
                });
                setLoading(false);
              }
            }
            )
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleSearch = (pn) => {
    pn.preventDefault();
    if (!pn) {
      return Alert.info("Заполните поле Наименование", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setLoading(true);
    getProductByName(pn);
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
                  <IconButton
                    type="submit"
                    disabled={isEditing}
                    className={classes.iconButton}
                    aria-label="search"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
                {isValidate && (
                  <span className={classes.errorText}>
                    Поле обязательно для заполнения
                  </span>
                )}
              </Grid>
              {/* <Grid item xs={12}>
                <label>Наименование</label>
                <TextField
                  placeholder="Введите название товара"
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="text"
                  value={productName}
                  onChange={onProductNameChange}
                  error={isValidateName}
                  helperText={
                    isValidateName ? "Поле обязательно для заполнения" : ""
                  }
                />
              </Grid> */}
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
              {companyData.certificatenum && (
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
              )}
              <Grid item xs={12}>
                <label style={{ marginTop: 10 }}>
                  <strong>Постоянные характиристики</strong>
                </label>
                <Grid container spacing={1} >
                  <Grid item xs={12}>
                    <AddAttributeChar
                      isEditing={isEditing}
                      selected={selectedAttribute}
                      clearBoard={clearBoard}
                      attributeCode={getAttributeCharCode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AddAttribute
                      isEditing={isEditing}
                      selected={selectedAttribute}
                      clearBoard={clearBoard}
                      attributeCode={getAttributeCode}
                      attrListProps={getAttrList}
                    />
                  </Grid>
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
              onClick={() => createProduct()}
            >
              Сохранить
            </button>
          </Grid>
        </Grid>
      </Fragment >
    )
}

export default WeightProducts
