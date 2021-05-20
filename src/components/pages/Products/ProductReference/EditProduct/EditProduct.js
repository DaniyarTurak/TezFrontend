import React, { useState, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import TableBody from "@material-ui/core/TableBody";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import FormControl from "@material-ui/core/FormControl";
import CardHeader from "@material-ui/core/CardHeader";
import ListAltSharpIcon from "@material-ui/icons/ListAltSharp";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import TableFooter from "@material-ui/core/TableFooter";
import AlertMaterial from "@material-ui/lab/Alert";
import Alert from "react-s-alert";
import AddAttributeChar from "../AddAttributeChar";
import AddAttribute from "../AddAttribute";

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
  productName,
  productDetails,
  brand,
  brandOptions,
  onBrandListInput,
  brandListChange,
  onCategoryListInput,
  category,
  categoryChange,
  categoryOptions,
  unitspr,
  setUnitOptions,
  unitListChange,
  onUnitListInput,
  cnofeacode,
  onCnofeacodeEdit,
  // onPieceAmountChange,
  sellByPieces,
  // onSellByPiecesChange,
  onProductNameChange,
  closeModal,
  onTaxChange,
  taxes,
  companyData,
  errorAlert,
  errorMessage,
  tax,
  piecesUnint,
  setErrorAlert,
  setReference,
  getBarcodeProps,
  setErrorMessage,
}) {
  const classes = useStyles();
  const [editingName, setEditingName] = useState(true);
  const [categoryName, setCategoryName] = useState(true);
  const [editingBrandName, setEditingBrandName] = useState(true);
  const [editingUnit, setEditingUnit] = useState(true);
  const [editingTax, setEditingTax] = useState(true);
  const [editingAttrGlob, setEditingAttrGlob] = useState(true);
  const [editingAttr, setEditingAttr] = useState(true);
  const [editCnofeacode, setEditCnofeacode] = useState(true);
  const [selectedAttribute] = useState([]);
  const [attributeCode, setAttributeCode] = useState("");
  const [attributeGlobCode, setAttributeGlobCode] = useState("");
  const [editProductAttr] = useState("");
  const [clearBoard, setClearBoard] = useState(false);

  const getAttributeCharCode = (attributeCodeChanged) => {
    setAttributeGlobCode(attributeCodeChanged);
  };

  const getAttributeCode = (attributeCodeChanged) => {
    setAttributeCode(attributeCodeChanged);
  };

  const editProdRes = () => {
    let product = {
      id: productDetails.id,
      name: productName,
      category: category.id,
      brand: brand.id,
      taxid: companyData.certificatenum ? tax.value : "0",
      unitsprid: unitspr.id,
      piece: sellByPieces,
      pieceinpack: piecesUnint,
      cnofeacode: cnofeacode,
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
    };
    Axios.post("/api/products/update", {
      product,
    })
      .then((res) => {
        setErrorAlert(false);
        setReference([]);
        getBarcodeProps(productDetails.code);
        closeModal(false);
        setClearBoard(res.code);
        Alert.success("Товар успешно сохранен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        setErrorAlert(true);
        setErrorMessage(err);
      });
  };

  return (
    <Fragment>
      <TableContainer component={Paper}>
        {errorAlert && (
          <AlertMaterial severity="error">
            {errorMessage.response && errorMessage.response.data.text}
          </AlertMaterial>
        )}
        <Table className={classes.table} ariaLabel="customized table">
          <TableHead className={classes.head} alingItem="left">
            <CardHeader
              avatar={<ListAltSharpIcon fontSize="large" />}
              title="Карточка товара"
            />
            <TableCell className={classes.head} alingItem="left"></TableCell>
            <TableCell className={classes.head} alingItem="left"></TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Штрих код:</TableCell>
              <TableCell alingItem="left">
                <Typography variant="h7">{productDetails.code} </Typography>
              </TableCell>
              <TableCell alingItem="left"></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Наименование:</TableCell>
              <TableCell className={classes.textField}>
                {editingName && (
                  <Typography variant="h7" alingItem="left">
                    {productDetails.name}
                  </Typography>
                )}
                {!editingName && (
                  <TextField
                    fullWidth
                    className={classes.textField}
                    alingItem="left"
                    id="outlined-full-width"
                    size="small"
                    required
                    label="Наименование товара"
                    variant="outlined"
                    type="text"
                    value={productName}
                    defaultValue={productDetails.name}
                    onChange={onProductNameChange}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingName(false);
                  }}
                >
                  <EditIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Категория:</TableCell>
              <TableCell>
                {categoryName && (
                  <Typography variant="h7" alingItem="left">
                    {productDetails.category}
                  </Typography>
                )}
                {!categoryName && (
                  <Autocomplete
                    alingItem="left"
                    fullWidth
                    size="small"
                    options={categoryOptions}
                    value={category}
                    defaultValue={category}
                    onChange={categoryChange}
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
                        label={productDetails.category}
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setCategoryName(false);
                  }}
                >
                  <EditRoundedIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Бренд:</TableCell>
              <TableCell>
                {editingBrandName && (
                  <Typography variant="h7" alingItem="left">
                    {productDetails.brand}
                  </Typography>
                )}
                {!editingBrandName && (
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={brandOptions}
                    value={brand}
                    onChange={brandListChange}
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
                        label={productDetails.brand}
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingBrandName(false);
                  }}
                >
                  <EditRoundedIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Код ТН ВЭД:</TableCell>
              <TableCell className={classes.textField}>
                {editCnofeacode && (
                  <Typography variant="h7" alingItem="left">
                    {!productDetails.cnofeacode
                      ? "Н/Д"
                      : productDetails.cnofeacode}
                  </Typography>
                )}
                {!editCnofeacode && (
                  <TextField
                    fullWidth
                    className={classes.textField}
                    alingItem="left"
                    id="outlined-full-width"
                    size="small"
                    required
                    variant="outlined"
                    type="number"
                    value={cnofeacode}
                    defaultValue={productDetails.cnofeacode}
                    onChange={onCnofeacodeEdit}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditCnofeacode(false);
                  }}
                >
                  <EditIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Единица измерения:</TableCell>
              <TableCell>
                {editingUnit && (
                  <Typography variant="h7" alingItem="left">
                    {productDetails.unitspr_name}
                  </Typography>
                )}
                {!editingUnit && (
                  <Autocomplete
                    size="small"
                    options={setUnitOptions}
                    value={unitspr}
                    onChange={unitListChange}
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
                        label={productDetails.unitspr_name}
                        variant="outlined"
                      />
                    )}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingUnit(false);
                  }}
                >
                  <EditRoundedIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            {companyData.certificatenum && (
              <TableRow>
                <TableCell>Налоговая категория</TableCell>
                <TableCell>
                  {editingTax && (
                    <Typography variant="h7" alingItem="left">
                      {productDetails.taxid === "0"
                        ? "Без НДС"
                        : "Стандартный НДС"}
                    </Typography>
                  )}
                  {!editingTax && (
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
                  )}
                </TableCell>
                <TableCell alingItem="left">
                  <IconButton
                    ariaLabel="редактировать"
                    component="span"
                    onClick={() => {
                      setEditingTax(false);
                    }}
                  >
                    <EditRoundedIcon ariaLabel="edit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Постоянные характеристики:</TableCell>
              <TableCell>
                {editingAttrGlob && (
                  <Typography variant="h7" alingItem="left">
                    {productDetails.detailscaption}
                  </Typography>
                )}
                {!editingAttrGlob && (
                  <AddAttributeChar
                    isEditing={isEditing}
                    selected={selectedAttribute}
                    clearBoard={clearBoard}
                    attributeCode={getAttributeCharCode}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingAttrGlob(false);
                  }}
                >
                  <EditRoundedIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Партийные характеристики:</TableCell>
              <TableCell>
                {editingAttr &&
                  productDetails.attributescaption.map((element) => {
                    return (
                      <Typography variant="h7" alingItem="left">
                        {element.attribute_name},
                      </Typography>
                    );
                  })}
                {!editingAttr && (
                  <AddAttribute
                    isEditing={isEditing}
                    selected={selectedAttribute}
                    clearBoard={clearBoard}
                    attributeCode={getAttributeCode}
                  />
                )}
              </TableCell>
              <TableCell alingItem="left">
                <IconButton
                  ariaLabel="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingAttr(false);
                  }}
                >
                  <EditRoundedIcon ariaLabel="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => editProdRes()}
                    >
                      Сохранить
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      alingItem="right"
                      onClick={closeModal}
                      variant="contained"
                    >
                      Отмена
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableCell>
              <TableCell alingItem="left"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
