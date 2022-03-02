import React, { useState, useEffect, Fragment } from "react";
import reports_recon from "../../../data/reports_recon";
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
//import ReportStockBalance from "./ReportStockBalance";
import ReportSalesSection from "./ReportSalesSection";
import ReportSalesPlan from "./ReportSalesPlan";
import ReportSalesPlanTeam from "./ReportSalesPlanTeam";
import ReportSales from "./ReportSales";
import ReportTransactions from "./ReportTransactions";
import AbcXyzPage from "./AbcXyzPage";
import ShelfLifePage from "./ShelfLifePage";
import ReconciliationPage from "./ReconciliationPage";
import ReportDebtPage from "./ReportDebtPage";
import ReportProductsPeriod from "./ReportProductsPeriod";
import ReportStockBalanceParent from "./ReportStockBalanceParent";
import ReportIlliquidProducts from "./ReportIlliquidProducts";

export default function ReportPage({ type, history, location }) {
  const [parameters, setParameters] = useState("");
  const [reportMode, setReportMode] = useState(null);
  const [typeMode, setTypeMode] = useState(type ? type : "report");
  const [userAccesses, setUserAccesses] = useState(
    JSON.parse(sessionStorage.getItem("isme-user-accesses")) || []
  );

  useEffect(() => {
    setTypeMode(type);
    setReportMode(null);
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

  const checkAccess = (code) => {
    return userAccesses.some((access) => access.code == code);
  };

  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {reports_recon.map(
          (report) =>
            typeMode === report.type &&
            checkAccess(report.code) && (
              <div className="col-md-3 report-btn-block" key={report.id}>
                <button
                  className={`btn btn-sm btn-block btn-report ${
                    reportMode === report.route
                      ? "btn-info"
                      : "btn-outline-info"
                  }`}
                  name={report.route}
                  onClick={changeReportMode} // disabled={!checkAccess(report.code)}
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
                <CertificatesPage
                  history={history}
                  location={location}
                  parameters={parameters}
                />
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
              {typeMode === "report" && reportMode === "reportdebtpage" && (
                <ReportDebtPage history={history} location={location} />
              )}
              {typeMode === "report" && reportMode === "abcxyz" && (
                <AbcXyzPage history={history} location={location} />
              )}
              {typeMode === "report" &&
                reportMode === "reportilliquidproducts" && (
                  <ReportIlliquidProducts
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
                  <ReportStockBalanceParent
                    history={history}
                    location={location}
                  />
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

              {typeMode === "stockreport" && reportMode === "shelflife" && (
                <ShelfLifePage history={history} location={location} />
              )}
              {typeMode === "stockreport" &&
                reportMode === "reconciliation" && (
                  <ReconciliationPage history={history} location={location} />
                )}

              {typeMode === "stockreport" &&
                reportMode === "productreportsperiod" && (
                  <ReportProductsPeriod history={history} location={location} />
                )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
