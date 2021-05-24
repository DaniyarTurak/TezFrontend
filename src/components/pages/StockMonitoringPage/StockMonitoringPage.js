import React, { useState, Fragment, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Axios from "axios";
import Button from '@material-ui/core/Button';
import useDebounce from "../../ReusableComponents/useDebounce";
import StockMonitoringTable from './StockMonitoringTable';
import Alert from "react-s-alert";

const AddButton = withStyles((theme) => ({
  root: {
    color: "white",
    border: "1px solid #28a745",
    backgroundColor: "#28a745",
    '&:hover': {
      border: "1px solid #28a745",
      color: "#28a745",
      backgroundColor: "transparent",
    },
  },
}))(Button);

export default function StockMonitoringPage() {
  const useStyles = makeStyles(theme =>
    createStyles({
      root: {
        '& label.Mui-focused': {
          color: '#17a2b8',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#17a2b8',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ced4da',
          },
          '&:hover fieldset': {
            borderColor: '#ced4da',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#17a2b8',
          },
        },
      },
    })
  );
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [prodsWithMS, setProdsWithMS] = useState([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [prodId, setProdId] = useState("");
  const [minimalStock, setMinimalStock] = useState("");
  const [isSending, setSending] = useState(false);
  const [selectedProd, setSelectedProd] = useState("");
  const [prodsSelect, setProdsSelect] = useState([]);
  const debouncedName = useDebounce(name, 500);
  const debouncedBarcode = useDebounce(barcode, 500);
  const [prodsTemp, setProdsTemp] = useState([])

  useEffect(() => {
    getProducts();
    getMinimalStock();
  }, []);

  useEffect(() => {
    let arr = [];
    prodsTemp.forEach(element => {
      arr.push(element)
    });
    arr.unshift({ id: 0, name: "Все товары" });
    setProdsSelect(arr);
  }, [prodsTemp]);

  const getProducts = () => {
    Axios.get("/api/products/stockmonitoring")
      .then((res) => res.data)
      .then((list) => {
        setProducts(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getMinimalStock = () => {
    Axios.get("/api/products/withminimalstock")
      .then((res) => res.data)
      .then((list) => {
        setProdsTemp(list);
        setProdsWithMS(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };


  useEffect(
    () => {
      if (debouncedName) {
        if (debouncedName.trim().length === 0) {
          Axios.get("/api/products/stockmonitoring", { params: { productName: "" } })
            .then((res) => res.data)
            .then((list) => {
              setProducts(list);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
        else {
          if (debouncedName.trim().length >= 3) {
            Axios.get("/api/products/stockmonitoring", { params: { productName: name } })
              .then((res) => res.data)
              .then((list) => {
                setProducts(list);
              })
              .catch((err) => {
                ErrorAlert(err);
              });
          };
        }
      }
    },
    [debouncedName]
  );

  useEffect(
    () => {
      if (debouncedBarcode) {
        if (debouncedBarcode.trim().length === 0) {
          Axios.get("/api/products/stockmonitoring", { params: { barcode: "" } })
            .then((res) => res.data)
            .then((list) => {
              setProducts(list);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
        else {
          if (debouncedBarcode.trim().length >= 3) {
            Axios.get("/api/products/stockmonitoring", { params: { barcode: barcode } })
              .then((res) => res.data)
              .then((list) => {
                setProducts(list);
              })
              .catch((err) => {
                ErrorAlert(err);
              });
          };
        }
      }
    },
    [debouncedBarcode]
  );

  const nameChange = (value) => {
    setName(value);
    setBarcode("");
    products.forEach(element => {
      if (element.name === value) {
        setBarcode(element.code);
        if (element.minimalstock !== null) {
          setMinimalStock(element.minimalStock);
        }
      }
    });
  };

  const barcodeChange = (value) => {
    setBarcode(value);
    setName("");
    products.forEach(element => {
      if (element.code === value) {
        setName(element.name);
        if (element.minimalstock !== null) {
          setMinimalStock(element.minimalStock);
        }
      }
    });
  };

  const addMinimalStock = () => {
    setSending(true);
    let prodid = "";
    if (!barcode || barcode === "") {
      ErrorAlert("Выберите товар")
    }
    else {
      if (!minimalStock || minimalStock === "") {
        ErrorAlert("Укажите минимальный остаток")
      }
      else {
        products.forEach(prod => {
          if (prod.code === barcode && prod.name === name) {
            prodid = prod.id;
          }
        });
        const reqdata = {
          product: prodid,
          units: minimalStock,
        };
        Axios.post("/api/stock/stockm/add", reqdata)
          .then((result) => {
            Alert.success("Минимальный остаток успешно установлен", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
            getMinimalStock();
            setSending(false);
          })
          .catch((err) => {
            Alert.error(err, {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            }
            );
            setSending(false);
          });
      }
    }
  };

  const minimalStockChange = (e) => {
    setMinimalStock(e.target.value);
  };

  const searchProd = (value) => {
    let arr = [];
    if (value !== "Все товары") {
      prodsTemp.forEach(prod => {
        if (prod.name === value) {
          arr.push(prod);
        }
        setProdsWithMS(arr);
      });
    }
    else {
      setProdsWithMS(prodsTemp);
    }
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
          Добавление минимального остатка
        </h6>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <label>Введите штрих-код:</label>
          <Autocomplete
            freeSolo
            value={barcode}
            noOptionsText="Товар не найден"
            onChange={(e, value) => barcodeChange(value)}
            onInputChange={(event, value) => { setBarcode(value) }}
            options={products.map((option) => option.code)}
            renderInput={(params) => (
              <TextField
                classes={{
                  root: classes.root,
                }}
                {...params}
                placeholder="Штрих-код"
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={9}>
          <label>Выберите товар из списка: </label>
          <Autocomplete
            value={name}
            noOptionsText="Товар не найден"
            onChange={(e, value) => nameChange(value)}
            onInputChange={(event, value) => { setName(value) }}
            options={products.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                classes={{
                  root: classes.root,
                }}
                {...params}
                placeholder="Наименование товара"
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            classes={{
              root: classes.root,
            }}
            value={minimalStock}
            onChange={minimalStockChange}
            placeholder="Минимальный остаток"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={9}>
          <AddButton
            onClick={addMinimalStock}
          >
            Добавить
              </AddButton>
        </Grid>
      </Grid>
      {prodsWithMS.length > 0 &&
        <Fragment>
          <br />
          <div className="empty-space"></div>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              Товары с установленным минимальным остатком
        </Grid>
            <Grid item xs={12} style={{ paddingBottom: "0px" }} >
              Быстрый поиск по перечню:
        </Grid>
            <Grid item xs={6} style={{ paddingTop: "0px" }}>
              <Autocomplete
                id="prods"
                // disabled={enable}
                options={prodsSelect.map((option) => option.name)}
                onChange={(e, value) => { searchProd(value) }}
                noOptionsText="Товар не найден"
                renderInput={(params) => (
                  <TextField
                    classes={{
                      root: classes.root,
                    }}
                    {...params}
                    placeholder="Выберите товар"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={12}>
              <StockMonitoringTable products={prodsWithMS} getMinimalStock={getMinimalStock} />
            </Grid>
          </Grid>
        </Fragment>
      }
    </Fragment>
  );
}
