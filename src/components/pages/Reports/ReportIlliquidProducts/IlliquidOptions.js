import React, { Fragment } from "react";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../ReusableComponents/AutocompleteProductBarcode";
import CategorySelect from "../../../ReusableComponents/CategorySelect";

import moment from "moment";
import Grid from "@material-ui/core/Grid";

const IlliquidOptions = ({
  changeDate,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  handleSearch,
  isLoading,

  barcode,
  brand,
  brands,
  category,
  productSelectValue,
  setCategory,
  products,
  onBarcodeChange,
  onBarcodeKeyDown,
  onBrandChange,
  onBrandListInput,
  onProductChange,
  onProductListInput,
}) => {
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
          maxDate={moment(dateFrom).add(3, "M")}
          maxDateMessage={"Период можно задавать не более 3 месяца"}
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
        //isLoadingProducts={isLoadingProducts}
      />

      <Grid item xs={12}>
        <CategorySelect setCategory={setCategory} category={category} />
      </Grid>
    </Fragment>
  );
};

export default IlliquidOptions;
