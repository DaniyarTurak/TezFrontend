import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import AlertMaterial from "@material-ui/lab/Alert";
import Alert from "react-s-alert";
import AddConstAttribute from "./AddConstAttribute";
import AddPartAttribute from "./AddPartAttribute";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SweetAlert from "react-bootstrap-sweetalert";

const useStyles = makeStyles((theme) => ({
  table: {},
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
    fontSize: 14,
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#ffEf",
    },
  },
  rowEdited: {
    color: theme.palette.warning.main,
  },
  textField: {
    maxWidth: 900,
    minWidth: 500,
  },
}));

export default function EditProduct({
  isEditing,
  productDetails,
  brandOptions,
  onBrandListInput,
  onCategoryListInput,
  categoryOptions,
  setUnitOptions,
  onUnitListInput,
  sellByPieces,
  closeModal,
  onTaxChange,
  taxes,
  companyData,
  errorAlert,
  errorMessage,
  tax,
  piecesUnint,
  capations,
  reference
}) {
  const classes = useStyles();
  const [editingProduct, setEditingProduct] = useState({});
  const [attributeCode, setAttributeCode] = useState("");
  const [attributeGlobCode, setAttributeGlobCode] = useState("");
  const [editProductAttr] = useState("");
  const [clearBoard, setClearBoard] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [sweetAlert, setSweetAlert] = useState(null);

  useEffect(() => {
    setEditingProduct(productDetails);
  }, [productDetails]);

  useEffect(() => {
    let attrOld = [];
    if (capations && capations.length > 0) {
      capations.forEach((element) => {
        if (element.attribute_id === null) {
        } else {
          attrOld.push({
            code: element.attribute_id,
            name: element.attribute_name,
            value: element.attribute_value,
          });
        }
      });
    }
    setAttributes(attrOld);
  }, [capations]);

  const getAttributeCharCode = (attributeCodeChanged) => {
    setAttributeGlobCode(attributeCodeChanged);
  };

  const getAttributeCode = (attributeCodeChanged) => {
    setAttributeCode(attributeCodeChanged);
  };

  const editProdRes = () => {
    let product = {
      id: editingProduct.id,
      name: editingProduct.name,
      category: editingProduct.categoryid,
      brand: editingProduct.brandid,
      taxid: companyData.certificatenum ? tax : "0",
      unitsprid: editingProduct.unitsprid,
      piece:
        editingProduct.piece === true ? editingProduct.piece : sellByPieces,
      pieceinpack: piecesUnint,
      cnofeacode: editingProduct.cnofeacode,
      details: !isEditing
        ? attributeGlobCode || null
        : editProductAttr.attributes !== "0" &&
          parseInt(editProductAttr.attributes, 0) >= attributeGlobCode
          ? editProductAttr.attributes
          : attributeGlobCode,
      attributes: !isEditing
        ? attributeCode || null
        : editProductAttr.attributes !== "0" &&
          parseInt(editProductAttr.attributes, 0) >= attributeCode
          ? editProductAttr.attributes
          : attributeCode,
      delete: "",
      attributesValue: attributes,
    };
    console.log(product);
    //   Axios.post("/api/products/update", {
    //     product,
    //   })
    //     .then((res) => {
    //       setErrorAlert(false);
    //       setReference([]);
    //       getBarcodeProps(productDetails.code);
    //       closeModal(false);
    //       setClearBoard(res.code);
    //       Alert.success("Товар успешно сохранен", {
    //         position: "top-right",
    //         effect: "bouncyflip",
    //         timeout: 2000,
    //       });
    //     })
    //     .catch((err) => {
    //       setErrorAlert(true);
    //       setErrorMessage(err);
    //     });
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
        allowEscape={true}
        closeOnClickOutside={false}
        onConfirm={() => handleDeleteProduct(item)}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить товар?
      </SweetAlert>
    );
  };

  const categoryChange = (value) => {
    if (value) {
      console.log(value);
      setEditingProduct({ ...editingProduct, category: value.name, categoryid: value.id })
    };
  };

  const brandChange = (value) => {
    if (value) {
      console.log(value);
      setEditingProduct({ ...editingProduct, brand: value.name, brandid: value.id })
    };
  };

  const unitSprChange = (value) => {
    if (value) {
      console.log(value);
      setEditingProduct({ ...editingProduct, unitspr_name: value.name, unitsprid: value.id })
    };
  };

  return (
    <Fragment>
      {errorAlert && (
        <AlertMaterial severity="error">
          {errorMessage.response && errorMessage.response.data.text}
        </AlertMaterial>
      )}
      <Paper style={{ backgroundColor: "#17a2b8" }}>
        <Grid container>
          <Grid item xs={1}>
            <ListAltSharpIcon fontSize="large" />
          </Grid>
          <Grid item xs={5}>
            Карточка товара
        </Grid>
          <Grid item xs={6}>
            <IconButton
              fontSize="large"
              onClick={() => handleDeleteProduct(reference)}>
              <DeleteIcon style={{ color: 'white' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={1} style={{ paddingTop: "20px" }}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <label>Штрих-код</label>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                disabled={true}
                placeholder={editingProduct.code}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Наименование:</label>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={editingProduct.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Категория:</label>
              <Autocomplete
                fullWidth
                size="small"
                options={categoryOptions}
                value={editingProduct.category}
                onChange={(e, value) => categoryChange(value)}
                noOptionsText="Категория не найдена"
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
                    {...params}
                    variant="outlined"
                    placeholder={editingProduct.category}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Бренд:</label>
              <Autocomplete
                fullWidth
                size="small"
                options={brandOptions}
                value={editingProduct.brand}
                onChange={(e, value) => brandChange(value)}
                noOptionsText="Брэнд не найден"
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
                    {...params}
                    variant="outlined"
                    placeholder={editingProduct.brand}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Код ТН ВЭД:</label>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={editingProduct.cnofeacode || ''}
                defaultValue={editingProduct.cnofeacode}
                onChange={(e) => setEditingProduct({ ...editingProduct, cnofeacode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Единица измерения:</label>
              <Autocomplete
                size="small"
                options={setUnitOptions}
                value={editingProduct.unitspr_name}
                onChange={(e, value) => unitSprChange(value)}
                noOptionsText="Единица измерение не найден"
                onInputChange={onUnitListInput.bind(this)}
                filterOptions={(options) =>
                  options.filter((option) => option.unit !== "")
                }
                getOptionLabel={(option) => (option ? option.name : "")}
                getOptionSelected={(option, value) =>
                  option.label === value.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={editingProduct.unitspr_name}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            {companyData.certificatenum && (
              <Grid item xs={12}>
                <label>Налоговая категория:</label>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                  size="small"
                >
                  <Select
                    fullWidth
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    size="small"
                    value="0"
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
            {editingProduct.detailscaption && editingProduct.detailscaption.length > 0 &&
              <Grid item xs={12}>
                <label>Постоянные характеристики:</label>
                <AddConstAttribute
                  clearBoard={clearBoard}
                  attributes={editingProduct.detailscaption}
                  attributeCode={getAttributeCharCode}
                  isEditing={isEditing}
                />
              </Grid>
            }
            <Grid item xs={12}>
              <label>Партийные характеристики:</label>
              {/* <AddPartAttribute
                isEditing={isEditing}
                clearBoard={clearBoard}
                attributeCode={getAttributeCode}
                capations={capations}
                setAttributes={setAttributes}
                attributes={attributes}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => editProdRes()}
              >
                Сохранить
              </Button>
              <Button
                onClick={closeModal}
                variant="contained"
                style={{ marginLeft: "20px" }}
              >
                Отмена
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
