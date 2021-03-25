import React, { useState, useEffect, Fragment } from "react";
import Searching from "../../../Searching";
import Axios from "axios";
import Moment from "moment";

import "moment/locale/ru";
Moment.locale("ru");

export default function PosDetails({ cashbox, closeDetail }) {
  const [cashboxDetails, setCashboxDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getCashboxDetails();
  }, []);

  const closeModal = () => {
    closeDetail(true);
  };

  const getCashboxDetails = () => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/info/cashbox", {
      params: { cashboxid: cashbox },
    })
      .then((res) => res.data)
      .then((res) => {
        setCashboxDetails(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const HaltUpdate = (id) => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/cancel", {
      params: { cashboxid: cashbox, id },
    })
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        setLoading(false);
        getCashboxDetails();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div style={{ paddingTop: "3rem" }} className="transaction-details">
      <Fragment>
        <div className="cashboxes">
          <h6>Файлы требующие обновление</h6>
          <button
            style={{ width: "30%" }}
            className="btn btn-outline-dark"
            onClick={closeModal}
          >
            Назад
          </button>
        </div>

        <hr />

        {isLoading && <Searching />}

        {!isLoading && cashboxDetails.length === 0 && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              За данный период кассовые ордера отсутствуют
            </div>
          </div>
        )}

        {!isLoading && cashboxDetails.length > 0 && (
          <div className="row mt-20">
            <div style={{ overflow: "auto" }} className="col-md-12">
              <table className="table table-striped " id="table-to-xls">
                <thead>
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ width: "20%" }}>Наименование файла</td>
                    <td style={{ width: "5%" }}>Статус</td>
                    <td style={{ width: "15%" }} className="text-center" />
                  </tr>
                </thead>
                <tbody>
                  {cashboxDetails.map((details, idx) => (
                    <tr key={idx}>
                      <td>{details.filename}</td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: details.needupdate === 0 ? "green" : "red",
                        }}
                      >
                        {details.needupdate === 0 && !details.status
                          ? "Обновлен"
                          : details.needupdate === 0 && !!details.status
                          ? details.status
                          : `Требуется Обновление`}
                      </td>

                      {details.needupdate === 1 && !details.status ? (
                        <td>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => HaltUpdate(details.id)}
                          >
                            Обратить обновление
                          </button>
                        </td>
                      ) : (
                        <td />
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Fragment>
    </div>
  );
}
