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
    <DatePicker
      locale="ru"
      className="form-control"
      selected={startDate}
      onChange={handleChange}
      dateFormat="yyyy, QQQ"
      showQuarterYearPicker
    />
  );
}
