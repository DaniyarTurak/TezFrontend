import React, { useState, useEffect } from "react";
import Axios from "axios";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";

import Grid from "@material-ui/core/Grid";
import DetailsTable from "./DetailsTable";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

export default function ReportCertificateDetails({ companyProps, classes }) {
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
        ErrorAlert(err);
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
        ErrorAlert(err);
      });
  };

  const handleCheckboxChange = (index, e) => {
    const isChecked = e.target.checked;
    let cert = certificates;
    cert[index].checked = isChecked;
    setCertificates([...cert]);
  };

  return (
    <Grid container spacing={3}>
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
        <DetailsTable
          classes={classes}
          certificates={certificates}
          handleCheckboxChange={handleCheckboxChange}
          handleWriteOff={handleWriteOff}
          isLoading={isLoading}
        />
      )}
    </Grid>
  );
}
