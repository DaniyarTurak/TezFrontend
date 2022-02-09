import React, { Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";
import CategorySelect from "../../../ReusableComponents/CategorySelect";

export default function IncomeOptions({
  attrval,
  attribute,
  attributes,
  attributeTypes,
  barcode,
  brand,
  brands,
  category,
  changeDate,
  counterparty,
  counterparties,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  grouping,
  handleSearch,
  isLoadingProducts,
  isLoading,
  nds,
  ndses,
  onAttributeChange,
  onAttributeTypeChange,
  onBarcodeChange,
  onBarcodeKeyDown,
  onBrandChange,
  onBrandListInput,
  onCounterpartieChange,
  onCounterpartieListInput,
  onGroupingChange,
  onNdsChange,
  onProductChange,
  onProductListInput,
  onPointChange,
  point,
  points,
  products,
  productSelectValue,
  textAttrval,
  setCategory
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={handleSearch}
          disableButton={isLoading}
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
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговая точка не найдена"
          label="Торговая точка"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={counterparty}
          onChange={onCounterpartieChange}
          options={counterparties}
          onInputChange={onCounterpartieListInput}
          noOptions="Контрагенты не найдены"
          label="Контрагенты"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={brand}
          onChange={onBrandChange}
          options={brands}
          onInputChange={onBrandListInput}
          noOptions="Бренды не найдены"
          label="Бренды"
        />
      </Grid>

      {/* <Grid item xs={3}>
        <AutocompleteSelect
          value={category}
          onChange={onCategoryChange}
          options={categories}
          onInputChange={onCategoryListInput}
          noOptions="Категории не найдены"
          label="Категории"
        />
      </Grid> */}
      <Grid item xs={3}>
        <CategorySelect
          setCategory={setCategory}
          category={category}
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={attribute}
          onChange={onAttributeChange}
          options={attributes}
          noOptions="Тип не найден"
          label="Атрибуты"
          isDisabled={!grouping}
        />
      </Grid>

      {attribute.format === "TEXT" && (
        <Grid item xs={3}>
          <TextField
            value={textAttrval}
            onChange={onAttributeTypeChange}
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
    </Fragment>
  );
}
