import React, { Component } from "react";

export default class AddProductAlerts extends Component {
  state = {
    disableButton: false,
    pleaseWait: "Пожалуйста подождите...",
  };

  componentDidMount() {}

  closeAlert = (isSubmit) => {
    if (isSubmit === 1) {
      this.props.closeAlert(true);
    } else {
      this.props.closeAlert(false);
    }
  };

  submit = () => {
    this.setState({ disableButton: true });
    this.closeAlert(1);
  };

  render() {
    const { disableButton } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ margin: "2rem" }} className="row">
          <button className="btn btn-warning-icon warn-item" />
        </div>
        <div style={{ fontSize: "2rem" }} className="row">
          <p>Вы уверены?</p>
        </div>
        <div style={{ opacity: "50%" }} className="row">
          <p>
            Вы действительно хотите сохранить товар с нулевой ценой продажи?
          </p>
        </div>
        <div style={{ width: "-webkit-fill-available" }} className="row">
          <div className="col-md-6">
            <button
              className="btn btn-block btn-outline-secondary"
              onClick={this.closeAlert}
            >
              Нет, отменить
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-block btn-outline-success"
              onClick={this.submit}
              disabled={disableButton}
            >
              Да, я уверен
            </button>
          </div>
        </div>
      </div>
    );
  }
}
