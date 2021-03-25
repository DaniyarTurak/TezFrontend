import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navigation({
  subgroup,
  ind,
  reportMode,
  changeReportMode,
  newsLoaded,
}) {
  useEffect(() => {
    newsLoaded();
  }, []);

  return (
    <NavLink
      key={subgroup.name + subgroup.id}
      activeClassName="nav-active"
      to={
        subgroup.route === "product/revision"
          ? `/revision/params`
          : `/usercabinet/${subgroup.route}`
      }
    >
      <li
        key={ind}
        className={`subgroup-tab ${
          subgroup.route === reportMode ? "active" : ""
        }`}
        onClick={() => changeReportMode(subgroup.route)}
      >
        {subgroup.name}
      </li>
    </NavLink>
  );
}
