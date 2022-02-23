import React, { Fragment, useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";

const CheckBoxList = ({
  category,
  functions,
  setAllChecks,
  allFunctions,
  checkedCheckboxes
}) => {

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>
        <Checkbox
          onChange={(e) =>
            setAllChecks(
              e,
              functions.map((access) => access.key),
            )
          }
          checked={allFunctions.every((fn) => {
            return checkedCheckboxes.some((ch) => ch.id==fn.id)
          })}
        />
        {category}
      </div>
      <div>{functions}</div>
    </div>
  );
};

export default CheckBoxList;
