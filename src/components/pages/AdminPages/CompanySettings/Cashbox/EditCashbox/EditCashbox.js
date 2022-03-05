import React, { Component } from "react";
import "./edit-cashbox.sass";
import barcode from "../../../../../../img/barcode.png";
import Alert from "react-s-alert";
import SwitchStyle from "./SwitchStyle";
import Axios from "axios";
import { Progress } from "reactstrap";
import Select from "react-select";

export default class EditCashbox extends Component {
  state = {
    address: "",
    advertisementMessage: "",
    BIN: true,
    company:
      JSON.parse(sessionStorage.getItem("isme-user-data")).companyname || "",
    displayFile: "",
    file: null,
    loaded: 0,
    NDS: true,
    point: "",
    pointID: "",
    points: this.props.points.map((point) => {
      return {
        label: point.name,
        value: point.id,
        address: point.address,
        name: point.name
      }
    }),
    RNM: true,
    thanksMessage: "Спасибо за покупку.",
    ticketInformation: "",
    ZNM: true,
  };

  onPointIDChange = (pointID) => {
    this.setState({ pointID });
    if (pointID.value) {
      this.getTicketFormat(pointID);
    }
  };

  handleChange = (event) => {
    if (event.target.files[0].size >= 102400) {
      return Alert.warning("Размер файла должен быть меньше 100 КБ", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else if (event.target.files[0].type !== "image/png") {
      return Alert.warning("Расширение файла должно быть .png", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    this.setState({
      displayFile: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0],
      loaded: 0,
    });
  };

  onPointChange = (e) => {
    const point = e.target.value;
    this.setState({ point });
  };

  onAddressChange = (e) => {
    const address = e.target.value;
    this.setState({ address });
  };

  onCompanyChange = (e) => {
    const company = e.target.value;
    this.setState({ company });
  };

  handleSwitch = (name, checked) => {
    name === "BIN"
      ? this.setState({ BIN: checked })
      : name === "NDS"
      ? this.setState({ NDS: checked })
      : name === "ZNM"
      ? this.setState({ ZNM: checked })
      : this.setState({ RNM: checked });
  };

  handleBIN = () => {
    const BIN = !this.state.BIN;
    this.setState({ BIN });
  };
  handleNDS = () => {
    const NDS = !this.state.NDS;
    this.setState({ NDS });
  };
  handleZNM = () => {
    const ZNM = !this.state.ZNM;
    this.setState({ ZNM });
  };
  handleNDS = () => {
    const RNM = !this.state.RNM;
    this.setState({ RNM });
  };

  onThanksMessageChange = (e) => {
    const thanksMessage = e.target.value;
    this.setState({ thanksMessage });
  };

  onAdvertisementMessageChange = (e) => {
    const advertisementMessage = e.target.value;
    if (advertisementMessage.length >= 2000) {
      return Alert.info("Длина рекламы не может превышать 2000 символов", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else this.setState({ advertisementMessage });
  };

  getTicketFormat = (point) => {
    const { points } = this.state;

    point = point.value;
    Axios.get("/api/ticketformat", { params: { point } })
      .then((res) => res.data)
      .then((ticketInformation) => {
        if (
          Object.keys(ticketInformation).length === 0 &&
          ticketInformation.constructor === Object
        ) {
          let pointNew;
          points.forEach((p) => {
            if (p.value === point) {
              pointNew = p;
            }
          });
          this.setState({
            address: pointNew.address,
            advertisementMessage: "",
            BIN: true,
            company:
              JSON.parse(sessionStorage.getItem("isme-user-data"))
                .companyname || "",
            displayFile: "",
            file: null,
            loaded: 0,
            NDS: true,
            point: pointNew.name,
            RNM: true,
            thanksMessage: "Спасибо за покупку.",
            ticketInformation: "",
            ZNM: true,
          });
        } else {
          this.setState({
            address: ticketInformation.json.address,
            advertisementMessage: ticketInformation.json.advertisementMessage,
            BIN: ticketInformation.json.BIN,
            company: ticketInformation.json.company,
            displayFile: ticketInformation.json.displayFile,
            NDS: ticketInformation.json.NDS,
            point: ticketInformation.json.point,
            thanksMessage: ticketInformation.json.thanksMessage,
            ZNM: ticketInformation.json.ZNM,
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleUpload = () => {
    const { address, company, file, point } = this.state;
    if (!address) {
      return Alert.warning(`Укажите адрес`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    if (!company) {
      return Alert.warning(`Укажите компанию`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    if (!point) {
      return Alert.warning(`Укажите торговую точку`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (file) {
      let data = new FormData();

      data.append("file", file, file.name);
      data.append("type", "logo");
      Axios.post("/api/files/upload", data, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            isLoading: true,
          });
        },
      })
        .then((res) => {
          Alert.success("Файл успешно выгружен", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });

          const hostname = window.location.host;
          const cutFile = res.data.file.slice(1);
          const fileName = "http://" + hostname + cutFile;
          this.setState({ loaded: 0, isLoading: true, displayFile: fileName });
          this.createNewTicket();
        })
        .catch((err) => {
          console.log(err);

          Alert.error(`Ошибка при выгрузке файла ${err}`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });

          this.setState({ loaded: 0 });
        });
      return;
    } else this.createNewTicket();
  };

  createNewTicket = () => {
    const {
      address,
      company,
      displayFile,
      point,
      pointID,
      BIN,
      NDS,
      ZNM,
      RNM,
      thanksMessage,
      advertisementMessage,
    } = this.state;

    // для подтягивания default значений из
    // бэка использовать вот этот сервис:"api/point";

    const finalTicket = {
      address,
      company,
      displayFile,
      point,
      BIN,
      NDS,
      ZNM,
      RNM,
      thanksMessage,
      advertisementMessage,
    };
    // api/ticketformat/manage - post запрос {ticketFormat:{header:"Привет всем"}}
    Axios.post("/api/ticketformat/manage", {
      point: pointID.value,
      ticketFormat: finalTicket,
    })
      .then((res) => res.data)
      .then((ticket) => {
        Alert.success("Чек успешно изменён", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.getTicketFormat(pointID);
        this.setState({ details: false });
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? this.state.alert.raiseError
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        console.log(err);
      });
  };

  render() {
    const {
      address,
      advertisementMessage,
      BIN,
      company,
      displayFile,
      NDS,
      point,
      points,
      pointID,
      RNM,
      thanksMessage,
      ZNM,
    } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="row">
          <div className="col-md-12">
            <label htmlFor="">Торговая точка</label>
            <Select
              value={pointID}
              name="point"
              onChange={this.onPointIDChange}
              noOptionsMessage={() => "Выберите торговую точку из списка"}
              options={points}
              placeholder="Выберите торговую точку"
            />
          </div>
        </div>
        {pointID && (
          <div className="row">
            <div
              style={{
                padding: "1rem",
                width: "28rem",
                margin: "1rem",
                backgroundColor: "whitesmoke",
                fontWeight: "100",
                fontVariant: "small-caps",
                fontFamily: "courier",
                fontSize: "10px",
                borderStyle: "double",
                borderRadius: "5%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <img
                  style={{ width: "40px", height: "40px" }}
                  src={displayFile}
                  alt=""
                />
              </div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {!point ? (
                  <label>Торговая Точка №1</label>
                ) : (
                  <label>{point}</label>
                )}

                {!address ? (
                  <label>Алматы| проспект Достык| 1</label>
                ) : (
                  <label>{address}</label>
                )}
                {!company ? <label>TOO Demo</label> : <label>{company}</label>}
              </label>

              {BIN && <label>БИН: 123456789012</label>}
              {BIN && <br />}
              {NDS && <label>НДС: 1234567 44 от 06.01.2020</label>}
              {NDS && <br />}
              {ZNM && <label>ЗНМ: TEZ0000000050</label>}
              {ZNM && <br />}
              {RNM && <label>РНМ: 010100101234</label>}
              {RNM && <br />}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: "bold" }}>Товарный чек</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>02.03.2020 16:02:20</label>
                <label> 145</label>
              </label>
              <label>Продажа: </label>
              <hr
                style={{
                  marginTop: "0.1rem",
                  marginBottom: "0.1rem",
                  borderTop: "1px dashed rgba(0,0,0,.1)",
                }}
              />
              <label>Лукошко Пюре Абрикос творог</label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>331KZT</label> <label>x1,000</label>
                <label> 311KZT</label>
              </label>
              <label>Фруто Няня Пюре натуральное из капусты бро</label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>1199KZT</label> <label>x1,000</label>
                <label> 1199KZT </label>
              </label>
              <label>Сертификат на 5000KZT</label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>5000KZT</label>
                <label> x1,000</label>
                <label> 5000KZT</label>
              </label>
              <hr
                style={{
                  marginTop: "0.1rem",
                  marginBottom: "0.1rem",
                  borderTop: "1px dashed rgba(0,0,0,.1)",
                }}
              />
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Итого товаров:</label> <label>3,000</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Итого сумма:</label>
                <label> 6530KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Скидка на чек:</label>
                <label> 0KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  marginTop: "0.2rem",
                  fontSize: "12px",
                  marginBottom: "0.2rem",
                }}
              >
                <label> Итог: </label>
                <label> 6530KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Итого скидки:</label> <label>0KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label> В том числе НДС:</label>
                <label> 163,92KZT</label>
              </label>
              <label style={{ fontWeight: "bold" }}> Смешанная оплата </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Оплата наличными: </label>
                <label>5000.0</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label> Получено от клиента:</label>
                <label> 5000KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Сдача:</label>
                <label> 0KZT</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Безналичный расчёт (карта):</label>
                <label> 1530.0</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Кассир:</label>
                <label> TEST</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <label>Терминал:</label>
                <label> 50</label>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {!thanksMessage ? (
                  <label>Дополнительный текст 1</label>
                ) : (
                  <label>{thanksMessage}</label>
                )}
                <img
                  style={{ width: "100px", height: "30px" }}
                  alt=""
                  src={barcode}
                />
                {advertisementMessage ? (
                  <label
                    style={{
                      width: "12.7rem",
                      fontFamily: "monospace",
                      fontVariant: "all-small-caps",
                      fontSize: "0.8rem",
                      overflow: "hidden",
                      // whiteSpace: "normal"
                    }}
                  >
                    {advertisementMessage}
                  </label>
                ) : (
                  <label>Дополнительный текст 2</label>
                )}
              </label>
            </div>
            <div
              style={{
                margin: "1rem",
                padding: "1rem",
                width: "27.1rem",
                backgroundColor: "whitesmoke",
                opacity: "85%",
                borderStyle: "double",
                borderRadius: "5%",
              }}
            >
              <div>
                <p>Загрузить логотип компании:</p>
                <div className="form-group files download-files">
                  <input
                    style={{ color: "#2ea591" }}
                    type="file"
                    className="form-control"
                    name="file"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <Progress max="100" color="success" value={this.state.loaded}>
                    {Math.round(this.state.loaded, 2)}%
                  </Progress>
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p>Торговая точка:</p>

                <input
                  type="text"
                  value={point}
                  className="form-control"
                  name="point"
                  placeholder="Торговая точка №1"
                  onChange={this.onPointChange}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p>Адрес:</p>
                <input
                  type="text"
                  value={address}
                  className="form-control"
                  placeholder="Алматы| проспект Достык| 1"
                  name="address"
                  onChange={this.onAddressChange}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p>Компания:</p>
                <input
                  type="text"
                  value={company}
                  className="form-control"
                  placeholder="TOO Demo"
                  name="company"
                  onChange={this.onCompanyChange}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <label>БИН:</label>
                  <label>НДС:</label>
                  <label>ЗНМ:</label>
                  <label>РНМ:</label>
                </div>
                <SwitchStyle
                  BIN={BIN}
                  NDS={NDS}
                  ZNM={ZNM}
                  RNM={RNM}
                  handleSwitch={this.handleSwitch}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p>Дополнительный текст 1:</p>
                <input
                  type="text"
                  value={thanksMessage}
                  placeholder="Спасибо за покупку."
                  className="form-control"
                  name="thanksMessage"
                  onChange={this.onThanksMessageChange}
                />
              </div>
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <p>Дополнительный текст 2:</p>
                <textarea
                  type="text"
                  style={{ height: "10rem", fontFamily: "monospace" }}
                  value={advertisementMessage}
                  // placeholder="Рекламное сообщение"
                  className="form-control"
                  name="advertisementMessage"
                  onChange={this.onAdvertisementMessageChange}
                />
              </div>
            </div>
            <div className="col-md-12 justify-content-center">
              <button
                style={{ width: "10rem" }}
                className=" btn btn-outline-success mt-30"
                onClick={() => this.handleUpload()}
              >
                Изменить чек
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
