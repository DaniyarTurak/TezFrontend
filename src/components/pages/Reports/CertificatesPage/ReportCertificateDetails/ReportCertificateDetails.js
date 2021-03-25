import React, { useState, useEffect } from "react";
import Axios from "axios";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

import Checkbox from "../../../../fields/Checkbox";

export default function ReportCertificateDetails({ companyProps }) {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    if (!company) {
      getCertificates();
    }
  }, []);

  useEffect(() => {
    if (company) {
      getCertificates();
      setCertificates([]);
    }
  }, [company]);

  const getCertificates = () => {
    setLoading(true);
    Axios.get("/api/giftcertificates/writeofflist", { params: { company } })
      .then((res) => res.data)
      .then((cert) => {
        const certChanged = cert.map((c) => {
          return { ...c, checked: false };
        });
        setCertificates(certChanged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleWriteOff = () => {
    let writeoff = [];
    let items = [];
    let checkedCertificates = [];

    certificates.forEach((cert) => {
      if (cert.checked) {
        const stock = { id: cert.id };
        checkedCertificates.push(stock);
      }
    });

    checkedCertificates.forEach((item) => {
      items.push(parseInt(item.id, 0));
    });

    if (checkedCertificates.length === 0) {
      return Alert.warning("Выберите сертификаты для списания", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    writeoff = { id: items };

    Axios.post("/api/giftcertificates/writeoff", { writeoff, company })
      .then(() => {
        setLoading(false);
        Alert.success("Сертификаты успешно списаны", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCertificates();
      })
      .catch((err) => {
        setLoading(false);
        Alert.error("Ошибка при списании", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        console.log(err);
      });
  };

  const handleCheckboxChange = (index, e) => {
    const isChecked = e.target.checked;
    let cert = certificates;
    cert[index].checked = isChecked;

    setCertificates([...cert]);
  };

  return (
    <div className="report-stock-balance">
      {isLoading && <Searching />}

      {!isLoading && certificates.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && certificates.length > 0 && (
        <div style={{ justifyContent: "center" }} className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>№</td>
                  <td className="text-center">Код</td>
                  <td className="text-center">Номинал</td>
                  <td className="text-center">Баланс</td>
                  <td className="text-center">Дата образования остатка</td>
                  <td className="text-right"></td>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="text-center">{certificate.code}</td>
                    <td className="text-center">{certificate.denomination}</td>
                    <td className="text-center">{certificate.balance}</td>
                    <td className="text-center">{certificate.date}</td>
                    <td className="text-right">
                      <Checkbox
                        name={certificate.code + idx}
                        checked={certificate.checked}
                        onChange={(e) => handleCheckboxChange(idx, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-md-4">
            <button
              style={{ margin: "10px" }}
              className="btn btn-block btn-outline-info"
              disabled={isLoading}
              onClick={handleWriteOff}
            >
              списать
            </button>
          </div>

          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Сертификаты на списание`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
