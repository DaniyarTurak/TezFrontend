import React, { useState, useEffect } from "react";
import Axios from "axios";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import CertificateOptionsStatus from "./CertificateOptionsStatus";
import Grid from "@material-ui/core/Grid";
import CertificatesTable from "./CertificatesTable";

export default function ReportCertificateStatus({ companyProps, classes }) {
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
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [code, setCode] = useState("");
  const [isSearchable, setSearchable] = useState(false);

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

  useEffect(() => {
    if (code === "") {
      setSearchable(false);
    }
    else {
      setSearchable(true);
    }
  }, [code]);

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

  const onStatusChange = (e, stat) => {
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

  const onPointChange = (e, p) => {
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
        ErrorAlert(err);
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
        ErrorAlert(err);
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
        ErrorAlert(err);
      });
  };

  const getStatusCertificatesExcel = () => {
    setExcelLoading(true);
    let arr = certificates;
    Axios({
      method: "POST",
      url: "/api/report/certificates/statustoexcel",
      data: { arr },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Статус сертификатов.xlsx`);
        document.body.appendChild(link);
        link.click();
        setExcelLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setExcelLoading(false);
      });
  };

  const onCodeChange = (e) => {
    if (e.target.value.trim() === "") {
      setCertificates(certificatesAll);
    };
    setCode(e.target.value.trim());
  }

  const searchCertificates = () => {
    let temp = [];

    if (code !== "") {
      setStatus({ value: "0", label: "Все" });
      setCertificates(certificatesAll);
      certificatesAll.forEach(cert => {
        if (cert.code === code) {
          temp.push(cert);
        }
      });
      setCertificates(temp);
    }
    else {
      Alert.warning(`Введите номер сертификата`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
  }

  return (
    <Grid container spacing={3}>
      <CertificateOptionsStatus
        onStatusChange={onStatusChange}
        onCodeChange={onCodeChange}
        searchCertificates={searchCertificates}
        onPointChange={onPointChange}
        point={point}
        points={points}
        status={status}
        statuses={statuses}
        code={code}
        isSearchable={isSearchable}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && certificates.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && certificates.length > 0 && (
        <CertificatesTable
          classes={classes}
          certificates={certificates}
          handleActivate={handleActivate}
          status={status}
        />
      )}
      {!isLoading && certificates.length > 0 &&
        <Grid item xs={12}>
          <button
            className="btn btn-sm btn-outline-success"
            disabled={isExcelLoading}
            onClick={getStatusCertificatesExcel}
          >
            Выгрузить в Excel
        </button>
        </Grid>
      }
    </Grid>
  );
}
