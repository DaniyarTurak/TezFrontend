import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

export default function DatePickerQuarter({ handleQuarter }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (date) => {
    handleQuarter(date);
    setStartDate(date);
  };

  return (
    <div className="col-md-2 date-block">
      <div className="col-md-3s">
        <label>Квартал</label>
        <DatePicker
          locale="ru"
          className="form-control"
          selected={startDate}
          onChange={handleChange}
          dateFormat="yyyy, QQQ"
          showQuarterYearPicker
        />
      </div>
    </div>
  );
}
