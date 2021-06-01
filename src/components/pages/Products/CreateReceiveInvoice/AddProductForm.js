import React, { useState, useEffect, Fragment } from "react";
import { Field, reduxForm, reset, change } from "redux-form";
import Axios from "axios";
import alert from "react-s-alert";
import { Alert, AlertTitle } from "@material-ui/lab";
import ReactModal from "react-modal";
import AddAttribute from "./AddAttribute";
import { InputField, InputGroup, SelectField } from "../../../fields";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  RequiredField,
  LessThanZero,
  NotEqualZero,
  NoMoreThan10,
  NoMoreThan20,
  RequiredSelect,
} from "../../../../validation";

import AddProductAlerts from "../Alerts/AddProductAlerts";
import cnofeaList from "../../../../data/cnofea.json";
import Tooltip from "./Tooltip";
import SellByPieces from "./SellByPieces";

import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import LimitAlert from "./LimitAlert";

import { isAllowed } from "../../../../barcodeTranslate";

ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};
const roundPrice = (price) => {
  const arr = [1, 2, 3, 4, 6, 7, 8, 9];
  let stringPrice = price.toString();
  let lastChar = parseInt(stringPrice[stringPrice.length - 1], 0);
  if (lastChar < 5) {
    return arr.indexOf(lastChar) !== -1 ? price + (5 - lastChar) : price;
  } else return arr.indexOf(lastChar) !== -1 ? price + (10 - lastChar) : price;
};

