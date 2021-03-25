import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

export default class DatePickerQuarter extends React.Component {
  state = {
    startDate: new Date(),
  };

  handleChange = (date) => {
    this.props.handleYear(date);
    this.setState({
      startDate: date,
    });
  };

  render() {
    return (
      <div className="col-md-2 date-block">
        <div className="col-md-3 sale-report-filter">
          <label>Год</label>
          <DatePicker
            locale={ru}
            className="form-control"
            selected={this.state.startDate}
            onChange={this.handleChange}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
          />
        </div>
      </div>
    );
  }
}
