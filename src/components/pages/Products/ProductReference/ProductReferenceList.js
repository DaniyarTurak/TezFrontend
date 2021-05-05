import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditProduct from "./EditProduct";
import Alert from "react-s-alert";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";
import Dialog from "@material-ui/core/Dialog";

export default function ProductReferenceList({
  company,
  reference,
  productBarcode,
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
}) {
  const [isAddingAmount, setAddingAmount] = useState(false);
  const [editProduct, setEditProduct] = useState([]);
  const [brand, setBrand] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitspr, setUnitspr] = useState("");
  const [unitOptions, setUnitOptions] = useState([]);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [sellByPieces, setSellByPieces] = useState(false);
  const [piecesUnint, setPiecesUnint] = useState("");
  const [productName, setProductName] = useState("");
  const [cnofeacode, setCnofeacode] = useState("");
  const [sweetalert, setSweetAlert] = useState(null);
  const [tax, setTax] = useState(1);
  const [maxWidth] = useState("md");
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
    setEditing(true);
    setAddingAmount(false);
    setModalOpen(true);
    setEditProduct(id);
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
    setAddingAmount(false);
    setEditing(false);
    setModalOpen(false);
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
        getProductReference();
        setReference([]);
        setProductBarcode("");
        getBarcodeProps(productBarcode);
        getProducts();
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

  const handleDeleteProduct = (item) => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        allowEscape={false}
        closeOnClickOutside={false}
        onConfirm={() => handleDelete(item)}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить товар?
      </SweetAlert>
    );
  };

  const closeModal = (e, idx) => {
    cleanAlerts();
    setEditingProduct(idx);
    setModalOpen(false);
    clear();
    setErrorMessage({});
    setErrorAlert(false);
  };

  const handleSearch = () => {
    let barcode = productSelectValue;
    if (!barcode) {
      return Alert.info("Введите штрих код или выберите товар", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    getProductReference();
    setSweetAlert(null);
  };

  const onPieceAmountChange = (e) => {
    const num = e.target.value;
    setPiecesUnint(num);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(false);
    setAddingAmount(true);
  };

  return isEditing && !isAddingAmount ? (
    <Dialog
      style={{ marginLeft: "100px" }}
      maxWidth={maxWidth}
      onClose={handleClose}
      open={modalIsOpen}
    >
      <EditProduct
        productDetails={editProduct}
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
      />
    </Dialog>
  ) : (
    <Fragment>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                type="text"
                name="barcode"
                value={productBarcode}
                className="form-control"
                label="Введите или отсканируйте штрихкод"
                onChange={onBarcodeChange}
                onKeyDown={onBarcodeKeyDown}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              id="outlined-basic"
              options={[reference, ...productOptions]}
              value={productSelectValue}
              onChange={productListChange}
              noOptionsText="Товар не найден"
              onInputChange={onProductListChange}
              filterOptions={(options) =>
                options.filter((option) => option !== "")
              }
              getOptionLabel={(option) => (option ? option.label : "")}
              getOptionSelected={(option, value) =>
                option.label === value.value
              }
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
              style={{ minHeight: "3.5rem" }}
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSearch}
            >
              Поиск
            </Button>
          </Grid>
        </Grid>
        {Object.keys(reference).length > 0 && (
          <TableContainer className="mt-4" component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.head} align="left">
                    Наименование
                  </TableCell>
                  <TableCell className={classes.head} align="center">
                    Штрих - код
                  </TableCell>
                  <TableCell className={classes.head} align="center">
                    Категория
                  </TableCell>
                  <TableCell className={classes.head} align="center">
                    Брeнд
                  </TableCell>
                  <TableCell className={classes.head} align="center">
                    Код ТН ВЭД
                  </TableCell>
                  <TableCell className={classes.head} align="center">
                    НДС
                  </TableCell>
                  <TableCell className={classes.head}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.row}>
                  <TableCell align="left"> {reference.name} </TableCell>
                  <TableCell align="center"> {reference.code} </TableCell>
                  <TableCell align="center"> {reference.category} </TableCell>
                  <TableCell align="center"> {reference.brand}</TableCell>
                  <TableCell align="center">
                    {" "}
                    {!reference.cnofeacode ? "Н/Д" : reference.cnofeacode}
                  </TableCell>
                  <TableCell align="center">
                    {reference.taxid === "0" ? "Без НДС" : "Стандартный НДС"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="редактировать"
                      onClick={() => handleEdit(reference)}
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      aria-label="удалить"
                      onClick={() => handleDeleteProduct(reference)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  {sweetalert}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Fragment>
  );
}
