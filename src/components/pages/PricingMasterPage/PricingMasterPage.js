import React, { useState, Fragment } from "react";
import MarginOptions from "./MarginOptions";
import AdditionalOptions from "./AdditionalOptions";
import SellingPrices from "./SellingPrices";
import PurchasePrices from "./PurchasePrices";
import pricing from "../../../data/pricing.json";

export default function PricingMasterPage() {
  const [mode, setMode] = useState("MarginOptions");

  const changeReportMode = (e) => {
    setMode(e.target.name);
  };

  //1-я вкладка - настройка маржи, 2 - сохраненный список, 3- настройка уведомлений.
  return (
    <div>
      <div className={`row ${mode ? "pb-10" : ""}`}>
        {pricing.map((pr) => (
          <div className="col-md-3 report-btn-block" key={pr.id}>
            <button
              className={`btn btn-sm btn-block btn-report ${
                mode === pr.route ? "btn-info" : "btn-outline-info"
              }`}
              name={pr.route}
              onClick={changeReportMode}
            >
              {pr.caption}
            </button>
          </div>
        ))}
      </div>

      {mode && (
        <Fragment>
          <div className="empty-space" />

          <div className="row mt-10">
            <div className="col-md-12">
              {mode === "MarginOptions" && <MarginOptions />}
              {mode === "AdditionalOptions" && <AdditionalOptions />}
              {mode === "PurchasePrices" && <PurchasePrices />}
              {mode === "SellingPrices" && <SellingPrices />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