let AddProductForm = ({
  deleted,
  deleteOldRecord,
  invoiceNumber,
  newProduct,
  handleSubmit,
  submitting,
  pristine,
  history,
  dispatch,
  reset,
  isEditing,
  handleEditing,
  editProduct,
  setAttributeVal,
}) => {
  const [addProductData, setAddProductData] = useState("");
  const [attributeCode, setAttributeCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [bottomLimit, setBottomLimit] = useState(0);
  const [brand, setBrand] = useState(0);
  const [brandOptions, setBrandOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [clearBoard, setClearBoard] = useState(false);
  const [cnofeaName, setCnofeaName] = useState("");
  const [disableUnits, setDisableUnits] = useState(false);
  const [isAdding, setAdding] = useState(false);
  const [isBarcodeExists, setBarcodeExists] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [lastpurchaseprice, setLastPurchasePrice] = useState(0);
  const [limitAlert, setLimitAlert] = useState(false);
  const [marginPercentage, setMarginPercentage] = useState(0);
  const [marginSum, setMarginSum] = useState(0);
  const [marginCategory, setMarginCategory] = useState("");
  const [marginBrand, setMarginBrand] = useState("");
  const [modalIsOpenAlert, setModalOpenAlert] = useState(false);
  const [newProductGenerating, setNewProductGenerating] = useState(false);
  const [newprice, setNewPrice] = useState(0);
  const [productID, setProductID] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [oldprice, setOldPrice] = useState(0);
  const [sellByPieces, setSellByPieces] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState([]);
  const [staticprice, setStaticPrice] = useState("");
  const [taxOptions, setTaxOptions] = useState([]);
  const [topLimit, setTopLimit] = useState(0);
  const [unitsprid, setUnitSprid] = useState("");
  const [unitOptions, setUnitOptions] = useState([]);
  const [updateprice, setUpdatePrice] = useState(true);
  const [completedProduct, setCompletedProduct] = useState("");
  const [attributescaption, setAttributeCapation] = useState([]);
  const [attrIdandValue, setAttrIdandValue] = useState([]);
  const [editAttrubutes, setEditAttrubutes] = useState([]);

  useEffect(() => {
    setEditAttrubutes(editProduct.attributescaption);
  }, [editProduct]);

  useEffect(() => {
    changeState(attrIdandValue);
  }, []);

  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};

  useEffect(() => {
    getTaxes();
    getCategories();
    getProducts();
    getBrands();
    getMeasures();
    getOptions("top_limit");
    getOptions("bottom_limit");
  }, []);

  useEffect(() => {
    if (completedProduct) {
      fillPrices(completedProduct);
    }
  }, [completedProduct]);

  //при редактировании товара вызывается изменения всех полей, кроме штрихкода и названия.
  useEffect(() => {
    if (editProduct && taxOptions.length > 0 && !isAdding) {
      clearForm();
    }
    if (isEditing && unitOptions.length > 0 && !isAdding) {
      //Форматирование Категории
      const editProductCategory = {
        label: editProduct.category_name_new
          ? editProduct.category_name_new
          : editProduct.category,
        value: editProduct.category_id_new
          ? editProduct.category_id_new
          : editProduct.categoryid,
      };
      //Форматирование Бренда
      const editProductBrand = {
        label: editProduct.brand_name_new
          ? editProduct.brand_name_new
          : editProduct.brand,
        value: editProduct.brand_id_new
          ? editProduct.brand_id_new
          : editProduct.brandid,
      };
      //Форматирование Налоговой категории
      const tax = {
        label: editProduct.taxid === "0" ? "Без НДС" : "Стандартный НДС",
        value: editProduct.taxid,
      };
      //Расчёт Единиц измерения
      const unitLabel = unitOptions.filter((e) => {
        return e && e.id === editProduct.unitspridc;
      });
      const unit = {
        label: editProduct.units_name_new
          ? editProduct.units_name_new
          : unitLabel[0].name,
        value: editProduct.units_id_new
          ? editProduct.units_id_new
          : editProduct.unitsprid,
      };
      //продажа поштучно
      if (editProduct.piece) {
        setSellByPieces(true);
        dispatch(
          change("AddProductForm", "pieceinpack", editProduct.pieceinpack)
        );
        dispatch(
          change("AddProductForm", "pieceprice", editProduct.pieceprice)
        );
      } else {
        setSellByPieces(false);
        dispatch(change("AddProductForm", "pieceinpack", ""));
        dispatch(change("AddProductForm", "pieceprice", ""));
      }

      //Предельная цена
      const staticpriceCheck = editProduct.staticprice;
      setStaticPrice(staticpriceCheck);
      dispatch(change("AddProductForm", "staticprice", staticpriceCheck));

      //Сохранение значений в поля формы
      dispatch(change("AddProductForm", "category", editProductCategory));
      dispatch(change("AddProductForm", "brand", editProductBrand));
      dispatch(
        change(
          "AddProductForm",
          "cnofea",
          editProduct.cnofeacode ? editProduct.cnofeacode : ""
        )
      );
      setLastPurchasePrice(editProduct.purchaseprice);
      dispatch(
        change("AddProductForm", "lastpurchaseprice", editProduct.purchaseprice)
      );
      dispatch(change("AddProductForm", "newprice", editProduct.newprice));
      setUpdatePrice(editProduct.updateallprodprice);
      dispatch(change("AddProductForm", "amount", editProduct.amount));
      dispatch(change("AddProductForm", "taxid", tax));
      dispatch(change("AddProductForm", "unitsprid", unit));
      dispatch(change("AddProductFrom", "attribute", editProduct.attributes));
    }
  }, [isEditing, editProduct]);

  //после нажатия на кнопку "редактировать товар" сначала срабатывает его удаление из предыдущего списка,
  //и вызывается этот эффект на добавление отредактированного.
  useEffect(() => {
    if (isEditing && deleted && isAdding) {
      addProduct(addProductData);
    }
  }, [deleted]);

  const getOptions = (name) => {
    Axios.get("/api/settings", { params: { name } })
      .then((res) => res.data)
      .then((res) => {
        if (res.length > 0) {
          if (name === "top_limit") {
            setTopLimit(parseInt(res[0].value, 0));
          } else {
            setBottomLimit(parseInt(res[0].value, 0));
          }
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const closeAlert = (isSubmit) => {
    if (isSubmit) {
      addProduct(addProductData);
    } else {
      setSubmitting(false);
    }
    setModalOpenAlert(false);
  };

  const getTaxes = (inputValue) => {
    Axios.get("/api/taxes", { params: { category: inputValue } })
      .then((res) => res.data)
      .then((taxesRes) => {
        setTaxOptions(taxesRes);
        const tax = {
          label: taxesRes[1].name,
          value: taxesRes[1].id,
        };
        dispatch(change("AddProductForm", "taxid", tax));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (inputValue) => {
    Axios.get("/api/products/margin", { params: { productName: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const productRes = list.map((product) => {
          return {
            ...product,
            name: product.name,
            id: product.id,
            code: product.code,
          };
        });
        setProductOptions(productRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategories = (inputValue, prod, wholeProd) => {
    Axios.get("/api/categories/margin", { params: { category: inputValue } })
      .then((res) => res.data)
      .then((categoryRes) => {
        if (prod) {
          categoryRes.forEach((e) => {
            if (e.id === prod.value) {
              prod.rate = e.rate;
              prod.sum = e.sum;
              dispatch(change("AddProductForm", "category", prod));
              setMarginCategory(prod);
            }
            setCompletedProduct(wholeProd);
          });
        }
        setCategoryOptions(categoryRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBrands = (inputValue, prod) => {
    Axios.get("/api/brand/margin", { params: { brand: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const brandRes = list.map((b) => {
          return {
            ...b,
            name: b.brand,
            id: b.id,
          };
        });
        if (prod) {
          brandRes.forEach((e) => {
            if (e.id === prod.value) {
              prod.rate = e.rate;
              prod.sum = e.sum;
              dispatch(change("AddProductForm", "brand", prod));
              setMarginBrand(prod);
            }
          });
        }

        setBrandOptions(brandRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMeasures = () => {
    Axios.get("/api/products/unitspr")
      .then((res) => res.data)
      .then((measuresResult) => {
        const unitRes = measuresResult.map((unit) => {
          return {
            name: unit.name,
            id: unit.id,
            isDisabled: false,
          };
        });
        const unit = {
          label: unitRes[0].name,
          value: unitRes[0].id,
          isDisabled: false,
        };

        dispatch(change("AddProductForm", "unitsprid", unit));
        setUnitOptions(unitRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearForm = () => {
    setClearBoard(!clearBoard);
    setBarcode(null);
    setCnofeaName(null);
    setUpdatePrice(true);
    setSellByPieces(false);
    setProductSelectValue("");
    setProductID(null);
    setAttributeCode(null);
    setSelectedAttribute([]);
    setLastPurchasePrice(0);
    setNewPrice(0);
    // setClearBoard(true);
    setNewProductGenerating(false);
    setBarcodeExists(false);
    setStaticPrice("");
    setAttributeCapation([]);
    setAttrIdandValue([]);
    // setEditAttrubutes([]);
    reset();
    const tx = taxOptions.find((tax) => {
      return tax.id === "1";
    });

    const tax = { label: tx.name, value: tx.id };

    dispatch(change("AddProductForm", "taxid", tax));
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();

    if (!isAllowed(barcodeChanged)) {
      alert.warning(`Пожалуйста поменяйте раскладку на латиницу!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      e.preventDefault();
      return;
    } else if (!barcodeChanged) {
      clearForm();
    } else {
      setBarcode(barcodeChanged);
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const onCnofeaChange = (e) => {
    cnofeaVerify(e.target.value);
  };

  const onSellByPiecesChange = (e) => {
    const piece = e.target.checked;
    setSellByPieces(piece);
    let unit = {};
    let newUnitRes = [...unitOptions];

    //продажа поштучно
    if (piece) {
      newUnitRes.forEach((e) => {
        if (e.id === "2" || e.id === "16" || e.id === "17") {
          e.isDisabled = false;
        } else e.isDisabled = true;
      });
      unit = {
        label: newUnitRes[1].name,
        value: newUnitRes[1].id,
        isDisabled: false,
      };
    } else {
      newUnitRes.forEach((e) => {
        e.isDisabled = false;
      });
      unit = {
        label: newUnitRes[0].name,
        value: newUnitRes[0].id,
        isDisabled: false,
      };
    }

    dispatch(change("AddProductForm", "unitsprid", unit));
    setUnitOptions(newUnitRes);
  };

  const onUnitSprIdChange = (e) => {
    const id = e.value;
    if (id === "3") {
      setDisableUnits(true);
      dispatch(change("AddProductForm", "lastpurchaseprice", 0));
      dispatch(change("AddProductForm", "amount", 0));
    } else {
      setDisableUnits(false);
    }
    setUnitSprid(id);
  };

  const cnofeaVerify = (cnofeaIn) => {
    let cnofeaCode = cnofeaIn;
    let cnofeaIterator = {},
      tax = {};

    for (let i = 0; i < cnofeaIn.length; i++) {
      // eslint-disable-next-line no-loop-func
      cnofeaList.forEach((iter) => {
        if (iter.code === cnofeaCode) {
          cnofeaIterator = iter;
          return;
        }
      });

      if (Object.keys(cnofeaIterator).length > 0) break;

      cnofeaCode = cnofeaCode.slice(0, -1);
    }

    if (cnofeaIterator.isauto) {
      const tx = taxOptions.find((tax) => {
        return tax.id === (cnofeaIterator.isauto ? "0" : "1");
      });

      tax = { label: tx.name, value: tx.id };
      setCnofeaName(cnofeaIterator.name);
      dispatch(change("AddProductForm", "taxid", tax));
    } else {
      setCnofeaName("");
    }
  };

  const onPurchasePriceChange = (e) => {
    numberValidation(e);

    const lpNum = +e.target.value;
    const npNum = +newprice;

    // блокировка автоматического высчитывания процента при наличии Маржи на процент
    if (npNum && marginPercentage) {
      dispatch(
        change(
          "AddProductForm",
          "newprice",
          Math.round(lpNum + (lpNum * marginPercentage) / 100)
        )
      );
    } else if (npNum && marginSum) {
      dispatch(
        change(
          "AddProductForm",
          "surcharge",
          Math.round(((lpNum + marginSum) * 100) / lpNum - 100)
        )
      );
      dispatch(
        change("AddProductForm", "newprice", Math.round(lpNum + marginSum))
      );
    } else if (npNum) {
      const surchargeRounded = Math.round(((npNum - lpNum) * 100) / lpNum);
      dispatch(change("AddProductForm", "surcharge", surchargeRounded));
    }
    setLastPurchasePrice(lpNum);
  };

  const onPieceAmountChange = (e) => {
    numberValidation(e);

    let num = e.target.value;
    const calculatedPiece = (newprice / num).toFixed(2);
    dispatch(change("AddProductForm", "pieceprice", calculatedPiece));
    dispatch(change("AddProductForm", "pieceinpack", num));
  };

  const onPiecePriceChange = (e) => {
    numberValidation(e);
    const num = e.target.value;
    dispatch(change("AddProductForm", "pieceprice", num));
  };

  const onSurchargeChange = (e) => {
    numberValidation(e);

    const scNum = +e.target.value;
    const lpNum = +lastpurchaseprice;

    const newpriceRounded = roundPrice(
      Math.round(lpNum + (lpNum * scNum) / 100)
    );
    setNewPrice(newpriceRounded);
    setMarginPercentage(0);
    setMarginSum(0);
    dispatch(change("AddProductForm", "newprice", newpriceRounded));
  };

  const onNewPriceChange = (e) => {
    numberValidation(e);

    const newpriceTarget = isNaN(e.target.value) ? 0 : e.target.value;
    const lpNum = +lastpurchaseprice;
    let isStatic = false;

    if (staticprice && newpriceTarget > staticprice) {
      isStatic = true;
    }
    if (isStatic) {
      alert.warning(
        `Внимание! Цена продажи не может превышать предельную цену: ${staticprice}`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
      e.preventDefault();
    } else {
      dispatch(change("AddProductForm", "newprice", newpriceTarget));
      setNewPrice(newpriceTarget);
      let surchargeRounded = 0;

      if (newpriceTarget === 0) {
        surchargeRounded = "0";
      } else {
        surchargeRounded = Math.round(((newpriceTarget - lpNum) * 100) / lpNum);
      }

      setMarginPercentage(0);
      setMarginSum(0);
      dispatch(change("AddProductForm", "surcharge", surchargeRounded));
    }
  };

  const onUpdatePriceChange = (e) => {
    setUpdatePrice(e.target.checked);
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) getProducts(productName);
  };

  const onBrandListInput = (brandName) => {
    if (brandName.length > 0) getBrands(brandName);
  };

  const onCategoryListInput = (categoryName) => {
    if (categoryName.length > 0) getCategories(categoryName);
  };

  const brandListChange = (brandChanged) => {
    setBrand(brandChanged);
    brandOptions.forEach((e) => {
      if (
        e.id === brandChanged.value &&
        (e.rate || e.sum) &&
        !completedProduct.rate &&
        !completedProduct.sum
      ) {
        fillRateAndSum(completedProduct, e.rate, e.sum);
      }
    });
  };

  const categoryChange = (categoryChanged) => {
    setCategory(categoryChanged);
    categoryOptions.forEach((e) => {
      if (
        e.id === categoryChanged.value &&
        (e.rate || e.sum) &&
        !completedProduct.rate &&
        !completedProduct.sum &&
        !marginBrand.rate &&
        !marginBrand.sum
      ) {
        fillRateAndSum(completedProduct, e.rate, e.sum);
      }
    });
  };

  const productListChange = (productChanged) => {
    clearForm();
    setProductSelectValue(productChanged);
    if (productChanged.code) {
      setBarcode(productChanged.code);
      handleSearch(productChanged.code);
    } else {
      clearForm();
    }
  };

  const handleSearch = (brcd) => {
    const barcodeCheck = brcd || barcode;
    if (!barcodeCheck) {
      return alert.info("Заполните поле Штрих код", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (barcodeCheck.length > 20) {
      return alert.info("Длина штрихкода не может превышать 20 символов", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setLoading(true);
    setNewProductGenerating(false);
    setBarcodeExists(false);
    getProductByBarcode(barcodeCheck);
  };

  const generateBarcode = () => {
    clearForm();
    Axios.get("/api/invoice/newbarcode")
      .then((res) => res.data)
      .then((barcodeseq) => {
        const last = barcodeseq + "2";
        const barcodeCheck = "2" + last.padStart(12, "0");
        setBarcode(barcodeCheck);
        setNewProductGenerating(true);
        dispatch(change("AddProductForm", "code", barcodeCheck));
      });
  };

  const fillRateAndSum = (product, rate, sum) => {
    if (rate) {
      setMarginPercentage(rate);
      dispatch(change("AddProductForm", "surcharge", rate));
      dispatch(
        change(
          "AddProductForm",
          "newprice",
          product.lastpurchaseprice
            ? product.lastpurchaseprice +
                (product.lastpurchaseprice * rate) / 100
            : 0
        )
      );
    }
    if (sum) {
      setMarginSum(sum);

      const surchargeRounded = product.lastpurchaseprice
        ? Math.round(
            ((product.price - product.lastpurchaseprice) * 100) /
              product.lastpurchaseprice
          )
        : 0;
      dispatch(change("AddProductForm", "surcharge", surchargeRounded));
      dispatch(change("AddProductForm", "newprice", product.price + sum));
    }
  };

  const fillPrices = (product) => {
    if (product.rate || product.sum) {
      fillRateAndSum(product, product.rate, product.sum);
    } else if (marginBrand.rate || marginBrand.sum) {
      fillRateAndSum(product, marginBrand.rate, marginBrand.sum);
    } else if (marginCategory.rate || marginCategory.sum) {
      fillRateAndSum(product, marginCategory.rate, marginCategory.sum);
    } else {
      setMarginPercentage(0);
      setMarginSum(0);
      const surchargeRounded = Math.round(
        ((product.price - product.lastpurchaseprice) * 100) /
          product.lastpurchaseprice
      );
      dispatch(change("AddProductForm", "surcharge", surchargeRounded));
      dispatch(change("AddProductForm", "newprice", product.price));
    }
  };

  const getProductByBarcode = (barcodeChanged) => {
    Axios.get("/api/products/barcode", {
      params: { barcode: barcodeChanged, all: 1 },
    })
      .then((res) => res.data)
      .then((product) => {
        if (Object.keys(product).length === 0) {
          alert.warning("Товар не найден", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          clearForm();
          dispatch(change("AddProductForm", "code", barcodeChanged));
          setBarcode(barcodeChanged);
          setLoading(false);
          setNewProductGenerating(true);

          return;
        }
        const isstaticpriceCheck = product.isstaticprice;
        let staticpriceCheck = "";
        if (isstaticpriceCheck) {
          staticpriceCheck = product.staticprice;
        }

        const prodID = product.id;
        // ProductID: для товаров из общего списка продукт айди добавляется null, для других товаров с `s` на конце
        setStaticPrice(staticpriceCheck);
        setBarcode(barcodeChanged);
        const name =
          prodID.slice(-1) === "s"
            ? product.name
            : { label: product.name, value: product.id };
        setNewProductGenerating(prodID.slice(-1) === "s" ? true : false);
        setBarcodeExists(prodID.slice(-1) === "s" ? true : false);
        setProductID(prodID.slice(-1) === "s" ? null : product.id);
        setLoading(false);
        setProductSelectValue(name);

        const attributeCapat = product.attributescaption;
        setAttributeCapation(attributeCapat);

        const attrCode = product.attributes;
        setAttributeCode(attrCode);

        const productCategory = {
          label: product.category,
          value: product.categoryid,
        };
        const brand = { label: product.brand, value: product.brandid };

        if (!product.categoryid || !product.category) {
          dispatch(change("AddProductForm", "category", ""));
        } else {
          dispatch(change("AddProductForm", "category", productCategory));
        }
        getBrands(product.brand, brand, product);
        getCategories(product.category, productCategory, product);
        dispatch(change("AddProductForm", "brand", product.brand ? brand : 0));

        dispatch(change("AddProductForm", "name", name));
        dispatch(change("AddProductForm", "isstaticprice", isstaticpriceCheck));
        dispatch(change("AddProductForm", "staticprice", staticpriceCheck));
        dispatch(change("AddProductForm", "cnofea", product.cnofeacode));
        dispatch(change("AddProductForm", "code", barcodeChanged));

        dispatch(change("AddProductForm", "newprice", product.price));

        //Изменения единиц измерения ****************BEGIN*************
        if (product.unitsprid) {
          const unitLabel = unitOptions.filter((e) => {
            return e && e.id === product.unitsprid;
          });

          const unit = { label: unitLabel[0].name, value: product.unitsprid };

          dispatch(change("AddProductForm", "unitsprid", unit));
        }
        // //Услуга
        if (product.unitsprid === "3") {
          setDisableUnits(true);
          dispatch(change("AddProductForm", "lastpurchaseprice", 0));
          dispatch(change("AddProductForm", "amount", 0));
        } else {
          setDisableUnits(false);
        }

        //продажа поштучно
        if (product.piece) {
          setSellByPieces(true);
          dispatch(
            change("AddProductForm", "pieceinpack", product.pieceinpack)
          );
          dispatch(change("AddProductForm", "pieceprice", product.pieceprice));
        } else {
          setSellByPieces(false);
          dispatch(change("AddProductForm", "pieceinpack", ""));
          dispatch(change("AddProductForm", "pieceprice", ""));
        }

        //Изменения единиц измерения ****************END*************
        const taxWithout = { label: "Без НДС", value: "0" };
        const taxWith = { label: "Стандартный НДС", value: "1" };
        if (!product.taxid) {
          dispatch(change("AddProductForm", "taxid", ""));
        } else if (product.taxid === "0") {
          dispatch(change("AddProductForm", "taxid", taxWithout));
        } else dispatch(change("AddProductForm", "taxid", taxWith));

        if (product.lastpurchaseprice === 0) {
          setOldPrice(product.lastpurchaseprice);
          setLastPurchasePrice(product.lastpurchaseprice);
          setNewPrice(product.price);
        } else if (product.price && product.lastpurchaseprice) {
          setOldPrice(product.lastpurchaseprice);
          setLastPurchasePrice(product.lastpurchaseprice);
          setNewPrice(product.price);
        } else {
          dispatch(change("AddProductForm", "newprice", ""));
          dispatch(change("AddProductForm", "lastpurchaseprice", ""));
          dispatch(change("AddProductForm", "surcharge", ""));
        }
        dispatch(
          change(
            "AddProductForm",
            "lastpurchaseprice",
            product.lastpurchaseprice
          )
        );

        if (product.cnofeaCode != null) {
          cnofeaVerify(product.cnofeacode);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFormKeyPress = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleAddProduct = (data) => {
    if (staticprice) {
      if (data.newprice > staticprice) {
        return alert.warning(
          `Внимание! Цена продажи не может превышать предельную цену: ${staticprice}`,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      }
    }
    setAddProductData(data);

    if (topLimit > 0 || bottomLimit > 0) {
      if (
        (topLimit > 0 && data.surcharge > topLimit) ||
        (bottomLimit > 0 && data.surcharge < bottomLimit)
      ) {
        setLimitAlert(true);
        return;
      } else setLimitAlert(false);
    } else setLimitAlert(false);

    if (data.newprice === "0") {
      setSubmitting(true);
      setModalOpenAlert(true);
    } else {
      setSubmitting(true);
      addProduct(data);
      // if (isEditing) {
      //   const item = {
      //     invoice: invoiceNumber,
      //     stock: editProduct.stock,
      //     attributes: editProduct.attributes,
      //   };
      //   deleteOldRecord(item);
      //   setAdding(true);
      // } else {
      //   addProduct(data);
      // }
    }
  };
  const addProduct = (data) => {
    let state = true;
    attrIdandValue.forEach((element) => {
      if (!element.code) {
        state = true;
      } else {
        if (!element.value || element.value === "") {
          state = false;
        }
      }
    });
    if (!state) {
      setSubmitting(false);
      alert.warning("Заполните атрибуты!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      if (isEditing) {
        const item = {
          invoice: invoiceNumber,
          stock: editProduct.stock,
          attributes: editProduct.attributes,
        };

        deleteOldRecord(item);
      }
      //всё что ниже переписывалось 100500 раз, трогать осторожно.
      const newData = {
        amount: unitsprid === "3" ? 0 : data.amount,
        attributes: !isEditing
          ? attributeCode || 0
          : editProduct.attributes !== "0" &&
            parseInt(editProduct.attributes, 0) >= 0
          ? editProduct.attributes
          : editProduct.attributes,
        brand: data.brand ? data.brand.value : 0,
        category: data.category ? data.category.value : null,
        cnofea: data.cnofea,
        code: !isEditing ? data.code : editProduct.code,
        id: !isEditing
          ? productID
          : editProduct.is_new
          ? null
          : editProduct.idc,
        isstaticprice: data.isstaticprice,
        lastpurchaseprice: oldprice,
        name: !isEditing ? data.name.label || data.name : editProduct.name,
        newprice: data.newprice,
        piece: sellByPieces ? true : false,
        pieceinpack: sellByPieces ? data.pieceinpack : 0,
        pieceprice: sellByPieces ? data.pieceprice : 0,
        purchaseprice: unitsprid === "3" ? 0 : data.lastpurchaseprice,
        staticprice: data.staticprice,
        sku: null, // он вроде не нужен, нужно будет перепроверить.
        taxid: companyData.certificatenum ? data.taxid.value : "0",
        unitsprid: data.unitsprid.value,
        updateprice,
        attrlist: editProduct.attributes
          ? attrIdandValue
          : attributeCode === "0" || !attributeCode
          ? []
          : attrIdandValue,
      };
      // всё что выше переписывалось 100500 раз, трогать осторожно.

      let reqdata = {
        invoice: invoiceNumber,
        type: "2",
        stockcurrentfrom: [newData],
      };

      //remove tabs and spaces
      newData.name = newData.name.replace(/\\t| {2}/g, "").trim();
      newData.code = newData.code.replace(/\\t| {2}/g, "").trim();
      Axios.post("/api/invoice/add/product", reqdata)
        .then((res) => {
          setEditAttrubutes(newData.attrlist);
          const newProductChanged = {
            invoice: reqdata.invoice,
            attributes: attributeCode || null,
            categoryName: newData.category,
            brand: newData.brand,
            code: newData.code,
            name: newData.name,
            newprice: newData.newprice,
            purchaseprice: newData.lastpurchaseprice,
            stock: res.data.text,
            amount: newData.amount,
          };
          newProduct(newProductChanged);
          setSubmitting(false);
          setAdding(false);
          handleEditing();
          clearForm();
          alert.success("Товар успешно добавлен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        })
        .catch((err) => {
          setSubmitting(false);
          ErrorAlert(err);
        });
    }
  };
  const changeState = (value) => {
    setAttrIdandValue(value);
  };

  const numberValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^[\d.]+$/)) e.preventDefault();
  };

  const reloadPage = () => {
    //https://github.com/Microsoft/TypeScript/issues/28898
    window.location.reload(false);
  };

  return (
    <Fragment>
      <ReactModal isOpen={modalIsOpenAlert} style={customStyles}>
        <AddProductAlerts history={history} closeAlert={closeAlert} />
      </ReactModal>
      <ReactModal isOpen={limitAlert} style={customStyles}>
        <LimitAlert
          closeLimitAlert={() => setLimitAlert(false)}
          topLimit={topLimit}
          bottomLimit={bottomLimit}
          submitData={() => addProduct(addProductData)}
        />
      </ReactModal>
      <div className="empty-space"></div>

      {staticprice && (
        <Alert severity="warning" style={{ marginTop: "1rem" }}>
          <AlertTitle>
            <strong style={{ fontSize: "0.875rem" }}>Внимание!</strong>
          </AlertTitle>
          <p style={{ fontSize: "0.875rem" }}>
            На данный товар установлена предельная цена: {staticprice}тг.
          </p>
        </Alert>
      )}

      <div className="add-product-form">
        <form
          onSubmit={handleSubmit(handleAddProduct)}
          onKeyPress={handleFormKeyPress}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
              <label>Штрих код</label>
              <Field
                disabled={isEditing}
                name="code"
                component={InputGroup}
                placeholder="Внесите вручную, или с помощью сканера"
                type="text"
                className={`form-control ${isLoading ? "loading-btn" : ""}`}
                onChange={onBarcodeChange}
                onKeyDown={onBarcodeKeyDown}
                appendItem={
                  <Fragment>
                    <button
                      disabled={isEditing}
                      className="btn btn-outline-info"
                      type="button"
                      onClick={() => handleSearch()}
                    >
                      Поиск
                    </button>
                    <button
                      disabled={isEditing}
                      className="btn btn-outline-info"
                      type="button"
                      onClick={generateBarcode}
                    >
                      Сгенерировать
                    </button>
                  </Fragment>
                }
                validate={!isEditing ? [RequiredField, NoMoreThan20] : []}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div style={{ marginLeft: "2.2rem" }} className="col-md-8 zi-7">
              <label>Наименование</label>
              {newProductGenerating && (
                <Fragment>
                  <Field
                    name="name"
                    component={InputField}
                    className="form-control"
                    placeholder="Введите название товара"
                  />
                  {isBarcodeExists && (
                    <p style={{ opacity: "60%", fontStyle: "red" }}>
                      Вы можете редактировать название данного товара!
                    </p>
                  )}
                </Fragment>
              )}

              {!newProductGenerating && (
                <Field
                  name="name"
                  disabled={isEditing}
                  component={SelectField}
                  value={productSelectValue}
                  noOptionsMessage={() => "Товар не найден"}
                  onChange={productListChange}
                  placeholder="Введите название товара"
                  onInputChange={onProductListInput.bind(this)}
                  options={productOptions || []}
                />
              )}
            </div>
            <Tooltip name="товаров" />
          </div>

          <div className="row justify-content-center">
            <div style={{ marginLeft: "2.2rem" }} className="col-md-8 zi-6">
              <label htmlFor="category">Категория</label>
              <Field
                name="category"
                component={SelectField}
                onChange={categoryChange}
                value={category}
                placeholder="Категория"
                noOptionMessage="Категория не найдена"
                options={categoryOptions}
                onInputChange={onCategoryListInput.bind(this)}
              />
            </div>
            <Tooltip name="категорий" />
          </div>

          <div className="row justify-content-center">
            <div style={{ marginLeft: "2.2rem" }} className="col-md-8 zi-5">
              <label>Бренд</label>
              <Field
                name="brand"
                component={SelectField}
                value={brand}
                noOptionsMessage={() => "Бренд не найден"}
                onChange={brandListChange}
                placeholder="Внесите наименование производителя"
                className="form-control"
                onInputChange={onBrandListInput.bind(this)}
                options={brandOptions || []}
              />
            </div>
            <Tooltip name="брендов" />
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <label>Код ТН ВЭД</label>
              <Field
                name="cnofea"
                component={InputGroup}
                type="text"
                className="form-control"
                placeholder="Внесите ТН ВЭД"
                autocomplete="off"
                onChange={numberValidation}
                onBlur={onCnofeaChange}
                validate={[NoMoreThan10]}
              />
            </div>
          </div>
          <SellByPieces
            sellByPieces={sellByPieces}
            onSellByPiecesChange={onSellByPiecesChange}
            onPieceAmountChange={onPieceAmountChange}
            onPiecePriceChange={onPiecePriceChange}
          />
          <div className="row justify-content-center">
            <div className="col-md-8 cnofea-name-text">{cnofeaName}</div>
          </div>
          <div className="row justify-content-center">
            <div style={{ minWidth: "8rem" }} className="col-md-2">
              <label>Цена закупки</label>
              <Field
                name="lastpurchaseprice"
                component={InputGroup}
                type="number"
                className="form-control"
                onChange={onPurchasePriceChange}
                autocomplete="off"
                onWheel={(event) => event.currentTarget.blur()}
                appendItem={<span className="input-group-text">&#8376;</span>}
                validate={
                  unitsprid !== "3" ? [RequiredField, LessThanZero] : []
                }
              />
            </div>
            <div style={{ minWidth: "8rem" }} className="col-md-2">
              <label>Надбавка</label>
              <Field
                name="surcharge"
                component={InputGroup}
                type="number"
                className="form-control"
                onChange={onSurchargeChange}
                autocomplete="off"
                onWheel={(event) => event.currentTarget.blur()}
                appendItem={<span className="input-group-text">%</span>}
              />
            </div>
            <div style={{ minWidth: "8rem" }} className="col-md-2">
              <label>Цена продажи</label>
              <Field
                name="newprice"
                component={InputGroup}
                type="number"
                className="form-control"
                onChange={onNewPriceChange}
                autocomplete="off"
                onWheel={(event) => event.currentTarget.blur()}
                appendItem={<span className="input-group-text">&#8376;</span>}
                validate={
                  unitsprid !== "3" ? [RequiredField, LessThanZero] : []
                }
              />
            </div>
            <div className="col-md-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={updateprice}
                    onChange={onUpdatePriceChange}
                    name="updateprice"
                    id="updateprice"
                    color="primary"
                  />
                }
                label="Обновление цены на всех торговых точках"
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-2">
              <label>Количество</label>
              <Field
                name="amount"
                component={InputGroup}
                placeholder="Внесите количество"
                type="number"
                disabled={disableUnits}
                className="form-control"
                autocomplete="off"
                onWheel={(event) => event.currentTarget.blur()}
                onChange={numberValidation}
                validate={
                  unitsprid !== "3"
                    ? [RequiredField, LessThanZero, NotEqualZero]
                    : []
                }
              />
            </div>
            {companyData.certificatenum && (
              <div className="col-md-3 zi-4">
                <label>Налоговая категория</label>
                <Field
                  name="taxid"
                  component={SelectField}
                  options={taxOptions}
                  placeholder="Выберите налоговую категорию"
                  validate={[RequiredSelect]}
                />
              </div>
            )}
            <div className="col-md-3 zi-4" style={{ zIndex: 10 }}>
              <label>Единица измерения</label>
              <Field
                name="unitsprid"
                component={SelectField}
                value={unitsprid}
                options={unitOptions || ""}
                placeholder="Выберите единицу измерения"
                onChange={onUnitSprIdChange}
                validate={[RequiredSelect]}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-3">
              <label htmlFor="">Дополнительная информация</label>
            </div>
          </div>
          <div className="row justify-content-center">
            <div style={{ marginLeft: "2.2rem" }} className="col-md-8 zi-6">
              <div className="col-md-12">
                <AddAttribute
                  attributescaption={attributescaption}
                  editAttrubutes={editAttrubutes}
                  changeState={changeState}
                  isEditing={isEditing}
                  editProduct={editProduct}
                  selected={selectedAttribute}
                  clearBoard={clearBoard}
                />
                <Alert severity="info" style={{ marginTop: 10 }}>
                  <AlertTitle>
                    <strong>Внимание!</strong>
                  </AlertTitle>
                  Что бы добавить атрибут на товар перейдите в раздел
                  "Номенклатура", выберите товар и нажмите "редактировать". В
                  поле "Партийные характеристики" добавьте атрибуты.
                </Alert>
              </div>
            </div>
          </div>
          <div className="row justify-content-center text-right mt-20">
            <div className="col-md-8">
              <button
                type="button"
                className="btn mr-10"
                disabled={isSubmitting || pristine || submitting}
                onClick={clearForm}
              >
                Очистить
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn mr-10"
                  disabled={isSubmitting || pristine || submitting}
                  onClick={reloadPage}
                >
                  Отменить редактирование
                </button>
              )}
              <button className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting
                  ? "Пожалуйста дождитесь"
                  : isEditing
                  ? "Редактировать товар"
                  : "Сохранить товар"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AddProductForm = reduxForm({
  form: "AddProductForm",
  reset,
})(AddProductForm);
