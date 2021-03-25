import React, { useState, Fragment } from "react";
import PosUpdateStatus from "./PosUpdateStatus";
import PosUpdateList from "./PosUpdateList";
import ReportPos from "./ReportPos";
import pospages from "../../../../data/pospages";

export default function PosPage() {
  const [reportMode, setReportMode] = useState("PosUpdateStatus");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };

  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {pospages.map((report) => (
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
              {reportMode === "PosUpdateStatus" && <PosUpdateStatus />}
              {reportMode === "PosUpdateList" && <PosUpdateList />}
              {reportMode === "ReportPos" && <ReportPos />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
