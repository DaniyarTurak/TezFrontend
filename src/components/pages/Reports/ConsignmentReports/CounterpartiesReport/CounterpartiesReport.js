import React, { useState, useEffect } from "react";
import Moment from "moment";
import Axios from "axios";
import HistoryTable from "./HistoryTable";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  labelRoot: {
    fontSize: ".875rem",
  },
});

export default function CounterpartiesReport({
  companyProps,
  changeParentReportMode,
  changeCurrentReportMode,
}) {
  const classes = useStyles();
  const [counterparty, setCounterparty] = useState("");
  const [counterparties, setCounterparties] = useState([]);
  const [consignments, setConsignments] = useState(null);
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSearched, setSearched] = useState(false);

  // useEffect(() => {
  //   if (!isDateChanging && counterparty) {
  //     getHistory();
  //   }
  //   return () => {
  //     setDateChanging(false);
  //   };
  // }, [dateFrom, dateTo, counterparty]);

  useEffect(() => {
    getCounterparties();
  }, []);

  const onCounterpartyChange = (event, c) => {
    setCounterparty(c);
    if (c === null) {
      return;
    }
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

  const getCounterparties = () => {
    Axios.get("/api/buyers", {
      params: { company: companyProps },
    })
      .then((res) => res.data)
      .then((list) => {
        const counterpartiesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCounterparties(counterpartiesList);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getHistory = () => {
    setSearched(true);
    if (!counterparty) {
      return Alert.warning("???????????????? ??????????????????????", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setLoading(true);
    Axios.get("/api/report/consignment/total", {
      params: { dateFrom, dateTo, consignator: counterparty.value },
    })
      .then((res) => res.data)
      .then((res) => {
        const consignatorNew = { ...res[0], date: dateFrom, dateTo };
        setConsignments(consignatorNew);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={getHistory}
          disableButton={isLoading}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          options={counterparties}
          disableClearable
          onChange={onCounterpartyChange}
          noOptionsText="?????????????????????? ???? ??????????????"
          renderOption={(option) => (
            <Typography style={{ fontSize: ".875rem" }}>
              {option.label}
            </Typography>
          )}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="??????????????????????"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                },
              }}
              inputProps={{
                ...params.inputProps,
                style: { fontSize: ".875rem" },
              }}
            />
          )}
        />
      </Grid>
      {isLoading && (
        <Grid item xs={12}>
          <TableSkeleton />
        </Grid>
      )}

      {!isLoading && !consignments && isSearched && (
        <Grid item xs={12}>
          <p
            style={{
              opacity: "60%",
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            ???????????? ???? ?????????????????????? ???? ??????????????
          </p>
        </Grid>
      )}

      {!isLoading && consignments &&
        <Grid item xs={12}>
          <HistoryTable
            consignments={consignments}
            id={counterparty.value}
            changeParentReportMode={changeParentReportMode}
            changeCurrentReportMode={changeCurrentReportMode}
          />
        </Grid>
      }
    </Grid>
  );
}
