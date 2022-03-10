import React, { Fragment } from "react";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";
import AutocompleteSelect from "../../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../../ReusableComponents/AutocompleteProductBarcode";
import CategorySelect from "../../../../ReusableComponents/CategorySelect";

import moment from "moment";
import Grid from "@material-ui/core/Grid";

const SimpleSalesOptions = ({
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
  counterparty,
  counterparties,
  productSelectValue,
  setCategory,
  selectedStock,
  stockList,
  products,
  onBarcodeChange,
  onBarcodeKeyDown,
  onBrandChange,
  onBrandListInput,
  onCounterpartieChange,
  onCounterpartieListInput,
  onProductChange,
  onProductListInput,
  onStockChange,
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
          maxDate={moment(dateFrom).add(1, "M")}
          maxDateMessage={"Период можно задавать не более 1 месяца"}
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

      <Grid item xs={4}>
        <AutocompleteSelect
          value={selectedStock}
          onChange={onStockChange}
          options={stockList}
          noOptions="Склад не найден"
          label="Склад"
        />
      </Grid>
      <Grid item xs={4}>
        <AutocompleteSelect
          value={counterparty}
          onChange={onCounterpartieChange}
          options={counterparties}
          onInputChange={onCounterpartieListInput}
          noOptions="Контрагенты не найдены"
          label="Контрагенты"
        />
      </Grid>
      <Grid item xs={4}>
        <AutocompleteSelect
          value={brand}
          onChange={onBrandChange}
          options={brands}
          onInputChange={onBrandListInput}
          noOptions="Бренд не найден"
          label="Бренды"
        />
      </Grid>

      <Grid item xs={12}>
        <CategorySelect setCategory={setCategory} category={category} />
      </Grid>
    </Fragment>
  );
};

export default SimpleSalesOptions;
