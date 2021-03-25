import React, { useState, Fragment } from "react";
import ReportExactHolding from "./ReportExactHolding";
import ReportAllHoldings from "./ReportAllHoldings";
import reportholdings from "../../../../data/reportholdings";

export default function ReportHoldingPage() {
  const [reportMode, setReportMode] = useState("ReportExactHolding");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };

  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {reportholdings.map((report) => (
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
              {reportMode === "ReportExactHolding" && <ReportExactHolding />}

              {reportMode === "ReportAllHoldings" && <ReportAllHoldings />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
