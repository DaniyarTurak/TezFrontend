import React, { useState, useEffect } from "react";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import FizCustomerDetailsTable from "./FizCustomerDetailsTable";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Axios from "axios";

import "moment/locale/ru";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
Moment.locale("ru");

export default function FizCustomerDetails({
  backToList,
  classes,
  company,
  customerData,
  calculateTotalDebt,
  changeDate,
  currentDebt,
  dateFrom,
  dateFromChange,
  dateTo,
  dateToChange,
  holding,
  openDetails,
}) {
  const [details, setDetails] = useState([]);
  const [isDetailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    if (!holding) {
      holding = false;
    }
    setDetailsLoading(true);
    Axios.get("/api/report/fizcustomers/details", {
      params: {
        dateFrom,
        dateTo,
        customer: customerData.customer_id,
        holding,
        company,
      },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        setDetailsLoading(false);
        setDetails(detailsList);
      })
      .catch((err) => {
        setDetailsLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <b>
              Покупатель: {customerData.fio}, номер телефона:
              {customerData.telephone}
            </b>
          </Grid>

          <Grid item xs={12}>
            <b>
              Остаток бонусов на текущий момент:
              {customerData.details.currbonuses} тенге
            </b>
          </Grid>

          <Grid item xs={12}>
            <b>Сумма долга на текущий момент: {currentDebt} тенге</b>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={4}>
        <Button fullWidth variant="outlined" onClick={backToList}>
          Вернуться назад
        </Button>
      </Grid>

      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={handleSearch}
          disableButton={isDetailsLoading}
        />
      </Grid>

      {isDetailsLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isDetailsLoading && details.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            За указанный период информация не найдена
          </p>
        </Grid>
      )}
      {!isDetailsLoading && details.length > 0 && (
        <FizCustomerDetailsTable
          calculateTotalDebt={calculateTotalDebt}
          classes={classes}
          dateFrom={dateFrom}
          dateTo={dateTo}
          details={details}
          name={customerData.fio}
          openDetails={openDetails}
        />
      )}
    </Grid>
  );
}
