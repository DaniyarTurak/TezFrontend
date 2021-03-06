import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import Alert from "react-s-alert";
import _ from "lodash";
import ReportOptions from "./ReportOptions";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Sales from "./Sales";
import SalesNDS from "./SalesNDS";
import Returns from "./Returns";
import ReturnsNDS from "./ReturnsNDS";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

const useStyles = makeStyles((theme) => ({
  notFound: {
    marginTop: "1rem",
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
    fontSize: ".875rem",
  },
}));

export default function ReportSalesSection({ companyProps, holding }) {
  const classes = useStyles();
  const [cashboxSalesResult, setCashboxSalesResult] = useState([]);
  const [cashboxSalesResultNDS, setCashboxSalesResultNDS] = useState([]);
  const [client, setClient] = useState("");
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [filterType, setFilterType] = useState({
    value: "cashboxuser",
    label: "По пользователям",
  });
  const [filter, setFilter] = useState({
    value: "cashboxFiz",
    label: "По физ. лицам",
  });
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [salesResult, setSalesResult] = useState([]);
  const [salesResultNDS, setSalesResultNDS] = useState([]);
  const [isSearched, setSearched] = useState(false)
  const company = companyProps ? companyProps.value : "";

  // const companyData = JSON.parse(sessionStorage.getItem("isme-user-data"))
  //   ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
  //   : "";

  let totalResults =
    filterType.value === "cashbox" ? cashboxSalesResult : salesResult;
  let totalResultsNDS =
    filterType.value === "cashbox" ? cashboxSalesResultNDS : salesResultNDS;

  // const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  if (!holding) {
    holding = false;
  }

  // useEffect(() => {
  //   if (!company) {
  //     handleSearch();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!isDateChanging) {
  //     handleSearch();
  //   }
  //   return () => {
  //     setDateChanging(false);
  //   };
  // }, [filterType, filter, dateFrom, dateTo, company]);

  useEffect(() => {
    if (filterType.value === "cashbox" && client) {
      getCashboxBonus();
      getCashboxBonusNDS();
    } else if (client) {
      getCashboxuserBonus();
      getCashboxuserBonusNDS();
    }
    return () => {
      setClient("");
      cleanSales();
    };
  }, [client]);

  const cleanSales = () => {
    setSalesResult([]);
    setSalesResultNDS([]);
    setSearched(false)
  };

  const handleSearch = () => {
    if (!dateFrom || !dateTo || filter.length === 0) {
      const text = !dateFrom ? "Дата с" : !dateTo ? "Дата по" : "Фильтр";
      return Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setSearched(true)
    setLoading(true);
    cleanSales();
    switch (filter.value) {
      case "cashboxFiz": {
        setClient("fiz");
        break;
      }
      case "cashboxJur": {
        setClient("jur");
        break;
      }
      default:
        console.log("Error: filter not detected");
    }
  };

  const getCashboxuserBonus = () => {
    setLoading(true)
    Axios.get("/api/report/sales/cashboxuser", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        setSalesResult(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getCashboxBonus = () => {
    setLoading(true)
    Axios.get("/api/report/sales/cashbox", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((sales) => {
        const temp = _.mapValues(_.groupBy(sales, "point"), (list) =>
          list.map((bs) => _.omit(bs, "point"))
        );
        const salesResultList = Object.keys(temp).map((key) => {
          return {
            point: key,
            cashboxes: temp[key],
          };
        });
        setSalesResult(salesResultList);
        setCashboxSalesResult(sales);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getCashboxuserBonusNDS = () => {
    setLoading(true)
    Axios.get("/api/report/sales/ndscashboxuser", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        setSalesResultNDS(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getCashboxBonusNDS = () => {
    setLoading(true)
    Axios.get("/api/report/sales/ndscashbox", {
      params: { dateFrom, dateTo, client, company, holding },
    })
      .then((res) => res.data)
      .then((salesNDS) => {
        const temp = _.mapValues(_.groupBy(salesNDS, "point"), (list) =>
          list.map((bs) => _.omit(bs, "point"))
        );

        const salesResultNDSList = Object.keys(temp).map((key) => {
          return {
            point: key,
            cashboxesNDS: temp[key],
          };
        });
        setSalesResultNDS(salesResultNDSList);
        setCashboxSalesResultNDS(salesNDS);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getExcel = () => {
    setExcelLoading(true);

    let totalsForSales = {};
    totalsForSales = {
      name: "Итого",
      cash: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.cash);
      }, 0),
      card: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.card);
      }, 0),
      debitpay: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.debitpay);
      }, 0),
      discount: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.discount);
      }, 0),
      bonuspay: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.bonuspay);
      }, 0),
      debtpay: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.debtpay);
      }, 0),
      total_discount: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.total_discount);
      }, 0),
      total_discount_bonus: totalResults.reduce((prev, cur) => {
        return prev + parseFloat(cur.total_discount_bonus);
      }, 0),
    };

    console.log([...totalResults, totalsForSales]);
    Axios({
      method: "POST",
      url: "/api/report/transactions/excel_sales",
      data: {
        salesResult: [...totalResults, totalsForSales],
        salesResultNDS: [...totalResults, totalsForSales],
        totalResults,
        totalResultsNDS,
        filterType,
      },
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
      <ReportOptions
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        setFilterType={setFilterType}
        setFilter={setFilter}
        setDateChanging={setDateChanging}
        cleanSales={cleanSales}
        dateFrom={dateFrom}
        dateTo={dateTo}
        handleSearch={handleSearch}
        filter={filter}
        filterType={filterType}
        isLoading={isLoading}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && salesResult.length === 0 && salesResultNDS.length === 0 && isSearched &&(
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && salesResult.length > 0 && salesResultNDS.length > 0 && (
        <Fragment>
          <Grid item xs={12}>
            <Sales
              salesResult={salesResult}
              classes={classes}
              filterType={filterType}
              totalResults={totalResults}
            />
          </Grid>

          <Grid item xs={12}>
            <SalesNDS
              salesResultNDS={salesResultNDS}
              classes={classes}
              filterType={filterType}
              totalResultsNDS={totalResultsNDS}
            />
          </Grid>

          <Grid item xs={12}>
            <Returns
              salesResult={salesResult}
              classes={classes}
              filterType={filterType}
              totalResults={totalResults}
            />
          </Grid>

          <Grid item xs={12}>
            <ReturnsNDS
              salesResultNDS={salesResultNDS}
              classes={classes}
              filterType={filterType}
              totalResultsNDS={totalResultsNDS}
            />
          </Grid>

          <Grid item xs={12}>
            <button
              className="btn btn-sm btn-outline-success"
              disabled={isExcelLoading}
              onClick={getExcel}
            >
              Выгрузить в excel
            </button>
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
}
