import React, { Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";
import SingleMaterialDate from "../../../ReusableComponents/SingleMaterialDate";
import Moment from "moment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ruLocale from "date-fns/locale/ru";
import ClearIcon from "@material-ui/icons/Clear";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import IconButton from "@material-ui/core/IconButton";

export default function SaledProductsOptions({
  barcode,
  counterparty,
  counterparties,
  handleCounterpartyChange,
  handleCounterpartyInputChange,
  products,
  productSelectValue,
  selectedStock,
  stockList,
  onBarcodeChange,
  onBarcodeKeyDown,
  onProductChange,
  onProductListInput,
  onStockChange,
}) {
  return (
    <Fragment>
      <AutocompleteProductBarcode
        barcode={barcode}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        productSelectValue={productSelectValue}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        products={products}
        //isLoadingProducts={isLoadingProducts}
      />

      <Grid item xs={3}>
        <AutocompleteSelect
          value={selectedStock}
          onChange={onStockChange}
          options={stockList}
          noOptions="Склад не найден"
          label="Склад"
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={counterparty}
          options={counterparties}
          onChange={handleCounterpartyChange}
          onInputChange={handleCounterpartyInputChange}
          noOptions="Контрагент не найден"
          label="Контрагенты"
        />
      </Grid>

      {/* <Grid item xs={3}>
        <AutocompleteSelect
          value={brand}
          onChange={onBrandChange}
          options={brands}
          onInputChange={onBrandListInput}
          noOptions="Бренд не найден"
          label="Бренды"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={category}
          onChange={onCategoryChange}
          options={categories}
          onInputChange={onCategoryListInput}
          noOptions="Категория не найдена"
          label="Категории"
        />
      </Grid>

      <Grid item xs={3}>
        <Button
          style={{
            minHeight: "3.5rem",
            fontSize: ".875rem",
            textTransform: "none",
          }}
          variant="outlined"
          color="primary"
          fullWidth
          disabled={isLoading}
          size="large"
          onClick={handleSearch}
        >
          Поиск
        </Button>
      </Grid>  */}
    </Fragment>
  );
}
