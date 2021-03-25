import React, { Component, Fragment } from "react";
import Searching from "../Searching";
import Moment from "moment";

import "moment/locale/ru";
Moment.locale("ru");

export default class GeneralDetails extends Component {
  state = {
    details: {},
    isLoading: false,
    product: "",
    modalIsOpen: false
  };

  closeModalSure = () => {
    this.props.closeDetailSure(true);
  };

  closeModal = () => {
    this.props.closeDetail(true);
  };

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <Searching />;
    }
    return (
      <div className="transaction-details">
        {!isLoading && (
          <Fragment>
            <div>
              <h6>Внимание! Вы уверены что хотите изменить данные по НДС?</h6>
            </div>

            <hr />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <button
                style={{ width: "30%", height: "80px" }}
                className="btn btn-outline-primary"
                onClick={this.closeModalSure}
              >
                Да
              </button>
              <button
                style={{ width: "30%" }}
                className="btn btn-outline-dark"
                onClick={this.closeModal}
              >
                Отмена
              </button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
