import React, { Component } from "react";
import { Field, reduxForm, change, reset } from "redux-form";

import { InputGroup, SelectField } from "../../fields";
import { RequiredSelect } from "../../../validation";

import Alert from "react-s-alert";
import Axios from "axios";

import ReactTooltip from "react-tooltip";

class ProductAddBrand extends Component {
  state = {
    isSubmiting: false,
    productOptions: [],
    brandOptions: [],
    isLoading: false,
    brand: "",
    barcode: "",
    productSelectValue: "",
    label: {
      title: "Привязка бренда к товару",
      name: "Наименование товара",
      code: "Штрих код",
      brand: "Бренд",
      pleaseWait: "Пожалуйста подождите...",
      placeholder: {
        name: "Введите названия товара",
        code: "Введите штрих код",
        brand: "Введите наименование бренда"
      },
      buttonLabel: {
        save: "Привязать",
        edit: "Сохранить изменения",
        clear: "Очистить",
        search: "Поиск"
      }
    },
    alert: {
      success: "Успешно",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      barcodeIsEmpty: "Заполните поле Штрих код",
      productNotFound: "Товар не найден",
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!"
      }
    }
  };

  componentDidMount() {
    this.getProducts();
    this.getBrands();
  }

  getProducts = inputValue => {
    Axios.get("/api/products", { params: { productName: inputValue } })
      .then(res => res.data)
      .then(list => {
        const productOptions = list.map(product => {
          return {
            name: product.name,
            id: product.id,
            code: product.code
          };
        });

        this.setState({ productOptions });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getBrands = inputValue => {
    Axios.get("/api/brand/search", { params: { brand: inputValue } })
      .then(res => res.data)
      .then(list => {
        const brandOptions = list.map(brand => {
          return {
            name: brand.brand,
            id: brand.id
          };
        });

        this.setState({ brandOptions });
      })
      .catch(err => {
        console.log(err);
      });
  };

  onProductListInput = productName => {
    if (productName.length > 0) this.getProducts(productName);
  };

  productListChange = productSelectValue => {
    this.setState({ productSelectValue });

    if (productSelectValue.code) {
      this.setState({ barcode: productSelectValue.code });
      this.handleSearch(productSelectValue.code);
    } else {
      this.clearForm();
    }
  };

  handleSearch = brcd => {
    const barcode = brcd || this.state.barcode;
    if (!barcode) {
      Alert.info(this.state.alert.barcodeIsEmpty, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000
      });
      return;
    }
    this.setState({ isLoading: true, newProductGenerating: false });
    this.getProductByBarcode(barcode);
  };

  getProductByBarcode = barcode => {
    Axios.get("/api/products/barcode", { params: { barcode } })
      .then(res => res.data)
      .then(product => {
        // временно добавил
        if (Object.keys(product).length === 0) {
          Alert.warning(this.state.alert.productNotFound, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000
          });
          this.clearForm();
          this.props.dispatch(change("productaddbrandform", "code", barcode));
          this.setState({ barcode, isLoading: false });
          return;
        }

        this.setState({
          products: product,
          barcode,
          isLoading: false
        });

        const name = { label: product.name, value: product.id };
        const brand = { label: product.brand, value: product.brandid };

        this.props.dispatch(
          change("productaddbrandform", "brand", product.brand ? brand : null)
        );
        this.props.dispatch(change("productaddbrandform", "name", name));
        this.props.dispatch(change("productaddbrandform", "code", barcode));
      })
      .catch(err => {
        console.log(err);
      });
  };

  clearForm = () => {
    this.setState({
      barcode: ""
    });
    this.props.dispatch(reset("productaddbrandform"));
  };

  onBarcodeChange = e => {
    let barcode = e.target.value.toUpperCase();
    if (!barcode) {
      this.clearForm();
    } else {
      this.setState({ barcode });
    }
  };

  onBarcodeKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  };

  onBrandListInput = brandName => {
    if (brandName.length > 0) this.getBrands(brandName);
  };

  brandListChange = brand => {
    this.setState({ brand });
  };

  handleSubmit = data => {
    this.setState({ isSubmiting: true });
    this.submit(data);
  };

  submit = data => {
    const bind = { product: data.name.value, brand: data.brand.value };
    Axios.post("/api/brand/addtoproduct", { bind: bind })
      .then(() => {
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000
        });

        this.setState({ isSubmiting: false, barcode: "" });
        this.props.dispatch(reset("productaddbrandform"));
      })
      .catch(err => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? this.state.alert.raiseError
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000
          }
        );
        this.setState({ isSubmiting: false });
      });
  };

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const {
      brandOptions,
      isLoading,
      productSelectValue,
      brand,
      productOptions,
      label,
      isSubmiting
    } = this.state;

    return (
      <div id="addBrand">
        <div className="row">
          <div className="col-md-8">
            <h6 className="btn-one-line">{label.title} </h6>
          </div>
        </div>

        <div className="empty-space"></div>

        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <dl>
            <dt>{label.code}</dt>
            <dd className="row">
              <div className="col-md-11">
                <Field
                  name="code"
                  component={InputGroup}
                  placeholder={label.placeholder.code}
                  type="text"
                  className={`form-control ${isLoading ? "loading-btn" : ""}`}
                  onChange={this.onBarcodeChange}
                  onKeyDown={this.onBarcodeKeyDown}
                  appendItem={
                    <button
                      className="btn btn-outline-info"
                      type="button"
                      onClick={() => this.handleSearch()}
                    >
                      {label.buttonLabel.search}
                    </button>
                  }
                  // validate={[RequiredField]}
                />
              </div>
            </dd>
            <dt>{label.name}</dt>
            <dd className="row">
              <div className="col-md-11">
                <Field
                  name="name"
                  component={SelectField}
                  value={productSelectValue}
                  noOptionsMessage={() => "Товар не найден"}
                  onChange={this.productListChange}
                  placeholder={label.placeholder.name}
                  onInputChange={this.onProductListInput.bind(this)}
                  options={productOptions || []}
                  validate={RequiredSelect}
                />
              </div>
              <button
                //style={{ marginTop: "2rem" }}
                data-tip="В выпадающем списке отображаются только первые 50 товаров. Рекомендуется вводить текст для поиска в списке."
                className="btn btn-w-big-icon info-item"
              ></button>
              <ReactTooltip />
            </dd>
            <dt>{label.brand}</dt>
            <dd className="row">
              <div className="col-md-11">
                <Field
                  name="brand"
                  component={SelectField}
                  value={brand}
                  noOptionsMessage={() => "Бренд не найден"}
                  onChange={this.brandListChange}
                  placeholder={label.placeholder.brand}
                  className="form-control"
                  onInputChange={this.onBrandListInput.bind(this)}
                  options={brandOptions || []}
                  validate={RequiredSelect}
                />
              </div>
              <button
                //style={{ marginTop: "2rem" }}
                data-tip="В выпадающем списке отображаются только первые 50 брендов. Рекомендуется вводить текст для поиска в списке."
                className="btn btn-w-big-icon info-item"
              ></button>
              <ReactTooltip />
            </dd>
          </dl>

          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmiting || pristine || submitting}
          >
            {isSubmiting ? label.pleaseWait : label.buttonLabel.save}
          </button>

          <button
            type="button"
            className="btn btn-secondary ml-10"
            disabled={isSubmiting || pristine || submitting}
            onClick={() => this.clearForm()}
          >
            {label.buttonLabel.clear}
          </button>
        </form>
      </div>
    );
  }
}

ProductAddBrand = reduxForm({
  form: "productaddbrandform"
})(ProductAddBrand);

export default ProductAddBrand;
