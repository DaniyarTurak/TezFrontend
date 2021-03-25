import React, { Component } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

//import cnofeaList from "../../../data/cnofea.json";

export default class ProductAlerts extends Component {
  state = {
    details: {},
    disableButton: false,
    invoiceNumber: this.props.invoiceNumber,
    pleaseWait: "Пожалуйста подождите...",
  };

  componentDidMount() {}

  closeAlert = () => {
    this.props.closeAlert(true);
  };

  submit = () => {
    const { invoiceNumber } = this.state;
    this.setState({ disableButton: true });
    const req = { invoice: invoiceNumber };
    Axios.post("/api/invoice/submit/add", req)
      .then(() => {
        this.setState({ disableButton: false });
        this.props.history.push({
          pathname: "/usercabinet/product",
          state: {
            fromSubmitInvoice: true,
          },
        });
      })
      .catch((err) => {
        this.setState({ disableButton: false });
        ErrorAlert(err);
        this.closeAlert();
      });
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
          <p> Вы действительно хотите сохранить и закрыть накладную?</p>
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
