import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";

export default function CertificateOptions({
  changeDate,
  consignator,
  consignators,
  point,
  dateFrom,
  dateTo,
  dateFromChange,
  dateToChange,
  onPointsChange,
  points,
  filter,
  onFilterChange,
  onConsignatorChange,
  handleSearch,
  options,
}) {
  return (
    <Fragment>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={handleSearch}
        />
      </Grid>
    </Fragment>
  );
}
