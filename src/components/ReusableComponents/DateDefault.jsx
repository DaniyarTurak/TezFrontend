import React from "react";
import Box from "@material-ui/core/Box";

export default function PeriodSales({
  changeDate,
  dateFrom,
  dateFromChange,
  dateTo,
  dateToChange,
  handleSearch,
}) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      className="row"
      justifyContent="space-around"
    >
      <div className="col-md-2 today-btn">
        <label />
        <button
          className="btn btn-block btn-outline-success"
          style={{ minWidth: "" }}
          onClick={() => changeDate("today")}
        >
          Сегодня
        </button>
      </div>
      <div className="col-md-2 month-btn">
        <label />
        <button
          className="btn btn-block btn-outline-success"
          onClick={() => changeDate("month")}
        >
          Текущий месяц
        </button>
      </div>
      <div className="col-md-2 date-block">
        <label>Дата с</label>
        <input
          type="date"
          value={dateFrom}
          className="form-control"
          name="dateFrom"
          onChange={dateFromChange}
        />
      </div>
      <div className="col-md-2 date-block">
        <label>Дата по</label>
        <input
          type="date"
          value={dateTo}
          className="form-control"
          name="dateTo"
          onChange={dateToChange}
        />
      </div>
      <div className="col-md-2 today-btn">
        <label />
        <button
          className="btn btn-block btn-outline-success"
          onClick={handleSearch}
        >
          Поиск
        </button>
      </div>
    </Box>
  );
}
