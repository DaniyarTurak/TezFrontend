import React, { Component, Fragment } from "react";
import AddPromotions from "./AddPromotions";
import CurrentPromotions from "./CurrentPromotions";
import OldPromotions from "./OldPromotions";
import promotions from "../../../../data/promotions";

export default class PromotionsPage extends Component {
  state = {
    mode: "CurrentPromotions"
  };

  changeReportMode = e => {
    this.setState({ mode: e.target.name });
  };

  render() {
    const { mode } = this.state;
    return (
      <div className="report">
        <div className={`row ${mode ? "pb-10" : ""}`}>
          {promotions.map(promo => (
            <div className="col-md-3 report-btn-block" key={promo.id}>
              <button
                className={`btn btn-sm btn-block btn-report ${
                  mode === promo.route ? "btn-info" : "btn-outline-info"
                }`}
                name={promo.route}
                onClick={this.changeReportMode}
              >
                {promo.caption}
              </button>
            </div>
          ))}
        </div>

        {mode && (
          <Fragment>
            <div className="empty-space" />

            <div className="row mt-10">
              <div className="col-md-12">
                {mode === "CurrentPromotions" && <CurrentPromotions />}
                {mode === "AddPromotions" && <AddPromotions />}
                {mode === "OldPromotions" && <OldPromotions />}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
