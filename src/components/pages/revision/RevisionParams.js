import React, { Component, Fragment } from "react";
import { reduxForm } from "redux-form";
import Alert from "react-s-alert";
import Axios from "axios";
import Searching from "../../Searching";
import Select from "react-select";
import { Link } from "react-router-dom";
import Moment from "moment";
import "../../../sass/revision.sass";
import { isChrome, isMobile } from "react-device-detect";

class RevisionParams extends Component {
  state = {
    label: {
      start: "Начать ревизию",
      resume: "Продолжить ревизию",
      pleaseWait: "Пожалуйста подождите...",
      placeholder: {
        selectPoint: "Выберите торговую точку из списка",
        selectRevisionType: "Выберите тип ревизии из списка",
        selectDeviceType: "Выберите оборудование ввода из списка",
        selectTempRevisionType: "Выберите режим ввода данных",
      },
      pointsNotFound: "Точки не найдены",
      header: {
        report: "Отчеты по ревизии",
        exit: "Выход",
        help: "Помощь",
      },
    },
    isLoading: true,
    points: [],
    params: JSON.parse(sessionStorage.getItem("revision-params")) || null,
    point: null,
    dataEnterTypes: [
      { label: "Введение количества товаров вручную", value: "cold" },
      { label: "Cканирование товаров подряд", value: "coldTemp" },
    ],
    dataEnterType: null,
    deviceTypes: [
      { label: "Камера", value: 2 },
      { label: "Сканер", value: 1 },
    ],
    deviceType: null,
    windowIsSmall: false,
    user: JSON.parse(sessionStorage.getItem("isme-user-data")) || null,
    revisionCondition: "",
    revisionConditions: [
      { label: "Полная ревизия", value: 1 },
      { label: "Частичная ревизия", value: 2 },
    ],
  };

