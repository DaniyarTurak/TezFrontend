import React, { useState, Fragment } from "react";
import CreateCoupons from "./CreateCoupons";
import ExistingCoupons from "./ExistingCoupons";
import coupons from "../../../../data/coupons.json";

export default function CouponsPage() {
  const [reportMode, setReportMode] = useState("CreateCoupons");

  const changeReportMode = (e) => {
    setReportMode(e.target.name);
  };
  return (
    <div className="report">
      <div className={`row ${reportMode ? "pb-10" : ""}`}>
        {coupons.map((report) => (
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
              {reportMode === "CreateCoupons" && <CreateCoupons />}

              {reportMode === "ExistingCoupons" && <ExistingCoupons />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
