import React, { useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import { RequiredField } from "../../../validation";

export default function UpdateBonusPage() {
  const [barcode, setBarcode] = useState("");
  const [bonusCategory, setBonusCategory] = useState("");
  const [bonusProduct, setBonusProduct] = useState("");
  const [categories, setCategories] = useState([]);
  const [categorySelectValue, setCategorySelectValue] = useState({
    label: "Выберите категорию",
    value: "-1",
    bonusrate: 0,
    exception: Array(0),
  });
  const [exceptionCategory, setExceptionCategory] = useState("");
  const [isToggleCategory, setToggleCategory] = useState(true);
  const [isToggleProduct, setToggleProduct] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [productSelectValue, setProductSelectValue] = useState("");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [valueCategory, setValueCategory] = useState("");

  useEffect(() => {
    getProducts();
    getCategoriesById();
  }, []);

  const getProductByBarcode = (b) => {
    Axios.get("/api/products/barcode", { params: { barcode: b } })
      .then((res) => res.data)
      .then((res) => {
        const product = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(product);
        getProductsById(product.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (productName) => {
    setLoading(true);
    Axios.get("/api/products", { params: { productName } })
      .then((res) => res.data)
      .then((res) => {
        const productsChanged = res.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });
        setProducts(productsChanged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  //Бонусы по конкретному id продукта
  const getProductsById = (id) => {
    setLoading(true);
    Axios.get("/api/products/bonusratebyid", { params: { id } })
      .then((res) => res.data)
      .then((bonus) => {
        setBonusProduct(bonus.bonusrate);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  //Категории с бонусами и исключениями (продукты одной категории с разной бонусной ставкой)
  const getCategoriesById = () => {
    setLoading(true);
    Axios.get("/api/products/bonusratebycategories")
      .then((res) => res.data)
      .then((res) => {
        const categoriesChanged = res.map((result) => {
          return {
            label: result.name,
            value: result.id,
            bonusrate: result.bonusrate,
            exception: result.exception,
          };
        });
        setCategories(categoriesChanged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onCategoryChange = (cat) => {
    if (!cat.value) {
      setCategorySelectValue({
        label: "Выберите категорию",
        value: "-1",
        bonusrate: 0,
        exception: Array(0),
      });
      setShowCategories(true);
      return;
    }
    setCategorySelectValue(cat);
    setValueCategory(cat.value);
    setBonusCategory(cat.bonusrate);
    setExceptionCategory(cat.exception);
    setBonusProduct("");
    setLoading(false);
    setShowCategories(true);
  };

  const onProductChange = (prod) => {
    if (!prod.code) {
      setProductSelectValue("");
      setBarcode("");
      return;
    }
    setProductSelectValue(prod);
    setValueCategory("");
    setExceptionCategory("");
    setBonusCategory("");
    setBonusProduct("");
    setBarcode(prod.code);
    setLoading(false);
    setShowProducts(true);
    getProductsById(prod.value);
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    if (barcodeChanged) {
      setBarcode(barcodeChanged);
      setLoading(false);
      setShowProducts(true);
    } else {
      setProductSelectValue("");
      setBarcode("");
    }
  };

  function onBonusCategoryChange(e) {
    let bonusCategoryChanged = e.target.value;
    if (!bonusCategoryChanged.match(/^\d+$/)) e.preventDefault();
    if (bonusCategoryChanged.length > 3) return;
    setBonusCategory(bonusCategoryChanged);
  }

  function onBonusProductChange(e) {
    let bonusProductChanged = e.target.value;
    if (!bonusProductChanged.match(/^\d+$/)) e.preventDefault();
    if (bonusProductChanged.length > 3) return;
    setBonusProduct(bonusProductChanged);
  }

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) getProducts(productName);
  };

  const toggleCategory = () => {
    setLoading(false);
    setBarcode("");
    setValueCategory("");
    setExceptionCategory("");
    setBonusCategory("");
    setBonusProduct("");
    setCategorySelectValue({
      label: "Выберите категорию",
      value: "-1",
      bonusrate: 0,
      exception: Array(0),
    });
    setProductSelectValue("");
    setToggleCategory(true);
    setToggleProduct(false);
    setShowProducts(false);
    setShowCategories(false);
  };

  const toggleProduct = () => {
    setBarcode("");
    setValueCategory("");
    setExceptionCategory("");
    setCategorySelectValue({
      label: "Выберите категорию",
      value: "-1",
      bonusrate: 0,
      exception: Array(0),
    });
    setBonusCategory("");
    setBonusProduct("");
    setProductSelectValue("");
    setLoading(false);
    setToggleCategory(false);
    setToggleProduct(true);
    setShowCategories(false);
    setShowProducts(false);
  };

  const handleBonus = (type, bonus, id) => {
    if (!bonus) {
      return Alert.error("Вы пытаетесь добавить пустое значение", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    sendInfo(type, bonus, id);
  };

  const sendInfo = (type, rate, id) => {
    const bonusrate = {
      type: type,
      rate: rate,
      id: id,
    };
    setLoading(true);
    Axios.post("/api/products/change_bonusrate", { bonusrate })
      .then(() => {
        Alert.success("Ставка успешно сохранена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setLoading(false);
        getCategoriesById();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDetails = (cat, type, bonus, id, exception) => {
    const bonusrate = {
      type,
      rate: bonus,
      id,
      exception,
    };
    setLoading(true);
    Axios.post("/api/products/change_bonusrate", {
      bonusrate,
    })
      .then(() => {
        Alert.success("Ставка успешно сохранена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });

        setLoading(false);
        setCategorySelectValue(cat);
        getCategoriesById();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        Alert.error("Вы пытаетесь добавить пустое значение", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        return;
      });
  };

  return (
    <div className="brand-list">
      <div className="row">
        <div className="col-md-12">
          <h6 className="btn-one-line">Настройка бонусной ставки</h6>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 month-btn">
          <button
            className={`btn btn-sm btn-block btn-report ${
              isToggleCategory ? "btn-info" : "btn-outline-info"
            }`}
            onClick={toggleCategory}
          >
            Категории
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className={`btn btn-sm btn-block btn-report ${
              isToggleProduct ? "btn-info" : "btn-outline-info"
            }`}
            onClick={toggleProduct}
          >
            Товары
          </button>
        </div>
      </div>

      {isToggleCategory && (
        <div className="row pt-10">
          <div className="col-md-6 bonus-block">
            <label>Выберите категорию из списка: </label>
            <Select
              name="category"
              value={categories.value}
              onChange={onCategoryChange}
              options={categories}
              placeholder="Выберите категорию"
              noOptionsMessage={() => "Категория не найдена"}
            />
          </div>
        </div>
      )}
      {!isLoading && showCategories && (
        <div>
          <div>Процент начисления бонуса:</div>
          <div className="row">
            <div className="col-md-1 percentage-block">
              <input
                name="bonusCategory"
                value={bonusCategory}
                className="form-control"
                onChange={onBonusCategoryChange.bind(this)}
                onWheel={(event) => event.currentTarget.blur()}
                type="number"
                validate={[RequiredField]}
              />
            </div>
            <label style={{ fontSize: "25px" }}>%</label>
            {!isLoading && exceptionCategory.length === 0 && (
              <div className="col-md-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    handleDetails(
                      categorySelectValue,
                      "cat",
                      bonusCategory,
                      valueCategory,
                      exceptionCategory
                    )
                  }
                >
                  Сохранить
                </button>
              </div>
            )}
            {!isLoading && exceptionCategory.length > 0 && (
              <div className="col-md-10 row">
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                      handleDetails(
                        categorySelectValue,
                        "cat",
                        bonusCategory,
                        valueCategory,
                        exceptionCategory
                      )
                    }
                  >
                    Оставить товары со старым бонусом
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() =>
                      handleDetails(
                        categorySelectValue,
                        "cat",
                        bonusCategory,
                        valueCategory
                      )
                    }
                  >
                    Изменить бонусы у всех товаров
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!isLoading && exceptionCategory.length > 0 && (
        <div className="row">
          <div className="col-md-12">
            <table className="table table-sm table-check-detail">
              <thead>
                <tr>
                  <th>Наименование товара</th>
                  <th>Бонусная ставка</th>
                </tr>
              </thead>
              <tbody>
                {categorySelectValue.exception.map((except, idx) => (
                  <tr key={idx}>
                    <td>{except.name}</td>
                    <td>{except.bonusrate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isToggleProduct && (
        <div className="row pt-10">
          <div className="col-md-3 bonus-block">
            <label style={{ minWidth: "150px" }}>Внесите штрих код: </label>
            <input
              name="barcode"
              value={barcode}
              placeholder="штрих код"
              onChange={onBarcodeChange}
              onKeyDown={onBarcodeKeyDown}
              type="text"
              className="form-control"
            />
          </div>
          <div className="col-md-9 bonus-block">
            <label>Выберите товар из списка: </label>
            <Select
              name="product"
              value={productSelectValue}
              onChange={onProductChange}
              options={products}
              placeholder="Выберите товар"
              onInputChange={onProductListInput.bind(this)}
              noOptionsMessage={() => "Товар не найден"}
            />
          </div>
        </div>
      )}

      {isLoading && <Searching />}

      {!isLoading && showProducts && (
        <div>
          <div>Процент начисления бонуса:</div>
          <div className="row">
            <div className="col-md-1 percentage-block">
              <input
                name="bonusProduct"
                value={bonusProduct}
                className="form-control"
                onWheel={(event) => event.currentTarget.blur()}
                onChange={onBonusProductChange.bind(this)}
                type="number"
                validate={[RequiredField]}
              />
            </div>
            <label style={{ fontSize: "25px" }}>%</label>
            <div>
              <button
                style={{ width: "195px", marginLeft: "20px" }}
                className="btn btn-outline-primary"
                onClick={() =>
                  handleBonus("prod", bonusProduct, productSelectValue.value)
                }
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
