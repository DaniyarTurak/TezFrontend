import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import Alert from "react-s-alert";

export default function ProductOptions({ classes, getActiveMargins }) {
  const [barcode, setBarcode] = useState("");
  const [productSelectValue, setProductSelectValue] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
  const [marginPercentage, setMarginPercentage] = useState(0);
  const [marginSum, setMarginSum] = useState(0);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setMarginPercentage(productSelectValue.rate ? productSelectValue.rate : 0);
    setMarginSum(productSelectValue.sum ? productSelectValue.sum : 0);
  }, [productSelectValue]);

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

  const getProductByBarcode = (b) => {
    setLoadingProducts(true);
    Axios.get("/api/products/barcode", { params: { barcode: b } })
      .then((res) => res.data)
      .then((res) => {
        setLoadingProducts(false);
        const product = {
          ...res,
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(product);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const getProducts = (productName) => {
    setLoadingProducts(true);
    Axios.get("/api/products/margin", { params: { productName } })
      .then((res) => res.data)
      .then((res) => {
        setLoadingProducts(false);
        const productsChanged = res.map((product) => {
          return {
            ...product,
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });
        setProducts(productsChanged);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const onProductChange = (event, prod) => {
    if (!prod) {
      setProductSelectValue("");
      setBarcode("");
    } else {
      setProductSelectValue(prod);
      setBarcode(prod.code);
    }
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    if (barcodeChanged) {
      setBarcode(barcodeChanged);
    } else {
      setProductSelectValue("");
      setBarcode("");
    }
  };

  const onProductListInput = (event, p, reason) => {
    if (reason === "input") getProducts(p);
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onPercentageChange = (e) => {
    let m = isNaN(e.target.value) ? 0 : e.target.value;
    if (m > 100) return;
    setMarginPercentage(m);
  };

  const onMarginSumChange = (e) => {
    let s = isNaN(e.target.value) ? 0 : e.target.value;
    setMarginSum(s);
  };

  const saveMargin = () => {
    Axios.post("/api/margin/add", {
      sum: parseFloat(marginSum),
      rate: parseFloat(marginPercentage),
      type: 3,
      object: parseInt(productSelectValue.value, 0),
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

  return (
    <Fragment>
      <Grid item xs={6}>
        <TextField
          type="text"
          fullWidth
          name="barcode"
          value={barcode}
          className="form-control"
          label="Штрих код"
          onChange={onBarcodeChange}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
            },
          }}
          onKeyDown={onBarcodeKeyDown}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          value={productSelectValue}
          disableClearable
          onChange={onProductChange}
          onInputChange={onProductListInput}
          noOptionsText="Товары не найдены"
          options={
            productSelectValue === ""
              ? products
              : [...productSelectValue, ...products]
          }
          filterSelectedOptions
          filterOptions={(options) => options.filter((option) => option !== "")}
          getOptionLabel={(option) => (option ? option.label : "")}
          getOptionSelected={(option) =>
            option
              ? option.label === productSelectValue.label
              : productSelectValue
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Наименование товара"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoadingProducts ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
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
