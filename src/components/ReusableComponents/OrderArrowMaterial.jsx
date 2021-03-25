import React from "react";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export default function OrderArrowMaterial({ ascending }) {
  return (
    <span style={{ marginLeft: "5px" }}>
      {ascending && <ArrowDropUpIcon />}
      {!ascending && <ArrowDropDownIcon />}
    </span>
  );
}
