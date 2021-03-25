import React, { Component } from "react";

import Alert from "react-s-alert";
import Axios from "axios";
import DiscountItems from "./DiscountItems";
import Select from "react-select";

import "./disabled-discounts.sass";

export default class DisabledDiscounts extends Component {
  maxId = 100;
  state = {
    discounts: [],
    isLoading: true,
    barcode: "",
    products: [],
    productsWithoutDiscount: [],
    productSelectValue: "",
    discountItems: [],
    productInfo: {},
  };

  componentDidMount() {
    this.getProducts();
    this.getProductsWithoutDiscount();
  }

  getProductByBarcode = (barcode) => {
    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        const productSelectValue = {
          value: product.id,
          label: product.name,
          code: product.code,
        };
        this.setState({ productSelectValue });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  getProducts = (productName) => {
    Axios.get("/api/products", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        const products = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });

        this.setState({ products: [...products], isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  getProductsWithoutDiscount = () => {
    Axios.get("/api/discount/prodwithoutdis")
      .then((res) => res.data)
      .then((disc) => {
        this.setState({
          productsWithoutDiscount: [...disc],
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  onProductListInput = (productName) => {
    this.getProducts(productName);
  };

  onProductChange = (productSelectValue) => {
    if (!productSelectValue.code) {
      this.setState({ productSelectValue, barcode: "" });
      return;
    }
    this.setState({ productSelectValue, barcode: productSelectValue.code });
  };

  onBarcodeChange = (e) => {
    let barcode = e.target.value.toUpperCase();

    if (barcode) {
      this.setState({ barcode });
    } else {
      this.setState({
        productSelectValue: { value: "", label: "Все" },
        barcode: "",
      });
    }
  };

  onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) this.getProductByBarcode(this.state.barcode);
  };

  createItem(prod) {
    return {
      label: prod.label,
      value: prod.value,
      id: this.maxId++,
    };
  }

  handleAddProduct = (prod) => {
    if (!!prod === false) {
      Alert.warning("Выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    const newItem = this.createItem(prod);
    this.setState(({ discountItems }) => {
      const newArray = [...discountItems, newItem];

      return {
        discountItems: newArray,
      };
    });
  };

  handleDeleteProduct = (id) => {
    this.setState(({ discountItems }) => {
      const idx = discountItems.findIndex((el) => el.id === id);

      const newArray = [
        ...discountItems.slice(0, idx),
        ...discountItems.slice(idx + 1),
      ];
      return {
        discountItems: newArray,
      };
    });
  };

  handleDelete = (id) => {
    let discountFlag = [];
    let prod = [];

    prod.push(parseInt(id, 0));

    discountFlag = { discount: true, prod: prod };
    Axios.post("/api/discount/changeflag", { discountFlag })
      .then(() => {
        this.setState({ isLoading: false });
        Alert.success("Статус товаров успешно изменен.", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.getProductsWithoutDiscount();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeDiscountFlag = () => {
    const { discountItems } = this.state;

    if (discountItems.length === 0) {
      Alert.warning("Выберите товары", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    let discountFlag = [];
    let prod = [];

    discountItems.forEach((item) => {
      prod.push(parseInt(item.value, 0));
    });
    discountFlag = { discount: false, prod: prod };
    Axios.post("/api/discount/changeflag", { discountFlag })
      .then(() => {
        this.setState({ isLoading: false, discountItems: [] });
        Alert.success("Статус товаров успешно изменен.", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.getProductsWithoutDiscount();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    const {
      barcode,
      productSelectValue,
      products,
      discountItems,
      productsWithoutDiscount,
    } = this.state;

    return (
      <div className="general-info">
        <p style={{ opacity: "50%" }}>
          Здесь вы можете выбрать товары, на которые скидки не будут
          применяться.
        </p>
        <div className="row">
          <div className="row col-md-9">
            <div className="col-md-5">
              <label>Штрихкод</label>
              <input
                name="barcode"
                value={barcode}
                placeholder="Введите или отсканируйте штрих код"
                onChange={this.onBarcodeChange}
                onKeyDown={this.onBarcodeKeyDown}
                type="text"
                className="form-control"
              />
              <p className="barcode">Нажмите "Enter" для поиска</p>
            </div>
            <div className="col-md-7">
              <label>Наименование Товара</label>
              <Select
                name="product"
                value={productSelectValue}
                onChange={this.onProductChange}
                options={products}
                placeholder="Выберите товар"
                onInputChange={this.onProductListInput.bind(this)}
                noOptionsMessage={() => "Товар не найден"}
              />
            </div>
          </div>
          <div className="col-md-3 add-button">
            <button
              className="btn btn-outline-secondary"
              onClick={() => this.handleAddProduct(productSelectValue)}
            >
              добавить
            </button>
          </div>
        </div>
        <div className="discount-items">
          <DiscountItems
            discountItems={discountItems}
            handleDeleteProduct={this.handleDeleteProduct}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-info btn-sm change-button"
          onClick={() => {
            this.changeDiscountFlag();
          }}
        >
          Добавить в исключения
        </button>

        <table style={{ marginTop: "10px" }} className="table table-hover">
          <thead>
            <tr className="table-discounts">
              <th style={{ width: "75%" }}>Наименования товаров без скидок</th>
              <th style={{ width: "10%" }}>Штрихкод</th>
              <th style={{ width: "15%" }} />
            </tr>
          </thead>
          <tbody>
            {productsWithoutDiscount.map((disc, idx) => (
              <tr key={idx}>
                <td>{disc.name}</td>
                <td>{disc.code}</td>
                <td>
                  <button
                    className="btn btn-outline-danger cancel-disc"
                    onClick={() => this.handleDelete(disc.id)}
                  >
                    убрать из исключения
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
