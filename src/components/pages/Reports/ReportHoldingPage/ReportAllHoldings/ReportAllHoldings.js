import React, { useState, Fragment } from "react";
import holdingtypes from "../../../../../data/holdingtypes";
import ReportFizCustomers from "../../../Reports/ReportFizCustomers";
import ReportSalesPlanTeam from "../../../Reports/ReportSalesPlanTeam";
import ReportSalesSection from "../../../Reports/ReportSalesSection";
import ReportTransactions from "../../../Reports/ReportTransactions";
import ReportBonuses from "../ReportBonuses";
import ReportCashboxState from "../../ReportCashboxState";

export default function ReportAllHoldings() {
  const [reportMode, setReportMode] = useState("reportFizCustomers");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };

  return (
    <div className="report">
      <div className="col-md-12">
        <div className="row">
          {holdingtypes.map((report) => (
            <div
              style={{ paddingTop: "5px", paddingBottom: "5px" }}
              className="col-md-4"
              key={report.id}
            >
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
      </div>

      {reportMode && (
        <Fragment>
          <div className="empty-space" />
          <div className="row mt-10">
            <div className="col-md-12">
              {reportMode === "reportcashboxstate" && (
                <ReportCashboxState company={""} holding={true} />
              )}
              {reportMode === "reportFizCustomers" && (
                <ReportFizCustomers companyProps={""} holding={true} />
              )}
              {reportMode === "reportbonuses" && (
                <ReportBonuses company={""} holding={true} />
              )}
              {reportMode === "reportsalesplanteam" && (
                <ReportSalesPlanTeam company={""} holding={true} />
              )}
              {reportMode === "reportsalessection" && (
                <ReportSalesSection companyProps={""} holding={true} />
              )}
              {reportMode === "reporttransactions" && (
                <ReportTransactions companyProps={""} holding={true} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
