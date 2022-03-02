import React, { Fragment, useState } from "react";
import ReportStockBalanceExtended from "../ReportStockBalanceExtended";
import ReportStockBalanceSimple from "../ReportStockBalanceSimple";
import stockbalance from "../../../../data/stockbalance.json";

const ReportStockBalance = ({ history, location }) => {
  // const [extended, setExtended] = useState(false);

  // const pageChange = () => {
  //   setExtended(!extended);
  // };
  const [mode, setMode] = useState("ReportStockBalanceSimple");

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
                mode === st.route ? "btn-danger" : "btn-outline-danger"
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
              {mode === "ReportStockBalanceSimple" && (
                <ReportStockBalanceSimple
                  history={history}
                  location={location}
                />
              )}
              {mode === "ReportStockBalanceExtended" && (
                <ReportStockBalanceExtended
                  history={history}
                  location={location}
                />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );

  // if (extended) {
  //   return (
  //     <ReportStockBalance
  //       history={history}
  //       location={location}
  //       pageChange={pageChange}
  //     />
  //   );
  // } else {
  //   return (
  //     <ReportStockBalanceSimple
  //       history={history}
  //       location={location}
  //       pageChange={pageChange}
  //     />
  //   );
  // }
};

export default ReportStockBalance;
