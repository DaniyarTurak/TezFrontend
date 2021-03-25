import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";

export default function InvoiceOptions({
  changeDate,
  consignator,
  consignators,
  counterparty,
  counterparties,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  handleInvoiceTypeChange,
  handleStockFromChange,
  handleStockToChange,
  handleCounterpartyChange,
  handleConsignatorChange,
  handleSearch,
  invoicetype,
  invoicetypes,
  stockList,
  stockTo,
  stockFrom,
  barcode,
  onBarcodeChange,
  onBarcodeKeyDown,
  productSelectValue,
  onProductChange,
  onProductListInput,
  products,
  isLoadingProducts,
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
          value={invoicetype}
          onChange={handleInvoiceTypeChange}
          options={invoicetypes}
          noOptions="Накладные не найдены"
          label="Тип накладной"
        />
      </Grid>

      {(invoicetype.value === "1" || invoicetype.value === "7") && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={stockFrom}
            onChange={handleStockFromChange}
            options={stockList}
            noOptions="Склад не найден"
            label="Со склада"
          />
        </Grid>
      )}

      {(invoicetype.value === "1" || invoicetype.value === "2") && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={stockTo}
            onChange={handleStockToChange}
            options={stockList}
            noOptions="Склад не найден"
            label="На склад"
          />
        </Grid>
      )}

      {invoicetype.value === "2" && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={counterparty}
            onChange={handleCounterpartyChange}
            options={counterparties}
            noOptions="Контрагент не найден"
            label="Контрагент"
          />
        </Grid>
      )}

      {(invoicetype.value === "16" || invoicetype.value === "17") && (
        <Grid item xs={3}>
          <AutocompleteSelect
            value={consignator}
            onChange={handleConsignatorChange}
            options={consignators}
            noOptions="Консигнатор не найден"
            label="Консигнаторы"
          />
        </Grid>
      )}
    </Fragment>
  );
}
