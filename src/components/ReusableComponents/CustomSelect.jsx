import React from "react";
import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "white",
    border: '2px solid #ced4da',
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      border: '2px solid #17a2b8',

    }
  })
};

export default function CustomSelect({
  options,
  onChange,
  placeholder,
  disabled,
  value,
  onInputChange,
}) {
  return (
    <Select
      onInputChange={onInputChange}
      allowClear
      value={value}
      isDisabled={disabled}
      styles={customStyles}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
