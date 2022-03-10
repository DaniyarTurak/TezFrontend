import React, { Fragment, useState } from "react";
import ReportSalesExtended from "./ReportSalesExtended";
import ReportSalesSimple from "./ReportSalesSimple";
import stockbalance from "../../../../data/sales.json";

const ReportSales = ({ history, location }) => {
  const [mode, setMode] = useState("ReportSalesSimple");

  const changeReportMode = (e) => {
    setMode(e.target.name);
  };

  return (
    <div>
      <div className={`row ${mode ? "pb-10" : ""}`}>
        {stockbalance.map((st) => (
          <div className="col-md-3 report-btn-block" key={st.id}>
            <button
              className={`btn btn-sm btn-block btn-report ${
                mode === st.route ? "btn-secondary" : "btn-outline-secondary"
              }`}
              name={st.route}
              onClick={changeReportMode}
            >
              {st.caption}
            </button>
          </div>
        ))}
      </div>

      {mode && (
        <Fragment>
          <div className="row mt-10">
            <div className="col-md-12">
              {mode === "ReportSalesSimple" && (
                <ReportSalesSimple history={history} location={location} />
              )}
              {mode === "ReportSalesExtended" && (
                <ReportSalesExtended history={history} location={location} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ReportSales;
