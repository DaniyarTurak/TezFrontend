import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

export default function DatePickerQuarter({ handleYear }) {
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (date) => {
    handleYear(date);
    setStartDate(date);
  };

  return (
    <div className="col-md-2 date-block">
      <div className="col-md-3 sale-report-filter">
        <label>Год</label>
        <DatePicker
          locale={ru}
          className="form-control"
          selected={startDate}
          onChange={handleChange}
          showYearDropdown
          yearDropdownItemNumber={15}
          scrollableYearDropdown
        />
      </div>
    </div>
  );
}
