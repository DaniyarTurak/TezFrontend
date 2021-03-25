import React, { Component } from "react";
import Alert from "react-s-alert";
//import Select from "react-select";
import Axios from "axios";
import Searching from "../../../Searching";
import "./create-certificates.sass";
import { Progress } from "reactstrap";
import { read, utils } from "xlsx";
//import CertificateItems from "./CertificateItems";
import Select from "react-select";

export default class CreateCertificates extends Component {
  state = {
    balance: "",
    balanceList: [],
    isLoading: false,
    loaded: 0,
    selectedFile: null,
    point: "",
    points: [],
    tempCerts: "",
    unit: 0,
  };

  componentDidMount() {}

  handleDownload = (file) => {
    this.setState({ isLoading: true });
    Axios.get("/api/files/download", { responseType: "blob", params: { file } })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        this.setState({ isLoading: false });
      });
  };

  handleSelectedFile = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  handleFetchFromExcel = () => {
    if (!this.state.selectedFile) {
      Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = read(bstr, {
        type: "binary",
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const giftcards = JSON.stringify(
        utils.sheet_to_json(ws, { dateNF: "YYYY-MM-DD" })
      );
      console.log(ws);
      // const giftcardsDateChanged = giftcards.map((e) => {
      //   console.log(e);
      // });

      var params = new URLSearchParams();
      params.append("giftcards", giftcards);

      this.setState({ isLoading: true });
      const options = {
        method: "post",
        url: "/api/giftcertificates/acceptance_xls",
        data: params,
      };
      Axios(options, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      })
        .then((res) => res.data)
        .then((tempCerts) => {
          this.setState({
            tempCerts,
            isLoading: false,
          });
          this.getStockList();
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          Alert.error("Ошибка загрузки данных", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          console.log(err);
        });
    };
    reader.readAsBinaryString(this.state.selectedFile);
  };

  getStockList = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((stockList) => {
        let options = [];
        stockList.forEach((stock) => {
          if (stock.name !== "Центральный склад") {
            const newVal = {
              value: stock.id,
              label: stock.name,
            };
            options.push(newVal);
          }
        });
        this.setState({ points: [...options] });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  onPointChange = (point) => {
    this.setState({ point });
  };

  handleAdd = () => {
    const { tempCerts, point } = this.state;

    let giftcards = [];
    let allocation = [];
    tempCerts.text.forEach((e) => {
      if (e.status === "ok" || e.status === "info") {
        giftcards.push(e);
      }
    });

    if (tempCerts.count) {
      tempCerts.count.forEach((e) => {
        allocation.push({
          point: point.value,
          balance: e.balance,
          units: e.count,
        });
      });
    }
    // temp.forEach((e) => {
    //   if (e.status === "ok" || e.status === "info") {
    //     giftcards.push({
    //       code: e.code,
    //       balance: e.balance,
    //       period: e.period,
    //       selldate: e.selldate,
    //       status: e.status,
    //     });
    //     allocation.push({
    //       point: point.value,
    //       balance: e.balance,
    //       units: e.units,
    //     });
    //   }
    // });

    //   console.log(giftcards, allocation);

    if (allocation.length === 0) {
      return Alert.error("Данные которые вы пытаетесь загрузить ошибочны", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (!point) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    this.setState({ isLoading: true });
    Axios.post("/api/giftcertificates/add", {
      giftcards,
      allocation,
    })
      .then((res) => {
        this.setState({ isLoading: false });
        Alert.success("Вы успешно сохранили новые сертификаты", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
        Alert.error(`возникла ошибка: ${err}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  render() {
    const { isLoading, loaded, point, points, tempCerts } = this.state;
    return (
      <div style={{ paddingBottom: "10rem" }} className="report-cashbox-state">
        <div className="row">
          <div
            className="col-md-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              style={{
                marginBottom: "5px",
              }}
              className="btn btn-outline-info"
              onClick={() => this.handleDownload("template_cert.xlsx")}
            >
              Скачать шаблон
            </button>
          </div>
        </div>
        <div className="form-group files download-files">
          <input
            style={{ color: "#2ea591" }}
            type="file"
            className="form-control"
            name="file"
            onChange={this.handleSelectedFile}
          />
        </div>
        <div className="form-group">
          <Progress max="100" color="success" value={loaded}>
            {Math.round(loaded, 2)}%
          </Progress>
        </div>
        <button
          className="btn btn-success form-control"
          onClick={this.handleFetchFromExcel}
        >
          Выгрузить
        </button>

        {isLoading && <Searching />}

        {!isLoading && tempCerts && (
          <table className="table table-hover mt-20">
            <thead>
              <tr>
                <th style={{ width: "2%" }}></th>
                <th style={{ width: "20%" }}>Название</th>
                <th className="text-center" style={{ width: "20%" }}>
                  Номер сертификата
                </th>
                <th className="text-center" style={{ width: "18%" }}>
                  Номинал
                </th>
                <th className="text-center" style={{ width: "10%" }}>
                  Период действия
                </th>
                <th className="text-center" style={{ width: "10%" }}>
                  Дата продажи
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Дополнительно
                </th>
              </tr>
            </thead>
            <tbody>
              {tempCerts.text.map((cert, idx) => (
                <tr
                  style={
                    cert.status === "ok"
                      ? { color: "green" }
                      : cert.status === "info"
                      ? { color: "orange" }
                      : cert.status === "error"
                      ? { color: "red" }
                      : ""
                  }
                  key={idx}
                >
                  <td>{idx + 1}</td>
                  <td>{cert.name}</td>
                  <td className="text-center">{cert.code}</td>
                  <td className="text-center tenge">{cert.balance}</td>
                  <td className="text-center">{cert.period}</td>
                  <td className="text-center">{cert.selldate}</td>
                  <td className="text-center">{cert.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr />
        {!isLoading && tempCerts && (
          <div style={{ opacity: "75%" }}>Распределение сертификатов:</div>
        )}

        {!isLoading && tempCerts && (
          <div className="row justify-content-center mt-10">
            <div className="col-md-6">
              <label>Выберите торговую точку:</label>
              <Select
                name="point"
                value={point}
                onChange={this.onPointChange}
                options={points}
                placeholder="Выберите торговую точку"
                noOptionsMessage={() => "Точка не найдена"}
              />
            </div>
            <div className="col-md-4 mt-30">
              <button className="btn btn-outline-info" onClick={this.handleAdd}>
                Сохранить данные
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
