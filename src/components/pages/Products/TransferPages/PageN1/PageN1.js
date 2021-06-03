import React, { useState, useEffect, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import Alert from "react-s-alert";
import { replaceAllSymbols } from "../../../../../barcodeTranslate";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import AttributeDetails from "./AttributeDetails";
import Grid from "@material-ui/core/Grid";
import DetailTable from "./DetailTable";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProductListTable from "./ProductListTable";

export default function PageN1({
  fromPointProps,
  toPointProps,
  invoiceNumberProps,
  selectedGoodsFuncProps,
}) {
  const [amountExceeds, setamountExceeds] = useState(false);
  const [detail, setdetail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [newAmount, setnewAmount] = useState("");
  const [newPriceCheck, setNewPriceCheck] = useState(false);
  // const [newProductPrice, setNewProductPrice] = useState();
  const [oldPriceCheck, setOldPriceCheck] = useState(false);
  const [productSelectValue, setproductSelectValue] = useState("");
  const [productOptions, setproductOptions] = useState([]);
  const [productList, setproductList] = useState([]);
  const [productBarcode, setproductBarcode] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getStockCurrentProducts();
    getInvoiceProducts();
    selectedGoodsFuncProps(productList);
  }, []);

  const getInvoiceProducts = () => {
    setLoadingProducts(true);
    Axios.get("/api/invoice/stockcurrent/product", {
      params: { invoicenumber: invoiceNumberProps },
    })
      .then((res) => res.data)
      .then((newproductList) => {
        setproductList(newproductList);
        setLoadingProducts(false);

        selectedGoodsFuncProps(newproductList);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const getStockCurrentProducts = (productName) => {
    setLoadingProducts(true);
    Axios.get("/api/products/stockcurrent/stock", {
      params: {
        stockid: fromPointProps.value,
        stocktoid: toPointProps.value,
        productName,
        isWeightProduct: false,
      },
    })
      .then((res) => res.data)
      .then((productlist) => {
        let newproductOptions = [];
        productlist.map((product) =>
          newproductOptions.push({
            label:
              product.name.trim() +
              (product.attributescaption ? ", " : "") +
              product.attributescaption +
              (product.unitspr_shortname
                ? " [" + product.unitspr_shortname + "]"
                : ""),
            value: product.id,
            value2: product.idto,
            code: product.code,
            attributes: product.attributes,
          })
        );
        setLoadingProducts(false);
        setproductOptions(newproductOptions);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const getStockCurrentProductsBarcode = (barcode) => {
    if (barcode) {
      Axios.get("/api/products/stockcurrent/stock", {
        params: {
          stockid: fromPointProps.value,
          stocktoid: toPointProps.value,
          barcode,
          isWeightProduct: false,
        },
      })
        .then((res) => res.data)
        .then((newproducts) => {
          if (newproducts.length === 0) {
            ErrorAlert("Товар отсутсвует на складе");
          };
          if (newproducts.length === 1) {
            const product = newproducts[0];
            const newproductSelectValue = {
              label:
                product.name.trim() +
                (product.attributescaption ? ", " : "") +
                product.attributescaption +
                (product.unitspr_shortname
                  ? " [" + product.unitspr_shortname + "]"
                  : ""),
              value: product.id,
              value2: product.idto,
              code: product.code,
              attributes: product.attributes,
            };
            setproductSelectValue(newproductSelectValue);
            getStockCurrentDetail(product.id, product.idto);
            setProducts(newproducts);
          }
          if (newproducts.length > 1) {
            setProducts(newproducts);
            setModalOpen(true);
          }
        })
        .catch((err) => {
          ErrorAlert(err);
        });
    }
  };

  const selectAttribute = (product) => {
    const newproductSelectValue = {
      label:
        product.name.trim() +
        (product.attributescaption ? ", " : "") +
        product.attributescaption +
        (product.unitspr_shortname
          ? " [" + product.unitspr_shortname + "]"
          : ""),
      value: product.id,
      code: product.code,
      attributes: product.attributes,
    };
    setproductSelectValue(newproductSelectValue);
    setModalOpen(false);
    getStockCurrentDetail(product.id, product.idto);
  };

  const getStockCurrentDetail = (stockcurrentid, stockcurrentidto) => {
    if (stockcurrentid) {
      setLoading(true);
      Axios.get("/api/stockcurrent/detail", {
        params: { stockcurrentid, stockcurrentidto },
      })
        .then((res) => res.data)
        .then((newdetail) => {
          setdetail(newdetail);
          setLoading(false);
        })
        .catch((err) => {
          ErrorAlert(err);
          setLoading(false);
        });
    } else {
      setdetail("");
    }
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    const replacedBarcodes = replaceAllSymbols(barcodeChanged);
    if (barcodeChanged) {
      setproductBarcode(replacedBarcodes);
    } else {
      setproductSelectValue("");
      setproductBarcode("");
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.key === "Enter") {
      getStockCurrentProductsBarcode(productBarcode);
    }
  };

  const onProductListInput = (event, p, reason) => {
    if (reason === "input") getStockCurrentProducts(p);
    else if (p.length === 0) getStockCurrentProducts();
  };

  const onProductChange = (event, prod) => {
    if (!prod) {
      setproductSelectValue("");
      setproductBarcode("");
    } else {
      setproductSelectValue(prod);
      setproductBarcode(prod.code);
      getStockCurrentDetail(prod.value, prod.value2);
    }
  };

  const onAmountChange = (e) => {
    let newAmount = isNaN(e.target.value) ? 0 : e.target.value;
    if (newAmount > detail.units) {
      setamountExceeds(true);
    } else {
      setnewAmount(newAmount);
      setamountExceeds(false);
    }
  };

  const addProduct = () => {
    if (
      !productSelectValue.value ||
      !newAmount ||
      (!newPriceCheck && !oldPriceCheck)
    ) {
      return Alert.info(
        !productSelectValue.value
          ? "Выберите товар"
          : !newAmount
            ? "Внесите количество товара для перемещения"
            : !newPriceCheck && !oldPriceCheck
              ? "Выберите цену для перемещения"
              : "",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
    }
    if (newAmount > detail.units) {
      return setamountExceeds(true);
    }
    const alreadyExist = productList.filter(
      (product) => product.id === productSelectValue.id
    );
    if (alreadyExist.length > 0) {
      return Alert.info("Данный товар уже в списке", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    const reqdata = {
      invoice: invoiceNumberProps,
      type: "1",
      stockcurrentfrom: [
        {
          id: productSelectValue.value,
          amount: newAmount,
          attributes: productSelectValue.attributes,
          SKU: null,
          newprice: newPriceCheck ? detail.priceto : detail.price,
          pieceprice: detail.pieceprice
        },
      ],
    };

    Axios.post("/api/invoice/add/product", reqdata)
      .then(() => {
        const newProduct = {
          id: productSelectValue.value,
          code: productSelectValue.code,
          name: productSelectValue.label,
          amount: newAmount,
          attributes: productSelectValue.attributes,
          price: newPriceCheck ? detail.priceto : detail.price,
        };
        productList.push(newProduct);
        setnewAmount("");
        setproductSelectValue("");
        setproductBarcode("");
        setdetail("");
        setamountExceeds(false);
        selectedGoodsFuncProps(productList);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
    setOldPriceCheck(false);
    setNewPriceCheck(false);
  };

  const removeProduct = (item) => {
    const newProductList = productList.filter((productList) => {
      return productList !== item;
    });

    const req = {
      invoice: invoiceNumberProps,
      stock: item.stock || item.id,
      attributes: item.attributes,
    };

    Axios.post("/api/invoice/delete/product", req)
      .then(() => {
        setproductList(newProductList);
        selectedGoodsFuncProps(newProductList);
        Alert.success("Товар удален из списка", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (newPriceCheck) {
      return Alert.warning("Только одно значение цены может быть выбрано!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      setOldPriceCheck(checked);
    }
  };
  const handleCheckboxChange1 = (e) => {
    const checked = e.target.checked;
    if (oldPriceCheck) {
      return Alert.warning("Только одно значение цены может быть выбрано!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      setNewPriceCheck(checked);
    }
  };
  return (
    <Fragment>
      {modalIsOpen && (
        <AttributeDetails
          modalIsOpen={modalIsOpen}
          setModalOpen={setModalOpen}
          selectAttribute={selectAttribute}
          products={products}
        />
      )}

      <Grid container spacing={1} style={{ marginBottom: "1rem" }}>
        <Grid item xs={12} style={{ marginTop: "1rem" }}>
          Выберите товары на складе
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="text"
            fullWidth
            name="barcode"
            value={productBarcode}
            className="form-control"
            label="Штрих код"
            onChange={onBarcodeChange}
            onKeyDown={onBarcodeKeyDown}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            value={productSelectValue}
            defaultValue={productSelectValue}
            disableClearable
            onChange={onProductChange}
            onInputChange={onProductListInput}
            noOptionsText="Товары не найдены"
            options={
              productSelectValue === ""
                ? productOptions
                : [productSelectValue, ...productOptions]
            }
            filterSelectedOptions
            filterOptions={(options) =>
              options.filter((option) => option !== "")
            }
            getOptionLabel={(option) => (option ? option.label : "")}
            getOptionSelected={(option) =>
              option ? option.label === productSelectValue.label : ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Наименование товара"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoadingProducts ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      {!isLoading && detail && (
        <DetailTable
          fromPointProps={fromPointProps}
          toPointProps={toPointProps}
          detail={detail}
          newAmount={newAmount}
          onAmountChange={onAmountChange}
          oldPriceCheck={oldPriceCheck}
          handleCheckboxChange={handleCheckboxChange}
          newPriceCheck={newPriceCheck}
          handleCheckboxChange1={handleCheckboxChange1}
          addProduct={addProduct}
        />
      )}
      {amountExceeds && (
        <span className="message text-danger">
          Количество не может превышать {detail.units}
        </span>
      )}
      {isLoading && <SkeletonTable />}
      {!isLoadingProducts && productList.length > 0 && (
        <ProductListTable
          productList={productList}
          newPriceCheck={newPriceCheck}
          removeProduct={removeProduct}
        />
      )}
    </Fragment>
  );
}
