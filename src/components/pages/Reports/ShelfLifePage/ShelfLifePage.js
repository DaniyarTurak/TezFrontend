import React, { useState, useEffect, Fragment } from "react";
import PeriodComponent from "./PeriodComponent";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function ShelfLifePage() {
  const [expdates, setExpdates] = useState([]);
  const arrays = [];
  const [isLoading, setLoading] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  useEffect(() => {
    getExpireDates();
  }, []);

  const periodProps = [
    { label: "от 0 до 3 месяцев", background: "#ff5252", gradient: "linear-gradient(#ff5252 1%, white 50%)" },
    { label: "от 3 до 6 месяцев", background: "#ffcc80", gradient: "linear-gradient(#ffcc80 1%, white 50%)" },
    { label: "от 6 до 9 месяцев", background: "#fff59d", gradient: "linear-gradient(#fff59d 1%, white 50%)" },
    { label: "от 9 до 12 месяцев", background: "#a5d6a7", gradient: "linear-gradient(#a5d6a7 1%, white 50%)" },
  ];

  const getExpireDates = () => {
    setLoading(true);
    Axios.get("/api/report/expire_date")
      .then((res) => res.data)
      .then((expiredates) => {
        arrays.push(expiredates[0].rep_exp_date.array3);
        arrays.push(expiredates[0].rep_exp_date.array6);
        arrays.push(expiredates[0].rep_exp_date.array9);
        arrays.push(expiredates[0].rep_exp_date.array12);
        setExpdates(arrays);
        setLoading(false)
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false)
      });
  };;

  const getShelfLifeExcel = () => {
    setExcelLoading(true);
    let arr3 = expdates[0];
    let arr6 = expdates[1];
    let arr9 = expdates[2];
    let arr12 = expdates[3];
    Axios({
      method: "POST",
      url: "/api/report/expire_date/excel",
      data: { arr3, arr6, arr9, arr12 },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Сроки годности.xlsx`);
        document.body.appendChild(link);
        link.click();
        setExcelLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setExcelLoading(false);
      });
  };

  return (

    <Grid container spacing={3}>
      {periodProps.map((period, i) => (expdates.length !== 0 &&
        <PeriodComponent
          isLoading={isLoading}
          products={expdates[i]}
          key={i}
          label={period.label}
          background={period.background}
          gradient={period.gradient} />
      ))}
      <Grid item xs={12}>
        {!isLoading && <button
          className="btn btn-sm btn-outline-success"
          disabled={isExcelLoading}
          onClick={getShelfLifeExcel}
        >
          Выгрузить в Excel
        </button>
        }
      </Grid>
    </Grid>
  );
};
