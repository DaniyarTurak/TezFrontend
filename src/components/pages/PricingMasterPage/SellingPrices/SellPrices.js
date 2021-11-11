
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import SellPricesList from "./SellPricesList"
import SellPriceAdd from "./SellPriceAdd";
import Axios from "axios";
import CustomSelect from "../../../ReusableComponents/CustomSelect";


export default function SellPrices() {

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

  const [point, setPoint] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    getPoints();
  }, []);

  useEffect(() => {
    if (point !== "") {
      getPrices();
    }
  }, [point]);

  const getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((points) => {
        let temp = [];
        points.forEach(pt => {
          temp.push({ label: pt.name, value: pt.id })
        });
        setPoints(temp);
      })
      .catch((err) => console.log(err));
  };

  const pointChange = (e) => {
    setPoint(e.value)
  };

  const getPrices = () => {
    setLoading(true);
    Axios.get("/api/prices/list", { params: { point } })
      .then((res) => res.data)
      .then((prices) => {
        let temp = [];
        if (prices.length > 0) {
          prices.forEach((el, idx) => {
            temp.push({ ...el, num: idx + 1, temp_price: el.price })
          });
        }
        setPriceList(temp);
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
          <label style={{ fontSize: "12px", color: point === "" || !point ? "red" : "black" }}>*Торговая точка</label>
          <CustomSelect
            styles={customStyles}
            options={points}
            onChange={pointChange}
            placeholder={"Торговая точка"}
          />
        </Grid>
        <Grid item xs={2} style={{ marginTop: "24px" }}>
          <button
            className="btn btn-success"
            onClick={getPrices}
            disabled={point === "" || isLoading ? true : false}
          >
            Показать
          </button>
        </Grid>
        <Grid item xs={12}>
          <hr style={{ margin: "0px" }} />
        </Grid>
        {point !== "" && !isLoading &&
          <Fragment>
            <Grid item xs={12} style={{ textAlign: 'center', color: '#6c757d' }}>
              Добавление цены реализации
            </Grid>
            <Grid item xs={12}>
              <SellPriceAdd
                point={point}
                getPrices={getPrices}
              />
            </Grid>
          </Fragment>
        }
        <Grid item xs={12}>
          <SellPricesList
            priceList={priceList}
            setPriceList={setPriceList}
            isLoading={isLoading}
            setLoading={setLoading}
            getPrices={getPrices}
            point={point}
          />
        </Grid>

      </Grid>
    </Fragment>
  )
}