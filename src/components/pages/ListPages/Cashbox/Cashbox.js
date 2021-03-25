import React, { Component, Fragment } from "react";
import CashboxListPage from "./CashboxListPage";
import EditCashbox from "./EditCashbox";
import cashboxes from "../../../../data/cashboxes";

export default class Cashbox extends Component {
  state = {
    cashboxMode: "CashboxListPage"
  };

  changeCashboxMode = e => {
    this.setState({ cashboxMode: e.target.name });
  };

  render() {
    const { cashboxMode } = this.state;
    return (
      <div className="report">
        <div className={`row ${cashboxMode ? "pb-10" : ""}`}>
          {cashboxes.map(cashbox => (
            <div className="col-md-3 report-btn-block" key={cashbox.id}>
              <button
                className={`btn btn-sm btn-block btn-report ${
                  cashboxMode === cashbox.route
                    ? "btn-info"
                    : "btn-outline-info"
                }`}
                name={cashbox.route}
                onClick={this.changeCashboxMode}
              >
                {cashbox.caption}
              </button>
            </div>
          ))}
        </div>

        {cashboxMode && (
          <Fragment>
            <div className="empty-space" />

            <div className="row mt-10">
              <div className="col-md-12">
                {cashboxMode === "CashboxListPage" && (
                  <CashboxListPage
                    history={this.props.history}
                    location={this.props.location}
                  />
                )}

                {cashboxMode === "EditCashbox" && (
                  <EditCashbox
                    history={this.props.history}
                    location={this.props.location}
                  />
                )}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
