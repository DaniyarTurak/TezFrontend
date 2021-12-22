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
  setWeightProductDetails
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


  const editWeightProdRes = () => {
    console.log("")
  }

  const handleDeleteProduct = () => {
    console.log("")
  }

  const taxChange = () => {
    console.log("")
  }
  return (
    <Fragment>
        hello
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
                onClick={() => editWeightProdRes()}
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
