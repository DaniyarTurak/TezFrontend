import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import bwipjs from "bwip-js";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TableSkeleton from "../../../Skeletons/TableSkeleton";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import InvoiceOptions from "./InvoiceOptions";
import InvoicesTable from "./InvoicesTable";
import InvoiceDetails from "./InvoiceDetails";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
  },
  buttonGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: { width: "12rem" },
  notFound: { textAlign: "center", color: theme.palette.text.secondary },
  tableRow: {
    hover: {
      "&$hover:hover": {
        backgroundColor: "#49bb7b",
      },
    },
  },
}));

export default function InvoiceBarcodes({ history }) {
  const classes = useStyles();
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [details, setDetails] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [markedInvoice, setMarkedInvoice] = useState("");
  const [selectedPrintType, setSelectedPrintType] = useState("");

  const [useBrand, setUseBrand] = useState(false);

  const printTypes = [
    { value: "1", label: "Обычный svg" },
    { value: "3", label: "С ценой svg" },
    { value: "4", label: "С ценой 30x20" },
    { value: "5", label: "С ценой 60x30" },
  ];

  useEffect(() => {
    if (details.length > 0) {
      try {
        details.map((e, idx) => {
          let canvas = bwipjs.toCanvas(e.code, {
            bcid: "code128", // Barcode type
            text: e.code, // Text to encode
            scale: 3, // 3x scaling factor
            height: 10, // Bar height, in millimeters
            includetext: true, // Show human-readable text
            textxalign: "center", // Always good to set this
          });
          return canvas;
        });
      } catch (e) {
        // `e` may be a string or Error object
      }
    }
  }, [details, selectedPrintType]);

  useEffect(() => {
    if (!isDateChanging) {
      searchInvoices();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

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

  const handleUseBrandChange = (e) => {
    setUseBrand(e.target.checked);
  };

  const dateFromChange = (date) => {
    setDateFrom(date);
    setDateChanging(true);
  };

  const dateToChange = (date) => {
    setDateTo(date);
    setDateChanging(true);
  };
  const index = [0, 2];

  const searchInvoices = () => {
    setLoading(true);

    let newinvoices = [];
    index.forEach((e, idx) => {
      Axios.get("/api/report/history/invoices", {
        params: {
          dateFrom,
          dateTo,
          invoicetype: e,
          counterpartie: 0,
          consignator: 0,
        },
      })
        .then((res) => res.data)
        .then((res) => {
          newinvoices.push(res);
          if (newinvoices.length === 2) {
            setInvoices([...newinvoices[0], ...newinvoices[1]]);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    });
  };

  const invoiceDetails = (inv) => {
    Axios.get("/api/report/history/invoice/details", {
      params: {
        invoicenumber: inv.invoicenumber,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setDetails(res);
        setMarkedInvoice(inv);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const printTypesChanged = (event) => {
    setSelectedPrintType(event.target.value);
  };

  const backToList = () => {
    setDetails([]);
    setMarkedInvoice(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            color="inherit"
            component={LinkBehavior}
            to="/usercabinet/product/printbarcode"
          >
            Печать штрихкода
          </Link>
          {markedInvoice && (
            <Link href="#" color="inherit" onClick={backToList}>
              Накладные
            </Link>
          )}
          {markedInvoice ? (
            <Typography color="textPrimary">Детали</Typography>
          ) : (
            <Typography color="textPrimary">Накладные</Typography>
          )}
        </Breadcrumbs>
      </Grid>
      {!markedInvoice && (
        <Grid item xs={12}>
          <MaterialDateDefault
            changeDate={changeDate}
            dateFrom={dateFrom}
            dateTo={dateTo}
            dateFromChange={dateFromChange}
            dateToChange={dateToChange}
            searchInvoices={searchInvoices}
          />
        </Grid>
      )}

      {markedInvoice && (
        <Grid item xs={12}>
          <InvoiceOptions
            selectedPrintType={selectedPrintType}
            printTypesChanged={printTypesChanged}
            printTypes={printTypes}
            classes={classes}
            handleUseBrandChange={handleUseBrandChange}
            useBrand={useBrand}
          />
        </Grid>
      )}

      {isLoading && (
        <Grid item xs={12}>
          <TableSkeleton />
        </Grid>
      )}

      {!isLoading && invoices.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Накладные не найдены</p>
        </Grid>
      )}

      {!isLoading && invoices.length > 0 && details.length === 0 && (
        <Grid item xs={12}>
          <InvoicesTable
            classes={classes}
            invoices={invoices}
            invoiceDetails={invoiceDetails}
          />
        </Grid>
      )}

      {markedInvoice && details.length > 0 && selectedPrintType && (
        <Grid item xs={12}>
          <InvoiceDetails
            markedInvoice={markedInvoice}
            backToList={backToList}
            details={details}
            selectedPrintType={selectedPrintType}
            classes={classes}
            useBrand={useBrand}
          />
        </Grid>
      )}
    </Grid>
  );
}
