import React, { Fragment, useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";

const CheckBoxList = ({
  category,
  functions,
  setAllChecks,
  accessFunctions,
}) => {
  //console.log("Category: ", category);
  //console.log("Functions: ", functions);<Checkbox onChange={() => setAllChecks()} />
  const [checkedAll, setCheckedAll] = useState(
    functions.length == accessFunctions.length
  );

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>
        <Checkbox
          onChange={(e) =>
            setAllChecks(
              e,
              functions.map((access) => access.key),
              setCheckedAll
            )
          }
          checked={checkedAll}
        />
        {category}
      </div>
      <div>{functions}</div>
    </div>
  );
};

export default CheckBoxList;
