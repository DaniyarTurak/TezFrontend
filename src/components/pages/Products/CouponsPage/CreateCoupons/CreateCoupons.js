import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import CouponType from "./CouponType";
import CouponBinding from "./CouponBinding";
import CouponDiscount from "./CouponDiscount";
// import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import format from "date-fns/format";
import alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    maxHeight: 440,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  select: {
    width: "14rem",
  },
  labels: { textAlign: "center", color: theme.palette.text.secondary },
  labelRoot: {
    fontSize: 21,
  },
  labelInputRoot: {
    fontSize: 16,
  },
  selectDropdown: {
    color: "#fff",
    backgroundColor: "#1b1f38",
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#3b3f58",
    },
  },
  dateWidth: {
    width: "20rem",
    margin: theme.spacing(1),
  },
}));

const couponTypes = [
  { label: "Многоразовый", value: "1" },
  { label: "Одноразовый", value: "2" },
];

const couponApplyings = [
  { label: "На товар(ы)", value: "1" },
  { label: "На сумму чека", value: "2" },
];

const bindingTypes = [
  { label: "Ко всем товарам", value: "0" },
  { label: "К категории", value: "1" },
  { label: "К бренду", value: "2" },
  { label: "К товару", value: "3" },
];

export default function CreateCoupons() {
  const classes = useStyles();
  const inputEl = useRef(null);

  const [couponType, setCouponType] = useState("");
  const [couponApplying, setCouponApplying] = useState("");
  const [number, setNumber] = useState("");
  const [numberFrom, setNumberFrom] = useState("");
  const [numberTo, setNumberTo] = useState("");
  const [bindingType, setBindingType] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [productBarcode, setProductBarcode] = useState("");
  const [productSelectValue, setProductSelectValue] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(Date.now());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (bindingType === "1") {
      getCategories();
    } else if (bindingType === "2") {
      getBrands();
    } else if (bindingType === "3") {
      getProducts();
    }
  }, [bindingType]);

  useEffect(() => {
    if (productSelectValue.label) {
      setProductBarcode(productSelectValue.code);
    }
  }, [productSelectValue]);

  const clear = () => {
    setCouponType("");
    setCouponApplying("");
    setNumber("");
    setNumberFrom("");
    setNumberTo("");
    setBindingType("");
    setBrand("");
    setCategory("");
    setDiscount(0);
    setProductSelectValue("");
    setProductBarcode("");
    setSelectedDate(Date.now());
  };

  const getProductByBarcode = (pb) => {
    const barcode = pb || productBarcode;

    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        let productSelectValue = {
          label: product.name,
          value: product.id,
          code: product.code,
          price: product.price,
        };
        setProductSelectValue(productSelectValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const brandsWithoutCat = list.filter((brand) => brand.id !== "0");
        const brandsChanged = brandsWithoutCat.map((result) => {
          return {
            label: result.brand,
            value: result.id,
          };
        });
        setBrands([...brandsChanged]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getCategories = () => {
    Axios.get("/api/categories/getcategories", { params: { deleted: false } })
      .then((res) => res.data)
      .then((list) => {
        const categoriesWithoutCat = list.filter(
          (category) => category.id !== "0"
        );
        const categoriesChanged = categoriesWithoutCat.map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        });
        setLoading(false);
        setCategories([...categoriesChanged]);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getProducts = (inputValue) => {
    Axios.get("/api/products", {
      params: { productName: inputValue },
    })
      .then((res) => res.data)
      .then((list) => {
        const productOptions = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
            price: product.price,
          };
        });
        setLoading(false);
        setProductOptions(productOptions);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleBindingTypeChange = (event) => {
    const bindingValue = event.target.value;
    if (bindingValue !== "0") {
      setLoading(true);
    }
    setBindingType(bindingValue);
    setBrand("");
    setCategory("");
    setProductBarcode("");
    setProductSelectValue("");
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(productBarcode);
  };

  const onBarcodeChange = (e) => {
    const pB = e.target.value.toUpperCase();
    if (pB.length > 0) {
      getProductByBarcode(pB);
      setProductBarcode(pB);
      return;
    } else if (pB.length === 0) {
      setProductBarcode("");
      setProductSelectValue("");
      return;
    }
  };

  const onBrandChange = (e, br) => {
    setBrand(br);
  };

  const onCategoryChange = (e, cat) => {
    setCategory(cat);
  };

  const productListChange = (e, productSelectValueChanged) => {
    setProductSelectValue(productSelectValueChanged);
    if (productSelectValueChanged === null) {
      setProductSelectValue("");
      setProductBarcode("");
      return;
    }
    if (!productSelectValueChanged.code) {
      return setProductBarcode("");
    }
  };

  const onCategoryListInput = (e, categoryName) => {
    if (categoryName) {
      if (categoryName.length > 0) getCategories(categoryName);
    }
  };

  const onBrandListInput = (e, brandName) => {
    if (brandName) {
      if (brandName.length > 0) getBrands(brandName);
    }
  };

  const onProductListInput = (e, productName) => {
    getProducts(productName);
  };

  const handleDiscountChange = (e) => {
    let d = isNaN(e.target.value) ? 0 : e.target.value;
    if (d > 100) return;
    setDiscount(d);
  };

  const handleCouponTypeChange = (event) => {
    setCouponType(event.target.value);
  };

  const handleCouponApplyingChange = (event) => {
    setCouponApplying(event.target.value);
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };
  const handleNumberFromChange = (e) => {
    let nf = isNaN(e.target.value) ? "" : e.target.value;
    setNumberFrom(nf);
  };

  const handleNumberToChange = (e) => {
    let nt = isNaN(e.target.value) ? "" : e.target.value;
    setNumberTo(nt);
  };

  const alertWarning = (text) => {
    return alert.warning(text, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };

  const handleCheck = () => {
    if (!couponType) {
      return alertWarning("Выберите тип купона!");
    } else if (!couponApplying) {
      return alertWarning("Выберите тип применения купона!");
    } else if (couponType === "1" && !number) {
      return alertWarning("Введите номер купона!");
    } else if (couponType === "2" && (!numberFrom || !numberTo)) {
      return alertWarning("Введите диапазоны купона!");
    } else if (couponType === "2" && numberFrom > numberTo) {
      return alertWarning("Введите корректный диапазон!");
    } else if (couponApplying === "1" && !bindingType) {
      return alertWarning("Выберите значение в привязке купона!");
    } else if (bindingType === "1" && !category) {
      return alertWarning("Выберите категорию!");
    } else if (bindingType === "2" && !brand) {
      return alertWarning("Выберите бренд!");
    } else if (bindingType === "3" && !productSelectValue) {
      return alertWarning("Выберите товар!");
    } else if (!discount || discount === 0) {
      return alertWarning("Введите скидку!");
    }
    createCoupon();
  };

  const createCoupon = () => {
    var dateResult = format(selectedDate, "dd.MM.yyyy");
    setSubmitting(true);

    //subtype 1 - многоразовый, 2- одноразовый
    const req = {
      discount,
      object:
        couponApplying === "2"
          ? "0"
          : bindingType === "0"
          ? "0"
          : bindingType === "1"
          ? category.value
          : bindingType === "2"
          ? brand.value
          : productSelectValue.value,
      objtype: couponApplying === "2" ? "0" : bindingType,
      expire: dateResult,
      type: couponApplying,
      subtype: couponType,
      numberfrom: couponType === "1" ? number : numberFrom,
      numberto: couponType === "1" ? number : numberTo,
    };

    Axios.post("/api/coupons/add", { coupons: req })
      .then((res) => res.data)
      .then((res) => {
        setSubmitting(false);
        if (res.code === "success" && res.text === null) {
          alert.success("Купон успешно добавлен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          clear();
        } else if (res.code === "success" && res.text[0].status === "error") {
          alert.warning(res.text[0].text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        } else {
          alert.success(res.text[0].text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          clear();
        }
      })
      .catch((err) => {
        setSubmitting(false);
        ErrorAlert(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CouponType
          inputEl={inputEl}
          couponType={couponType}
          couponTypes={couponTypes}
          couponApplying={couponApplying}
          couponApplyings={couponApplyings}
          classes={classes}
          number={number}
          numberFrom={numberFrom}
          numberTo={numberTo}
          handleCouponTypeChange={handleCouponTypeChange}
          handleCouponApplyingChange={handleCouponApplyingChange}
          handleNumberChange={handleNumberChange}
          handleNumberFromChange={handleNumberFromChange}
          handleNumberToChange={handleNumberToChange}
        />
      </Grid>
      {couponApplying === "1" && (
        <Grid item xs={12}>
          <CouponBinding
            bindingType={bindingType}
            bindingTypes={bindingTypes}
            brand={brand}
            brands={brands}
            category={category}
            categories={categories}
            classes={classes}
            discount={discount}
            isLoading={isLoading}
            productBarcode={productBarcode}
            productSelectValue={productSelectValue}
            productOptions={productOptions}
            handleBindingTypeChange={handleBindingTypeChange}
            handleDiscountChange={handleDiscountChange}
            onBarcodeKeyDown={onBarcodeKeyDown}
            onBarcodeChange={onBarcodeChange}
            onBrandChange={onBrandChange}
            onCategoryChange={onCategoryChange}
            productListChange={productListChange}
            onBrandListInput={onBrandListInput}
            onCategoryListInput={onCategoryListInput}
            onProductListInput={onProductListInput}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <CouponDiscount
          classes={classes}
          discount={discount}
          handleDateChange={handleDateChange}
          handleDiscountChange={handleDiscountChange}
          selectedDate={selectedDate}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          className={classes.select}
          variant="outlined"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          size="large"
          onClick={handleCheck}
        >
          Сохранить
        </Button>
      </Grid>
    </Grid>
  );
}
