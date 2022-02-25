import React, { Fragment } from "react";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";

export default function ReportOptions({
  setDateFrom,
  setDateTo,
  setDateChanging,
  setFilter,
  cleanSales,
  setFilterType,
  dateFrom,
  dateTo,
  handleSearch,
  filter,
  filterType,
  isLoading
}) {
  const options = [
    { value: "cashboxFiz", label: "По физ. лицам" },
    { value: "cashboxJur", label: "По юр. лицам" },
  ];
  const typeOptions = [
    { value: "cashboxuser", label: "По пользователям" },
    { value: "cashbox", label: "По кассам" },
  ];

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

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const filterChange = (e, f) => {
    setFilter(f);
    cleanSales();
  };

  const filterTypeChange = (e, f) => {
    setFilterType(f);
    cleanSales();
  };

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
          disableButton={isLoading}
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={filter}
          onChange={filterChange}
          options={options}
          noOptions="Фильтр не найден"
          label="Фильтр"
        />
      </Grid>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={filterType}
          onChange={filterTypeChange}
          options={typeOptions}
          noOptions="Фильтр не найден"
          label="Фильтр-2"
        />
      </Grid>
    </Fragment>
  );
}
