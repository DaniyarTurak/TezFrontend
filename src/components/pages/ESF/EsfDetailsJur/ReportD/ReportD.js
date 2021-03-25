import React, { Component } from "react";

export default class ReportD extends Component {
  closeEsf = () => {
    this.props.closeEsf();
  };

  render() {
    const {
      addressReceive,
      addressSend,
      countryCode,
      TINreceiver,
      TINshipper,
      receiver,
      shipper,
      onAddressReceiveChange,
      onAddressSendChange,
      onCountryCodeChange,
      onTINreceiverChange,
      onTINshipperChange,
      onReceiverChange,
      onShipperChange,
      esfManagement,
    } = this.props;
    return (
      <div>
        <div
          style={{
            background: "cornsilk",
            opacity: "40%",
          }}
          className="row mt-1"
        >
          <p style={{ fontSize: "10px" }} className="col-md-4">
            Грузоотправитель:
          </p>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">ИИН/БИН:</p>
          <input
            type="text"
            className="col-md-7 form-control"
            value={TINshipper}
            placeholder="ИИН/БИН"
            onChange={onTINshipperChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">Грузоотправитель:</p>
          <textarea
            type="text"
            className="col-md-7 form-control"
            value={shipper}
            placeholder="Наименование"
            onChange={onShipperChange}
          ></textarea>
        </div>

        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">Адрес отправки:</p>
          <textarea
            type="text"
            className="col-md-7 form-control"
            value={addressSend}
            placeholder="Адрес отправки"
            onChange={onAddressSendChange}
          ></textarea>
        </div>

        <div
          style={{
            background: "cornsilk",
            opacity: "40%",
          }}
          className="row mt-1"
        >
          <p style={{ fontSize: "10px" }} className="col-md-4">
            Грузополучатель:
          </p>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">ИИН/БИН:</p>
          <input
            type="text"
            className="col-md-7 form-control"
            value={TINreceiver}
            placeholder="ИИН/БИН"
            onChange={onTINreceiverChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">Грузополучатель:</p>
          <textarea
            type="text"
            className="col-md-7 form-control"
            value={receiver}
            placeholder="Наименование"
            onChange={onReceiverChange}
          ></textarea>
        </div>

        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">Адрес доставки:</p>
          <textarea
            type="text"
            className="col-md-7 form-control"
            value={addressReceive}
            placeholder="Адрес доставки"
            onChange={onAddressReceiveChange}
          ></textarea>
        </div>

        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-4">Код страны:</p>
          <input
            type="text"
            className="col-md-7 form-control"
            value={countryCode}
            placeholder="KZ"
            onChange={onCountryCodeChange}
          ></input>
        </div>
        <div style={{ marginBottom: "1rem" }} className="col-md-12 text-center">
          <button
            className="btn btn-success mt-10 mr-10"
            onClick={esfManagement}
          >
            Сохранить изменения
          </button>
          <button className="btn btn-secondary mt-10" onClick={this.closeEsf}>
            Назад
          </button>
        </div>
      </div>
    );
  }
}
