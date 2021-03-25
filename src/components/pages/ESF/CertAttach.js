import React, { Component } from "react";
import Axios from "axios";
import Alert from "react-s-alert";

class CertAttach extends Component {
  state = {
    loaded: 0,
    authCert: null,
    signCert: null,
    authFile: "",
    signFile: "",
  };

  componentDidMount() {
    this.getCert("auth");
    this.getCert("sign");
  }

  getCert = (type) => {
    Axios.get("/api/esf/cert", { params: { type } })
      .then((res) => res.data)
      .then((file) => {
        if (type === "auth") {
          this.setState({ authFile: file });
        } else {
          this.setState({ signFile: file });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSelectedAuthFile = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      authCert: event.target.files[0],
      loaded: 0,
    });
  };

  handleSelectedSignFile = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      signCert: event.target.files[0],
      loaded: 0,
    });
  };

  saveFiles = (type) => {
    const { authCert, signCert } = this.state;
    if (type === "auth" && !authCert) {
      return Alert.info("Выберите сертификат для авторизации", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (type === "sign" && !signCert) {
      return Alert.info("Выберите сертификат для подписи", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    const file = type === "auth" ? authCert : signCert;
    const fileName = type === "auth" ? authCert.name : signCert.name;

    let data = new FormData();
    data.append("file", file, fileName);

    console.log(data);
    Axios.post("/api/esf/uploadCert", data, {
      onUploadProgress: (ProgressEvent) => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
        });
      },
    })
      .then(() => {
        Alert.success("Файл успешно сохранен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        // this.getCert(type);
        this.getCert("auth");
        this.getCert("sign");
        this.setState({ loaded: 0 });
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
  };

  render() {
    const { loaded, authFile, signFile } = this.state;

    return (
      <div className="cert-attach">
        <div className="row pt-10">
          <div className="col-md-12">
            <h6>Прикрепление ЭЦП</h6>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6" style={{ borderRight: "1px solid #000" }}>
            <label htmlFor="">
              <b>ЭЦП для авторизации (AUTH)</b>
            </label>
            <br />
            <input
              type="file"
              className="mt-20"
              onChange={this.handleSelectedAuthFile}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">
              <b>ЭЦП для подписи (RSA, GOST)</b>
            </label>
            <br />
            <input
              type="file"
              className="mt-20"
              onChange={this.handleSelectedSignFile}
            />
          </div>
        </div>

        {loaded > 0 && (
          <div className="row">
            <div className="col-md-12 mt-20">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped"
                  role="progressbar"
                  // eslint-disable-next-line
                  style={{ width: `${Math.round(loaded, 2)}` + "%" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="row pt-20">
          <div className="col-md-6" style={{ borderRight: "1px solid #000" }}>
            <p
              className="text-center not-found-text"
              style={{ wordBreak: "break-word" }}
            >
              {authFile[0] || "ЭЦП для авторизации отсутсвует"}
            </p>
          </div>
          <div className="col-md-6">
            <p
              className="text-center not-found-text"
              style={{ wordBreak: "break-word" }}
            >
              {signFile[0] || "ЭЦП для подписи отсутсвует"}
            </p>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-md-6" style={{ borderRight: "1px solid #000" }}>
            <button
              className="btn btn-success"
              onClick={() => this.saveFiles("auth")}
            >
              Сохранить
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-success"
              onClick={() => this.saveFiles("sign")}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CertAttach;
