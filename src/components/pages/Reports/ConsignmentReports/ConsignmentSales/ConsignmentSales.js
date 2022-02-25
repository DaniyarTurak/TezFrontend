import React, { useState, useEffect } from "react";
import Axios from "axios";
import Sales from "./Sales";
import NDSSales from "./NDSSales";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import Box from "@material-ui/core/Box";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  paragraph: {
    display: "flex",
    justifyContent: "center",
    opacity: "60%",
  },
});

export default function ConsignmentSales({ companyProps }) {
  const classes = useStyles();
  const [dateFrom, setDateFrom] = useState(
    Moment()
      .startOf("month")
      .format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isSalesLoading, setSalesLoading] = useState(false);
  const [isNDSSalesLoading, setNDSSalesLoading] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [ndsSales, setNdsSales] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!isDateChanging) {
      getSales();
      getNDSSales();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const getSales = () => {
    setSalesLoading(true);
    Axios.get("/api/report/consignment/sales", { params: { dateFrom, dateTo } })
      .then((res) => res.data)
      .then((res) => {
        setSales(res);
        setSalesLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSalesLoading(false);
      });
  };

  const getNDSSales = () => {
    setNDSSalesLoading(true);
    Axios.get("/api/report/consignment/ndssales", {
      params: { dateFrom, dateTo },
    })
      .then((res) => res.data)
      .then((res) => {
        setNdsSales(res);
        setNDSSalesLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setNDSSalesLoading(false);
      });
  };

  const handleSearch = () => {
    getSales();
    getNDSSales();
  };

  return (
    <Box>
      <MaterialDateDefault
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        searchInvoices={handleSearch}
        disableButton={isSalesLoading}
      />
      {isSalesLoading ? (
        <TableSkeleton />
      ) : sales.length === 0 ? (
        <p className={classes.paragraph}>Данные по продажам не найдены</p>
      ) : (
        <Sales sales={sales} />
      )}
      {isNDSSalesLoading ? (
        <TableSkeleton />
      ) : ndsSales.length === 0 ? (
        <p className={classes.paragraph}>Данные по продажам (НДС) не найдены</p>
      ) : (
        <NDSSales ndsSales={ndsSales} />
      )}
    </Box>
  );
}
