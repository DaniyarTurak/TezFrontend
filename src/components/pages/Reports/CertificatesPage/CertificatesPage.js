import React, { useState, Fragment } from "react";
import ReportCertificateStatus from "./ReportCertificateStatus";
import ReportCertificateDetails from "./ReportCertificateDetails";
import certificates from "../../../../data/certificates";

export default function CertificatesPage({ companyProps }) {
  const [reportMode, setReportMode] = useState("ReportCertificateStatus");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };

  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {certificates.map((report) => (
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
              {reportMode === "ReportCertificateStatus" && (
                <ReportCertificateStatus companyProps={companyProps} />
              )}

              {reportMode === "ReportCertificateDetails" && (
                <ReportCertificateDetails companyProps={companyProps} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
