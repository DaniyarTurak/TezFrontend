import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import AlertMaterial from "@material-ui/lab/Alert";
import Alert from "react-s-alert";
import AddConstAttribute from "./AddConstAttribute";
import AddPartAttribute from "./AddPartAttribute";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import { ConstantLine } from "../../../../../../node_modules/devextreme-react/chart";

export default function EditProduct({
  productDetails,
  brandOptions,
  onBrandListInput,
  onCategoryListInput,
  categoryOptions,
  setUnitOptions,
  onUnitListInput,
  sellByPieces,
  companyData,
  errorAlert,
  errorMessage,
  piecesUnint,
  setClear,
  isClear,
  setProductDetails
}) {

  const [editingProduct, setEditingProduct] = useState({});
  const [listAllAttributes, setListAllAttributes] = useState([]);

  const [constAttribCode, setConstAttribCode] = useState(0);
  const [partAttribCode, setPartAttribCode] = useState(0);
  const [attributesValues, setAttributesValues] = useState([]);
  const [detailsValues, setDetailsValues] = useState([]);
  const [isDeleteListCode, setDeleteListCode] = useState(false);
  const [sweetalert, setSweetAlert] = useState(null);
  const [tax, setTax] = useState("0");

  const getAttributes = () => {
    Axios.get("/api/attributes")
      .then((res) => res.data)
      .then((attributes) => {
        setListAllAttributes(attributes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setEditingProduct(productDetails);
    setTax(productDetails.taxid)
  }, [productDetails]);

  useEffect(() => {
    getAttributes();
  }, []);

  const editProdRes = () => {
    let tempAttributes = [];
    let tempDetails = [];
    if (detailsValues.length > 0) {
      detailsValues.forEach(element => {
        tempDetails.push({
          code: element.attribute_id,
          name: element.attribute_name,
          value: element.attribute_value
        })
      });
    }

    if (attributesValues.length > 0) {
      attributesValues.forEach(element => {
        tempAttributes.push({
          code: element.attribute_id,
          name: element.attribute_name,
          value: element.attribute_format === "DATE" ? Moment().format("YYYY-MM-DD") : ""
        })
      });
    }
    let product = {
      id: editingProduct.id,
      code: editingProduct.code,
      name: editingProduct.name,
      category: editingProduct.categoryid,
      brand: editingProduct.brandid,
      taxid: companyData.certificatenum ? tax : "0",
      unitsprid: editingProduct.unitsprid,
      piece:
        editingProduct.piece === true ? editingProduct.piece : sellByPieces,
      pieceinpack: piecesUnint ? piecesUnint : 0,
      cnofeacode: editingProduct.cnofeacode,
      details: constAttribCode,
      attributes: partAttribCode,
      delete: "",
      attributesValue: tempAttributes,
      detailsValue: tempDetails
    };
    if (productDetails.id === 0) {
      Axios.post("/api/products/create", { product })
        .then((res) => {
          Alert.success("Товар успешно сохранен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          setClear(!isClear);
          setEditingProduct({});
          setSweetAlert(null);
          setProductDetails({})
        })
        .catch((err) => {
          ErrorAlert(err);
          console.log(err);
        });
    }
    else {
      Axios.post("/api/products/update", {
        product,
      })
        .then((res) => {
          Alert.success("Товар успешно сохранен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          setClear(!isClear);
          setEditingProduct({});
          setSweetAlert(null);
          setProductDetails({})
          setDeleteListCode(!isDeleteListCode);
        })
        .catch((err) => {
          ErrorAlert(err);
        });
    }
  };

  const handleDelete = () => {
    const product = {
      id: editingProduct.id,
      delete: "true",
    };
    Axios.post("/api/products/update", {
      product,
    })
      .then((res) => res.data)
      .then((res) => {
        if (res.code === "success") {
          Alert.success("Товар успешно удален.", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          setClear(!isClear);
          setEditingProduct({});
          setSweetAlert(null);
          setProductDetails({})
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
  };

  const handleDeleteProduct = () => {
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
        onConfirm={handleDelete}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить товар?
      </SweetAlert>
    );
  };

  const categoryChange = (value) => {
    if (value) {
      setEditingProduct({ ...editingProduct, category: value.name, categoryid: value.id })
    };
  };

  const brandChange = (value) => {
    if (value) {
      setEditingProduct({ ...editingProduct, brand: value.name, brandid: value.id })
    };
  };

  const unitSprChange = (value) => {
    if (value) {
      setEditingProduct({ ...editingProduct, unitspr_name: value.name, unitsprid: value.id })
    };
  };

  const taxChange = (e) => {
    setTax(e.target.value);
    setEditingProduct({ ...editingProduct, taxid: e.target.value })
  };

  const deleteListCode = (listcode) => {
    Axios.post("/api/attributes/delete/listcode", {
      listcode,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  }

  return (
    <Fragment>
      {sweetalert}
      {errorAlert && (
        <AlertMaterial severity="error">
          {errorMessage.response && errorMessage.response.data.text}
        </AlertMaterial>
      )}
      <Paper style={{ backgroundColor: "#17a2b8" }}>
        <Grid container>
          <Grid item xs={1} >
            <div style={{ paddingTop: "5px", paddingLeft: "5px", color: "white" }}><ListAltSharpIcon fontSize="large" /></div>
          </Grid>
          <Grid item xs={10}>
            <div style={{ paddingTop: "12px", color: "white" }}>Карточка товара</div>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              fontSize="large"
              onClick={() => handleDeleteProduct()}>
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
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={tax}
                  onChange={taxChange}
                >
                  <MenuItem value={"0"}>Без НДС</MenuItem>
                  <MenuItem value={"1"}>Стандартный НДС</MenuItem>
                </Select>
              </Grid>
            )}
            <Grid item xs={12}>
              <label><strong>Постоянные характеристики:</strong></label>
              <AddConstAttribute
                productAttributes={editingProduct.detailscaption}
                listAllAttributes={listAllAttributes}
                setConstAttribCode={setConstAttribCode}
                setDetailsValues={setDetailsValues}
                deleteListCode={deleteListCode}
                isDeleteListCode={isDeleteListCode}
              />
            </Grid>
            <Grid item xs={12}>
              <label><strong>Партийные характеристики:</strong></label>
              <AddPartAttribute
                productAttributes={editingProduct.attributescaption}
                listAllAttributes={listAllAttributes}
                setPartAttribCode={setPartAttribCode}
                setAttributesValues={setAttributesValues}
                deleteListCode={deleteListCode}
                isDeleteListCode={isDeleteListCode}
              />
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
                onClick={() => {
                  setClear(!isClear);
                  setProductDetails({});
                }}
              >
                Отмена
              </button>
              &emsp;
              <button className="btn btn-success"
                onClick={() => editProdRes()}
              >
                Сохранить
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
