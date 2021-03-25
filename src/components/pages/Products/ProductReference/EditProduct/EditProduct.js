import React, { useState } from "react";
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
import { Fragment } from "react";

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
  // onPieceAmountChange,
  // sellByPieces,
  // onSellByPiecesChange,
  onProductNameChange,
  editProd,
  closeModal,
  tax,
  onTaxChange,
  taxes,
  companyData,
  errorAlert,
}) {
  const classes = useStyles();
  const [editingName, setEditingName] = useState(true);
  const [categoryName, setCategoryName] = useState(true);
  const [editingBrandName, setEditingBrandName] = useState(true);
  const [editingUnit, setEditingUnit] = useState(true);
  const [editingTax, setEditingTax] = useState(true);

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead className={classes.head} align="left">
            <CardHeader
              avatar={<ListAltSharpIcon fontSize="large" />}
              title="Карточка товара"
            />
            <TableCell className={classes.head} align="left"></TableCell>
            <TableCell className={classes.head} align="left"></TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Штрих код:</TableCell>
              <TableCell align="left">
                <Typography variant="h7">{productDetails.code} </Typography>
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Наименование:</TableCell>
              <TableCell className={classes.textField}>
                {editingName && (
                  <Typography variant="h7" align="left">
                    {productDetails.name}
                  </Typography>
                )}
                {!editingName && (
                  <TextField
                    fullWidth
                    className={classes.textField}
                    align="left"
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
              <TableCell align="left">
                <IconButton
                  aria-label="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingName(false);
                  }}
                >
                  <EditIcon aria-label="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Категория:</TableCell>
              <TableCell>
                {categoryName && (
                  <Typography variant="h7" align="left">
                    {productDetails.category}
                  </Typography>
                )}
                {!categoryName && (
                  <Autocomplete
                    align="left"
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
              <TableCell align="left">
                <IconButton
                  aria-label="редактировать"
                  component="span"
                  onClick={() => {
                    setCategoryName(false);
                  }}
                >
                  <EditRoundedIcon aria-label="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Бренд:</TableCell>
              <TableCell>
                {editingBrandName && (
                  <Typography variant="h7" align="left">
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
              <TableCell align="left">
                <IconButton
                  aria-label="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingBrandName(false);
                  }}
                >
                  <EditRoundedIcon aria-label="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Единица измерения:</TableCell>
              <TableCell>
                {editingUnit && (
                  <Typography variant="h7" align="left">
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
              <TableCell align="left">
                <IconButton
                  aria-label="редактировать"
                  component="span"
                  onClick={() => {
                    setEditingUnit(false);
                  }}
                >
                  <EditRoundedIcon aria-label="edit" />
                </IconButton>
              </TableCell>
            </TableRow>
            {companyData.certificatenum && (
              <TableRow>
                <TableCell>Налоговая категория</TableCell>
                <TableCell>
                  {editingTax && (
                    <Typography variant="h7" align="left">
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
                <TableCell align="left">
                  <IconButton
                    aria-label="редактировать"
                    component="span"
                    onClick={() => {
                      setEditingTax(false);
                    }}
                  >
                    <EditRoundedIcon aria-label="edit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => editProd()}
                    >
                      Сохранить
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      align="right"
                      onClick={closeModal}
                      variant="contained"
                    >
                      Отмена
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
