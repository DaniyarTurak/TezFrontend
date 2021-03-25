import React, { Component, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import { reduxForm } from "redux-form";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import Pagination from "react-js-pagination";
import { RequiredField, LessThanZero, NotEqualZero } from "../../../validation";
import _ from "lodash";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

class MarginalPrice extends Component {
  state = {
    price: "",
    isLoading: true,
    showMarginalPriceInput: false,
    isToggleAdd: true,
    isToggleList: true, //false,
    barcode: "",
    productNotFound: false,
    searchKey: "",
    isDataSending: false,
    productsNotFound: false,
    isManagingPrice: false,
    activePage: 1,
    itemsPerPage: 10,
    pageRangeDisplayed: 5,
    currentRange: { first: 0, last: 0 },
    productsWithMargPrice: [],
    productsWithMargPriceOriginal: [],
    label: {
      list: "Добавление предельной цены",
      enterPrice: "Введите предельную цену товара",
    },
    alert: {
      raiseEditError: "Введите предельную цену товара",
      raiseErrorNoCode: "Выберите товар",
      success: "Предельная цена установлена успешно",
      successDel: "Предельная цена на товар удалена",
      serviceError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
    },
  };

  componentDidMount() {
    this.getProducts();
    this.getProductsWithMarginalPrice();
    this.getStaticPriceProducts();
    this.setState({
      currentRange: {
        first:
          this.state.activePage * this.state.itemsPerPage -
          this.state.itemsPerPage,
        last: this.state.activePage * this.state.itemsPerPage - 1,
      },
    });
  }

  getProductsWithMarginalPrice = (barcode, p_activePage) => {
    this.setState({ isLoading: true });
    const { activePage, itemsPerPage } = this.state;
    const _activePage = p_activePage ? p_activePage : activePage;

    Axios.get("/api/products/staticprice/list", {
      params: { barcode, activePage: _activePage, itemsPerPage },
    })
      .then((res) => res.data)
      .then((data) => {
        data.products.forEach((product) => {
          product.ischangedprice = false;
        });

        this.setState({
          productsWithMargPrice: data.products,
          itemsCount: data.itemsCount,
          productsWithMargPriceOriginal: _.cloneDeep(data.products),
          isLoading: false,
          productsNotFound: data.products.length > 0 ? false : true,
          activePage: _activePage,
          currentRange: {
            first: this.state.itemsPerPage - this.state.itemsPerPage,
            last: this.state.itemsPerPage - 1,
          },
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false, productsNotFound: true });
        console.log(err);
      });
  };

  getStaticPriceProducts = (productName) => {
    Axios.get("/api/products/staticprice/search", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        const productsSearch = list.map((product) => {
          return {
            label: product.name,
            name: product.name,
            value: product.id,
            code: product.code,
            staticprice: product.staticprice,
          };
        });
        this.setState({ productsSearch });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProductByBarcode = (barcode) => {
    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        const productSelectValue = product
          ? {
              value: product.id,
              label: product.name,
              code: product.code,
              price: product.staticprice,
            }
          : null;
        if (product)
          this.setState({
            productSelectValue,
            showMarginalPriceInput: true,
            productNotFound: false,
            price: product.staticprice ? product.staticprice : "",
          });
        else
          this.setState({
            productSelectValue,
            showMarginalPriceInput: false,
            productNotFound: true,
            price: "",
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProducts = (productName) => {
    Axios.get("/api/products/withprice", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        const products = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
            price: product.staticprice,
          };
        });

        this.setState({ products, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onProductChange = (productSelectValue) => {
    if (!productSelectValue.code) {
      this.setState({
        productSelectValue: null,
        barcode: "",
        showMarginalPriceInput: false,
        price: "",
      });
      return;
    }
    this.setState({
      productSelectValue,
      price: productSelectValue.price ? productSelectValue.price : "",
      productNotFound: false,
      barcode: productSelectValue.code,
      showMarginalPriceInput: true,
    });
  };

  onProductSearchChange = (searchProductSelectValue) => {
    this.getProductsWithMarginalPrice(searchProductSelectValue.code, 1);

    // if (!searchProductSelectValue.code) {
    //   this.setState({ searchProductSelectValue: null,productsWithMargPrice:_.cloneDeep(this.state.productsWithMargPriceOriginal)});
    //   return;
    // }
    // this.setState({
    // 	searchProductSelectValue,productsWithMargPrice:[searchProductSelectValue]
    // });
  };

  onProductListChange = (productSelectValue) => {
    if (!productSelectValue.code) {
      this.setState({ productSelectValue: null, barcode: "" });
      return;
    }
    this.setState({
      productSelectValue,
      barcode: productSelectValue.code,
    });
  };

  onBarcodeChange = (e) => {
    let barcode = e.target.value.toUpperCase();
    this.setState({
      barcode,
      showMarginalPriceInput: false,
      productSelectValue: null,
      price: "",
    });
  };

  onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) this.getProductByBarcode(this.state.barcode);
  };

  onBarcodeListKeyDown = (e) => {
    if (e.keyCode === 13) this.handleSearch();
  };

  onProductListInput = (productName) => {
    if (productName.length > 0) this.getProducts(productName);
  };

  onProductSearchInput = (productName) => {
    if (productName.length > 0) this.getStaticPriceProducts(productName);
  };

  toggleList = () => {
    this.setState({
      barcode: "",
      productSelectValue: null,
      isLoading: false,
      isToggleAdd: false,
      isToggleList: true,
      showMarginalPriceInput: false,
      price: "",
    });
    this.getProductsWithMarginalPrice();
  };

  toggleAdd = () => {
    this.setState({
      barcode: "",
      productSelectValue: null,
      isLoading: false,
      isToggleAdd: true,
      isToggleList: false,
      showMarginalPriceInput: false,
      price: "",
    });
  };

  handleAddMarginalPrice = (price, id, code) => {
    const { alert } = this.state;
    if (!price) {
      Alert.error(alert.raiseEditError, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    if (!code) {
      Alert.error(alert.raiseErrorNoCode, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    this.sendInfo(price, id, code, null);
  };

  sendInfo = (price, id, code, indx) => {
    this.setState({ isDataSending: true, isManagingPrice: true });
    Axios.post("/api/invoice/changeprice", {
      isstaticprice: true,
      product: id,
      price,
    })
      .then((result) => result.data)
      .then((result) => {
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        console.log(indx);
        if (indx === 0 || indx) {
          const { productsWithMargPrice } = this.state;
          productsWithMargPrice[indx].ischangedprice = false;
          this.setState({ productsWithMargPrice });
        } else {
          this.getProductsWithMarginalPrice();
        }
        this.setState({
          isDataSending: false,
          isManagingPrice: false,
          barcode: "",
          productSelectValue: null,
          showMarginalPriceInput: false,
          price: "",
        });
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response &&
          err.response.data &&
          err.response.data.code === "error"
        )
          Alert.error(err.response.data.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        else
          Alert.error(this.state.alert.serviceError, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        this.setState({ isDataSending: false, isManagingPrice: false });
      });
  };

  onPriceChange = (e) => {
    this.setState({ price: e.target.value });
  };

  onListPriceChange = (index, e) => {
    const { productsWithMargPrice } = this.state;
    productsWithMargPrice[index].staticprice = e.target.value;
    productsWithMargPrice[index].ischangedprice = true;
    this.setState({ productsWithMargPrice });
  };

  handleEdit = (product, indx) => {
    const { productsWithMargPrice } = this.state;
    if (!productsWithMargPrice[indx].ischangedprice) {
      productsWithMargPrice[indx].ischangedprice = true;
      this.setState(productsWithMargPrice);
    }
    //   else
    // 	this.sendInfo(product.staticprice,product.id,product.code,indx)
  };

  sendMassInfo = () => {
    this.setState({ isDataSending: true, isManagingPrice: true });
    const { productsWithMargPrice } = this.state;
    const changes = [];
    productsWithMargPrice.forEach((product) => {
      if (product.ischangedprice)
        changes.push({ product: product.id, price: product.staticprice });
    });
    Axios.post("/api/invoice/changestaticprice", {
      changes,
    })
      .then((result) => result.data)
      .then((result) => {
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.getProductsWithMarginalPrice();
        this.setState({
          isDataSending: false,
          isManagingPrice: false,
          barcode: "",
          productSelectValue: null,
          searchProductSelectValue: null,
          showMarginalPriceInput: false,
          price: "",
        });
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert(err);
        this.setState({ isDataSending: false, isManagingPrice: false });
      });
  };

  handleDelete = (product) => {
    this.setState({ isManagingPrice: true });
    Axios.post("/api/products/staticprice/deleteprod", {
      product: product.id,
    })
      .then((result) => result.data)
      .then((result) => {
        console.log(result);
        Alert.success(this.state.alert.successDel, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.setState({ isManagingPrice: false });
        this.getProductsWithMarginalPrice();
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response &&
          err.response.data &&
          err.response.data.code === "error"
        )
          Alert.error(err.response.data.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        else
          Alert.error(this.state.alert.serviceError, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        this.setState({ isManagingPrice: false });
      });
  };

  handleSearch = () => {
    this.getProductsWithMarginalPrice(this.state.barcode);
  };

  handlePageChange(pageNumber) {
    // this.setState({
    //   activePage: pageNumber,
    //   currentRange: {
    // 	first: pageNumber * this.state.itemsPerPage - this.state.itemsPerPage,
    // 	last: pageNumber * this.state.itemsPerPage - 1
    //   },
    //   productsWithMargPrice:_.cloneDeep(this.state.productsWithMargPriceOriginal)
    // });
    this.getProductsWithMarginalPrice(null, pageNumber);
  }

  onSearchChange = (e) => {
    this.setState({
      searchKey: e.target.value,
      productsWithMargPrice: _.cloneDeep(
        this.state.productsWithMargPriceOriginal
      ),
    });
  };

  render() {
    const {
      isLoading,
      label,
      productSelectValue,
      searchProductSelectValue,
      products,
      barcode,
      //showMarginalPriceInput,
      isToggleList,
      price,
      isToggleAdd,
      activePage,
      itemsPerPage,
      pageRangeDisplayed,
      currentRange,
      productNotFound,
      isDataSending,
      isManagingPrice,
      productsSearch,
      itemsCount,
      //searchKey,
      //productsNotFound,
      productsWithMargPrice,
    } = this.state;
    let filteredProducts =
      productsWithMargPrice.length > 0 &&
      this.state.productsWithMargPrice.filter((product) => {
        let productName = product.name.toLowerCase().trim().replace(/ /g, "");
        let searchKey = this.state.searchKey
          .toLowerCase()
          .trim()
          .replace(/ /g, "");
        return productName.indexOf(searchKey) !== -1;
      });
    let isEditable = false;
    productsWithMargPrice.length > 0 &&
      productsWithMargPrice.forEach((product) => {
        if (product.ischangedprice) {
          isEditable = true;
          return;
        }
      });
    return (
      <div className="marginal-price">
        <div className="row">
          <div className="col-md-12">
            <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
              {label.list}
            </h6>
          </div>
        </div>

        {/* <div className="row">
          <div className="col-md-3 month-btn">
            <button
              className={`btn btn-sm btn-block btn-report ${
                isToggleAdd ? "btn-info" : "btn-outline-info"
              }`}
              onClick={() => this.toggleAdd()}
            >
              Добавление товара
            </button>
          </div>
          <div className="col-md-3 month-btn">
            <button
              className={`btn btn-sm btn-block btn-report ${
                isToggleList ? "btn-info" : "btn-outline-info"
              }`}
              onClick={() => this.toggleList()}
            >
              Список товаров с предельной ценой
            </button>
          </div>
        </div> */}

        {isToggleAdd && (
          <div className="row pt-10">
            <div className="col-md-3">
              <label style={{ minWidth: "150px" }}>Внесите штрих код: </label>
              <input
                name="barcode"
                value={barcode}
                placeholder="Штрих код"
                onChange={this.onBarcodeChange}
                onKeyDown={this.onBarcodeKeyDown}
                type="text"
                autoComplete="off"
                className="form-control"
              />
            </div>
            <div className="col-md-9">
              <label>Выберите товар из списка: </label>
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
        )}

        {productNotFound && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text loading-dots">
              Товар не найден
            </div>
          </div>
        )}

        {/* {!isLoading && showMarginalPriceInput && ( */}
        <div className="mt-20 mb-20">
          <div className="row">
            <div className="col-md-4">{label.enterPrice}</div>
          </div>
          <div className="row">
            <div className="col-md-4 percentage-block">
              <input
                name="price"
                type="number"
                value={price}
                className="form-control"
                onChange={this.onPriceChange}
                autoComplete="off"
                onWheel={(event) => event.currentTarget.blur()}
                validate={[RequiredField, LessThanZero, NotEqualZero]}
              />
            </div>
            {/* </div>
			<div className="row"> mt-10*/}
            <div className="col-md-4 percentage-block">
              <button
                className="btn btn-outline-primary"
                disabled={isDataSending}
                onClick={() =>
                  this.handleAddMarginalPrice(
                    price,
                    productSelectValue.value,
                    productSelectValue.code
                  )
                }
              >
                Добавить товар в справочник
              </button>
            </div>
          </div>
        </div>
        {/* )} */}

        <div className="empty-space"></div>

        <div className="row mt-10">
          <div className="col-md-12">
            <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
              Перечень товаров с предельной ценой
            </h6>
          </div>
        </div>

        <div className="row mt-10">
          <div className="col-md-9">
            <label>Быстрый поиск по перечню: </label>
            <Select
              name="product"
              value={searchProductSelectValue}
              onChange={this.onProductSearchChange}
              options={productsSearch}
              placeholder="Выберите товар"
              onInputChange={this.onProductSearchInput.bind(this)}
              noOptionsMessage={() => "Товар не найден"}
            />
          </div>

          {/* <div className="col-md-6">
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text">
								<span className="ico-mglass"></span>
							</span>
						</div>
						<input
							name="search"
							value={searchKey}
							type="text"
							autoComplete="off"
							placeholder="Поиск по наименованию товара"
							className="form-control"
							onChange={this.onSearchChange}
						/>
					</div>
				</div> */}
          <div className="col-md-3">
            <br />
            <button
              className="btn btn-success ml-10"
              style={{ marginTop: ".5rem" }}
              title={"Cохранить изменения"}
              disabled={!isEditable || isManagingPrice}
              onClick={() => {
                this.sendMassInfo();
              }}
            >
              Cохранить изменения
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {isToggleList && (
          <Fragment>
            {/* <div className="row pt-10 mt-20">
            <div className="col-md-3">
              <label style={{ minWidth: "150px" }}>Внесите штрих код: </label>
              <input
                name="barcode"
                value={barcode}
                placeholder="Штрих код"
                onChange={this.onBarcodeChange}
                onKeyDown={this.onBarcodeListKeyDown}
                type="text"
                className="form-control"
              />
            </div>
            <div className="col-md-7">
              <label>Выберите товар из списка: </label>
              <Select
                name="product"
                value={productSelectValue}
                onChange={this.onProductListChange}
                options={products}
                placeholder="Выберите товар"
                onInputChange={this.onProductListInput.bind(this)}
                noOptionsMessage={() => "Товар не найден"}
              />
            </div>
			<div className="col-md-2 text-right search-btn">
				<button
				className="btn btn-success mt-30"
				onClick={() => this.handleSearch()}
				>
				Поиск
				</button>
          	</div>
          </div> */}
            {productsWithMargPrice.length > 0 && !isLoading && (
              <Fragment>
                <div className="row pt-10 mt-10">
                  <div className="col-md-12">
                    <table className="table table-hover" id="table-to-xls">
                      <thead>
                        <tr>
                          <th style={{ width: "4%" }}></th>
                          <th style={{ width: "30%" }}>Наименование товара</th>
                          <th style={{ width: "15%" }}>Штрих код</th>
                          <th style={{ width: "15%" }}>Предельная цена</th>
                          <th style={{ width: "7%" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product, idx) => (
                          <tr
                            className={`${
                              currentRange.first <= idx &&
                              idx <= currentRange.last
                                ? ""
                                : "d-none"
                            }`}
                            key={idx}
                          >
                            <td>{idx + 1 + itemsPerPage * (activePage - 1)}</td>
                            <td>{product.name}</td>
                            <td>{product.code}</td>
                            <td>
                              {!product.ischangedprice ? (
                                product.staticprice
                              ) : (
                                <input
                                  name="listPrice"
                                  type="number"
                                  value={product.staticprice}
                                  className="form-control"
                                  onChange={this.onListPriceChange.bind(
                                    this,
                                    idx
                                  )}
                                  autoComplete="off"
                                  onWheel={(event) =>
                                    event.currentTarget.blur()
                                  }
                                  validate={[
                                    RequiredField,
                                    LessThanZero,
                                    NotEqualZero,
                                  ]}
                                />
                              )}
                            </td>
                            <td>
                              <button
                                className="btn  btn-w-icon edit-item"
                                title="Изменить цену"
                                disabled={isManagingPrice}
                                onClick={() => {
                                  this.handleEdit(product, idx);
                                }}
                              />
                              <button
                                className="btn btn-w-icon delete-item"
                                title="Удалить"
                                disabled={isManagingPrice}
                                onClick={() => {
                                  this.handleDelete(product);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {itemsCount > itemsPerPage && (
                    <div className="col-md-12 text-right">
                      <Pagination
                        hideDisabled
                        //   hideNavigation={
                        //     filteredProducts.length / itemsPerPage < pageRangeDisplayed
                        //   }
                        //   hideFirstLastPages={
                        //     filteredProducts.length / itemsPerPage < pageRangeDisplayed
                        //   }
                        hideNavigation={itemsCount < pageRangeDisplayed}
                        hideFirstLastPages={
                          itemsCount < pageRangeDisplayed * itemsPerPage
                        }
                        activePage={activePage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={itemsCount}
                        pageRangeDisplayed={pageRangeDisplayed}
                        innerClass="pagination justify-content-center"
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={this.handlePageChange.bind(this)}
                      />
                    </div>
                  )}
                </div>
              </Fragment>
            )}
          </Fragment>
        )}

        {productsWithMargPrice.length === 0 && !isLoading && isToggleList && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text loading-dots">
              Товары не найден
            </div>
          </div>
        )}
      </div>
    );
  }
}

MarginalPrice = reduxForm({
  form: "marginalprice",
})(MarginalPrice);

export default MarginalPrice;
