import React, { useState, useEffect, Fragment } from "react";
import { Field, reduxForm, reset, change } from "redux-form";
import { InputGroup, InputField, SelectField } from "../../../../fields";
import Axios from "axios";
import Alert from "react-s-alert";
import { isAllowed } from "../../../../../barcodeTranslate";
import cnofeaList from "../../../../../data/cnofea.json";
import {
  RequiredField,
  NoMoreThan13,
  RequiredSelect,
} from "../../../../../validation";
import ReactTooltip from "react-tooltip";
import ReactModal from "react-modal";
import AddProductAlerts from "../../Alerts/AddProductAlerts";
import SellByPieces from "./SellByPieces";

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

let ProductReference = ({
  dispatch,
  pristine,
  submitting,
  deleteOldRecord,
  reset,
  isEditing,
  history,
  handleSubmit,
  invoiceNumber,
  editProduct,
  handleEditing,
  newProduct,
}) => {
  const [addProductData, setAddProductData] = useState("");
  const [brand, setBrand] = useState(0);
  const [staticprice, setStaticPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [productID, setProductID] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [taxOptions, setTaxOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [newProductGenerating, setNewProductGenerating] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [clearBoard, setClearBoard] = useState(false);
  const [isBarcodeExists, setBarcodeExists] = useState(false);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [oldprice, setOldPrice] = useState(0);
  const [brandOptions, setBrandOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [modalIsOpenAlert, setModalOpenAlert] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitsprid, setUnitSprid] = useState("");
  const [updateprice, setUpdatePrice] = useState(true);
  const [isAdding, setAdding] = useState(false);
  const [sellByPieces, setSellByPieces] = useState(false);

  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};

  const productListChange = (productChanged) => {
    setProductSelectValue(productChanged);

    if (productChanged.code) {
      setBarcode(productChanged.code);
      handleSearch(productChanged.code);
    } else {
      clearForm();
    }
  };
  const onCategoryListInput = (categoryName) => {
    if (categoryName.length > 0) getCategories(categoryName);
  };
  const onBrandListInput = (brandName) => {
    if (brandName.length > 0) getBrands(brandName);
  };
  const categoryChange = (categoryChanged) => {
    setCategory(categoryChanged);
  };

  useEffect(() => {
    getTaxes();
    getCategories();
    getBrands();
    getMeasures();
  }, []);

  const getProducts = (inputValue) => {
    Axios.get("/api/products", { params: { productName: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const productRes = list.map((product) => {
          return {
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
  const onUnitSprIdChange = (e) => {
    const id = e.value;
    if (id === "3") {
      dispatch(change("AddProductForm", "lastpurchaseprice", 0));
      dispatch(change("AddProductForm", "amount", 0));
    } else {
    }
    setUnitSprid(id);
  };
  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const brandRes = list.map((brand) => {
          return {
            name: brand.brand,
            id: brand.id,
          };
        });
        setBrandOptions(brandRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const closeAlert = (isSubmit) => {
    if (isSubmit) {
      addProductData;
    } else {
      setSubmitting(false);
    }
    setModalOpenAlert(false);
  };
  const generateBarcode = () => {
    clearForm();
    Axios.get("/api/invoice/newbarcode")
      .then((res) => res.data)
      .then((barcodeseq) => {
        const last = barcodeseq + "2";
        const barcodeCheck = "2" + last.padStart(12, "0");
        setBarcode(barcodeCheck);
        dispatch(change("ProductReference", "code", barcodeCheck));
      });
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) getProducts(productName);
  };
  const handleFormKeyPress = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  const brandListChange = (brandChanged) => {
    setBrand(brandChanged);
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

  const handleAddProduct = (data) => {
    if (staticprice) {
      if (data.newprice > staticprice) {
        return Alert.warning(
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

    if (data.newprice === "0") {
      setSubmitting(true);
      setModalOpenAlert(true);
    } else {
      setSubmitting(true);
      if (isEditing) {
        const item = {
          invoice: invoiceNumber,
          stock: editProduct.stock,
          attributes: editProduct.attributes,
        };
        deleteOldRecord(item);
        setAdding(true);
      } else {
        addProduct(data);
      }
    }
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
      dispatch(change("ProductReference", "taxid", tax));
    } else {
    }
  };
  const getCategories = (inputValue) => {
    Axios.get("/api/categories/search", { params: { category: inputValue } })
      .then((res) => res.data)
      .then((categoryRes) => {
        setCategoryOptions(categoryRes);
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
          };
        });
        const unit = {
          label: unitRes[0].name,
          value: unitRes[0].id,
        };

        dispatch(change("AddProductForm", "unitsprid", unit));
        setUnitOptions(unitRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProductByBarcode = (barcodeChanged) => {
    Axios.get("/api/products/barcode", {
      params: { barcode: barcodeChanged, all: 1 },
    })
      .then((res) => res.data)
      .then((product) => {
        if (Object.keys(product).length === 0) {
          Alert.warning("Товар не найден", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          clearForm();
          dispatch(change("ProductReference", "code", barcodeChanged));
          setBarcode(barcodeChanged);
          setLoading(false);
          return;
        }

        const isstaticpriceCheck = product.isstaticprice;
        let staticpriceCheck = "";
        if (isstaticpriceCheck) {
          staticpriceCheck = product.staticprice;
        }

        const prodID = product.id;
        // ProductID: для товаров из общего списка продукт айди добавляется null, для других товаров с `s` на конце
        setBarcode(barcodeChanged);
        const name =
          prodID.slice(-1) === "s"
            ? product.name
            : { label: product.name, value: product.id };
        setLoading(false);

        const productCategory = {
          label: product.category,
          value: product.categoryid,
        };
        const brand = { label: product.brand, value: product.brandid };

        if (!product.categoryid || !product.category) {
          dispatch(change("ProductReference", "category", ""));
        } else {
          dispatch(change("ProductReference", "category", productCategory));
        }

        dispatch(
          change("ProductReference", "brand", product.brand ? brand : 0)
        );
        dispatch(change("ProductReference", "name", name));
        dispatch(
          change("ProductReference", "isstaticprice", isstaticpriceCheck)
        );
        dispatch(change("ProductReference", "staticprice", staticpriceCheck));
        dispatch(change("ProductReference", "code", barcodeChanged));

        //Изменения единиц измерения ****************BEGIN*************
        if (product.unitsprid) {
          const unitLabel = unitOptions.filter((e) => {
            return e && e.id === product.unitsprid;
          });

          const unit = { label: unitLabel[0].name, value: product.unitsprid };

          dispatch(change("ProductReference", "unitsprid", unit));
        }

        if (product.unitsprid === "3") {
          dispatch(change("AddProductForm", "amount", 0));
        }

        //Изменения единиц измерения ****************END*************

        const taxWithout = { label: "Без НДС", value: "0" };
        const taxWith = { label: "Стандартный НДС", value: "1" };
        if (!product.taxid) {
          dispatch(change("ProductReference", "taxid", ""));
        } else if (product.taxid === "0") {
          dispatch(change("ProductReference", "taxid", taxWithout));
        } else dispatch(change("ProductReference", "taxid", taxWith));

        if (product.lastpurchaseprice === 0) {
          dispatch(change("ProductReference", "surcharge", 0));
        } else if (product.price && product.lastpurchaseprice) {
          const surchargeRounded = Math.round(
            ((product.price - product.lastpurchaseprice) * 100) /
              product.lastpurchaseprice
          );

          dispatch(change("ProductReference", "surcharge", surchargeRounded));
        } else {
          dispatch(change("ProductReference", "newprice", ""));
          dispatch(change("ProductReference", "lastpurchaseprice", ""));
          dispatch(change("ProductReference", "surcharge", ""));
        }
        dispatch(
          change(
            "ProductReference",
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
  const handleSearch = (brcd) => {
    const barcodeCheck = brcd || barcode;
    if (!barcodeCheck) {
      return Alert.info("Заполните поле Штрих код", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (barcodeCheck.length > 20) {
      return Alert.info("Длина штрихкода не может превышать 20 символов", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setLoading(true);
    getProductByBarcode(barcodeCheck);
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
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

  const clearForm = () => {
    setBarcode(null);
    reset();
    //dispatch(reset("ProductReference"));

    const tx = taxOptions.find((tax) => {
      return tax.id === "1";
    });

    const tax = { label: tx.name, value: tx.id };

    dispatch(change("ProductReference", "taxid", tax));
    console.log(tax);
  };
  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();

    if (!isAllowed(barcodeChanged)) {
      Alert.warning(`Пожалуйста поменяйте раскладку на латиницу!`, {
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
  const addProduct = (data) => {
    data.category = data.category ? data.category.value : null;
    if (!isEditing) {
      data.name = data.name.label || data.name;
      data.id = productID;
    } else {
      console.log(editProduct.is_new);
      editProduct.is_new ? (data.id = null) : (data.id = editProduct.id);
      data.name = editProduct.name;
      //data.id = editProduct.id;
      data.code = editProduct.code;
    }
    companyData.certificatenum
      ? (data.taxid = data.taxid.value)
      : (data.taxid = "0");
    data.sku = null;

    if (data.brand) {
      data.brand = data.brand.value;
    } else data.brand = 0;
    data.updateprice = updateprice;
    data.purchaseprice = data.lastpurchaseprice;
    data.unitsprid = data.unitsprid.value;
    data.lastpurchaseprice = oldprice;

    if (unitsprid === "3") {
      data.purchaseprice = 0;
      data.amount = 0;
    }

    let reqdata = {
      invoice: invoiceNumber,
      type: "2",
      stockcurrentfrom: [data],
    };

    //remove tabs and spaces
    data.name = data.name.replace(/\\t| {2}/g, "").trim();
    data.code = data.code.replace(/\\t| {2}/g, "").trim();
    Axios.post("/api/invoice/add/product", reqdata)
      .then((res) => {
        const newProductChanged = {
          invoice: data.invoice,
          categoryName: data.category,
          brand: data.brand,
          code: data.code,
          name: data.name,
          newprice: data.newprice,
          purchaseprice: data.lastpurchaseprice,
          stock: res.data.text,
          amount: data.amount,
        };
        newProduct(newProductChanged);
        setSubmitting(false);
        setAdding(false);
        handleEditing();
        setClearBoard(data.code);
        clearForm();
        Alert.success("Товар успешно добавлен", {
          position: "top-right",
          effect: "bouncyflip", 
          timeout: 2000,
        });
      })
      .catch((err) => {
        setSubmitting(false);
        setClearBoard(data.code);
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      });
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
                validate={!isEditing ? [RequiredField, NoMoreThan13] : []}
              />
            </div>
            <div style={{ marginLeft: "1 rem" }} className="col-md-8 zi-7">
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
                    <p style={{ opacity: "60%" }}>
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
            <ReactTooltip />
          </div>
          <div className="row justify-content-center">
            <div style={{ marginLeft: "1 rem" }} className="col-md-8 zi-6">
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
            <ReactTooltip />
          </div>
          <div className="row justify-content-center">
            <div style={{ marginLeft: "1 rem" }} className="col-md-8 zi-5">
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
            <ReactTooltip />
          </div>
          <div className="row justify-content-center">
            {companyData.certificatenum && (
              <div className="col-md-8">
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
            <div className="col-md-8">
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
            <div className="col-md-8">
              <SellByPieces
                sellByPieces={sellByPieces}
                onSellByPiecesChange={onSellByPiecesChange}
              />
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

export default ProductReference = reduxForm({
  form: "ProductReference",
  reset,
})(ProductReference);
