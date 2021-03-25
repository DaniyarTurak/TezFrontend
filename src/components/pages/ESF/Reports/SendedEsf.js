import React, { Component, Fragment } from "react";
import Axios from "axios";
import PleaseWait from "../../../PleaseWait";
import Alert from "react-s-alert";
import Moment from "moment";

import { parseString } from "xml2js";

class SendedEsf extends Component {
  state = {
    sended: [],
    isLoading: false,
    isQueryInvoice: false,
    dateFrom: Moment().format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
  };

  dateFromChange = (e) => {
    const dateFrom = e.target.value;
    this.setState({ dateFrom });
  };

  dateToChange = (e) => {
    const dateTo = e.target.value;
    this.setState({ dateTo });
  };

  onSearchClick = () => {
    this.setState({ isLoading: true });
    const { dateFrom, dateTo } = this.state;
    this.getSendedEsf(dateFrom, dateTo);
  };

  getSendedEsf = (dateFrom, dateTo) => {
    Axios.get("/api/esf/sended", { params: { dateFrom, dateTo } })
      .then((res) => res.data)
      .then((sended) => {
        console.log(sended);
        this.setState({ sended, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  reQueryInvoiceById = () => {
    const passwords = JSON.parse(sessionStorage.getItem("isme-passwords"));

    if (!passwords || passwords.length === 0) {
      this.setState({ isSubmit: false });
      return Alert.warning("Пожалуйста введите пароли!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    const { sended } = this.state;

    let idNums = new Map();
    sended.forEach((detail) => {
      if (detail.esfid) idNums.set(detail.esfid, detail.id);
    });
    localStorage["isme-idNums"] = JSON.stringify(Array.from(idNums.entries()));

    const sessionId = localStorage.getItem("isme-session");
    this.setState({ isQueryInvoice: true });

    console.log("sended", sended);
    console.log("idNums", idNums);
    if (idNums.size > 0) this.queryInvoiceById(sessionId, idNums);
  };

  queryInvoiceById = (sessionId, idNums) => {
    const ids = [];
    idNums.forEach((key, value) => {
      ids.push(value);
    });

    console.log("ids", ids);

    Axios.get("/api/esf/queryInvoiceById", { params: { sessionId, ids } })
      .then((res) => res.data)
      .then((result) => {
        parseString(result, this.callbackQueryInvoiceById);
      })
      .catch((err) => {
        console.log(err);
        this.props.closeSession();
      });
  };

  callbackQueryInvoiceById = (err, result) => {
    console.log(result);
    try {
      const queryInvoiceByIdResponse =
        result["soap:Envelope"]["soap:Body"][0][
          "esf:queryInvoiceByIdResponse"
        ][0];
      const rsCount = queryInvoiceByIdResponse["rsCount"][0];
      const invoiceInfoList =
        queryInvoiceByIdResponse["invoiceInfoList"][0]["invoiceInfo"];

      console.log("rsCount", rsCount);
      console.log("invoiceInfoList", invoiceInfoList);

      const idNums = new Map(JSON.parse(localStorage["isme-idNums"]));
      console.log("idNums", idNums);

      let statuses = [];
      if (rsCount > 0) {
        statuses = invoiceInfoList.map((invoiceInfo) => {
          return {
            esfnum: idNums.get(invoiceInfo["invoiceId"][0]),
            status: invoiceInfo["invoiceStatus"]
              ? invoiceInfo["invoiceStatus"][0]
              : null,
            esfid: invoiceInfo["invoiceId"]
              ? invoiceInfo["invoiceId"][0]
              : null,
            reason: invoiceInfo["cancelReason"]
              ? invoiceInfo["cancelReason"][0]
              : null,
            esfregnum: invoiceInfo["registrationNumber"]
              ? invoiceInfo["registrationNumber"][0]
              : null,
          };
        });
      } else {
        idNums.forEach((key, value) => {
          statuses.push({
            esfnum: key,
            status: "PROCESSING",
            esfid: value,
          });
        });
      }

      console.log("statuses", statuses);
      this.props.closeSession();
      this.esfUpdateStatus(statuses);
    } catch (ex) {
      console.log(ex);
      try {
        const faultstring =
          result["soap:Envelope"]["soap:Body"][0]["soap:Fault"][0][
            "faultstring"
          ][0];
        console.log(faultstring);
        const matchingWord = "No open session associated with user.";
        if (faultstring.includes(matchingWord)) {
          this.props.createSession("sendedEsf");
        }
      } catch (e) {
        this.setState({ isQueryInvoice: false });
        Alert.warning(
          "Возникла ошибка при обновлении статуса счет-фактур, повторите попытку позже",
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          }
        );
        this.props.closeSession();
      }
    }
  };

  esfUpdateStatus = (statuses) => {
    Axios.post("/api/esf/esfUpdateStatus", { statuses })
      .then((res) => res.data)
      .then((result) => {
        console.log(result);
        this.setState({ isQueryInvoice: false });
        const { dateFrom, dateTo } = this.state;
        this.getSendedEsf(dateFrom, dateTo);
        Alert.success("Статусы счет-фактур успешно обновлены", {
          position: "top-right",
          effect: "bouncyflip",
          html: true,
          timeout: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isQueryInvoice: false });
        Alert.warning(
          "Возникла ошибка при обновлении статуса в ИС ЭСФ, повторите попытку позже",
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          }
        );
      });
  };

  render() {
    const { sended, isLoading, dateFrom, dateTo } = this.state;
    return (
      <Fragment>
        <div className="empty-space" />

        <div className="row pt-10">
          <div className="col-md-12">
            <h6>Отчет по отправленным счет-фактурам</h6>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <input
              type="date"
              value={dateFrom}
              className="form-control"
              onChange={this.dateFromChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              value={dateTo}
              className="form-control"
              onChange={this.dateToChange}
            />
          </div>
          <div className="col-md-6 text-right">
            <button
              className="btn btn-outline-info"
              onClick={this.onSearchClick}
              disabled={isLoading}
            >
              {isLoading ? "Идет поиск счет-фактур" : "Поиск"}
            </button>
          </div>
        </div>

        {isLoading && <PleaseWait />}

        {!isLoading && sended.length > 0 && (
          <div className="row mt-10">
            <div className="col-md-12">
              <table className="table table-bordered">
                <thead className="bg-info text-white">
                  <tr>
                    <td>Исходящий номер ЭСФ в бухгалтерии</td>
                    <td className="text-center">Дата совершения оборота</td>
                    <td className="text-center">Дата формирования ЭСФ</td>
                    <td className="text-center">
                      Стоимость товаров, работ, услуг с учетом косвенных налогов
                    </td>
                    <td className="text-center">
                      Стоимость товаров, работ, услуг без косвенных налогов
                    </td>
                    <td className="text-center">НДС</td>
                    <td className="text-center">Статус</td>
                  </tr>
                </thead>
                <tbody>
                  {sended.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{detail.id}</td>
                      <td className="text-center">{detail.turnoverdate}</td>
                      <td className="text-center">{detail.esfdate}</td>
                      <td className="text-center tenge">
                        {detail.totalpricewithtax.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {detail.totalpricewithouttax.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center tenge">
                        {detail.totalndsamount.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center">{detail.esfstatusname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && sended.length > 0 && (
          <div className="row mt-10">
            <div className="col-md-12 text-center">
              <button
                className="btn btn-success"
                onClick={this.reQueryInvoiceById}
              >
                Получить статусы с ИС ЭСФ
              </button>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default SendedEsf;
