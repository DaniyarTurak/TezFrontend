import React, { useState, Fragment } from "react";
import CreateDiscounts from "./CreateDiscounts";
import DisabledDiscounts from "./DisabledDiscounts";
import ShelfLife from "./ShelfLife";
import discounts from "../../../../data/discounts";

export default function DiscountsPage() {
  const [reportMode, setReportMode] = useState("CreateDiscounts");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };
  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {discounts.map((report) => (
          <div className="col-md-3 report-btn-block" key={report.id}>
            <button
              className={`btn btn-sm btn-block btn-report ${
                reportMode === report.route ? "btn-info" : "btn-outline-info"
              }`}
              name={report.route}
              onClick={changeReportMode}
            >
              {report.caption}
            </button>
          </div>
        ))}
      </div>

      {reportMode && (
        <Fragment>
          <div className="empty-space" />

          <div className="row mt-10">
            <div className="col-md-12">
              {reportMode === "CreateDiscounts" && <CreateDiscounts />}

              {reportMode === "ShelfLife" && <ShelfLife />}

              {reportMode === "DisabledDiscounts" && <DisabledDiscounts />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
