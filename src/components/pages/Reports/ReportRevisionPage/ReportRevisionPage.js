import React, { useState, Fragment } from "react";
import ReportRevision from "./ReportRevision";
//import RevisionConfirm from "./RevisionConfirm";
import reportrevision from "../../../../data/reportrevision";

export default function ReportRevisionPage({ companyProps }) {
  const [reportMode, setReportMode] = useState("ReportRevision");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };
  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {reportrevision.map((report) => (
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
              {reportMode === "ReportRevision" && (
                <ReportRevision companyProps={companyProps} />
              )}

              {/* Для подтверждения ревизии перед добавлением. {reportMode === "RevisionConfirm" && <RevisionConfirm />} */}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
