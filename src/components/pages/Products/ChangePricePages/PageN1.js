import React, { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Checkbox from "../../../fields/Checkbox";
import ReactModal from "react-modal";
import Searching from "../../../Searching";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

ReactModal.setAppElement("#root");

export default function PageN1({ productListProps, isWholesale, setWholeSale }) {
  const [isLoading, setisLoading] = useState(true);
  const [isSearching, setisSearching] = useState(false);
  const [isSelledByPieces, setisSelledByPieces] = useState(false);
  const [newPrice, setnewPrice] = useState("");
  const [newWSPrice, setnewWSPrice] = useState("");
  const [newPiecePrice, setnewPiecePrice] = useState("");
  const [options, setoptions] = useState([]);
  const [productList, setproductList] = useState(
    JSON.parse(sessionStorage.getItem("changePriceProductList")) || []
  );
  const [productBarcode, setproductBarcode] = useState("");
  const [productsList, setproductsList] = useState([]);
  const [selectValue, setselectValue] = useState("");
  const [staticprice, setstaticprice] = useState("");

  useEffect(() => {
    setWholeSale( JSON.parse(sessionStorage.getItem("isme-company-data")) && JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale ? JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale : false);
    getProducts();
  }, []);

  const getProducts = (inputValue) => {
    Axios.get("/api/products/stockcurrent/point", {
      params: { productName: inputValue },
    })
      .then((res) => res.data)
      .then((list) => {
        let changedoptions = [];

        list.map((product) =>
          changedoptions.push({
            label:
              product.name +
              (product.attributescaption ? ", " : "") +
              product.attributescaption,
            value: {
              product: product.id,
              attributes: product.attributes,
            },
            code: product.code,
          })
        );

        setisLoading(false);
        setoptions([...changedoptions]);
      })
      .catch((err) => {
        ErrorAlert(err);
        console.log(err);
      });
  };

  const onBarcodeChange = (e) => {
    const newproductBarcode = e.target.value.toUpperCase();
    setproductBarcode(newproductBarcode);
    setselectValue("");
  };
  const onProductListChange = (inputValue) => {
    if (inputValue.length > 0) getProducts(inputValue);
  };

  const productListChange = (value) => {
    const newBarcodeVal = value.code ? value.code : "";
    setselectValue(value);
    setproductBarcode(newBarcodeVal);
  };

  function onSumChange(e) {
    const changedstaticprice = staticprice;
    const changedAmount = isNaN(e.target.value) ? 0 : e.target.value;
    if (changedstaticprice) {
      if (changedAmount > changedstaticprice) {
        Alert.warning(
          `Внимание! Новая цена не может превышать предельную цену: ${staticprice}`,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      }
    }
    setnewPrice(changedAmount);
  }

  function onWSSumChange(e) {
    const changedAmount = isNaN(e.target.value) ? 0 : e.target.value;
    setnewWSPrice(changedAmount);
  }

  function onPieceSumChange(e) {
    const changedAmount = isNaN(e.target.value) ? 0 : e.target.value;
    setnewPiecePrice(changedAmount);
  }

  const selectAllPoints = (ind, e) => {
    const isChecked = e.target.checked;
    let newproductsList = productsList;

    newproductsList[ind].checked = isChecked;

    newproductsList[ind].info.forEach((product) => {
      product.checked = isChecked;
    });
    setproductsList([...newproductsList]);
  };

  const handleCheckboxChange = (ind, index, e) => {
    const isChecked = e.target.checked;
    let newproductsList = productsList;
    newproductsList[ind].info[index].checked = isChecked;

    setproductsList([...newproductsList]);
  };

  const searchProducts = () => {
    let barcode = productBarcode;
    if (!barcode) {
      return Alert.info("Введите штрих код", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setisSearching(true);

    Axios.get("/api/stockcurrent/pointprod", {
      params: {
        barcode,
      },
    })
      .then((res) => res.data)
      .then((result) => {
        let newisstaticprice;
        result.forEach((e) => {
          let newisSelledByPieces = e.info[0].piece ? true : false;
          newisstaticprice = e.isstaticprice;
          setisSelledByPieces(newisSelledByPieces);
        });
        if (newisstaticprice) {
          result.forEach((e) => {
            let newstaticprice;
            newstaticprice = e.staticprice;
            setstaticprice(newstaticprice);
          });
        } else {
          setstaticprice("");
        }
        if (result.length > 1) {
          const newproductSelectValue = {
            label: result[0].info[0].name,
            value: result[0].info[0].stockcurrentid,
          };
          setselectValue(newproductSelectValue);
        }
        setisSearching(false);
        setproductsList(result);
      })
      .catch((err) => {
        ErrorAlert(err);
        console.log(err);
      });
  };

  const addProduct = () => {
    if (!productBarcode || !newPrice || (!newPiecePrice && isSelledByPieces)) {
      return Alert.info(
        !productBarcode
          ? "Выберите товар"
          : !newPrice
            ? "Внесите новую цену продажи"
            : !newPiecePrice && isSelledByPieces
              ? "Внесите новую цену продажи за штуку"
              : "",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }

    const changedstaticprice = staticprice;
    if (changedstaticprice) {
      if (newPrice > changedstaticprice) {
        return Alert.warning(
          `Внимание! Новая цена не может превышать предельную цену: ${changedstaticprice}`,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      }
    }
    let changedproductList =
      JSON.parse(sessionStorage.getItem("changePriceProductList")) || [];
    let existedValue = false;

    productsList.forEach((point) => {
      point.info.forEach((product) => {
        if (product.checked) {
          const selectedPointsList = [
            {
              id: point.id,
              stockcurrentid: product.stockcurrentid,
              name: point.name,
            },
          ];
          const prodName =
            product.name +
            `${product.attributescaption ? " " + product.attributescaption : ""
            }`;
          const newProduct = {
            id: product.productID,
            code: product.code,
            name: prodName,
            piece: isSelledByPieces,
            pieceprice: newPiecePrice,
            price: newPrice,
            oldPrice: product.price,
            wholesale_price: newWSPrice === "" ? 0 : newWSPrice,
            oldWholesale_price: product.wholesale_price,
            selectedPoints: selectedPointsList,
            isWholesale: isWholesale
          };

          let alreadyExist = productList.filter(
            (product) =>
              product.id === newProduct.id &&
              product.name === newProduct.name &&
              product.selectedPoints[0].id === newProduct.selectedPoints[0].id
          );

          if (alreadyExist.length === 0) {
            changedproductList.push(newProduct);
          } else {
            existedValue = true;
          }
        }
      });
    });
    if (existedValue) {
      Alert.warning(
        "Некоторые товары не были добавлены, так как они уже были в списке, удалите запись из таблицы, и внесите товар заново",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    } else {
      setnewPrice("");
      setnewWSPrice("");
      setproductsList([]);
      setproductBarcode("");
    }

    setproductList(changedproductList);

    productListProps(changedproductList);
    sessionStorage.setItem(
      "changePriceProductList",
      JSON.stringify(changedproductList)
    );
  };

  const removeProduct = (item) => {
    let newProductList = productList.filter((productList) => {
      return productList !== item;
    });
    setproductList(newProductList);
    productListProps(newProductList);
    sessionStorage.setItem(
      "changePriceProductList",
      JSON.stringify(newProductList)
    );
  };

  return (
    <div className="product-change-price-page-n1">
      <div className="row mt-10">
        <div className="col-md-12">
          <label htmlFor="">Выберите товары на складе</label>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            name="barcode"
            value={productBarcode}
            className="form-control"
            placeholder="Введите или отсканируйте штрих код"
            onChange={onBarcodeChange}
          />
        </div>
        <div className="col-md-5 zi-3">
          <Select
            name="productList"
            value={selectValue}
            noOptionsMessage={() => "Товар не найден"}
            onChange={productListChange}
            placeholder="Выберите товар из списка"
            onInputChange={onProductListChange}
            options={options || []}
          />
        </div>
      </div>

      <div className="row mt-10 pb-10" style={{ paddingLeft: "5px" }}>
        <button
          name="Search"
          className="btn btn-success ml-10"
          onClick={searchProducts}
          disabled={isSearching}
        >
          Поиск
        </button>
      </div>

      {isLoading && <Searching />}

      {!isLoading && productsList.length > 0 && (
        <Fragment>
          <div className="row">
            <div className="col-md-12 pt-30">
              <label>
                Выберите товар(-ы), где необходимо установить новые цены
              </label>
              {productsList.map((point, ind) => {
                return (
                  <Fragment key={point.id}>
                    <div className="mt-10">
                      {point.name} ({point.address})
                    </div>
                    <table className="table table-hover ml-10">
                      <thead>
                        <tr>
                          <th style={{ width: "50%" }}>Наименование товара</th>
                          <th
                            style={{
                              width: isSelledByPieces ? "10%" : "20%",
                            }}
                          >
                            Текущая розничная цена
                          </th>
                          <th
                            style={{
                              width: isSelledByPieces ? "10%" : "20%",
                            }}
                          >
                            Текущая оптовая цена
                          </th>
                          {isSelledByPieces && (
                            <th style={{ width: "20%" }}>Цена за штуку</th>
                          )}
                          <th className="text-right">
                            <input
                              type="checkbox"
                              title={"Выбрать все"}
                              checked={point.checked ? point.checked : false}
                              onChange={(e) => selectAllPoints(ind, e)}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {point.info.map((product, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {product.name +
                                  `${product.attributescaption
                                    ? " " + product.attributescaption
                                    : ""
                                  }`}
                              </td>
                              <td>{product.price}</td>
                              <td>{product.wholesale_price === 0 ? "-" : product.wholesale_price}</td>
                              {isSelledByPieces && (
                                <td>{product.pieceprice}</td>
                              )}
                              <td className="text-right">
                                <Checkbox
                                  name={product.name + ind}
                                  checked={
                                    product.checked ? product.checked : false
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(ind, index, e)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div className={`row pt-30 ${productList.length > 0 ? "pb-10" : ""}`}>
            <div className="col-md-2 pt-5px pb-10 text-right">
              <b>Новая {isWholesale ? "розничная" : ""} цена:</b>
            </div>
            <div className="col-md-2 pb-10 pr-0 pl-0">
              <input
                type="text"
                name="newPrice"
                className="form-control"
                placeholder={`Новая ${isWholesale ? "розничная" : ""} цена`}
                value={newPrice}
                onChange={onSumChange}
              />
            </div>
            {isWholesale &&
              <Fragment>
                <div className="col-md-2 pt-5px text-right">
                  <b>Новая оптовая цена:</b>
                </div>
                <div className="col-md-2 pr-0 pl-0">
                  <input
                    type="text"
                    name="newWSPrice"
                    className="form-control"
                    placeholder="Новая оптовая цена"
                    value={newWSPrice}
                    onChange={onWSSumChange}
                  />
                  {(newWSPrice === "" || newWSPrice.toString() === "0") &&
                    <p style={{ lineHeight: "0.9", fontSize: "12px", padding: "5px", fontWeight: "lighter", color: "red" }}>*Товар не будет продаваться оптом</p>
                  }
                </div>
              </Fragment>
            }
            {isSelledByPieces && (
              <Fragment>
                <div className={`col-md-${isWholesale ? "2" : "4"} pt-5px text-right`}>
                  <b>Новая цена за штуку:</b>
                </div>
                <div className={`col-md-${isWholesale ? "2" : "3"}`}>
                  <input
                    type="text"
                    name="newpieceprice"
                    className="form-control"
                    placeholder="Новая цена за штуку"
                    value={newPiecePrice}
                    onChange={onPieceSumChange}
                  />
                </div>
              </Fragment>
            )}
            <div
              className={`col-md-${isSelledByPieces ? "12" : "2"} text-center`}
            >
              <button
                className="btn btn-info"
                onClick={addProduct}
                style={{ zIndex: 0 }}
              >
                Добавить
              </button>
            </div>
          </div>
        </Fragment>
      )}
      {!isLoading && productList.length > 0 && (
        <Fragment>
          <div className="empty-space"></div>

          <table className="table table-hover change-price-plt mt-10">
            <thead>
              <tr>
                <th style={{ width: isSelledByPieces ? "30%" : "40%" }}>
                  Продукт
                </th>
                <th style={{ width: "10%" }}>Штрих код</th>
                <th style={{ width: "10%" }} className="text-center">
                  Текущая {isWholesale ? "розничная" : ""} цена
                </th>
                <th style={{ width: "10%" }} className="text-center">
                  Новая {isWholesale ? "розничная" : ""} цена
                </th>
                {isWholesale &&
                  <Fragment>
                    <th style={{ width: "10%" }} className="text-center">
                      Текущая оптовая цена
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Новая оптовая цена
                    </th>
                  </Fragment>
                }
                {isSelledByPieces && (
                  <th style={{ width: "10%" }} className="text-center">
                    Новая цена за штуку
                  </th>
                )}
                <th colSpan="2" style={{ width: "15%" }}>
                  Торговая точка
                </th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, idx) => {
                return (
                  <tr key={idx}>
                    <td>{product.name}</td>
                    <td>{product.code}</td>
                    <td className="text-center">{product.oldPrice}</td>
                    <td className="text-center">{product.price}</td>
                    {isWholesale &&
                      <Fragment>
                        <td className="text-center">{product.oldWholesale_price}</td>
                        <td className="text-center">{product.wholesale_price}</td>
                      </Fragment>}
                    {isSelledByPieces && (
                      <td className="text-center">{product.pieceprice}</td>
                    )}
                    <td>
                      <ul>
                        {product.selectedPoints.map((point) => {
                          return <span key={point.id}>{point.name}</span>;
                        })}
                      </ul>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon delete-item"
                        onClick={() => {
                          removeProduct(product);
                        }}
                      ></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
}
