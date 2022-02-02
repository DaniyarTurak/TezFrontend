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
import ReportStockBalance from "./ReportStockBalance";
import ReportSalesSection from "./ReportSalesSection";
import ReportSalesPlan from "./ReportSalesPlan";
import ReportSalesPlanTeam from "./ReportSalesPlanTeam";
import ReportSales from "./ReportSales";
import ReportTransactions from "./ReportTransactions";
import AbcXyzPage from "./AbcXyzPage";
import ShelfLifePage from "./ShelfLifePage";
import ReconciliationPage from "./ReconciliationPage";
import ReportDebtPage from "./ReportDebtPage";

export default function ReportPage({ type, history, location }) {
  const [parameters, setParameters] = useState("");
  const [reportMode, setReportMode] = useState(
    type === "report"
      ? "reportcashboxstate"
      : location.state
        ? location.state
        : "reportstockbalance"
  );
  const [typeMode, setTypeMode] = useState(type ? type : "report");
  const [userAccesses, setUserAccesses] = useState(JSON.parse(sessionStorage.getItem("isme-user-accesses")) || [])

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

  const checkAccess = (code) => {
    return userAccesses.some((access) => access.code == code)
  }
  
  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {reports_recon.map(
          (report) =>
            typeMode === report.type && (
              <div className="col-md-3 report-btn-block" key={report.id}>
                <button
                  className={`btn btn-sm btn-block btn-report ${reportMode === report.route
                    ? "btn-info"
                    : checkAccess(report.code) ? "btn-outline-info" : "btn-outline-secondary"
                    }`}
                  name={report.route}
                  onClick={changeReportMode}
                  disabled={!checkAccess(report.code)}
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
              {typeMode === "report" && reportMode === "certificatespage"  && checkAccess("rep_certificates") && (
                <CertificatesPage history={history} location={location} parameters={parameters} />
              )}

              {typeMode === "report" && reportMode === "reportcashboxstate" && checkAccess("rep_checkout") && (
                <ReportCashboxState history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportsalessection" && checkAccess("rep_sales") && (
                <ReportSalesSection history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reporttransactions" && checkAccess("rep_checks") && (
                <ReportTransactions
                  history={history}
                  location={location}
                  parameters={parameters}
                />
              )}

              {typeMode === "report" && reportMode === "reportsales" && checkAccess("rep_prod_solds") &&  (
                <ReportSales history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportsalesplan" && checkAccess("rep_single_bonus") &&  (
                <ReportSalesPlan history={history} location={location} />
              )}

              {typeMode === "report" &&
                reportMode === "reportsalesplanteam" && checkAccess("rep_team_bonus") && (
                  <ReportSalesPlanTeam
                    holding={false}
                    companyProps={""}
                    history={history}
                    location={location}
                  />
                )}

              {typeMode === "report" && reportMode === "reportincome" && checkAccess("rep_gross_profit") && (
                <ReportIncome history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportdiscounts" && checkAccess("rep_discounts") && (
                <ReportDiscounts history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportconsultants" && checkAccess("rep_consultants") && (
                <ReportConsultants history={history} location={location} />
              )}

              {typeMode === "report" && reportMode === "reportFizCustomers" && checkAccess("rep_buyers") && (
                <ReportFizCustomers
                  holding={false}
                  company={""}
                  history={history}
                  location={location}
                />
              )}
               {typeMode === "report" && reportMode === "reportdebtpage" && checkAccess("rep_debt_book") && (
                <ReportDebtPage history={history} location={location} />
              )}

              {typeMode === "stockreport" &&
                reportMode === "reportholdingpage" && checkAccess("whs_holdings") &&  (
                  <ReportHoldingPage history={history} location={location} />
                )}
              {typeMode === "stockreport" &&
                reportMode === "reportstockbalance" && checkAccess("whs_leftovers") && (
                  <ReportStockBalance history={history} location={location} />
                )}

              {typeMode === "stockreport" &&
                reportMode === "reportinvoicehistory" && checkAccess("whs_inv_history") && (
                  <ReportInvoiceHistory
                    history={history}
                    location={location}
                    parameters={parameters}
                  />
                )}

              {typeMode === "stockreport" &&
                reportMode === "reportproductmovement" && checkAccess("whs_prod_move") && (
                  <ReportProductMovement
                    history={history}
                    location={location}
                    parameters={parameters}
                  />
                )}

              {typeMode === "stockreport" && reportMode === "revision" && checkAccess("whs_revision") && (
                <ReportRevision history={history} location={location} />
              )}

              {typeMode === "stockreport" &&
                reportMode === "consignmentreports" && checkAccess("whs_consignment") && (
                  <ConsignmentReports
                    history={history}
                    location={location}
                    changeParentReportMode={changeReportMode}
                  />
                )}

              {typeMode === "report" && reportMode === "abcxyz" && checkAccess("rep_abc_xyz") && (
                <AbcXyzPage history={history} location={location} />
              )}

              {typeMode === "stockreport" && reportMode === "shelflife" && checkAccess("whs_exp_dates") && (
                <ShelfLifePage history={history} location={location} />
              )}
              {typeMode === "stockreport" && reportMode === "reconciliation" && checkAccess("whs_reconciliation") && (
                <ReconciliationPage history={history} location={location} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
