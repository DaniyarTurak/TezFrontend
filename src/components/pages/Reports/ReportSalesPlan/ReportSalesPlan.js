import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import SalesPlanOptions from "./SalesPlanOptions";
import SalesPlanTable from "./SalesPlanTable";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  notFound: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: ".875rem",
  },
  tableRow: {
    hover: {
      "&$hover:hover": {
        backgroundColor: "#49bb7b",
      },
    },
  },
  label: {
    color: "orange",
    fontSize: ".875rem",
  },
  invoiceOptions: {
    fontSize: ".875rem",
  },
  button: {
    minHeight: "3.5rem",
    fontSize: ".875rem",
    textTransform: "none",
  },
}));

export default function ReportSalesPlan({ companyProps }) {
  const classes = useStyles();
  const [bonusResult, setBonusResult] = useState([]);
  const [cashboxUsers, setCashboxUsers] = useState([]);
  const [cashboxuser, setCashboxuser] = useState({
    value: "0",
    label: "Все пользователи",
  });
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const company = companyProps ? companyProps.value : "";
  const companyData = JSON.parse(sessionStorage.getItem("isme-user-data"))
    ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
    : "";
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");
  const [planType, setPlanType] = useState({ value: 1, label: "Ежедневный" });

  useEffect(() => {
    getCashboxUsers();
    getDailyBonus();
  }, []);

  useEffect(() => {
    if (!isDateChanging) {
      getDailyBonus();
    }
    return () => {
      setDateChanging(false);
    };
  }, [cashboxuser]);

  const getCashboxUsers = () => {
    Axios.get("/api/cashboxuser/individual/bonus", { params: { company } })
      .then((res) => res.data)
      .then((users) => {
        const all = [{ label: "Все пользователи", value: "0" }];
        const cashboxUsersList = users.map((user) => {
          return {
            label: user.name,
            value: user.id,
          };
        });
        setCashboxUsers([...all, ...cashboxUsersList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

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
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const cashboxUsersChange = (c) => {
    setCashboxuser(c);
  };

  const getDailyBonus = () => {
    setLoading(true);
    Axios.get(
      `/api/report/salesplan/daily${cashboxuser.value === "0" ? "/all" : ""}`,
      {
        params: { dateFrom, dateTo, cashboxuser: cashboxuser.value, type: planType.value },
      }
    )
      .then((res) => res.data)
      .then((res) => {
        setBonusResult(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getMonthlyBonus = () => {
    setLoading(true);
    Axios.get(
      `/api/report/salesplan/monthly${cashboxuser.value === "0" ? "/all" : ""}`,
      {
        params: { dateFrom, dateTo, cashboxuser: cashboxuser.value, type: planType.value },
      }
    )
      .then((res) => res.data)
      .then((res) => {
        setBonusResult(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getQuarterlyBonus = () => {
    setLoading(true);
    Axios.get(
      `/api/report/salesplan/quarterly${cashboxuser.value === "0" ? "/all" : ""}`,
      {
        params: { dateFrom, dateTo, cashboxuser: cashboxuser.value, type: planType.value },
      }
    )
      .then((res) => res.data)
      .then((res) => {
        setBonusResult(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const getBonus = () => {
    switch (planType.value) {
      case 1:
        getDailyBonus();
        break;
      case 2:
        getMonthlyBonus();
        break;
      case 3:
        getQuarterlyBonus();
        break;
      default:
        break;
    }
  }

  return (
    <Grid container spacing={3}>
      <SalesPlanOptions
        cashboxuser={cashboxuser}
        cashboxUsers={cashboxUsers}
        cashboxUsersChange={cashboxUsersChange}
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        getBonus={getBonus}
        planType={planType}
        setPlanType={setPlanType}
        setBonusResult={setBonusResult}
      />
      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && bonusResult.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && bonusResult.length > 0 && (
        <SalesPlanTable
          cashboxuser={cashboxuser}
          companyData={companyData}
          dateFrom={dateFrom}
          dateTo={dateTo}
          now={now}
          bonusResult={bonusResult}
          planType={planType}
        />
      )}
    </Grid>
  );
}
