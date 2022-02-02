import React, { Component, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";

import { parseString } from "xml2js";
import "react-block-ui/style.css";

import SyncInvoice from "./SyncInvoice";
import SyncInvoiceJur from "./SyncInvoiceJur";
import InboundInvoice from "./InboundInvoice";
import CertAttach from "./CertAttach";
import EsfReports from "./EsfReports";

class ESF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currType: "receive",
      // currType: 'report',
      childType: "",
      invoiceType: "fiz",
      passwords: JSON.parse(sessionStorage.getItem("isme-passwords")) || [],
      sections: [
        { name: "receive", label: "Прием", disabled: !this.checkAccess("elct_inv_reception") },
        { name: "send", label: "Передача", disabled: !this.checkAccess("elct_inv_broadcast") },
        { name: "cert", label: "Прикрепить ЭЦП", disabled: !this.checkAccess("elct_inv_attach_eds") },
        { name: "report", label: "Отчет", disabled: !this.checkAccess("elct_inv_report") },
      ],
    };
    this.inboundInvoice = React.createRef();
    this.syncInvoice = React.createRef();
    this.esfReports = React.createRef();
  }

  checkAccess = (code) => {
    const userAccesses = JSON.parse(sessionStorage.getItem("isme-user-accesses")) || [];
    return userAccesses.some((access) => access.code == code)
  }

  setCurrType = (e) => {
    const currType = e.target.name;
    this.setState({ currType });
  };

  componentDidMount() {
    const sessionId = localStorage.getItem("isme-session");
    const passwords = JSON.parse(sessionStorage.getItem("isme-passwords"));
    if (passwords && passwords.length > 0) {
      const isEsfPassword = passwords.find(
        (password) => password.type === "isEsfPassword"
      ).value;
      const userData = JSON.parse(sessionStorage.getItem("isme-user-data"));
      const username = userData.iin;
      if (username && sessionId && isEsfPassword)
        this.sessionStatus(username, sessionId, isEsfPassword);
    }
  }

  passwordsInputChange = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    let { passwords } = this.state;
    const newPassword = { type, value };

    passwords = passwords.filter((password) => {
      return password.type !== type;
    });
    if (value) passwords.push(newPassword);
    // console.log(passwords);
    this.setState({ passwords });

    sessionStorage.setItem("isme-passwords", JSON.stringify(passwords));
  };

  createSessionClick = (childType) => {
    const passwords = JSON.parse(sessionStorage.getItem("isme-passwords"));
    const companyData = JSON.parse(sessionStorage.getItem("isme-company-data"));
    const userData = JSON.parse(sessionStorage.getItem("isme-user-data"));
    const sessionId = localStorage.getItem("isme-session");
    const username = userData.iin;
    const tin = companyData.bin;

    if (!passwords || passwords.length === 0) {
      this.decideNextStep(childType, true);
      return Alert.warning("Пожалуйста введите пароли!", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    const isEsfPassword = passwords.find(
      (password) => password.type === "isEsfPassword"
    ).value;
    const authCertPassword = passwords.find(
      (password) => password.type === "authCertPassword"
    ).value;

    console.log(username, tin, isEsfPassword, authCertPassword);

    const childTypes = [
      "inboundInvoice",
      "syncInvoice",
      "confirmInvoiceById",
      "esfReports",
    ];
    if (childTypes.indexOf(childType) !== -1) {
      this.setState({ childType });
    }

    if (sessionId) this.closeSession(username, sessionId, isEsfPassword);
    this.createSession(username, tin, authCertPassword, isEsfPassword);
  };

  createSession = (username, tin, certPassword, isEsfPassword) => {
    const { childType } = this.state;
    Axios.get("/api/esf/createSession", {
      params: {
        tin,
        username,
        certPassword,
        isEsfPassword: isEsfPassword,
      },
    })
      .then((res) => res.data)
      .then((xml) => {
        console.log(xml);
        parseString(xml, this.callbackCreateSession);
      })
      .catch((err) => {
        console.log(err);
        this.decideNextStep(childType, true);
      });
  };

  decideNextStep = (childType, fail) => {
    if (!fail) {
      if (childType === "inboundInvoice") {
        this.inboundInvoice.current.onQueryInvoice();
      } else if (childType === "syncInvoice") {
        this.syncInvoice.current.signXmlClick();
      } else if (childType === "confirmInvoiceById") {
        this.inboundInvoice.current.reConfirmInvoiceById();
      } else if (childType === "esfReports") {
        this.esfReports.current.sessionCreated();
      } else {
        Alert.success("Авторизация прошла успешно", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      }
    } else {
      if (
        childType === "inboundInvoice" ||
        childType === "confirmInvoiceById"
      ) {
        this.inboundInvoice.current.createSessionFailed(childType);
      } else if (childType === "syncInvoice") {
        this.syncInvoice.current.createSessionFailed();
      } else if (childType === "esfReports") {
        this.esfReports.current.createSessionFailed();
      } else {
        Alert.warning("Ошибка при авторизации в ИС ЭСФ, повторите попытку", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      }
    }
  };

  callbackCreateSession = (err, result) => {
    const { childType } = this.state;
    try {
      const sessionId =
        result["soap:Envelope"]["soap:Body"][0]["ns2:createSessionResponse"][0][
        "sessionId"
        ][0];
      console.log(sessionId);
      localStorage.setItem("isme-session", sessionId);
      this.decideNextStep(childType);
    } catch (e) {
      try {
        const faultstring =
          result["soap:Envelope"]["soap:Body"][0]["soap:Fault"][0][
          "faultstring"
          ][0];
        console.log(faultstring);
        const matchingWord =
          "Can`t create a new user session. User already has opened session with id";
        if (faultstring.includes(matchingWord)) {
          const sessionId = faultstring.replace(matchingWord, "").trim();
          localStorage.setItem("isme-session", sessionId);
          console.log(sessionId);
          this.decideNextStep(childType);
        } else {
          this.decideNextStep(childType, true);
        }
      } catch (e) {
        this.decideNextStep(childType, true);
      }
    }
  };

  sessionStatus = (tin, sessionId, isEsfPassword) => {
    Axios.get("/api/esf/sessionStatus", {
      params: { sessionId, tin, isEsfPassword },
    })
      .then((res) => res.data)
      .then((xml) => {
        parseString(xml, this.callbackSessionStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  callbackSessionStatus = (err, result) => {
    try {
      const status =
        result["soap:Envelope"]["soap:Body"][0][
        "ns2:currentSessionStatusResponse"
        ][0]["status"][0];
      if (status !== "OK") localStorage.removeItem("isme-session");
    } catch (e) {
      localStorage.removeItem("isme-session");
    }
  };

  closeSession = (tin, sessionId, isEsfPassword) => {
    // const tin = '881104300436';
    Axios.get("/api/esf/closeSession", {
      params: { sessionId, tin, isEsfPassword },
    })
      .then((res) => res.data)
      .then(() => {
        localStorage.removeItem("isme-session");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onFizJurChange = (invoiceType) => {
    this.setState({ invoiceType });
  };

  render() {
    const { currType, invoiceType, passwords, sections } = this.state;
    const isEsfPassword = passwords.find(
      (password) => password.type === "isEsfPassword"
    );
    const authCertPassword = passwords.find(
      (password) => password.type === "authCertPassword"
    );
    const signCertPassword = passwords.find(
      (password) => password.type === "signCertPassword"
    );
    return (
      <Fragment>
        <div className="esf-block">
          <div className="row pb-10">
            <div className="col-md-12">Электронный счет-фактура</div>
          </div>

          <div className="empty-space"></div>

          <div className={`row pt-10 pb-10`}>
            {sections.map((section, idx) => (
              <div className="col-md-3" key={idx}>
                <button
                  onClick={this.setCurrType}
                  name={section.name}
                  disabled={section.disabled}
                  className={`btn btn-block ${currType === section.name ? "btn-info" : section.disabled ? "btn-outline-info" : "btn-outline-secondary"
                    }`}
                >
                  {section.label}
                </button>
              </div>
            ))}
          </div>

          <div className="empty-space"></div>

          {currType !== "cert" && (
            <div className="row pb-10">
              <div className="col-md-4">
                <label htmlFor="">Пароль для авторизации в ИС ЭСФ</label>
                <input
                  type="password"
                  value={isEsfPassword && isEsfPassword.value}
                  className="form-control"
                  onChange={this.passwordsInputChange}
                  placeholder="Введите пароль"
                  name="isEsfPassword"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="">Пароль от ЭЦП для авторизации</label>
                <input
                  type="password"
                  value={authCertPassword && authCertPassword.value}
                  className="form-control"
                  onChange={this.passwordsInputChange}
                  placeholder="Введите пароль"
                  name="authCertPassword"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="">Пароль от ЭЦП для подписи</label>
                <input
                  type="password"
                  value={signCertPassword && signCertPassword.value}
                  className="form-control"
                  onChange={this.passwordsInputChange}
                  placeholder="Введите пароль"
                  name="signCertPassword"
                />
              </div>
            </div>
          )}

          {currType === "send" && !this.checkAccess("elct_inv_broadcast") &&(
            <div>
              <div className="empty-space"></div>
              <div style={{ justifyContent: "center" }} className="row pb-10">
                <div className="col-md-3 mt-10">
                  <button
                    onClick={() => this.onFizJurChange("fiz")}
                    name="fiz"
                    className={`btn btn-block ${invoiceType === "fiz" ? "btn-info" : "btn-outline-info"
                      }`}
                  >
                    для физ. лиц
                  </button>
                </div>
                <div className="col-md-3 mt-10">
                  <button
                    onClick={() => this.onFizJurChange("jur")}
                    name="jur"
                    className={`btn btn-block ${invoiceType === "jur" ? "btn-info" : "btn-outline-info"
                      }`}
                  >
                    для юр. лиц
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* <div className="row mt-20 pb-10 text-center">
						<div className="col-md-12">
							<button className="btn btn-success" onClick={this.createSessionClick}>
								Авторизоваться в ИС ЭСФ
							</button>
						</div>
					</div> */}

          {currType === "receive" && !this.checkAccess("elct_inv_reception") && (
            <InboundInvoice
              createSession={this.createSessionClick}
              ref={this.inboundInvoice}
            />
          )}
          {currType === "send" && invoiceType === "fiz" && !this.checkAccess("elct_inv_broadcast") && (
            <SyncInvoice
              createSession={this.createSessionClick}
              closeSession={this.closeSession}
              ref={this.syncInvoice}
            />
          )}
          {currType === "send" && invoiceType === "jur" && !this.checkAccess("elct_inv_broadcast") && (
            <SyncInvoiceJur
              createSession={this.createSessionClick}
              closeSession={this.closeSession}
              ref={this.syncInvoice}
            />
          )}
          {currType === "cert" && !this.checkAccess("elct_inv_attach_eds") && <CertAttach />}
          {currType === "report" && !this.checkAccess("elct_inv_report") && (
            <EsfReports
              createSession={this.createSessionClick}
              ref={this.esfReports}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default ESF;
