import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  type = "checkbox",
  name,
  checked = false,
  onChange,
  disabled = false
}) => (
  <input
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
    disabled={disabled}
  />
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