  componentWillMount() {
    document.body.style.overflow = "hidden";

    if (window.innerWidth < 480) {
      const { label } = this.state;

      label.placeholder.selectPoint = "Выберите торговую точку";
      label.placeholder.selectRevisionType = "Выберите тип ревизии";
      label.placeholder.selectDeviceType = "Выберите оборудование";
      label.placeholder.selectTempRevisionType = "Выберите режим";
      this.setState({ label, windowIsSmall: true });
    }

    const { params } = this.state;

    Axios.get("/api/revision/point")
      .then((res) => res.data)
      .then((points) => {
        let point = null;
        points = points.map((p_point) => {
          if (params && params.point === p_point.id) {
            point = {
              label: p_point.name,
              value: p_point.id,
            };
          }

          return {
            label: p_point.name,
            value: p_point.id,
          };
        });
        let revisionCondition = "";
        let dataEnterType = null;
        let deviceType = { label: "Камера", value: 2 };
        if (params) {
          if (params.revType === "cold") {
            dataEnterType = {
              label: "Введение количества товаров вручную",
              value: "cold",
            };
          } else if (params.revType === "coldTemp") {
            dataEnterType = {
              label: "Cканирование товаров подряд",
              value: "coldTemp",
            };
          }
          if (params.deviceType === 2)
            deviceType = { label: "Камера", value: 2 };
          else deviceType = { label: "Сканер", value: 1 };
          if (params.revisionCondition.value === 1)
            revisionCondition = { label: "Полная ревизия", value: 1 };
          else revisionCondition = { label: "Частичная ревизия", value: 2 };
        }

        this.setState({
          points,
          isLoading: false,
          point,
          dataEnterType,
          deviceType,
          revisionCondition,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
    if (!params) {
      Axios.get("/api/erpuser/info")
        .then((res) => res.data)
        .then((user) => {
          this.setState({ user });
          sessionStorage.setItem("isme-user-data", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  revisionTypeChange = (revisionCondition) => {
    this.setState({ revisionCondition });
  };

  pointsChange = (point) => {
    this.setState({ point });
  };

  tempRevisionTypeChange = (dataEnterType) => {
    this.setState({ dataEnterType });
  };

  deviceTypeChange = (deviceType) => {
    this.setState({ deviceType });
  };

  handleResume = () => {
    const {
      dataEnterType,
      deviceType,
      point,
      windowIsSmall,
      revisionCondition,
    } = this.state;

    if (!revisionCondition || !revisionCondition.value) {
      Alert.warning("Выберите тип ревизии", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }
    if (!dataEnterType || !dataEnterType.value) {
      Alert.warning("Выберите режим ввода данных", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }
    if (!point || !point.value) {
      Alert.warning("Выберите торговую точку", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }
    if (!deviceType || !deviceType.value) {
      Alert.warning("Выберите оборудование ввода", {
        position: windowIsSmall ? "top" : "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }

    let revType = "cold";
    if (dataEnterType.value === "cold") revType = "cold";
    else revType = "coldTemp";

    sessionStorage.setItem(
      "revision-params",
      JSON.stringify({
        point: point.value,
        pointLabel: point.label,
        revType,
        revisionCondition,
        currentTime: Moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        deviceType: deviceType.value,
      })
    );

    this.props.history.push("/revision");
  };

  handleDownload = (file) => {
    this.setState({ isLoading: true }); // Set true flag here
    Axios.get("/api/files/download", { responseType: "blob", params: { file } })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        this.setState({ isLoading: false }); // Set false flag here
      });
  };

  render() {
    const {
      label,
      isLoading,
      points,
      point,
      dataEnterTypes,
      dataEnterType,
      deviceType,
      deviceTypes,
      windowIsSmall,
      params,
      user,
      revisionCondition,
      revisionConditions,
    } = this.state;
    return isChrome || isMobile ? (
      <Fragment>
        <Alert stack={{ limit: 1 }} offset={windowIsSmall ? 0 : 30} />
        <div
          className={`revision-header ${
            isMobile ? "mobile-revision-header" : "window-width"
          }`}
        >
          <Link
            to={{
              pathname: "/usercabinet/report/reportRevision",
              state: "revision",
            }}
            className="firstElement"
          >
            {!isMobile ? label.header.report : "Отчёт"}
          </Link>
          <span className="emptySapace"></span>
          <a
            href="http://tezportal.ddns.net/public/files/Инструкция_по_ревизии.pdf"
            download
          >
            <li>{label.header.help}</li>
          </a>
          <a href="/revision/signout">
            <li>{label.header.exit}</li>
          </a>
        </div>
        <div className="revision-params">
          <div className={`params-block  ${isMobile ? "mt-50" : ""}`}>
            {isLoading && <Searching />}

            {!isLoading && points.length === 0 && (
              <div className="row text-center">
                <div className="col-md-12 not-found-text">
                  {label.pointsNotFound}
                </div>
              </div>
            )}

            {!isLoading && points.length > 0 && (
              <Fragment>
                <div className="row">
                  <div className="col-md-12">
                    <span className="rev-header-text">Пользователь:</span>
                    {user ? user.name : ""}
                    <br />
                    <span className="rev-header-text">Компания:</span>
                    {user ? user.companyname : ""}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-center rev-header-text">
                    Выберите параметры ревизии
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mt-10">
                    <label htmlFor="">Тип ревизии</label>
                    <Select
                      value={revisionCondition}
                      name="type"
                      onChange={this.revisionTypeChange}
                      options={revisionConditions}
                      isSearchable={false}
                      placeholder={label.placeholder.selectRevisionType}
                    />
                  </div>
                  <div className="col-md-12 mt-10">
                    <label htmlFor="">Режим ввода данных</label>
                    <Select
                      value={dataEnterType}
                      name="type"
                      onChange={this.tempRevisionTypeChange}
                      noOptionsMessage={() =>
                        label.placeholder.selectTempRevisionType
                      }
                      options={dataEnterTypes}
                      isSearchable={false}
                      placeholder={label.placeholder.selectTempRevisionType}
                    />
                  </div>
                  <div className="col-md-12 mt-10">
                    <label htmlFor="">Торговая точка</label>
                    <Select
                      value={point}
                      name="point"
                      onChange={this.pointsChange}
                      noOptionsMessage={() => label.placeholder.selectPoint}
                      isSearchable={false}
                      options={points}
                      placeholder={label.placeholder.selectPoint}
                    />
                  </div>
                  <div className="col-md-12 mt-10">
                    <label htmlFor="">Оборудование ввода</label>
                    <Select
                      value={deviceType}
                      name="deviceType"
                      onChange={this.deviceTypeChange}
                      noOptionsMessage={() =>
                        label.placeholder.selectDeviceType
                      }
                      isSearchable={false}
                      options={deviceTypes}
                      placeholder={label.placeholder.selectDeviceType}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-center mb-100">
                    <button
                      className="btn btn-success mt-30"
                      onClick={() => this.handleResume()}
                    >
                      {params ? label.resume : label.start}
                    </button>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </Fragment>
    ) : (
      <div>Для ревизии рекомендуется использовать браузер Chrome</div>
    );
  }
}

RevisionParams = reduxForm({
  form: "revisionParamsForm",
})(RevisionParams);

export default RevisionParams;
