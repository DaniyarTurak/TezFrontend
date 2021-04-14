import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Searching from "../../../Searching";
import { RequiredField, LessThanZero, NotEqualZero } from "../../../../validation";
import _ from "lodash";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import AddMarginalPrice from "./AddMarginalPrice";

export default function MarginalPricePage() {

  const [products, setProducts] = useState();
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [showMarginalPriceInput, setShowMarginalPriceInput] = useState(false);
  const [isToggleAdd, setToggleAdd] = useState(true);
  const [isToggleList, setToggleList] = useState(true);
  const [barcode, setBarcode] = useState("");
  const [productNotFound, setProductNotFound] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [isDataSending, setDataSending] = useState(false);
  const [isManagingPrice, setManagingPrice] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [firstPage, setFirstPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [productsWithMargPrice, setProductsWithMargPrice] = useState([]);
  const [productsWithMargPriceOriginal, setProductsWithMargPriceOriginal] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState();
  const [productsSearch, setProductsSearch] = useState();
  const [searchProductSelectValue, setSearchProductSelectValue] = useState();


  useEffect(() => {
    getProducts();
    getProductsWithMarginalPrice();
  }, []);

  const getProductsWithMarginalPrice = (barcode, p_activePage) => {
    setLoading(true);
    const _activePage = p_activePage ? p_activePage : activePage;

    Axios.get("/api/products/staticprice/list", {
      params: { barcode, activePage: _activePage, itemsPerPage },
    })
      .then((res) => res.data)
      .then((data) => {
        data.products.forEach((product) => {
          product.ischangedprice = false;
        });
        setProductsWithMargPrice(data.products);
        setProductsWithMargPriceOriginal(_.cloneDeep(data.products));
        setLoading(false);
        if (data.products.length <= 0) {
          setProductNotFound(true);
        };
        setActivePage(_activePage);
        setFirstPage(itemsPerPage - itemsPerPage);
        setLastPage(itemsPerPage - 1);
      })
      .catch((err) => {
        setLoading(false);
        setProductNotFound(true);
        console.log(err);
      });
  };

  const getStaticPriceProducts = (productName) => {
    Axios.get("/api/products/staticprice/search", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        console.log("getStaticPriceProducts", list);
        setProductsSearch(list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByBarcode = (barcode) => {
    Axios.get("/api/products/barcode", { params: { barcode } })
      .then((res) => res.data)
      .then((product) => {
        if (product) {
          console.log("getProductByBarcode", product)
          setProductSelectValue(product);
        }
        if (product) {
          setShowMarginalPriceInput(true);
          setProductNotFound(false);
          setPrice(product.staticprice);
        }
        else {
          setShowMarginalPriceInput(false);
          setProductNotFound(true);
          setPrice("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (productName) => {
    setLoading(true);
    Axios.get("/api/products/withprice", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        console.log("products", list)
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onProductChange = (productSelectValue) => {
    if (!productSelectValue.code) {
      setProductSelectValue(null);
      setBarcode("");
      setShowMarginalPriceInput(false);
      setPrice("");
    }
    setProductSelectValue(productSelectValue);
    setPrice();
    setProductNotFound(false);
    setBarcode(productSelectValue.code);
    setShowMarginalPriceInput(true);
  };

  const onProductSearchChange = (searchProductSelectValue) => {
    getProductsWithMarginalPrice(searchProductSelectValue.code, 1);
  };

  const onBarcodeChange = (e) => {
    setBarcode(e.target.value.toUpperCase());
    setShowMarginalPriceInput(false);
    setProductSelectValue(null);
    setPrice("");
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) { getProductByBarcode(barcode) };
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) { getProducts(productName) };
  };

  const onProductSearchInput = (productName) => {
    if (productName.length > 0) { getStaticPriceProducts(productName) };
  };

  const handleAddMarginalPrice = (price, id, code) => {
    if (!price) {
      Alert.error("Введите предельную цену товара", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    if (!code) {
      Alert.error("Выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    sendInfo(price, id, code, null);
  };

  const sendInfo = (price, id, code, indx) => {
    setDataSending(true);
    setManagingPrice(true);
    Axios.post("/api/invoice/changeprice", {
      isstaticprice: true,
      product: id,
      price,
    })
      .then((result) => result.data)
      .then((result) => {
        Alert.success("Предельная цена установлена успешно", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        console.log(indx);
        let a = productsWithMargPrice;
        if (indx === 0 || indx) {
          a[indx].ischangedprice = false;
          setProductsWithMargPrice(a);
        } else {
          getProductsWithMarginalPrice();
        }
        setDataSending(false);
        setManagingPrice(false);
        setBarcode("");
        setProductSelectValue(null);
        setShowMarginalPriceInput(false);
        setPrice("");
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
          Alert.error("Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        setDataSending(false);
        setManagingPrice(false);
      });
  };

  const onPriceChange = (e) => {
    setPrice(e.target.value);
  };

  const onListPriceChange = (index, e) => {
    let a = productsWithMargPrice;
    a[index].staticprice = e.target.value;
    a[index].ischangedprice = true;
    setProductsWithMargPrice(a);
  };

  const handleEdit = (product, indx) => {
    let a = productsWithMargPrice;
    if (!a[indx].ischangedprice) {
      a[indx].ischangedprice = true;
      setProductsWithMargPrice(a);
    }
  };


  const sendMassInfo = () => {
    setDataSending(true);
    setManagingPrice(true);
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
        getProductsWithMarginalPrice();
        setDataSending(false);
        setManagingPrice(false);
        setBarcode("");
        setProductSelectValue(null);
        setSearchProductSelectValue(null);
        setShowMarginalPriceInput(false);
        setPrice("");
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert(err);
        setDataSending(false);
        setManagingPrice(false);
      });
  };

  const handleDelete = (product) => {
    setManagingPrice(true);
    Axios.post("/api/products/staticprice/deleteprod", {
      product: product.id,
    })
      .then((result) => result.data)
      .then((result) => {
        console.log(result);
        Alert.success("Предельная цена на товар удалена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setManagingPrice(false);
        getProductsWithMarginalPrice();
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
          Alert.error("Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        setManagingPrice(false);
      });
  };

  const handleSearch = () => {
    getProductsWithMarginalPrice(barcode);
  };

  const onSearchChange = (e) => {
    setSearchKey(e.target.value);
    setProductsWithMargPrice(_.cloneDeep(productsWithMargPriceOriginal))
  };

  let filteredProducts =
    productsWithMargPrice.length > 0 &&
    productsWithMargPrice.filter((product) => {
      let productName = product.name.toLowerCase().trim().replace(/ /g, "");
      let searchKey2 = searchKey
        .toLowerCase()
        .trim()
        .replace(/ /g, "");
      return productName.indexOf(searchKey2) !== -1;
    });
  let isEditable = false;
  productsWithMargPrice.length > 0 &&
    productsWithMargPrice.forEach((product) => {
      if (product.ischangedprice) {
        isEditable = true;
      };
    });



  return (
    <div className="marginal-price">
      <AddMarginalPrice />
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
            onChange={onProductSearchChange}
            options={productsSearch}
            placeholder="Выберите товар"
            onInputChange={onProductSearchInput.bind(this)}
            noOptionsMessage={() => "Товар не найден"}
          />
        </div>
        <div className="col-md-3">
          <br />
          <button
            className="btn btn-success ml-10"
            style={{ marginTop: ".5rem" }}
            title={"Cохранить изменения"}
            disabled={!isEditable || isManagingPrice}
            onClick={() => {
              sendMassInfo();
            }}
          >
            Cохранить изменения
                  </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {isToggleList && (
        <Fragment>
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
                          className={`${firstPage <= idx &&
                            idx <= lastPage
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
                                onChange={onListPriceChange.bind(
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
                                handleEdit(product, idx);
                              }}
                            />
                            <button
                              className="btn btn-w-icon delete-item"
                              title="Удалить"
                              disabled={isManagingPrice}
                              onClick={() => {
                                handleDelete(product);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

};