import React, { Component } from "react";
import Breadcrumb from "../../Breadcrumb";

class ReferencesListPage extends Component {
  state = {
    breadcrumb: [{ caption: "Справочники", active: true }],
    isLoading: false,
    clickedBtn: "",
    label: {
      counterparties: "Контрагенты",
      buyers: "Покупатели",
      brand: "Бренды",
      pleaseWait: "Пожалуйста подождите...",
    },
  };

  handlePath = (e) => {
    this.setState({ clickedBtn: e.target.name, isLoading: true });
    this.path(e);
  };

  path = (e) => {
    const target = e.target.name;
    this.props.history.push("references/" + target);
  };

  render() {
    const { breadcrumb, label, isLoading, clickedBtn } = this.state;
    return (
      <div className="references">
        <Breadcrumb content={breadcrumb} />

        <div className="row">
          <div className="col-md-3">
            <button
              className="btn btn-block btn-outline-success"
              disabled={isLoading && clickedBtn === "counterparties"}
              name="counterparties"
              onClick={this.handlePath}
            >
              {isLoading && clickedBtn === "counterparties"
                ? label.pleaseWait
                : label.counterparties}
            </button>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-block btn-outline-success"
              disabled={isLoading && clickedBtn === "buyers"}
              name="buyers"
              onClick={this.handlePath}
            >
              {isLoading && clickedBtn === "buyers"
                ? label.pleaseWait
                : label.buyers}
            </button>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-block btn-outline-success"
              disabled={isLoading && clickedBtn === "brand"}
              name="brand"
              onClick={this.handlePath}
            >
              {isLoading && clickedBtn === "brand"
                ? label.pleaseWait
                : label.brand}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReferencesListPage;
