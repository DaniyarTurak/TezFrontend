import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import EditProduct from "./EditProduct";
import EditWeightProducts from "./EditWeightProducts";
import Alert from "react-s-alert";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function ProductReferenceList({
  productsList,
  weightProductsList,
  company,
  getProducts,
  setProductsList,
  getWeightProducts
}) {
  const [brand, setBrand] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitspr, setUnitspr] = useState("");
  const [unitOptions, setUnitOptions] = useState([])
  const [sellByPieces, setSellByPieces] = useState(false);
  const [piecesUnint, setPiecesUnint] = useState("");
  const [cnofeacode, setCnofeacode] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [weightProduct, setWeightProduct] = useState(false)
  const [prodName, setProdName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isClear, setClear] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [weightProductDetails, setWeightProductDetails] = useState({})

  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};

  useEffect(() => {
    getCategories();
    getBrands();
    getMeasures();
    getProducts();
    getWeightProducts();
  }, []);

  useEffect(() => {
    setProdName("");
    setBarcode("");
    getProducts();
    getWeightProducts();
  }, [isClear]);

  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", {
      params: {
        brand: inputValue,
      },
    })
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

  const getCategories = (inputValue) => {
    Axios.get("/api/categories/search", {
      params: { deleted: false, company, category: inputValue },
    })
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
            isDisabled: false,
          };
        });
        setUnitOptions(unitRes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSellByPiecesChange = (e, idx) => {
    const piece = e.target.checked;
    setSellByPieces(piece);
    let newUnitRes = [...unitOptions];
    //продажа поштучно
    if (piece) {
      newUnitRes.forEach((e) => {
        if (e.id === "2" || e.id === "16" || e.id === "17") {
          e.isDisabled = false;
        } else e.isDisabled = true;
      });
    } else {
      newUnitRes.forEach((e) => {
        e.isDisabled = false;
      });
    }
    setUnitOptions(newUnitRes);
  };
  const onProductNameChange = (e) => {
    let pn = e.target.value;
    if (pn.length > 100) {
      return Alert.warning(
        `Название товара не может содержать символы: ' ; ' ' , '`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    }
    setProdName(pn);
  };

  const onCnofeacodeEdit = (e) => {
    let co = e.target.value;
    setCnofeacode(co);
  };

  const categoryChange = (e, categoryChanged) => {
    setCategory(categoryChanged);
  };

  const onCategoryListInput = (e, categoryName) => {
    getCategories(categoryName);
  };

  const onBrandListInput = (e, brandName) => {
    getBrands(brandName);
  };

  const brandListChange = (e, brandChanged) => {
    setBrand(brandChanged);
  };

  const onUnitListInput = (e, unitspr) => {
    if (unitspr.lenght > 0) setUnitspr(unitspr);
  };

  const unitListChange = (e, unitsprChanged) => {
    setUnitspr(unitsprChanged);
  };

  const getProductDetails = () => {
    if (barcode.trim() === "" && prodName.trim() === "") {
      return Alert.info("Введите штрих код или выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    else {
      Axios.get("/api/nomenclature", {
        params: { barcode: barcode ? barcode.trim() : "", name: prodName ? prodName.trim() : "" },
      })
        .then((res) => res.data)
        .then((res) => {
          if (res === "") {
            Axios.get("/api/nomenclature/spr", {
              params: { barcode: barcode },
            })
              .then((res) => res.data)
              .then((res) => {
                if (res !== "") {
                  setProductDetails(res);
                }
                else {
                  Alert.warning(`Товар со штрих-кодом ${barcode} не найден. Попробуйте сналача добавить товар.`, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 4000,
                  });
                }
              }
              )
              .catch((err) => {
                console.log(err);
              });
          }
          else {
            setProductDetails(res)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const getWeightProductDetails = () => {
    Axios.get("/api/pluproducts/byname", {
      params: { name: prodName ? prodName.trim() : "" },
    })
      .then((res) => res.data)
      .then((data) => {
        setWeightProductDetails(data)
        console.log(data)
      })
  }

  const onPieceAmountChange = (e) => {
    const num = e.target.value;
    setPiecesUnint(num);
  };

  const prodNameChange = ({ value, search, fromBarcode }) => {
    if (!value || value.trim() === "") {
      setProdName("");
      if (!fromBarcode) {
        setBarcode("");
      }
      if (search) {
        getProductByName("");
      }
    }
    else {
      setProdName(value);
      let flag = false;
      productsList.forEach(prod => {
        if (prod.name === value) {
          setBarcode(prod.code);
          flag = true;
        }
      });
      if (!flag && search) {
        getProductByName(value);
      }
    }
  };

  const barcodeChange = (value) => {
    setBarcode(value.trim());
    let flag = false;
    productsList.forEach((prod) => {
      if (value.trim() === prod.code) {
        flag = true;
        prodNameChange({ value: prod.name, search: false, fromBarcode: true });
      }
    })
    if (!flag) {
      prodNameChange({ value: "", search: false, fromBarcode: true });
    }
  }

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) {
      getProductByBarcode();
    }
  };

  const getProductByBarcode = () => {
    Axios.get("/api/nomenclature", {
      params: { barcode: "", name: prodName ? prodName.trim() : "" }
    }
    )
      .then((res) => res.data)
      .then((product) => {
        setProductDetails(product);
        setProdName(product.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByName = (value) => {
    Axios.get("/api/nomenclature/products_spr", {
      params: { name: value ? value.trim() : "" }
    }
    )
      .then((res) => res.data)
      .then((product) => {
        if (product.length > 0) {
          if (product.lenght === 1) {
            setBarcode(product[0].code);
          }
          else {
            setProductsList(product);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWeightProductByName = (value) => {

  }
  const onCheckboxChange = (e) => {
    setWeightProduct(e.target.checked)
  }
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="checkedB"
                color="primary"
                onChange={onCheckboxChange}
              />
            }
            size="small"
            label="Весовые товары"
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {!weightProduct ?
            (<Fragment>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <TextField
                    style={{ marginTop: "5px", marginLeft: "10px" }}
                    variant="outlined"
                    type="text"
                    name="barcode"
                    value={barcode}
                    className="form-control"
                    placeholder="Введите или отсканируйте штрихкод"
                    onChange={(e) => barcodeChange(e.target.value)}
                    onInputChange={(e) => barcodeChange(e.target.value)}
                    onKeyDown={(e) => onBarcodeKeyDown(e, barcode)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  style={{ marginTop: "5px", marginLeft: "10px" }}
                  options={productsList.map((option) => option.name)}
                  value={prodName}
                  onChange={(e, value) => prodNameChange({ value, search: false, fromBarcode: false })}
                  noOptionsText="Товар не найден"
                  onInputChange={(e, value) => prodNameChange({ value, search: true, fromBarcode: false })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Наименование товара"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Fragment>
            ) : (
              <Grid item xs={4}>
                <Autocomplete
                  style={{ marginTop: "5px", marginLeft: "10px" }}
                  options={weightProductsList.map((option) => option.name)}
                  value={prodName}
                  onChange={(e, value) => prodNameChange({ value, search: false })}
                  noOptionsText="Товар не найден"
                  onInputChange={(e, value) => prodNameChange({ value, search: true })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Наименование товара"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            )}

          <Grid item xs={3}>
            <Button
              style={{
                minHeight: "3.5rem",
                marginTop: "5px",
                marginLeft: "10px",
              }}
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              onClick={weightProduct ? getWeightProductDetails : getProductDetails}
            >
              Поиск
            </Button>
          </Grid>

        </Grid>
      </Grid>
      {Object.keys(productDetails).length > 0 &&
        <Grid item xs={12} style={{ paddingTop: "20px" }}>
          <EditProduct
            setClear={setClear}
            isClear={isClear}
            productDetails={productDetails}
            setProductDetails={setProductDetails}
            brand={brand}
            onBrandListInput={onBrandListInput}
            brandListChange={brandListChange}
            brandOptions={brandOptions}
            unitspr={unitspr}
            setUnitOptions={unitOptions}
            unitOptions={unitOptions}
            unitListChange={unitListChange}
            onUnitListInput={onUnitListInput}
            category={category}
            onCategoryListInput={onCategoryListInput}
            categoryOptions={categoryOptions}
            categoryChange={categoryChange}
            sellByPieces={sellByPieces}
            onSellByPiecesChange={onSellByPiecesChange}
            piecesUnint={piecesUnint}
            cnofeacode={cnofeacode}
            onCnofeacodeEdit={onCnofeacodeEdit}
            onProductNameChange={onProductNameChange}
            onPieceAmountChange={onPieceAmountChange}
            errorAlert={errorAlert}
            companyData={companyData}
            setErrorAlert={setErrorAlert}
          />
        </Grid>
      }
      {Object.keys(weightProductDetails).length > 0 &&
        <Grid item xs={12} style={{ paddingTop: "20px" }}>
          <EditWeightProducts
          setClear={setClear}
          isClear={isClear}
          weightProductDetails={weightProductDetails}
          setWeightProductDetails={setWeightProductDetails}
          onUnitListInput={onUnitListInput}
          errorAlert={errorAlert}
          companyData={companyData}
          setErrorAlert={setErrorAlert}
          />
        </Grid>
      }

    </Fragment>
  );
}
