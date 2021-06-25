import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import EditProduct from "./EditProduct";
import Alert from "react-s-alert";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@material-ui/core/Button";

export default function ProductReferenceList({
  productsList,


  company,
  reference,
  onBarcodeChange,
  onBarcodeKeyDown,
  productSelectValue,
  productOptions,
  productListChange,
  onProductListChange,
  getProducts,
  getBarcodeProps,
  setReference,
  setProductBarcode,
  getProductReference,
  capations,
  setProductSelectValue,
  productBarcode
}) {
  const [editProduct, setEditProduct] = useState([]);
  const [brand, setBrand] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitspr, setUnitspr] = useState("");
  const [unitOptions, setUnitOptions] = useState([])
  const [editingProduct, setEditingProduct] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [sellByPieces, setSellByPieces] = useState(false);
  const [piecesUnint, setPiecesUnint] = useState("");
  const [productName, setProductName] = useState("");
  const [cnofeacode, setCnofeacode] = useState("");
  const [tax, setTax] = useState(1);
  const [errorMessage, setErrorMessage] = useState({});
  const [errorAlert, setErrorAlert] = useState(false);

  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};

  const useStyles = makeStyles((theme) => ({
    table: {},
    head: {
      backgroundColor: "#17a2b8",
      color: theme.palette.common.white,
      fontSize: 14,
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    rowEdited: {
      color: theme.palette.warning.main,
    },
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
  }));

  const handleEdit = (id, oldProduct) => {
    setEditingProduct(oldProduct);
    setEditProduct(id);
    setEditing(true);
  };

  const classes = useStyles(reference);

  useEffect(() => {
    getCategories();
    getBrands();
    getMeasures();
    getProducts();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setProductName(reference.name);
      setCnofeacode(reference.cnofeacode);
    }
  }, [isEditing, editingProduct]);

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

  const taxes = [
    { label: "Без НДС", value: "0" },
    { label: "Стандартный НДС", value: "1" },
  ];

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
    setProductName(pn);
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

  const onTaxChange = (e, t) => {
    setTax(e.target.value);
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

  const cleanAlerts = () => {
    setEditing(false);
  };

  const clear = () => {
    setBrand("");
    setCategory("");
    setSellByPieces("");
    setUnitspr("");
    setTax("");
    setCnofeacode("");
  };

  const handleDelete = (e, idx) => {
    const product = {
      id: productSelectValue.value,
      delete: "true",
    };
    Axios.post("/api/products/update", {
      product,
    })
      .then((res) => res.data)
      .then((res) => {
        setReference([]);
        setProductSelectValue("");
        setProductBarcode("");
        if (res.code === "success") {
          Alert.success("Товар удален успешно.", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        } else
          return Alert.warning(res.text, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
      })
      .catch((err) => {
        console.log(err);
      });
    closeModal(false);
  };

  const closeModal = (e, idx) => {
    cleanAlerts();
    setEditingProduct(idx);
    clear();
    setErrorMessage({});
    setErrorAlert(false);
  };

  const [productDetails, setProductDetails] = useState({});

  const getProductDetails = () => {
    if (barcode === "") {
      return Alert.info("Введите штрих код или выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    else {
      Axios.get("/api/nomenclature", {
        params: { barcode: barcode },
      })
        .then((res) => res.data)
        .then((res) => {
          setProductDetails(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const onPieceAmountChange = (e) => {
    const num = e.target.value;
    setPiecesUnint(num);
  };

  const [prodName, setProdName] = useState("");
  const [barcode, setBarcode] = useState("");

  const prodNameChange = (value) => {
    setProdName(value);
    if (value !== null) {
      productsList.forEach(prod => {
        if (prod.name === value) {
          setBarcode(prod.code);
        }
      });
    }
  };

  const barcodeChange = (value) => {
    setBarcode(value);
    setProdName("");
    if (value !== null) {
      productsList.forEach(prod => {
        if (prod.code === value) {
          setProdName(prod.name);
        }
      });
    }
  }

  return (
    <Fragment>
      <Grid container spacing={2}>
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
              onKeyDown={onBarcodeKeyDown}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            style={{ marginTop: "5px", marginLeft: "10px" }}
            options={productsList.map((option) => option.name)}
            value={prodName}
            onChange={(e, value) => prodNameChange(value)}
            noOptionsText="Товар не найден"
            onInputChange={(e, value) => prodNameChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Наименование товара"
                variant="outlined"
              />
            )}
          />
        </Grid>
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
            onClick={getProductDetails}
          >
            Поиск
          </Button>
        </Grid>
      </Grid>
      {Object.keys(productDetails).length > 0 &&
        <Grid item xs={12} style={{ paddingTop: "20px" }}>
          <EditProduct
            productDetails={productDetails}
            editProduct={editProduct}
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
            productName={productName}
            cnofeacode={cnofeacode}
            onCnofeacodeEdit={onCnofeacodeEdit}
            onProductNameChange={onProductNameChange}
            closeModal={closeModal}
            taxes={taxes}
            tax={tax}
            onTaxChange={onTaxChange}
            onPieceAmountChange={onPieceAmountChange}
            errorAlert={errorAlert}
            errorMessage={errorMessage}
            companyData={companyData}
            setErrorAlert={setErrorAlert}
            setReference={setReference}
            getBarcodeProps={getBarcodeProps}
            setErrorMessage={setErrorMessage}
            capations={capations}
            reference={reference}
          />
        </Grid>
      }
    </Fragment>
  );
}
