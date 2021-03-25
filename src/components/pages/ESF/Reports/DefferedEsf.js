import React, { Component, Fragment } from "react";
import Axios from "axios";
import PleaseWait from "../../../PleaseWait";
import Alert from "react-s-alert";
import Moment from "moment";

import { parseString } from "xml2js";

class DefferedEsf extends Component {
  state = {
    deffered: [],
    isLoading: true,
  };

  componentDidMount() {
    this.getDeferredEsf();
  }

  getDeferredEsf = () => {
    Axios.get("/api/esf/deffered")
      .then((res) => res.data)
      .then((deffered) => {
        console.log(deffered);
        this.setState({ deffered, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  reConfirmInvoiceById = () => {
    const passwords = JSON.parse(sessionStorage.getItem("isme-passwords"));

    if (!passwords || passwords.length === 0) {
      this.setState({ isSubmit: false });
      return Alert.warning("Пожалуйста введите пароли!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    const { deffered } = this.state;
    const ids = deffered.map((deffer) => {
      return deffer.esfid;
    });
    const nums = deffered.map((deffer) => {
      return deffer.id;
    });
    const sessionId = localStorage.getItem("isme-session");
    this.setState({ isLoading: true });
    this.confirmInvoiceById(sessionId, ids, nums);
  };

  confirmInvoiceById = (sessionId, ids, nums) => {
    console.log(sessionId, ids);
    Axios.get("/api/esf/confirmInvoiceById", {
      params: {
        sessionId,
        ids,
      },
    })
      .then((res) => res.data)
      .then((confirm) => {
        parseString(confirm, (err, result) => {
          try {
            console.log(result);
            const confirmInvoiceById =
              result["soap:Envelope"]["soap:Body"][0][
                "esf:confirmInvoiceByIdResponse"
              ][0];
            const invoiceSummaryList =
              confirmInvoiceById["invoiceSummaryList"][0];
            console.log(invoiceSummaryList);

            const statuses = nums.map((num) => {
              return { num, status: "DELIVERED" };
            });

            this.esfUpdateStatus(statuses);

            Alert.success("Успешно обновлено", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 3000,
            });
          } catch (e) {
            try {
              const faultstring =
                result["soap:Envelope"]["soap:Body"][0]["soap:Fault"][0][
                  "faultstring"
                ][0];
              console.log(faultstring);
              const matchingWord = "No open session associated with user.";
              if (faultstring.includes(matchingWord)) {
                this.props.createSession("defferedEsf");
              }
            } catch (e) {
              this.setState({ isLoading: false });
              Alert.warning("Возникла ошибка при обновлении статуса в ИС ЭСФ", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 3000,
              });
            }
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  esfUpdateStatus = (statuses) => {
    Axios.post("/api/esf/esfUpdateStatus", { statuses })
      .then((res) => res.data)
      .then((result) => {
        console.log(result);
        this.getDeferredEsf();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { deffered, isLoading } = this.state;
    return (
      <Fragment>
        <div className="empty-space"></div>

        <div className="row pt-10">
          <div className="col-md-12">
            <h6>Отчет по отложенным счет-фактурам</h6>
          </div>
        </div>

        {isLoading && <PleaseWait />}

        {!isLoading && deffered.length === 0 && (
          <div className="row">
            <div className="col-md-12 text-center not-found-text">
              Отложенные счет-фактуры отсутсвуют
            </div>
          </div>
        )}

        {!isLoading && deffered.length > 0 && (
          <div className="row mt-10">
            <div className="col-md-12">
              <table className="table table-striped">
                <thead className="bg-info text-white">
                  <tr>
                    <td>№ п\п</td>
                    <td>Регистрационный номер</td>
                    <td>Дата счет-фактуры</td>
                    <td>Контрагент</td>
                    <td>Статус в ИС ЭСФ</td>
                    <td>Статус в tezportal</td>
                  </tr>
                </thead>
                <tbody>
                  {deffered.map((deffer, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{deffer.esfregnum}</td>
                      <td>{Moment(deffer.esfdate).format("DD.MM.YYYY")}</td>
                      <td>{deffer.sellerName}</td>
                      <td>{deffer.status}</td>
                      <td>
                        {deffer.revise ? "Прошел сверку" : "Не прошел сверку"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-12">
              <button
                className="btn btn-outline-info"
                disabled={deffered.length === 0}
                onClick={this.reConfirmInvoiceById}
              >
                Обновить статус в ИС ЭСФ
              </button>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default DefferedEsf;
