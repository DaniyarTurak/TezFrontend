import React, { useState, useEffect, Fragment } from "react";
import reports from "../../../data/reports";

import CertificatesPage from "./CertificatesPage";
import ConsignmentReports from "./ConsignmentReports";
import ReportCashboxState from "./ReportCashboxState";
import ReportConsultants from "./ReportConsultants";
import ReportDiscounts from "./ReportDiscounts";
import ReportHoldingPage from "./ReportHoldingPage";
import ReportIncome from "./ReportIncome";
import ReportInvoiceHistory from "./ReportInvoiceHistory";
import ReportFizCustomers from "./ReportFizCustomers";
import ReportProductMovement from "./ReportProductMovement";
import ReportRevision from "./ReportRevision";
import ReportStockBalance from "./ReportStockBalance";
import ReportSalesSection from "./ReportSalesSection";
import ReportSalesPlan from "./ReportSalesPlan";
import ReportSalesPlanTeam from "./ReportSalesPlanTeam";
import ReportSales from "./ReportSales";
import ReportTransactions from "./ReportTransactions";
import AbcXyzPage from "./AbcXyzPage";
import ShelfLifePage from "./ShelfLifePage";
import ReconciliationPage from "./ReconciliationPage";

export default function ReportPage({ type, history, location }) {
  // const counter = useSelector((state) => state.counter);
  // console.log(counter);

  const [parameters, setParameters] = useState("");
  const [reportMode, setReportMode] = useState(
    type === "report"
      ? "reportcashboxstate"
      : location.state
        ? location.state
        : "reportstockbalance"
  );
  const [typeMode, setTypeMode] = useState(type ? type : "report");

  useEffect(() => {
    setTypeMode(type);
    setReportMode(
      type === "report"
        ? reportMode === "reporttransactions"
          ? "reporttransactions"
          : "reportcashboxstate"
        : location.state
          ? location.state
          : "reportstockbalance"
    );
  }, [type]);

  // componentWillMount() {
  //   document.body.setAttribute("style", "background-color:#f4f4f4 !important");
  // }

  const changeReportMode = (e, params) => {
    if (params) {
      // для перехода из консигнации в другие отчёты (временно)
      if (e === "reporttransactions") {
        setTypeMode("report");
      }
      setParameters(params);
      setReportMode(e);
    } else {
      setReportMode(e.target.name);
      setParameters("");
    }
  };

  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {reports.map(
          (report) =>
            typeMode === report.type && (
              <div className="col-md-3 report-btn-block" key={report.id}>
                <button
                  className={`btn btn-sm btn-block btn-report ${reportMode === report.route
                    ? "btn-info"
                    : "btn-outline-info"
                    }`}
                  name={report.route}
                  onClick={changeReportMode}
                >
                  {report.caption}
                </button>
              </div>
            )
        )}
      </div>

      {reportMode && (
        <Fragment>
          <div className="empty-space" />

          <div className="row mt-10">
            <div className="col-md-12">
              {typeMode === "report" && reportMode === "certificatespage" && (
                <CertificatesPage history={history} location={location} parameters={parameters} />
              )}

              {typeMode === "report" && reportMode === "reportcashboxstate" && (
                <ReportCashboxState history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportsalessection" && (
                <ReportSalesSection history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reporttransactions" && (
                <ReportTransactions
                  history={history}
                  location={location}
                  parameters={parameters}
                />
              )}

              {typeMode === "report" && reportMode === "reportsales" && (
                <ReportSales history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportsalesplan" && (
                <ReportSalesPlan history={history} location={location} />
              )}

              {typeMode === "report" &&
                reportMode === "reportsalesplanteam" && (
                  <ReportSalesPlanTeam
                    holding={false}
                    companyProps={""}
                    history={history}
                    location={location}
                  />
                )}

              {typeMode === "report" && reportMode === "reportincome" && (
                <ReportIncome history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportdiscounts" && (
                <ReportDiscounts history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportconsultants" && (
                <ReportConsultants history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportFizCustomers" && (
                <ReportFizCustomers
                  holding={false}
                  company={""}
                  history={history}
                  location={location}
                />
              )}

              {typeMode === "stockreport" &&
                reportMode === "reportholdingpage" && (
                  <ReportHoldingPage history={history} location={location} />
                )}
              {typeMode === "stockreport" &&
                reportMode === "reportstockbalance" && (
                  <ReportStockBalance history={history} location={location} />
                )}

              {typeMode === "stockreport" &&
                reportMode === "reportinvoicehistory" && (
                  <ReportInvoiceHistory
                    history={history}
                    location={location}
                    parameters={parameters}
                  />
                )}

              {typeMode === "stockreport" &&
                reportMode === "reportproductmovement" && (
                  <ReportProductMovement
                    history={history}
                    location={location}
                    parameters={parameters}
                  />
                )}

              {typeMode === "stockreport" && reportMode === "revision" && (
                <ReportRevision history={history} location={location} />
              )}

              {typeMode === "stockreport" &&
                reportMode === "consignmentreports" && (
                  <ConsignmentReports
                    history={history}
                    location={location}
                    changeParentReportMode={changeReportMode}
                  />
                )}

              {typeMode === "report" && reportMode === "abcxyz" && (
                <AbcXyzPage history={history} location={location} />
              )}

              {typeMode === "stockreport" && reportMode === "shelflife" && (
                <ShelfLifePage history={history} location={location} />
              )}
              {typeMode === "stockreport" && reportMode === "reconciliation" && (
                <ReconciliationPage history={history} location={location} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
