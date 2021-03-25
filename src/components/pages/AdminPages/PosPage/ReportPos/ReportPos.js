import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./report-pos.sass";

import PosDetails from "../../Details/PosDetails";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

export default function ReportPos() {
  const [cashbox, setCashbox] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [terminalDetails, setTerminalDetails] = useState([]);

  const backToList = () => {
    setTerminalDetails([]);
  };

  useEffect(() => {
    getTerminals();
  }, []);

  const closeDetail = () => {
    setModalOpen(false);
  };

  const getTerminals = () => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/info/companies")
      .then((res) => res.data)
      .then((res) => {
        setLoading(false);
        setTerminals(res);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const handleDetails = (c) => {
    setCashbox(c);
    setModalOpen(true);
  };

  const terminalDetailsFunction = (comp, compName) => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/info/details", {
      params: { company: comp },
    })
      .then((res) => res.data)
      .then((res) => {
        setCompanyName(compName);
        setTerminalDetails(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  return (
    <div className="terminal-list">
      {!isLoading && terminals.length > 0 && terminalDetails.length === 0 && (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "65%" }}>Наименование компаний</th>
                <th style={{ width: "30%" }}>
                  Количество касс требующих обновление
                </th>
              </tr>
            </thead>
            <tbody style={{ cursor: "pointer" }}>
              {terminals.map((terminal) => (
                <tr
                  key={terminal.company}
                  onClick={() =>
                    terminalDetailsFunction(terminal.company, terminal.name)
                  }
                >
                  <td>{terminal.company}</td>
                  <td>{terminal.name}</td>
                  <td className="text-center">{terminal.needupdatecount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {terminalDetails.length > 0 && !modalIsOpen && (
        <div className="mt-20">
          <div className="col-md-8">
            <div>
              <b className="btn-one-line">
                Торговые точки в компании: {companyName}
              </b>
            </div>
          </div>
          <div className="col-md-12 text-right">
            <button
              style={{ width: "30%" }}
              className="btn btn-outline-dark"
              onClick={backToList}
            >
              Вернуться назад
            </button>
          </div>

          {terminalDetails.map((details, idx) => {
            return (
              <div className="row mt-20" key={idx}>
                <div className="col-md-12">{details.pointname}</div>
                <div className="col-md-12">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>Id Кассы</th>
                        <th style={{ width: "50%" }}>Наименование кассы</th>
                        <th style={{ width: "40%" }}>Статус</th>
                      </tr>
                    </thead>
                    {details.cashboxes.map((c, ind) => {
                      return (
                        <tbody key={ind}>
                          <tr
                            onClick={() => handleDetails(c.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{c.id}</td>

                            <td>{c.name}</td>
                            <td
                              style={{
                                fontWeight: "bold",
                                color: c.needupdate === 0 ? "green" : "red",
                              }}
                            >
                              {c.needupdate === 0
                                ? "Обновлен до последней версии"
                                : `Требуется Обновление`}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalIsOpen && (
        <PosDetails closeDetail={closeDetail} cashbox={cashbox} />
      )}
    </div>
  );
}
