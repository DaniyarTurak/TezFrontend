import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../../ReusableComponents/AutocompleteSelect";
import AutocompleteProductBarcode from "../../../../ReusableComponents/AutocompleteProductBarcode";
import CategorySelect from "../../../../ReusableComponents/CategorySelect";
import Button from "@material-ui/core/Button";

export default function SaledProductsOptions({
  barcode,
  brand,
  brands,
  category,
  counterparty,
  counterparties,
  products,
  productSelectValue,
  handleSearch,
  handleCounterpartyChange,
  handleCounterpartyInputChange,
  selectedStock,
  setCategory,
  stockList,
  onBarcodeChange,
  onBarcodeKeyDown,
  onBrandChange,
  onBrandListInput,
  onCounterpartieChange,
  onCounterpartieListInput,
  onProductChange,
  onProductListInput,
  onStockChange,
  isLoading,
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
          onChange={handleCounterpartyChange}
          options={counterparties}
          onInputChange={handleCounterpartyInputChange}
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

      {/* <Grid item xs={3}>
        <AutocompleteSelect
          value={category}
          onChange={onCategoryChange}
          options={categories}
          onInputChange={onCategoryListInput}
          noOptions="Категория не найдена"
          label="Категории"
        />
      </Grid> */}

      <Grid item xs={12}>
        <CategorySelect setCategory={setCategory} category={category} />
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
          size="large"
          onClick={handleSearch}
          disabled={isLoading}
        >
          Поиск
        </Button>
      </Grid>
    </Fragment>
  );
}
