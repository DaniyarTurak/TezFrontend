import React, { useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function ReportCertificateStatus({ companyProps }) {
  const [certificates, setCertificates] = useState([]);
  const [certificatesAvailable, setCertificatesAvailable] = useState([]);
  const [certificatesActive, setCertificatesActive] = useState([]);
  const [certificatesExpired, setCertificatesExpired] = useState([]);
  const [certificatesUsed, setCertificatesUsed] = useState([]);
  const [certificatesAll, setCertificatesAll] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [point, setPoint] = useState("");
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState({ value: "0", label: "Все" });

  const company = companyProps ? companyProps.value : "";
  const statuses = [
    { value: "0", label: "Все" },
    { value: "1", label: "Доступен для продажи" },
    { value: "2", label: "Продан (Активен)" },
    { value: "3", label: "Продан (Истёк)" },
    { value: "4", label: "Использован" },
  ];

  useEffect(() => {
    if (!company) {
      getCertificates();
      getStockList();
    }
  }, []);

  useEffect(() => {
    if (company) {
      getCertificates();
      getStockList();
      clean();
    }
  }, [company]);

  const clean = () => {
    setPoint("");
    setPoints([]);
    setStatus({ value: "0", label: "Все" });
    setCertificates([]);
    setCertificatesAll([]);
    setCertificatesAvailable([]);
    setCertificatesActive([]);
    setCertificatesExpired([]);
    setCertificatesUsed([]);
  };

  const onStatusChange = (stat) => {
    setStatus(stat);
    stat.value === "0"
      ? setCertificates(certificatesAll)
      : stat.value === "1"
      ? setCertificates(certificatesAvailable)
      : stat.value === "2"
      ? setCertificates(certificatesActive)
      : stat.value === "3"
      ? setCertificates(certificatesExpired)
      : setCertificates(certificatesUsed);
  };

  const onPointChange = (p) => {
    setPoint(p);
  };

  const getCertificates = () => {
    setLoading(true);
    Axios.get("/api/giftcertificates", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const certAll = res;
        const certAvailable = res.filter(
          (cert) => cert.status === "Доступен для продажи"
        );
        const certActive = res.filter(
          (cert) => cert.status === "Продан (Активен)"
        );
        const certExpired = res.filter(
          (cert) => cert.status === "Продан (Истек)"
        );
        const certUsed = res.filter((cert) => cert.status === "Использован");
        setCertificates(res);
        setCertificatesAll(certAll);
        setCertificatesAvailable(certAvailable);
        setCertificatesActive(certActive);
        setCertificatesExpired(certExpired);
        setCertificatesUsed(certUsed);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getStockList = () => {
    Axios.get("/api/stock", { params: { company } })
      .then((res) => res.data)
      .then((stockList) => {
        const options = stockList.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        setPoints([...options]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleActivate = (certificate) => {
    if (!point) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    setLoading(true);
    Axios.post("/api/giftcertificates/activate", {
      point: point.value,
      id: certificate.id,
      company,
    })
      .then((res) => {
        setLoading(false);
        Alert.success("Вы успешно активировали сертификат", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        setLoading(false);
        Alert.error(`Возникла ошибка: ${err.response.data.text}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  return (
    <div className="report-stock-balance">
      <div className="row">
        <div className="col-md-3 point-block">
          <label htmlFor="">Статус</label>
          <Select
            name="status"
            value={status}
            onChange={onStatusChange}
            options={statuses}
            placeholder="Выберите статус"
            noOptionsMessage={() => "Статус не найден"}
          />
        </div>
        <div className="col-md-6">
          <label>Выберите торговую точку:</label>
          <Select
            name="point"
            value={point}
            onChange={onPointChange}
            options={points}
            placeholder="Выберите торговую точку"
            noOptionsMessage={() => "Точка не найдена"}
          />
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && certificates.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {/* {!isLoading && certificates.length > 0 && ( */}
      <div className="row mt-20">
        <div className="col-md-12">
          <table className="table table-striped " id="table-to-xls">
            <thead>
              <tr style={{ fontWeight: "bold" }}>
                <td>№</td>
                <td>Код</td>
                <td className="text-center">Номинал</td>
                <td className="text-center">Дата истечения</td>
                <td className="text-center">Тип</td>
                <td className="text-center">Дата продажи</td>
                <td className="text-center">Статус</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {certificates.map((certificate, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>

                  <td>{certificate.code}</td>
                  <td className="text-center">{certificate.denomination}</td>
                  <td className="text-center">{certificate.expiredate}</td>
                  <td className="text-center">{certificate.type}</td>

                  <td className="text-center">{certificate.selldate}</td>
                  <td
                    className="text-center"
                    style={{
                      fontWeight: "bold",
                      color:
                        certificate.status === "Доступен для продажи"
                          ? "green"
                          : certificate.status === "Использован"
                          ? "black"
                          : certificate.status === "Продан (Активен)"
                          ? "blue"
                          : "red",
                    }}
                  >
                    {certificate.status}
                  </td>
                  <td>
                    {certificate.status === "Доступен для продажи" ||
                    certificate.status === "Использован" ? (
                      <button
                        className="btn btn-outline-info"
                        onClick={() => handleActivate(certificate)}
                      >
                        Активировать
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-12">
          <ReactHTMLTableToExcel
            className="btn btn-sm btn-outline-success"
            table="table-to-xls"
            filename={`Сертификаты(${status.label})`}
            sheet="tablexls"
            buttonText="Выгрузить в excel"
          />
        </div>
      </div>
    </div>
  );
}
