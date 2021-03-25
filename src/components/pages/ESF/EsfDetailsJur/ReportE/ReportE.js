import React, { Component } from "react";
import SwitchStyleContract from "./SwitchStyleContract";
import Select from "react-select";

export default class ReportE extends Component {
  closeEsf = () => {
    this.props.closeEsf();
  };

  render() {
    const {
      contract,
      contractDate,
      contractNumber,
      contractConditions,
      destination,
      esfManagement,
      handleSwitch,
      onContractDateChange,
      onContractNumberChange,
      onContractConditionsChange,
      onDestinationChange,
      onPowerOfAttorneyNumberChange,
      onPowerOfAttorneyDateChange,
      onSendMethodChange,
      onSupplyConditionChange,
      powerOfAttorneyNumber,
      powerOfAttorneyDate,
      sendMethod,
      sendMethods,
      supplyCondition,
      supplyConditions,
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
          <p style={{ fontSize: "10px" }} className="col-md-12">
            Договор (контракт) на поставку товаров,работ,услуг
          </p>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">
            Договор (контракт) на поставку товаров,работ,услуг:
          </p>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="col-md-6"
          >
            <SwitchStyleContract
              contract={contract}
              handleSwitch={handleSwitch}
            />
          </div>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">
            Номер договора (контракта) на поставку товаров,работ,услуг:
          </p>
          <input
            type="text"
            className="col-md-6 form-control"
            value={contract ? contractNumber : ""}
            disabled={!contract}
            placeholder="Номер договора (контракта) на поставку товаров,работ,услуг"
            onChange={onContractNumberChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">
            Дата договора (контракта) на поставку товаров,работ,услуг:
          </p>
          <input
            type="date"
            disabled={!contract}
            className="col-md-6 form-control"
            value={contract ? contractDate : ""}
            onChange={onContractDateChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">Условия оплаты по договору:</p>
          <input
            type="text"
            className="col-md-6 form-control"
            value={contractConditions}
            placeholder="Условия оплаты по договору"
            onChange={onContractConditionsChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">Способ отправления:</p>
          <Select
            name="sendMethod"
            className="col-md-6 pl-0 pr-0 mt-3"
            value={sendMethod}
            onChange={onSendMethodChange}
            noOptionsMessage={() => "Способы отправления отсутствуют"}
            options={sendMethods}
            placeholder="Выберите способ отправления"
          />
        </div>
        <div
          style={{
            background: "cornsilk",
            opacity: "40%",
          }}
          className="row mt-1"
        >
          <p style={{ fontSize: "10px" }} className="col-md-12">
            Поставка товаров осуществлена по доверенности
          </p>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">
            Номер доверенности на поставку товаров,работ,услуг:
          </p>
          <input
            type="text"
            className="col-md-6 form-control"
            value={powerOfAttorneyNumber}
            placeholder="Номер доверенности на поставку товаров,работ,услуг"
            onChange={onPowerOfAttorneyNumberChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">
            Дата доверенности на поставку товаров,работ,услуг:
          </p>
          {/* {console.log(powerOfAttorneyDate)} */}
          <input
            type="date"
            className="col-md-6 form-control"
            value={powerOfAttorneyDate}
            onChange={onPowerOfAttorneyDateChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">Пункт назначения:</p>
          <input
            type="text"
            className="col-md-6 form-control"
            value={destination}
            placeholder="Пункт назначения"
            onChange={onDestinationChange}
          ></input>
        </div>
        <div className="row mt-1 justify-content-center align-items-center">
          <p className="col-md-5">Условия поставки:</p>

          <Select
            className="col-md-6 pl-0 pr-0 mt-3"
            name="supplyCondition"
            value={supplyCondition}
            onChange={onSupplyConditionChange}
            noOptionsMessage={() => "Условия поставки отсутствуют"}
            options={supplyConditions}
            placeholder="Выберите условие поставки"
          />
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
