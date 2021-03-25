import React from "react";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import Moment from "moment";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
    <div>
      <MaterialDateDefault
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        searchInvoices={handleSearch}
      />
      <Grid container spacing={3} style={{ marginTop: "1rem" }}>
        <Grid item xs={3}>
          <Autocomplete
            fullWidth
            value={filter}
            options={options}
            onChange={filterChange}
            disableClearable
            noOptionsText="Выберите фильтр из списка"
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.label === filter.label}
            renderInput={(params) => (
              <TextField {...params} label="Фильтр" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            fullWidth
            value={filterType}
            options={typeOptions}
            onChange={filterTypeChange}
            disableClearable
            noOptionsText="Выберите фильтр из списка"
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option) => option.label === filterType.label}
            renderInput={(params) => (
              <TextField {...params} label="Фильтр-2" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
}
