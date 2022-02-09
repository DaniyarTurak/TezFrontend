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
import CategorySelect from "../../../ReusableComponents/CategorySelect";

export default function StockbalanceOptions({
  attrval,
  attribute,
  attributes,
  attributeTypes,
  barcode,
  brand,
  brands,
  category,
  consignment,
  counterparty,
  counterparties,
  date,
  grouping,
  handleSearch,
  isLoading,
  isLoadingProducts,
  nds,
  ndses,
  onAttributeTypeChange,
  onBarcodeChange,
  onBarcodeKeyDown,
  onConsignmentChange,
  onDateChange,
  onGroupingChange,
  onNdsChange,
  onProductChange,
  onProductListInput,
  onStockChange,
  onAttributeTextFieldChange,
  onBrandChange,
  onBrandListInput,
  onAttributeChange,
  productSelectValue,
  products,
  selectedStock,
  stockList,
  handleCounterpartyChange,
  handleCounterpartyInputChange,
  dateAttrval,
  setDateAttrval,
  setCategory
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <SingleMaterialDate
          value={date}
          onChange={onDateChange}
          label="Дата"
          margin={"normal"}
        />
      </Grid>
      <AutocompleteProductBarcode
        barcode={barcode}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        productSelectValue={productSelectValue}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        products={products}
        isLoadingProducts={isLoadingProducts}
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

      <Grid item xs={3}>
        <AutocompleteSelect
          value={brand}
          onChange={onBrandChange}
          options={brands}
          onInputChange={onBrandListInput}
          noOptions="Бренд не найден"
          label="Бренды"
        />
      </Grid>
      {/* 
      <Grid item xs={3}>
        <AutocompleteSelect
          value={category}
          onChange={onCategoryChange}
          options={categories}
          onInputChange={onCategoryListInput}
          noOptions="Категория не найдена"
          label="Категории"
        />
      </Grid> */}

      <Grid item xs={3}>
        <CategorySelect setCategory={setCategory} category={category} />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={attribute}
          onChange={onAttributeChange}
          options={attributes}
          isDisabled={!grouping}
          noOptions="Атрибут не найден"
          label="Атрибуты"
        />
      </Grid>

      {attribute.format === "TEXT" && (
        <Grid item xs={3}>
          <TextField
            value={attrval}
            onChange={onAttributeTextFieldChange}
            disabled={!grouping}
            label="Значение Атрибута"
          />
        </Grid>
      )}

      {attribute.format === "SPR" && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={attrval}
            onChange={onAttributeTypeChange}
            options={attributeTypes}
            isDisabled={!grouping}
            noOptions="Атрибут не найден"
            label="Значение Атрибута"
          />
        </Grid>
      )}
      {attribute.format === "DATE" && (
        <Grid item xs={3}>
          {/* <SingleMaterialDate
            value={dateAttrval} onChange={onAttributeDateChange} label="Дата"
          /> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <KeyboardDatePicker
              label={"Выберите дату"}
              value={dateAttrval}
              renderInput={(params) => <TextField {...params} />}
              onChange={(newValue) => {
                setDateAttrval(Moment(newValue).format("YYYY-MM-DD"));
              }}
              disableToolbar
              autoOk
              variant="inline"
              format="dd.MM.yyyy"
              InputProps={
                dateAttrval && {
                  startAdornment: (
                    <IconButton
                      onClick={() => {
                        setDateAttrval(null);
                      }}
                      disabled={!dateAttrval}
                      style={{ order: 1 }}
                    >
                      <ClearIcon color="disabled" fontSize="small" />
                    </IconButton>
                  ),
                }
              }
            />
          </MuiPickersUtilsProvider>
        </Grid>
      )}
      <Grid item xs={3}>
        <AutocompleteSelect
          value={nds}
          onChange={onNdsChange}
          options={ndses}
          noOptions="НДС не найден"
          label="НДС"
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={grouping}
              onChange={onGroupingChange}
              name="grouping"
              style={{ color: "#17a2b8" }}
            />
          }
          label={
            <span style={{ fontSize: ".875rem" }}>
              Разбить по партийным характеристиками (Например: по цвету, размеру
              и т.д.)
            </span>
          }
        />
      </Grid>

      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={consignment}
              onChange={onConsignmentChange}
              name="grouping"
              style={{ color: "#17a2b8" }}
            />
          }
          label={
            <span style={{ fontSize: ".875rem" }}>
              Включая товары, находящиеся на консигнации
            </span>
          }
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
      </Grid>
    </Fragment>
  );
}
