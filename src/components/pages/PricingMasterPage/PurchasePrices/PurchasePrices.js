
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import PurchasePricesList from "./PurchasePricesList"
import PurchasePriceAdd from "./PurchasePriceAdd";
import Axios from "axios";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import CustomAutocomplete from "../../../ReusableComponents/CustomAutocomplete";
import Autocomplete from "@material-ui/lab/Autocomplete";


export default function PurchasePrices() {

  const [counterparty, setCounterparty] = useState(null);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [prodName, setProdName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [counterparties, setCounterparties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [object, setObject] = useState(0);
  const [isSearched, setSearched] = useState(false);
  const [isWholesale, setWholeSale] = useState(false);
  const [byCounterparty, setByCounterparty] = useState(false);

  const objects = [
    { value: 0, label: "Все товары" },
    { value: 1, label: "Контрагент" },
    { value: 2, label: "Бренд" },
    { value: 3, label: "Категория" }
  ]

  useEffect(() => {
    setWholeSale(JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale ? JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale : false);
    getCategories();
    getBrands();
    getCounterparties();
  }, []);

  useEffect(() => {
    console.log(barcode);
    if (barcode === null) {
      getPrices();
    }
  }, [barcode])

  useEffect(() => {
    console.log(prodName);
    if (prodName === null) {
      getPrices();
    }
  }, [prodName])

  const getBrands = (e) => {
    Axios.get("/api/brand/search", {
      params: { deleted: false, brand: e ? e : "" },
    })
      .then((res) => res.data)
      .then((list) => {
        let temp = [];
        list.forEach(br => {
          temp.push({ label: br.brand, value: br.id })
        });
        temp.unshift({ label: "Без бренда", value: 0 });
        setBrands(temp);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCategories = (c) => {
    Axios.get("/api/categories/margin", {
      params: { category: c },
    })
      .then((res) => res.data)
      .then((list) => {
        const categoriesList = list.map((result) => {
          return {
            ...result,
            label: result.name,
            value: result.id,
          };
        });
        setCategories([...categoriesList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCounterparties = () => {
    Axios.get("/api/counterparties")
      .then((res) => res.data)
      .then((counterparties) => {
        let temp = [];
        counterparties.forEach(ct => {
          temp.push({ label: ct.name + " | " + ct.bin, value: ct.id })
        });
        setCounterparties(temp);
      })
      .catch((err) => console.log(err));
  };

  const getPrices = () => {
    setLoading(true);
    let path = "";
    if (object === 1) {
      path = "/api/prices/listbycounterparty";
      setByCounterparty(true);
    }
    else {
      path = "/api/prices/list";
      setByCounterparty(false);
    }

    Axios.get(path, {
      params:
      {
        barcode: barcode && barcode !== "" ? barcode : null,
        prodName: prodName && prodName !== "" ? prodName : null,
        object,
        object_id: object === 1 ? counterparty.value :
          object === 2 ? brand.value : object === 3 ? category.value : null
      }
    })
      .then((res) => res.data)
      .then((prices) => {
        let temp = [];
        if (prices.length > 0) {
          prices.forEach((el, idx) => {
            temp.push({
              ...el,
              num: idx + 1,
              purchase_price: el.purchase_price ? el.purchase_price : "",
              sell_price: el.sell_price ? el.sell_price : "",
              wholesale_price: el.wholesale_price ? el.wholesale_price : "",
              temp_purchase_price: el.purchase_price ? el.purchase_price : "",
              temp_sell_price: el.sell_price ? el.sell_price : "",
              temp_wholesale_price: el.wholesale_price ? el.wholesale_price : "",
            })
          });
        }
        setPriceList(temp);
        setLoading(false);
        setSearched(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const objectChange = (e) => {
    setObject(e.value);
    setSearched(false);
    setBrand(null);
    setCategory(null);
    setCounterparty(null);
  };

  const autocompleteChange = (value) => {
    switch (object) {
      case 1:
        setCounterparty(value);
        setBrand(null);
        setCategory(null);
        break;
      case 2:
        setBrand(value);
        setCounterparty(null);
        setCategory(null);
        break;
      case 3:
        setCategory(value);
        setBrand(null);
        setCounterparty(null);
        break;
      default:
        break;
    }
  }

  return (
    <Fragment>
      <Grid
        container
        spacing={2}
      >
        <Grid item xs={object === 0 ? 10 : 5}>
          {/* <label style={{ fontSize: "12px", color: counterparty === "" || !counterparty ? "red" : "black" }}>*Контрагент</label> */}
          <CustomSelect
            options={objects}
            onChange={objectChange}
            placeholder={"Тип"}
          />
        </Grid>
        {object !== 0 && <Grid item xs={5}>
          {/* <label style={{ fontSize: "12px", color: counterparty === "" || !counterparty ? "red" : "black" }}>*Контрагент</label> */}
          <Autocomplete
            value={object === 1 ? counterparty : object === 2 ? brand : object === 3 ? category : null}
            defaultValue={object === 1 ? counterparty : object === 2 ? brand : object === 3 ? category : null}
            fullWidth
            disabled={isLoading}
            options={object === 1 ? counterparties :
              object === 2 ? brands :
                object === 3 ? categories :
                  []}
            getOptionLabel={(option) => option.label}
            onChange={(e, value) => {
              autocompleteChange(value);
            }}
            // onInputChange={(e, value) => { setBarcode(value) }}
            noOptionsText="Товар не найден"
            renderInput={(params) => (
              <CustomAutocomplete
                params={params}
                placeholder={object === 1 ? "Контрагент" : object === 2 ? "Бренд" : object === 3 ? "Категория" : ""}
              />
            )}
          />
        </Grid>}
        <Grid item xs={2}
        // style={{ marginTop: "24px" }}
        >
          <button
            className="btn btn-success"
            onClick={getPrices}
            disabled={
              (object === 1 && !counterparty) ||
                (object === 2 && !brand) ||
                (object === 3 && !category) ||
                isLoading ? true : false}
          >
            Показать
          </button>
        </Grid>
        <Grid item xs={12}>
          <hr style={{ margin: "0px" }} />
        </Grid>
        {isSearched &&
          <Fragment>
            <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
              {object === 1 ? 'Добавление закупочной цены' : ' Поиск товара'}
            </Grid>
            <Grid item xs={12}>
              <PurchasePriceAdd
                counterparty={counterparty}
                brand={brand}
                category={category}
                getPrices={getPrices}
                isWholesale={isWholesale}
                object={object}
                barcode={barcode}
                setBarcode={setBarcode}
                prodName={prodName}
                setProdName={setProdName}
              />
            </Grid>
          </Fragment>
        }
        {isSearched && <Grid item xs={12}>
          <PurchasePricesList
            counterparty={counterparty}
            priceList={priceList}
            setPriceList={setPriceList}
            isLoading={isLoading}
            setLoading={setLoading}
            getPrices={getPrices}
            isWholesale={isWholesale}
            byCounterparty={byCounterparty}
            setBarcode={setBarcode}
            setProdName={setProdName}
          />
        </Grid>}
      </Grid>
    </Fragment >
  )
}