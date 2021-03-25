import React, { useState, Fragment } from "react";
import Companies from "./Companies";
import Sales from "./Sales";
import consolidated from "../../../../data/consolidated";

export default function ConsolidatedReports() {
  const [reportMode, setReportMode] = useState("Companies");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };

  return (
    <div>
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {consolidated.map((report) => (
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
              {reportMode === "Companies" && <Companies />}

              {reportMode === "Sales" && <Sales />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
