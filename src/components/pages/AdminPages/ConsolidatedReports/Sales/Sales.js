import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Moment from "moment";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { aggregationIntervals } from "./data.js";

import OnlySales from "./OnlySales";
import OnlyRefunds from "./OnlyRefunds";
import CashChecks from "./CashChecks";
import CardChecks from "./CardChecks";
import DebitChecks from "./DebitChecks";
import DebtChecks from "./DebtChecks";

import OnlySalesTable from "./OnlySalesTable";
import OnlyRefundsTable from "./OnlyRefundsTable";
import CashTable from "./CashTable";
import CardTable from "./CardTable";
import DebitTable from "./DebitTable";
import DebtTable from "./DebtTable";

const useStyles = makeStyles((theme) => ({
  paragraph: {
    display: "flex",
    justifyContent: "center",
    opacity: "60%",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

function Sales() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [sales, setSales] = useState(false);
  const [salesAggregated, setSalesAggregated] = useState([]);
  const [currentSalesInterval, setCurrentSalesInterval] = useState(
    aggregationIntervals[0].interval
  );
  const [refundsAggregated, setRefundsAggregated] = useState([]);
  const [currentRefundsInterval, setCurrentRefundsInterval] = useState(
    aggregationIntervals[0].interval
  );
  const [cashAggregated, setCashAggregated] = useState([]);
  const [currentCashInterval, setCashInterval] = useState(
    aggregationIntervals[0].interval
  );
  const [cardAggregated, setCardAggregated] = useState([]);
  const [currentCardInterval, setCardInterval] = useState(
    aggregationIntervals[0].interval
  );
  const [debitAggregated, setDebitAggregated] = useState([]);
  const [currentDebitInterval, setDebitInterval] = useState(
    aggregationIntervals[0].interval
  );
  const [debtAggregated, setDebtAggregated] = useState([]);
  const [currentDebtInterval, setDebtInterval] = useState(
    aggregationIntervals[0].interval
  );

  function updateSalesInterval(value) {
    setCurrentSalesInterval(value.target.value);
    setSalesAggregated([]);
  }

  function updateRefundsInterval(value) {
    setCurrentRefundsInterval(value.target.value);
    setRefundsAggregated([]);
  }

  function updateCashInterval(value) {
    setCashInterval(value.target.value);
    setCashAggregated([]);
  }

  function updateCardInterval(value) {
    setCardInterval(value.target.value);
    setCardAggregated([]);
  }

  function updateDebitInterval(value) {
    setDebitInterval(value.target.value);
    setDebitAggregated([]);
  }

  function updateDebtInterval(value) {
    setDebtInterval(value.target.value);
    setDebtAggregated([]);
  }

  useEffect(() => {
    setLoading(true);
    Axios.get("/api/adminpage/soldrep", {
      params: {
        dateFrom: Moment().subtract(1, "year").format(),
        dateTo: Moment().format(),
      },
    })
      .then((res) => res.data)
      .then((res) => {
        let newSales = [];
        res.forEach((e) => {
          const newItem = {
            ...e,
            soldcount: parseFloat(e.soldcount),
            returncount: parseFloat(e.returncount),
            soldsum: parseFloat(e.soldsum),
            returnsum: parseFloat(e.returnsum),
            soldavg: parseFloat(e.soldavg),
            returnavg: parseFloat(e.returnavg),
            cashpay: parseFloat(e.cashpay),
            cardpay: parseFloat(e.cardpay),
            countcardpay: parseFloat(e.countcardpay),
            countcashpay: parseFloat(e.countcashpay),
            countdebitpay: parseFloat(e.countdebitpay),
            countdebtpay: parseFloat(e.countdebtpay),
            debitpay: parseFloat(e.debitpay),
            debtpay: parseFloat(e.debtpay),
            bonuspay: parseFloat(e.bonuspay),
            discount: parseFloat(e.discount),
            avgcashpay: parseFloat(e.avgcashpay),
            avgcardpay: parseFloat(e.avgcardpay),
            avgdebitpay: parseFloat(e.avgdebitpay),
            avgdebtpay: parseFloat(e.avgdebtpay),
          };
          newSales.push(newItem);
        });
        setSales(newSales);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return !isLoading && sales.length > 0 ? (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <OnlySales
            sales={sales}
            currentSalesInterval={currentSalesInterval}
            updateSalesInterval={updateSalesInterval}
            setSalesAggregated={setSalesAggregated}
            salesAggregated={salesAggregated}
          />
          <OnlySalesTable sales={sales} salesAggregated={salesAggregated} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <OnlyRefunds
            sales={sales}
            currentRefundsInterval={currentRefundsInterval}
            updateRefundsInterval={updateRefundsInterval}
            setRefundsAggregated={setRefundsAggregated}
            refundsAggregated={refundsAggregated}
          />
          <OnlyRefundsTable
            sales={sales}
            refundsAggregated={refundsAggregated}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CashChecks
            sales={sales}
            currentCashInterval={currentCashInterval}
            updateCashInterval={updateCashInterval}
            setCashAggregated={setCashAggregated}
            cashAggregated={cashAggregated}
          />
          <CashTable sales={sales} cashAggregated={cashAggregated} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <CardChecks
            sales={sales}
            currentCardInterval={currentCardInterval}
            updateCardInterval={updateCardInterval}
            setCardAggregated={setCardAggregated}
            cardAggregated={cardAggregated}
          />
          <CardTable sales={sales} cardAggregated={cardAggregated} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <DebitChecks
            sales={sales}
            currentDebitInterval={currentDebitInterval}
            updateDebitInterval={updateDebitInterval}
            setDebitAggregated={setDebitAggregated}
            debitAggregated={debitAggregated}
          />
          <DebitTable sales={sales} debitAggregated={debitAggregated} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <DebtChecks
            sales={sales}
            currentDebtInterval={currentDebtInterval}
            updateDebtInterval={updateDebtInterval}
            setDebtAggregated={setDebtAggregated}
            debtAggregated={debtAggregated}
          />
          <DebtTable sales={sales} debtAggregated={debtAggregated} />
        </Paper>
      </Grid>
    </Grid>
  ) : isLoading ? (
    <TableSkeleton />
  ) : (
    <p className={classes.paragraph}>Данные по продажам не найдены</p>
  );
}

Sales.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sales);
