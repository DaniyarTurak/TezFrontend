
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import PurchasePricesList from "./PurchasePricesList"
import PurchasePriceAdd from "./PurchasePriceAdd";
import Axios from "axios";
import Select from "react-select";

export default function PurchasePrices() {

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "white",
      // border: '2px solid #17a2b8',
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        border: '2px solid #17a2b8',

      }
    })
  };

  const [counterparty, setCounterparty] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [counterparties, setCounterparties] = useState([]);

  useEffect(() => {
    getCounterparties();
  }, []);

  useEffect(() => {
    if (counterparty !== "") {
      getPrices();
    }
  }, [counterparty]);

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

  const counterpartyChange = (e) => {
    setCounterparty(e.value)
  };

  const getPrices = () => {
    setLoading(true);
    Axios.get("/api/prices/list", { params: { counterparty } })
      .then((res) => res.data)
      .then((prices) => {
        if (prices.length > 0) {
          let temp = [];
          prices.forEach((el, idx) => {
            temp.push({ ...el, num: idx + 1 })
          });
          setPriceList(temp);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Grid
        container
        spacing={2}
      >
        <Grid item xs={10}>
          <label style={{ fontSize: "12px", color: counterparty === "" || !counterparty ? "red" : "black" }}>*Контрагент</label>
          <Select
            styles={customStyles}
            options={counterparties}
            onChange={counterpartyChange}
            placeholder="Контрагент"
          />
        </Grid>
        <Grid item xs={2} style={{ marginTop: "24px" }}>
          <button
            className="btn btn-success"
            onClick={getPrices}
            disabled={counterparty === "" || isLoading ? true : false}
          >
            Показать
          </button>
        </Grid>
        <Grid item xs={12}>
          <hr style={{ margin: "0px" }} />
        </Grid>
        {counterparty !== "" && !isLoading &&
          <Fragment>
            <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
              Добавление закупочной цены
            </Grid>
            <Grid item xs={12}>
              <PurchasePriceAdd
                counterparty={counterparty}
                getPrices={getPrices}
              />
            </Grid>
          </Fragment>
        }
        <Grid item xs={12}>
          <PurchasePricesList
            priceList={priceList}
            isLoading={isLoading}
            getPrices={getPrices}
          />
        </Grid>

      </Grid>
    </Fragment>
  )
}
