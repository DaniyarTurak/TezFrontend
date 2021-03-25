import React, { useState, Fragment } from "react";
import ConsignmentProducts from "./ConsignmentProducts";
import ConsignmentSales from "./ConsignmentSales";
import CounterpartiesReport from "./CounterpartiesReport";
import reportrevision from "../../../../data/consignmentreport";

export default function ConsignmentReports({
  companyProps,
  changeParentReportMode,
}) {
  const [parameters, setParameters] = useState("");
  const [reportMode, setReportMode] = useState("ConsignmentProducts");

  const changeReportMode = (e, params) => {
    if (params) {
      // для перехода из консигнации в другие отчёты (временно)
      setReportMode(e);
      setParameters(params);
    } else {
      setReportMode(e.target.name);
      setParameters("");
    }
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
              {reportMode === "ConsignmentProducts" && (
                <ConsignmentProducts
                  companyProps={companyProps}
                  changeParentReportMode={changeParentReportMode}
                  parameters={parameters}
                />
              )}
              {reportMode === "ConsignmentSales" && (
                <ConsignmentSales companyProps={companyProps} />
              )}
              {reportMode === "CounterpartiesReport" && (
                <CounterpartiesReport
                  companyProps={companyProps}
                  changeParentReportMode={changeParentReportMode}
                  changeCurrentReportMode={changeReportMode}
                />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
