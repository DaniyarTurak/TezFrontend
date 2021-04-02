import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import { Typography } from "@material-ui/core";
import CertificatesSoldTable from "./CertificatesSoldTable"

export default function ReportCertificateSold({ companyProps, classes }) {
  // const [certificates, setCertificates] = useState([]);
  // const [isLoading, setLoading] = useState(false);

  // const company = companyProps ? companyProps.value : "";

  // useEffect(() => {
  //   if (!company) {
  //     getCertificates();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (company) {
  //     getCertificates();
  //     setCertificates([]);
  //   }
  // }, [company]);

  // const getCertificates = () => {
  //   setLoading(true);
  //   Axios.get("/api/giftcertificates/writeofflist", { params: { company } })
  //     .then((res) => res.data)
  //     .then((cert) => {
  //       const certChanged = cert.map((c) => {
  //         return { ...c, checked: false };
  //       });
  //       setCertificates(certChanged);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       ErrorAlert(err);
  //     });
  // };

  // const handleWriteOff = () => {
  //   let writeoff = [];
  //   let items = [];
  //   let checkedCertificates = [];

  //   certificates.forEach((cert) => {
  //     if (cert.checked) {
  //       const stock = { id: cert.id };
  //       checkedCertificates.push(stock);
  //     }
  //   });

  //   checkedCertificates.forEach((item) => {
  //     items.push(parseInt(item.id, 0));
  //   });

  //   if (checkedCertificates.length === 0) {
  //     return Alert.warning("Выберите сертификаты для списания", {
  //       position: "top-right",
  //       effect: "bouncyflip",
  //       timeout: 2000,
  //     });
  //   }
  //   writeoff = { id: items };

  //   Axios.post("/api/giftcertificates/writeoff", { writeoff, company })
  //     .then(() => {
  //       setLoading(false);
  //       Alert.success("Сертификаты успешно списаны", {
  //         position: "top-right",
  //         effect: "bouncyflip",
  //         timeout: 2000,
  //       });
  //       getCertificates();
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       ErrorAlert(err);
  //     });
  // };

  // const handleCheckboxChange = (index, e) => {
  //   const isChecked = e.target.checked;
  //   let cert = certificates;
  //   cert[index].checked = isChecked;
  //   setCertificates([...cert]);
  // };

  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [isSearched, setSearched] = useState(false);
  const [nominals, setNominals] = useState([]);

  //   useEffect(() => {
  //     setSearched(false);
  // }, []);

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const getCertificates = () => {
    setSearched(true);
    setLoading(true);
    console.log(dateFrom);
    console.log(dateTo);
    Axios.get("/api/report/certificates/sold", { params: { dateFrom, dateTo } })
      .then((res) => res.data)
      .then((certs) => {
        console.log(certs);
        let noms = [];
        certs.forEach(element => {
          noms.push(element.nominal)
        });
        setNominals(Array.from(new Set(noms)));
        console.log(noms);
        setCertificates(certs);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <Fragment>
      <Fragment>
        <Grid item xs={12}>
          <MaterialDateDefault
            changeDate={changeDate}
            dateFrom={dateFrom}
            dateTo={dateTo}
            dateFromChange={dateFromChange}
            dateToChange={dateToChange}
            searchInvoices={getCertificates}
          />
        </Grid>
        <Grid item xs={12}>
          {isLoading &&
            <SkeletonTable />
          }
          {!isLoading && certificates.length === 0 && isSearched &&
            <Typography style={{ color: "#212569", textAlign: "center", padding: "20px" }}>
              Сертификатов не найдено
            </Typography>
          }
          {!isLoading && certificates.length > 0 &&
            <CertificatesSoldTable certificates={certificates} />
          }
        </Grid>
      </Fragment>
    </Fragment>
  );
}
