import React, { Component, Fragment } from "react";
import { Field, reduxForm, reset, change } from "redux-form";
import Alert from "react-s-alert";
import Axios from "axios";
import Select from "react-select";
import { InputGroup } from "../../../fields";
import { RequiredField, NoMoreThan13 } from "../../../../validation";
import CertificateItems from "./CertificateItems";

import "./create-certificates.sass";

class CreateCertificates extends Component {
  maxId = 100;
  state = {
    alert: {
      addNewPoint: "Добавить еще одну торговую точку",
      createCertificate: "Создать сертификат",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!",
      },
    },
    barcode: "",
    certificateItems: [this.createNewItem()],
    date: 0,
    isLoading: false,
    label: {
      barcode: "Штрих код",
      placeholder: {
        barcode: "Внесите вручную, или с помощью сканера",
      },
      tooltip:
        "Внимание! Сроком действия является количество месяцев с момента продажи сертификата.",
    },
    price: 0,
    point: "",
    points: [],
    poolFrom: 0,
    poolTo: 0,
    certificate: "",
    certificates: [],

    type: { value: 0, label: "Одноразовый" },
    types: [
      { value: 0, label: "Одноразовый" },
      { value: 1, label: "Многоразовый" },
    ],
    quantity: 0,
  };

  componentDidMount() {}

  generateBarcode = () => {
    Axios.get("/api/invoice/newbarcode")
      .then((res) => res.data)
      .then((barcodeseq) => {
        const last = barcodeseq + "2";
        const barcode = "2" + last.padStart(12, "0");
        this.setState({ barcode, newProductGenerating: true });
        this.props.dispatch(change("CreateCertificates", "code", barcode));
      });
  };

  onBarcodeChange = (e) => {
    let barcode = e.target.value.toUpperCase();
    this.setState({ barcode });
  };

  onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  };

  onDateChange = (e) => {
    let date = isNaN(e.target.value) ? 0 : e.target.value;
    if (date > 100) return;
    this.setState({ date });
  };

  onPointChange = (point) => {
    this.setState({ point });
  };

  onPriceChange = (e) => {
    let price = isNaN(e.target.value) ? 0 : e.target.value;
    this.setState({ price });
  };

  onPoolFromChange = (e) => {
    let poolFrom = isNaN(e.target.value) ? 0 : e.target.value;
    if (poolFrom.length > 20) return;
    this.setState({ poolFrom });
  };

  onPoolToChange = (e) => {
    let poolTo = isNaN(e.target.value) ? 0 : e.target.value;
    if (poolTo.length > 20) return;
    this.setState({ poolTo });
  };

  onCertificateChange = (certificate) => {
    this.setState({ certificate });
  };

  onTypeChange = (type) => {
    this.setState({ type });
  };

  onQuantityChange = (id, e) => {
    const { certificateItems } = this.state;
    let quantity = isNaN(e.target.value) ? 0 : e.target.value;

    certificateItems.forEach((q) => {
      q.value = q.id === id ? quantity : q.value;
    });

    this.setState((oldState) => {
      const newQuantities = [...oldState.certificateItems];
      return {
        certificateItems: newQuantities,
      };
    });
  };

  createNewItem() {
    return {
      id: this.maxId++,
      value: 0,
    };
  }

  handleAddPoint = () => {
    const newItem = this.createNewItem();
    this.setState(({ certificateItems }) => {
      const newArray = [...certificateItems, newItem];
      return {
        certificateItems: newArray,
      };
    });
  };

  handleDeletePoint = (id) => {
    this.setState(({ certificateItems }) => {
      const idx = certificateItems.findIndex((el) => el.id === id);

      const newArray = [
        ...certificateItems.slice(0, idx),
        ...certificateItems.slice(idx + 1),
      ];

      return {
        certificateItems: newArray,
      };
    });
  };

  handleCreateCertificate = () => {
    Alert.success(this.state.alert.createCertificate, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
    const cert = {
      certificate: this.state.barcode,
      type: this.state.type,
      poolFrom: this.state.poolFrom,
      poolTo: this.state.poolTo,
      date: this.state.date,
      price: this.state.price,
      quantities: this.state.certificateItems,
      points: this.state.points,
    };
    console.log(cert);
    Axios.post("/api/certificates/bloody_certificates_future_service")
      .then((res) => res.data)
      .then((certificates) => {
        console.log(certificates);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSearch = () => {
    Alert.info("Currently, I'm looking for certificate by barcode", {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };

  toCurrency(number) {
    const formatter = new Intl.NumberFormat("ru-RU", {
      style: "decimal",
    });
    let newValue = isNaN(number) ? 0 : number;
    return formatter.format(newValue);
  }

  fixedPool(number) {
    const formatter = new Intl.NumberFormat("ru-RU", {
      style: "decimal",
    });
    let newValue = isNaN(number) ? 0 : number;
    return formatter.format(newValue);
  }

  render() {
    const {
      certificateItems,
      date,
      isLoading,
      label,
      point,
      points,
      poolFrom,
      poolTo,
      price,
      certificate,
      certificates,
      type,
      types,
    } = this.state;

    return (
      <div className="report-cashbox-state">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <label>{label.barcode}</label>
            <Field
              name="code"
              component={InputGroup}
              placeholder={label.placeholder.barcode}
              type="text"
              className={`form-control ${isLoading ? "loading-btn" : ""}`}
              onChange={this.onBarcodeChange}
              onKeyDown={this.onBarcodeKeyDown}
              appendItem={
                <Fragment>
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => this.handleSearch()}
                  >
                    Поиск
                  </button>
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={this.generateBarcode}
                  >
                    Сгенерировать
                  </button>
                </Fragment>
              }
              validate={[RequiredField, NoMoreThan13]}
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <label>Выберите сертификат:</label>
            <Select
              name="certificate"
              value={certificate}
              onChange={this.onCertificateChange}
              options={certificates}
              placeholder="Выберите сертификат"
              noOptionsMessage={() => "Сертификат не найден"}
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <label>Выберите тип сертификата:</label>
            <Select
              name="type"
              value={type}
              onChange={this.onTypeChange}
              options={types}
              placeholder="Выберите Тип"
              noOptionsMessage={() => "Тип не найден"}
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-2 number-range">
            <label>Введите диапазон номеров:</label>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-5">
                <label>От</label>
                <input
                  name="poolFrom"
                  value={poolFrom}
                  type="text"
                  onChange={this.onPoolFromChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-5">
                <label>До</label>
                <input
                  name="poolTo"
                  value={poolTo}
                  type="text"
                  onChange={this.onPoolToChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <label>Количество:</label>
                <p style={{ marginTop: "5px" }}>
                  {parseInt(poolTo, 10) - parseInt(poolFrom, 10) + 1}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center expiration-date">
          <div className="col-md-6">
            <label>Укажите срок действия сертификата с момента продажи:</label>
          </div>

          <div className="col-md-2 months">
            <input
              type="text"
              value={this.toCurrency(date)}
              className="form-control input-month"
              name="date"
              onChange={this.onDateChange}
            />
            <label className="month">месяц(ев)</label>
          </div>
        </div>

        <div className="row justify-content-center cert-prices">
          <div className="col-md-4">
            <label>Введите номинал сертификата:</label>
          </div>

          <div className="col-md-4 prices">
            <input
              type="text"
              value={price}
              className="form-control price"
              name="price"
              onChange={this.onPriceChange}
            />
            <label className="tg-price">тг.</label>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <CertificateItems
              point={point}
              points={points}
              certificateItems={certificateItems}
              handleDeletePoint={this.handleDeletePoint}
              onPointChange={this.onPointChange}
              onQuantityChange={this.onQuantityChange}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-info add-point"
              onClick={this.handleAddPoint}
            >
              Добавить еще одну точку
            </button>
          </div>
        </div>

        <div className="row justify-content-center">
          <button
            className="btn btn-outline-success cert-create"
            onClick={this.handleCreateCertificate}
          >
            Создать сертификат
          </button>
        </div>
      </div>
    );
  }
}

CreateCertificates = reduxForm({
  form: "CreateCertificates",
  reset,
})(CreateCertificates);

export default CreateCertificates;
