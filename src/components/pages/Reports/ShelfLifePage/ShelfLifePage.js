import React, { useState, useEffect ,Fragment} from "react";
import PeriodComponent from "./PeriodComponent";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { Typography } from "@material-ui/core";
import moment from 'moment';

export default function ShelfLifePage() {
  const [expdates, setExpdates] = useState([]);
  const [datesExcel, setDatesExcel] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    getExpireDates();
  }, []);

  const periodProps = [
    { label: "Просроченные товары", background: "#ff5252", gradient: "linear-gradient(#ff5252 1%, white 50%)" },
    { label: "от 0 до 3 месяцев", background: "#fa855e", gradient: "linear-gradient(#fa855e 1%, white 50%)" },
    { label: "от 3 до 6 месяцев", background: "#ffcc80", gradient: "linear-gradient(#ffcc80 1%, white 50%)" },
    { label: "от 6 до 9 месяцев", background: "#fff59d", gradient: "linear-gradient(#fff59d 1%, white 50%)" },
    { label: "от 9 до 12 месяцев", background: "#a5d6a7", gradient: "linear-gradient(#a5d6a7 1%, white 50%)" },
  ];

  const getExpireDates = () => {
    setLoading(true);
    Axios.get("/api/report/expire_date")
      .then((res) => res.data)
      .then((expiredates) => {
        let newarr = [];
        newarr.push(expiredates[0].rep_exp_date.array0);
        newarr.push(expiredates[0].rep_exp_date.array3);
        newarr.push(expiredates[0].rep_exp_date.array6);
        newarr.push(expiredates[0].rep_exp_date.array9);
        newarr.push(expiredates[0].rep_exp_date.array12);
        setDatesExcel(newarr);
        setExpdates(newarr);
        setLoading(false);
        setCode(expiredates[0].rep_exp_date.code);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false)
      });
  };

  const getShelfLifeExcel = () => {
    setExcelLoading(true);
    let arr0 = [];
    let arr3 = [];
    let arr6 = [];
    let arr9 = [];
    let arr12 = [];

    if (datesExcel[0]) {
      datesExcel[0].forEach((e) => {
        arr0.push({ ...e, dt: moment(e.dt).format('L') })
      })
    };

    if (datesExcel[1]) {
      datesExcel[1].forEach((e) => {
        arr3.push({ ...e, dt: moment(e.dt).format('L') })
      })
    };

    if (datesExcel[2]) {
      datesExcel[2].forEach((e) => {
        arr6.push({ ...e, dt: moment(e.dt).format('L') })
      })
    };

    if (datesExcel[3]) {
      datesExcel[3].forEach((e) => {
        arr9.push({ ...e, dt: moment(e.dt).format('L') })
      })
    };

    if (datesExcel[4]) {
      datesExcel[4].forEach((e) => {
        arr12.push({ ...e, dt: moment(e.dt).format('L') })
      })
    };

    Axios({
      method: "POST",
      url: "/api/report/expire_date/excel",
      data: { arr0, arr3, arr6, arr9, arr12 },
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
      {expdates.length > 0 && <Fragment>
        {periodProps.map((period, i) => (expdates.length !== 0 &&
          <PeriodComponent
            code={code}
            isLoading={isLoading}
            products={expdates[i]}
            key={i}
            label={period.label}
            background={period.background}
            gradient={period.gradient} />
        ))}
      </Fragment>
      }
      {
        expdates.length === 0 && !isLoading && code === "no_data_found" && <Typography style={{ textAlign: "center" }}>Нет данных</Typography>
      }
      <Grid item xs={12}>
        {!isLoading && expdates.length > 0 && code === "sucess" && <button
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
