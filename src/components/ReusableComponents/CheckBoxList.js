import React, { Fragment, useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";

const CheckBoxList = ({ category, functions, setAllChecks }) => {
  //console.log("Category: ", category);
  //console.log("Functions: ", functions);

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>
        <Checkbox
          onChange={(e) =>
            setAllChecks(
              e,
              functions.map((access) => access.key)
            )
          }
        />
        {category}
      </div>
      <div>{functions}</div>
    </div>
  );
};

export default CheckBoxList;
