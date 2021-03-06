import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import { isAllowed } from "../../../../../barcodeTranslate";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddAttribute from "./AddAttribute";
import AddAttributeChar from "./AddAttributeChar";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
const useStyles = makeStyles((theme) => ({
  topDiv: {
    borderRadius: "4px",
    border: "solid",
    borderColor: "lightgrey",
    borderWidth: "1px",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      borderColor: "black",
    },
  },

  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  errorText: {
    color: "red",
    display: "flex",
    fontSize: ".875rem",
    marginLeft: "1rem",
  },

  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
}));

const useStyles2 = makeStyles((theme) => ({
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
}));

export default function CreateProduct({ isEditing }) {
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isValidate, setValidate] = useState(false);
  const [isValidateName, setValidateName] = useState(false);
  const [isValidateUnit, setValidateUnit] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [unitspr, setUnitspr] = useState(1);
  const [sellByPieces, setSellByPieces] = useState(false);
  const [productName, setProductName] = useState("");
  const [cnofeacode, setCnofeacode] = useState("");
  const [tax, setTax] = useState(1);
  const [piecesUnint, setPiecesUnint] = useState(0);
  const [productBarcode, setProductBarcode] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState([]);
  const [attributeCode, setAttributeCode] = useState("");
  const [attributeGlobCode, setAttributeGlobCode] = useState("");
  const [attrList, setAttrList] = useState([]);
  const [editProduct, setEditProduct] = useState("");
  const [clearBoard, setClearBoard] = useState(false);
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};
  const classes = useStyles();
  const classes2 = useStyles2();

  useEffect(() => {
    getTaxes();
    getCategories();
    getBrands();
    getMeasures();
  }, []);


  const generateBarcode = () => {
    Axios.get("/api/invoice/newbarcode")
      .then((res) => res.data)
      .then((barcodeseq) => {
        const last = barcodeseq + "2";
        const barcodeCheck = "2" + last.padStart(12, "0");
        setBarcode(barcodeCheck);
      });
  };


  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue } })
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
    Axios.get("/api/categories/search", { params: { category: inputValue } })
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
            value: unit.id,
            label: unit.name,
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

  const getProductByBarcode = (barcodeChanged) => {
    Axios.get("/api/nomenclature", {
      params: { barcode: barcodeChanged, all: 1 },
    })
      .then((res) => res.data)
      .then((product) => {
        if (product !== "") {
          Alert.info(`?????????? ???? ??????????-?????????? ${barcode} ?????? ????????????????????. ???? ???? ???????????? ?????? ????????????????.`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          setLoading(false);
          clearForm();
        }
        else {
          Axios.get("/api/nomenclature/spr", {
            params: { barcode: barcode },
          })
            .then((res) => res.data)
            .then((res) => {
              if (res !== "") {
                setProductName(res.name);
                setProductBarcode(res);
                setLoading(false);
              }
              else {
                Alert.warning(`?????????? ???? ??????????-?????????? ${barcode} ???? ????????????. ???? ???????????? ?????? ????????????????.`, {
                  position: "top-right",
                  effect: "bouncyflip",
                  timeout: 4000,
                });
                setLoading(false);
              }
            }
            )
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onProductNameChange = (e) => {
    let pn = e.target.value;
    if (!pn === 0) {
      setValidateName(true);
      return;
    } else if (!pn) {
      setValidateName(true);
    } else {
      setValidateName(false);
    }
    if (pn.length > 100) {
      return Alert.warning(
        `???????????????? ???????????? ???? ?????????? ?????????????????? ??????????????: ' ; ' ' , '`,
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

  const brandListChange = (e, brandChanged) => {
    setBrand(brandChanged);
  };

  const onSellByPiecesChange = (e) => {
    const piece = e.target.checked;
    setSellByPieces(piece);
    let newUnitRes = [...unitOptions];
    //?????????????? ????????????????
    if (piece < 2) {
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

  const handleSearch = (brcd) => {
    brcd.preventDefault();
    if (!barcode) {
      return Alert.info("?????????????????? ???????? ?????????? ??????", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (barcode.length > 20) {
      return Alert.info("?????????? ?????????????????? ???? ?????????? ?????????????????? 20 ????????????????", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setLoading(true);
    getProductByBarcode(barcode);
  };

  const onBarcodeKeyDown = (e) => {
    if (!barcode) {
      setValidate(true);
      return;
    }
    if (e.keyCode === 13) {
      handleSearch();
    }
    if (productBarcode === barcode) {
      Alert.warning("?????????? ?????? ???????? ?? ????????!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
  };
  const getTaxes = (inputValue) => {
    Axios.get("/api/taxes", { params: { category: inputValue } })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    if (!isAllowed(barcodeChanged)) {
      Alert.warning(`???????????????????? ?????????????????? ?????????????????? ???? ????????????????!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      e.preventDefault();
      return;
    } else if (!barcodeChanged) {
      setValidate(true);
    } else {
      setValidate(false);
    }
    setBarcode(barcodeChanged);
  };

  const unitListChange = (e, unitsprChanged) => {
    setUnitspr(unitsprChanged);
  };
  const onUnitListInput = (e, unitspr) => {
    if (unitspr.lenght > 0) setUnitspr(unitspr);
  };

  const onCategoryListInput = (e, categoryName) => {
    getCategories(categoryName);
  };
  const onBrandListInput = (e, brandName) => {
    getBrands(brandName);
  };
  const categoryChange = (e, categoryChanged) => {
    setCategory(categoryChanged);
  };

  const onTaxChange = (e, t) => {
    setTax(e.target.value);
  };

  const getAttributeCode = (attributeCodeChanged) => {
    setAttributeCode(attributeCodeChanged);
  };
  const getAttributeCharCode = (attributeCodeChanged) => {
    setAttributeGlobCode(attributeCodeChanged);
  };

  const getAttrList = (attrListChanged) => {
    setAttrList(attrListChanged);
  };

  const taxes = [
    { label: "?????? ??????", value: "0" },
    { label: "?????????????????????? ??????", value: "1" },
  ];

  const onPieceAmountChange = (e) => {
    const num = e.target.value;
    if (num < 2) {
      setValidateUnit(true);
      return;
    } else if (!num) {
      setValidateUnit(true);
    } else {
      setValidateUnit(false);
    }
    setPiecesUnint(num);
  };

  const createProduct = () => {
    if (!barcode) {
      Alert.warning("?????????????????? ????????????????!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    else {
      if (!productName) {
        Alert.warning("?????????????????? ???????????????????????? ????????????!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      }
      else {
        if (!unitspr.id) {
          Alert.warning("?????????????? ?????????????? ??????????????????!", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        else {
          if (sellByPieces === true && piecesUnint < 2) {
            Alert.warning("???????????????????? ?? ????????????????/??????????(??????. 2)", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            });
          }
          else {
            let product = {
              code: barcode,
              name: productName,
              category: category.id || "0",
              brand: brand.id || "0",
              taxid: companyData.certificatenum ? tax : "0",
              unitsprid: unitspr.id,
              piece: sellByPieces ? true : false,
              pieceinpack: piecesUnint,
              attributes: !isEditing
                ? attributeCode || null
                : editProduct.attributes !== "0" &&
                  parseInt(editProduct.attributes, 0) >= attributeCode
                  ? editProduct.attributes
                  : attributeCode,
              details: !isEditing
                ? attributeGlobCode || null
                : editProduct.attributes !== "0" &&
                  parseInt(editProduct.attributes, 0) >= attributeGlobCode
                  ? editProduct.attributes
                  : attributeGlobCode,
              cnofeacode: cnofeacode,
              attrList,
            };
            Axios.post("/api/products/create", { product })
              .then((res) => {
                clearForm(res);
                setClearBoard(res.code);
                Alert.success("?????????? ?????????????? ????????????????", {
                  position: "top-right",
                  effect: "bouncyflip",
                  timeout: 2000,
                });
              })
              .catch((err) => {
                ErrorAlert(err);
                console.log(err);
              });
          }
        }
      }
    }
  };

  const clearForm = () => {
    setBrand("");
    setCategory("");
    setSellByPieces(false);
    setBarcode("");
    setUnitspr("");
    setTax(1);
    setProductName("");
    setPiecesUnint(0);
    setAttributeCode(null);
    setAttributeGlobCode(null);
    setAttrList([]);
    setSelectedAttribute([]);
    setCnofeacode("");
    // setAttrListGlob([]);
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>?????????? ??????</label>
              <div className={classes.topDiv}>
                <TextField
                  size="small"
                  disabled={isEditing}
                  onChange={onBarcodeChange}
                  onKeyDown={onBarcodeKeyDown}
                  value={barcode}
                  error={isValidate}
                  className={classes.input}
                  InputProps={{
                    classes: classes2,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                      </React.Fragment>
                    ),
                  }}
                  type="text"
                  placeholder="?????????????? ??????????????, ?????? ?? ?????????????? ??????????????"
                />
                <IconButton
                  type="submit"
                  disabled={isEditing}
                  className={classes.iconButton}
                  aria-label="search"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
                <Button
                  color="primary"
                  className={classes.iconButton}
                  disabled={isEditing}
                  onClick={generateBarcode}
                >
                  ??????????????????????????
                </Button>
              </div>
              {isValidate && (
                <span className={classes.errorText}>
                  ???????? ?????????????????????? ?????? ????????????????????
                </span>
              )}
            </Grid>
            <Grid item xs={12}>
              <label>????????????????????????</label>
              <TextField
                placeholder="?????????????? ???????????????? ????????????"
                fullWidth
                size="small"
                variant="outlined"
                type="text"
                value={productName}
                onChange={onProductNameChange}
                error={isValidateName}
                helperText={
                  isValidateName ? "???????? ?????????????????????? ?????? ????????????????????" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="category">??????????????????</label>
              <Autocomplete
                align="left"
                fullWidth
                size="small"
                options={categoryOptions}
                value={category}
                defaultValue={category}
                onChange={categoryChange}
                noOptionsText="?????????????????? ???? ??????????????"
                onInputChange={onCategoryListInput.bind(this)}
                filterOptions={(options) =>
                  options.filter((option) => option.category !== "")
                }
                getOptionLabel={(option) => (option ? option.name : "")}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    label="???????????????? ??????????????????"
                    {...params}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <label>??????????</label>
              <Autocomplete
                fullWidth
                size="small"
                options={brandOptions}
                value={brand}
                onChange={brandListChange}
                noOptionsText="?????????? ???? ????????????"
                onInputChange={onBrandListInput.bind(this)}
                filterOptions={(options) =>
                  options.filter((option) => option.brand !== "")
                }
                getOptionLabel={(option) => (option ? option.name : "")}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    label="?????????????? ???????????????????????? ??????????????????????????"
                    {...params}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <label> ?????? ???? ??????</label>
              <TextField
                placeholder="?????????????? ?????? ???? ?????? "
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={cnofeacode}
                onChange={onCnofeacodeEdit}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h6" align="left">
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          onChange={onSellByPiecesChange}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      size="small"
                      label="?????????????? ????????????????"
                    />
                  </Typography>
                  <span
                    className="input-group-text border-0"
                    style={{ backgroundColor: "transparent", padding: "0px" }}
                  >
                    <TextField
                      type="number"
                      fullWidth
                      placeholder="???????????????????? ?? ????????????????/??????????(??????. 2)"
                      size="small"
                      variant="outlined"
                      disabled={!sellByPieces}
                      onWheel={(event) => event.currentTarget.blur()}
                      onChange={onPieceAmountChange}
                      error={isValidateUnit}
                      helperText={
                        isValidateUnit ? "???????????????? ???? ?????????? ???????? ???????????? 2" : ""
                      }
                    />
                    <Tooltip
                      title={
                        <h6>
                          ?????????????? ???????? ???? ?????????? ???????????? ?????? ???????????? ???? ??????????. ?????? ??
                          ?????????????? "?????????????????? ??????"
                        </h6>
                      }
                    >
                      <span>
                        <Button disabled>
                          <InfoIcon color="primary" fontSize="large" />
                        </Button>
                      </span>
                    </Tooltip>
                  </span>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    style={{ paddingBottom: "10px", paddingTop: "8px" }}
                  >
                    ?????????????? ??????????????????
                  </Typography>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={unitOptions}
                    value={unitspr}
                    onChange={unitListChange}
                    noOptionsText="?????????????? ?????????????????? ???? ??????????????"
                    onInputChange={onUnitListInput.bind(this)}
                    filterOptions={(options) =>
                      options.filter((option) => option.unitOptions !== "")
                    }
                    getOptionLabel={(option) => (option ? option.name : "")}
                    getOptionSelected={(option, value) =>
                      option.label === value.label
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="??????????"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            {companyData.certificatenum && (
              <Grid
                item
                xs={12}
                style={{ paddingBottom: "20px", paddingTop: "20px" }}
              >
                <label> ?????????????????? ??????????????????</label>
                <FormControl
                  style={{ paddingBottom: "5px", paddingTop: "10px" }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  value="???????????????? ?????????????????? ????????????????"
                >
                  <Select
                    fullWidth
                    size="small"
                    value={tax}
                    onChange={onTaxChange}
                  >
                    {taxes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <label style={{ marginTop: 10 }}>
                <strong>???????????????????? ????????????????????????????</strong>
              </label>
              <Grid container spacing={1} >
                <Grid item xs={12}>
                  <AddAttributeChar
                    isEditing={isEditing}
                    selected={selectedAttribute}
                    clearBoard={clearBoard}
                    attributeCode={getAttributeCharCode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AddAttribute
                    isEditing={isEditing}
                    selected={selectedAttribute}
                    clearBoard={clearBoard}
                    attributeCode={getAttributeCode}
                    attrListProps={getAttrList}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} />
        <Grid
          container
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
          spacing={1}
          justify="center"
          alignItems="center">
          <button
            type="button"
            className="btn mr-10"
            onClick={clearForm}
          >
            ????????????????
          </button>
          &emsp;
          <button className="btn btn-success"
            onClick={() => createProduct()}
          >
            ??????????????????
          </button>
        </Grid>
      </Grid>
    </Fragment >
  );
};