import React, { useState, Fragment } from "react";
import Axios from "axios";
import MaterialDateDefault from "../../../../ReusableComponents/MaterialDateDefault";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import { Typography } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CertificatesUsedTable from "./CertificatesUsedTable"
import moment from 'moment';
import TransactionDetails from "../../Details/TransactionDetails";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

ReactModal.setAppElement("#root");



export default function ReportCertificateUsed({ companyProps, classes }) {

  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [isSearched, setSearched] = useState(false);
  const [nominals, setNominals] = useState([]);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [certExcell, setCertExcell] = useState();
  const [transaction, setTransaction] = useState("");
  const [modalIsOpen, setModalOpen] = useState(false);

  const company = companyProps ? companyProps.value : "";


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
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
  };

  const getCertificates = () => {
    setSearched(true);
    setLoading(true);
    Axios.get("/api/report/certificates/used", { params: { dateFrom, dateTo } })
      .then((res) => res.data)
      .then((certs) => {
        console.log(certs);
        let noms = [];
        certs.forEach(element => {
          noms.push(element.nominal)
        });
        let newarr = [];
        certs.forEach(el => {
          newarr.push(el);
        });
        setCertExcell(newarr);
        certs.forEach(element => {
          noms.push(element.nominal)
        });
        setNominals(Array.from(new Set(noms)));
        setCertificates(certs);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const showCertificates = (nom) => {
    let crts = [];
    certificates.map((certificate) => {
      if (certificate.nominal === nom) {
        crts.push(certificate);
      }
    })
    return (
      <CertificatesUsedTable certificates={crts} openDetails={openDetails} />
    )
  };

  const getUsedCertificatesExcel = () => {
    setExcelLoading(true);
    let arr = [];

    certExcell.forEach((e) => {
      arr.push({ ...e, sell_date: moment(e.sell_date).format('L') })
    });

    Axios({
      method: "POST",
      url: "/api/report/certificates/usedtoexcel",
      data: { arr },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Использованные сертификаты.xlsx`);
        document.body.appendChild(link);
        link.click();
        setExcelLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setExcelLoading(false);
      });
  };

  const openDetails = (tr) => {
    let trans = {id: tr }
    setTransaction(trans);
    setModalOpen(true);
    console.log(trans);
  };

  const closeDetails = () => {
    setTransaction("");
    setModalOpen(false);
  };

  return (
    <Fragment>
      <ReactModal
        onRequestClose={() => {
          setModalOpen(false);
        }}
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <TransactionDetails
          companyProps={company}
          transaction={transaction}
          parentDetail={1}
          closeDetail={closeDetails}
          // holding={holding}
        />
      </ReactModal>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ paddingBottom: "20px" }}>
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
          {!isLoading && certificates.length > 0 && <Fragment>
            {console.log(certificates)}
            {nominals.map((nom, n) => (
              <Accordion key={n} style={{ margin: "0px" }} defaultExpanded>
                <AccordionSummary
                  style={{ backgroundColor: "#FFF59D" }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography className={classes.heading}>
                    Сертификаты на &nbsp; <strong>{nom} тг.</strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {showCertificates(nom)}
                </AccordionDetails>
              </Accordion>
            ))}
          </Fragment>
          }
        </Grid>
        <Grid item xs={12}>
          {!isLoading && certificates.length > 0 && <button
            className="btn btn-sm btn-outline-success"
            disabled={isExcelLoading}
            onClick={getUsedCertificatesExcel}
          >
            Выгрузить в Excel
        </button>
          }
        </Grid>
      </Grid>
    </Fragment>
  );
}
