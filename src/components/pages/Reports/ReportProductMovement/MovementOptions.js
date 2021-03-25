import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";

export default function MovementOptions({
  changeDate,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  handleSearch,
  selectedPoint,
  onPointChange,
  points,
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
      <Grid item xs={4}>
        <AutocompleteSelect
          value={selectedPoint}
          onChange={onPointChange}
          options={points}
          noOptions="Торговая точка не найдена"
          label="Торговая точка"
        />
      </Grid>
    </Fragment>
  );
}
