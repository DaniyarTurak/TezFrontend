import React, { useState, useEffect, Fragment } from "react";
import PeriodComponent from "./PeriodComponent";
import Axios from "axios";

export default function ShelfLifePage() {
const [expdates,setExpdates] = useState([]);
const arrays = [];
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
    Axios.get("/api/report/expire_date")
    .then((res) => res.data)
    .then((expiredates) => {
      arrays.push(expiredates[0].rep_exp_date.array3);
      arrays.push(expiredates[0].rep_exp_date.array6);
      arrays.push(expiredates[0].rep_exp_date.array9);
      arrays.push(expiredates[0].rep_exp_date.array12);
      setExpdates(arrays);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <div>

      {periodProps.map((period, i) => ( expdates.length !== 0 &&
        <PeriodComponent 
        products = {expdates[i]}
        key={i}
        label = {period.label} 
        background = {period.background} 
        gradient = {period.gradient}/>
      ))}

    </div>
  );
}
