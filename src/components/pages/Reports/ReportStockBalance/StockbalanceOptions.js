import React, { Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";
import SingleMaterialDate from "../../../ReusableComponents/SingleMaterialDate";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function StockbalanceOptions({
  attrval,
  attribute,
  attributes,
  attributeTypes,
  barcode,
  brand,
  brands,
  category,
  categories,
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
  onCounterpartieChange,
  onCounterpartieListInput,
  onBrandChange,
  onBrandListInput,
  onCategoryChange,
  onCategoryListInput,
  onAttributeChange,
  productSelectValue,
  products,
  selectedStock,
  stockList,
  handleCounterpartyChange,
  handleCounterpartyInputChange,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <SingleMaterialDate value={date} onChange={onDateChange} label="Дата" />
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
              Разбить по партийным характеристиками (Например: по цвету, размеру и т.д.)
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
