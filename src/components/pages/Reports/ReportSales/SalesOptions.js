import React, { Fragment } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CategorySelect from "../../../ReusableComponents/CategorySelect";

export default function SalesOptions({
  attrval,
  textAttrval,
  attribute,
  attributes,
  attributeTypes,
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
  isSubmitting,
  onPointChange,
  onCounterpartieChange,
  onCounterpartieListInput,
  onBrandChange,
  onBrandListInput,
  onTypeChange,
  onAttributeChange,
  onAttributeTypeChange,
  onGroupingChange,
  point,
  points,
  type,
  types,
  barcode,
  barcodeChange,
  name,
  setName,
  nameChange,
  products,
  setBarcode,
  withoutDate,
  onWithoutDateChange,
  clientType,
  setClientType,
  sellType,
  setSellType,
  clientTypes,
  sellTypes,
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
          disableButton={isSubmitting}
          maxDate={moment(dateFrom).add(1, "M")}
          invisibleButton={false}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          freeSolo
          value={barcode}
          noOptionsText="Товар не найден"
          onChange={(e, value) => barcodeChange(value)}
          onInputChange={(event, value) => setBarcode(value)}
          options={products.map((option) => option.code)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Штрих-код" variant="outlined" />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          value={name}
          noOptionsText="Товар не найден"
          onChange={(e, value) => nameChange(value)}
          onInputChange={(event, value) => setName(value)}
          options={products.map((option) => option.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Наименование товара"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          onChange={onPointChange}
          options={points}
          noOptions="Торговые точки не найдены"
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
      
      <Grid item xs={12}>
        <CategorySelect setCategory={setCategory} category={category} />
      </Grid>


      <Grid item xs={3}>
        <AutocompleteSelect
          value={type}
          onChange={onTypeChange}
          options={types}
          noOptions="Тип не найден"
          label="Тип транзакции"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={clientType}
          onChange={(e, value) => setClientType(value)}
          options={clientTypes}
          noOptions="Тип не найден"
          label="Тип клиента"
        />
      </Grid>

      <Grid item xs={3}>
        <AutocompleteSelect
          value={sellType}
          onChange={(e, value) => setSellType(value)}
          options={sellTypes}
          noOptions="Тип не найден"
          label="Тип продажи"
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
              checked={withoutDate}
              onChange={onWithoutDateChange}
              name="grouping"
              style={{ color: "#17a2b8" }}
            />
          }
          label={
            <span style={{ fontSize: ".875rem" }}>
              Поиск с группировкой по товару
            </span>
          }
        />
      </Grid>

      {/* <Grid item xs={3}>
        <CategorySelect onCategoryChange={onCategoryChange} setCategory={setCategory} />
      </Grid> */}

    </Fragment>
  );
}
