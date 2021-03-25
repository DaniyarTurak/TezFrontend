import React, { useState, useEffect } from "react";
import Alert from "react-s-alert";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: "50%",
  },
  box: {
    marginTop: "1rem",
  },
}));

export default function PickProduct({
  addProduct,
  editProduct,
  editingProduct,
  barcodeCounter,
  invoiceId,
  isEditing,
  invoiceList,
  isSubmitting,
  scale,
  stopEditing,
  maxHotKey,
}) {
  const classes = useStyles();
  const taxes = [
    { label: "Без НДС", value: "0" },
    { label: "Стандартный НДС", value: "1" },
  ];
  const [amount, setAmount] = useState("");
  const [isNewProduct, setNewProduct] = useState(false);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [productName, setProductName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState("");
  const [updateprice, setUpdatePrice] = useState(true);

  const prefix = JSON.parse(sessionStorage.getItem("isme-user-data")).prefix;

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setAmount(editingProduct.amount);
      setPrice(editingProduct.newprice);
      setProductName(editingProduct.name);
      setPurchasePrice(editingProduct.purchaseprice);
      setTax(taxes[editingProduct.taxid]);
      setUpdatePrice(editingProduct.updateallprodprice);
    }
  }, [isEditing, editingProduct]);

  const getProducts = (inputValue) => {
    Axios.get("/api/productsweight/oldproducts", {
      params: { productName: inputValue, scale },
    })
      .then((res) => res.data)
      .then((res) => {
        const old = res.map((p) => {
          return {
            label: p.name,
            value: p.id,
            barcode: p.code,
            hotkey: p.hotkey,
          };
        });
        setProductOptions(old);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onAmountChange = (e) => {
    let a = isNaN(e.target.value) ? 0 : e.target.value;
    setAmount(a);
  };

  const productListChange = (p) => {
    setProductSelectValue(p);
    if (p.barcode) {
      searchByBarcode(p);
    } else {
      clean();
    }
  };
  const searchByBarcode = (p) => {
    Axios.get("/api/products/barcode", {
      params: { barcode: p.barcode, all: "1", isWeight: true },
    })
      .then((res) => res.data)
      .then((res) => {
        setPurchasePrice("" + res.lastpurchaseprice);
        setPrice("" + res.price);
        setTax(taxes[res.taxid]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) getProducts(productName);
  };

  const onProductNameChange = (e) => {
    let pn = e.target.value;
    if (pn.includes(",") || pn.includes(";")) {
      return Alert.warning(
        `Название товара не может содержать символы: ' ; ' ' , '`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    } else if (pn.length > 32) {
      return Alert.warning(`Название товара не может превышать 32 символа`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setProductName(pn);
  };
  const onPurchasePriceChange = (e) => {
    let pp = isNaN(e.target.value) ? 0 : e.target.value;
    setPurchasePrice(pp);
  };
  const onPriceChange = (e) => {
    let p = isNaN(e.target.value) ? 0 : e.target.value;
    setPrice(p);
  };

  const onTaxChange = (t) => {
    setTax(t);
  };
  const onUpdatePriceChange = (e) => {
    setUpdatePrice(e.target.checked);
  };

  const clean = () => {
    setAmount("");
    setNewProduct(false);
    setProductSelectValue("");
    setProductName("");
    setPurchasePrice("");
    setPrice("");
    setTax("");
    setUpdatePrice(true);
    if (isEditing) {
      stopEditing();
    }
  };

  const alert = () => {
    return Alert.warning(
      `Заполните ${
        !productName && !productSelectValue
          ? "Наименование товара"
          : !purchasePrice
          ? "Цену закупки"
          : !amount
          ? "Количество"
          : !price
          ? "Цену продажи"
          : !tax
          ? "Налоговую категорию"
          : ""
      }`,
      {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      }
    );
  };
  console.log(prefix !== 0);
  console.log(
    (prefix ? (prefix !== 0 && prefix < 10 ? "0" + prefix : prefix) : "") +
      ("" + barcodeCounter).padStart(
        prefix ? (prefix !== 0 && prefix < 10 ? 5 : 5) : 7,
        "0"
      )
  );
  const handleAdd = () => {
    if (
      (!productName && !productSelectValue) ||
      !purchasePrice ||
      !amount ||
      !price ||
      !tax
    ) {
      return alert();
    }

    if (parseInt(purchasePrice, 0) > parseInt(price, 0)) {
      return Alert.warning("Цена закупа не может превышать цену продажи", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    if (amount < 0 || purchasePrice < 0 || price < 0) {
      return Alert.warning("Значения не могут быть минусовыми", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    let newKeyArr = [];
    let newKey;
    invoiceList.forEach((e) => {
      if (e.is_new) {
        newKeyArr.push(e.hotkey);
      }
    });
    newKey = newKeyArr.length > 0 ? Math.max(...newKeyArr) + 1 : maxHotKey;

    const prod = {
      amount,
      attributes: null,
      brand: null,
      category: "-1",
      cnofea: null,
      code: isNewProduct
        ? (prefix ? (prefix.length === 1 ? "0" + prefix : prefix) : "") +
          ("" + barcodeCounter).padStart(
            prefix ? (prefix.length === 1 ? 6 : 5) : 7,
            "0"
          )
        : (prefix ? (prefix.length === 1 ? "0" + prefix : prefix) : "") +
          ("" + productSelectValue.barcode).padStart(
            prefix ? (prefix.length === 1 ? 6 : 5) : 7,
            "0"
          ),
      hotkey: isNewProduct ? newKey : productSelectValue.hotkey,
      id: isNewProduct ? null : productSelectValue.value,
      lastpurchaseprice: purchasePrice,
      name: isNewProduct ? productName : productSelectValue.label,
      newprice: parseFloat(price),
      purchaseprice: purchasePrice,
      sku: null,
      taxid: tax.value,
      unitsprid: "6",
      updateprice,
    };

    const editProd = {
      amount,
      attributes: null,
      brand: null,
      category: "-1",
      cnofea: null,
      code: editingProduct.code,
      hotkey: editingProduct.hotkey,
      id: editingProduct.is_new ? null : editingProduct.id,
      invoice: invoiceId,
      lastpurchaseprice: purchasePrice,
      name: editingProduct.name,
      newprice: parseFloat(price),
      purchaseprice: purchasePrice,
      sku: null,
      stock: editingProduct && editingProduct.stock,
      taxid: tax.value,
      unitsprid: "6",
      updateprice,
    };

    !isEditing ? addProduct(prod, false) : editProduct(editProd);
    clean();
  };

  return (
    <Box className={classes.box} display="flex" justifyContent="center">
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {!isEditing && (
            <Grid item xs={12}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => setNewProduct(true)}
              >
                Новый товар
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography gutterBottom>Наименование товара</Typography>
            {isNewProduct || isEditing ? (
              <input
                type="text"
                value={productName}
                placeholder="Введите наименование товара"
                className="form-control"
                name="productName"
                disabled={isEditing}
                onChange={onProductNameChange}
              />
            ) : (
              !isEditing && (
                <Select
                  value={productSelectValue}
                  name="productSelectValue"
                  onChange={productListChange}
                  noOptionsMessage={() => "Товар не найден"}
                  onInputChange={onProductListInput}
                  options={productOptions}
                  placeholder="Выберите товар"
                />
              )
            )}
          </Grid>

          <Grid item xs={9}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={updateprice}
                  onChange={onUpdatePriceChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Обновление цены на всех торговых точках"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Цена закупа за 1 кг.</Typography>
            <input
              type="text"
              value={purchasePrice}
              placeholder="Введите цену закупа"
              className="form-control"
              name="purchaseprice"
              onChange={onPurchasePriceChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Цена за 1 кг.</Typography>
            <input
              type="text"
              value={price}
              placeholder="Введите цену"
              className="form-control"
              name="price"
              onChange={onPriceChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Количество (кг.)</Typography>
            <input
              type="text"
              value={amount}
              placeholder="Введите количество"
              className="form-control"
              name="amount"
              onChange={onAmountChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>НДС</Typography>
            <Select
              value={tax}
              name="tax"
              onChange={onTaxChange}
              noOptionsMessage={() => "НДС не найден"}
              options={taxes}
              placeholder="Выберите НДС"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth onClick={clean}>
              {!isEditing ? "Очистить" : "Отмена"}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={handleAdd}
            >
              {!isEditing ? "Сохранить" : "Изменить"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
