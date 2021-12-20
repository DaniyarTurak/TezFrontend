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
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";

export default function EditProduct({
  weightProductDetails,
  sellByPieces,
  companyData,
  errorAlert,
  errorMessage,
  piecesUnint,
  setClear,
  isClear,
  setWeightProductDetails
}) {

  const [editingProduct, setEditingProduct] = useState({});
  const [listAllAttributes, setListAllAttributes] = useState([]);
  const [unitOptions, setUnitOptions] = useState([{ id: 1, name: "Килограмм", label: "Килограмм" }]);
  const [unitspr, setUnitspr] = useState(1);
  const [constAttribCode, setConstAttribCode] = useState(0);
  const [partAttribCode, setPartAttribCode] = useState(0);
  const [attributesValues, setAttributesValues] = useState([]);
  const [detailsValues, setDetailsValues] = useState([]);
  const [isDeleteListCode, setDeleteListCode] = useState(false);
  const [sweetalert, setSweetAlert] = useState(null);
  const [tax, setTax] = useState("");

  useEffect(() => {
    setEditingProduct(weightProductDetails);
    setTax(weightProductDetails.tax)
  }, [weightProductDetails]);


  // const editProdRes = () => {
  //   let tempDetails = [];
  //   if (detailsValues.length > 0) {
  //     detailsValues.forEach(element => {
  //       tempDetails.push({
  //         code: element.attribute_id,
  //         name: element.attribute_name,
  //         value: element.attribute_value
  //       })
  //     });
  //   }
  //   let product = {
  //     id: editingProduct.id,
  //     code: editingProduct.code,
  //     name: editingProduct.name,
  //     category: editingProduct.categoryid,
  //     brand: editingProduct.brandid,
  //     taxid: companyData.certificatenum ? tax : "0",
  //     unitsprid: editingProduct.unitsprid,
  //     piece:
  //       editingProduct.piece === true ? editingProduct.piece : sellByPieces,
  //     pieceinpack: piecesUnint ? piecesUnint : 0,
  //     cnofeacode: editingProduct.cnofeacode,
  //     details: constAttribCode,
  //     attributes: partAttribCode,
  //     delete: "",
  //     detailsValue: tempDetails
  //   };
  //   if (productDetails.id === 0) {
  //     Axios.post("/api/products/create", { product })
  //       .then((res) => {
  //         Alert.success("Товар успешно сохранен", {
  //           position: "top-right",
  //           effect: "bouncyflip",
  //           timeout: 2000,
  //         });
  //         setClear(!isClear);
  //         setEditingProduct({});
  //         setSweetAlert(null);
  //         setProductDetails({})
  //       })
  //       .catch((err) => {
  //         ErrorAlert(err);
  //         console.log(err);
  //       });
  //   }
  //   else {
  //     Axios.post("/api/products/update", {
  //       product,
  //     })
  //       .then((res) => {
  //         Alert.success("Товар успешно сохранен", {
  //           position: "top-right",
  //           effect: "bouncyflip",
  //           timeout: 2000,
  //         });
  //         setClear(!isClear);
  //         setEditingProduct({});
  //         setSweetAlert(null);
  //         setProductDetails({})
  //         setDeleteListCode(!isDeleteListCode);
  //       })
  //       .catch((err) => {
  //         ErrorAlert(err);
  //       });
  //   }
  // };

  const handleDelete = () => {

    Axios.post("/api/pluproducts/delete", {
      id: editingProduct.id
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
          setWeightProductDetails({})
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

  const unitListChange = (e, unitsprChanged) => {
    setUnitspr(unitsprChanged);
  };
  const onUnitListInput = (e, unitspr) => {
    if (unitspr.lenght > 0) setUnitspr(unitspr);
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
              <label>Единица измерения:</label>
              <Autocomplete
                fullWidth
                size="small"
                options={unitOptions}
                value={unitspr}
                onChange={unitListChange}
                noOptionsText="Единица измерения не найдена"
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
                    placeholder="Килограмм"
                  />
                )}
              />
            </Grid>
              <Grid item xs={12}>
                <label>Налоговая категория:</label>
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={tax}
                  onChange={taxChange}
                >
                  <MenuItem value={"Без НДС"}>Без НДС</MenuItem>
                  <MenuItem value={"Стандартный НДС"}>Стандартный НДС</MenuItem>
                </Select>
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
                  setWeightProductDetails({});
                }}
              >
                Отмена
              </button>
              &emsp;
              <button className="btn btn-success"
                onClick={() => console.log("saved")}
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
