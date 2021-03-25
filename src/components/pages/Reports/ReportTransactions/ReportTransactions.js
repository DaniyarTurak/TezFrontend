import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import { makeStyles } from "@material-ui/core/styles";

import TransactionsOptions from "./TransactionsOptions";
import TransactionDetails from "../Details/TransactionDetails";
import TransactionsTable from "./TransactionsTable";

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

const useStyles = makeStyles((theme) => ({
  notFound: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: ".875rem",
  },
  tableRow: {
    hover: {
      "&$hover:hover": {
        backgroundColor: "#49bb7b",
      },
    },
  },
  label: {
    color: "orange",
    fontSize: ".875rem",
  },
  invoiceOptions: {
    fontSize: ".875rem",
  },
  button: {
    minHeight: "3.5rem",
    fontSize: ".875rem",
    textTransform: "none",
  },
}));

export default function ReportTransactions({
  companyProps,
  holding,
  parameters,
}) {
  const classes = useStyles();
  const [ascending, setAscending] = useState(true);
  const [consignator, setConsignator] = useState(
    parameters
      ? { label: parameters.customer, value: parameters.id }
      : { label: "Все", value: "0" }
  );
  const [consignators, setConsignators] = useState([]);
  const [dateFrom, setDateFrom] = useState(
    parameters
      ? Moment(parameters.date).format("YYYY-MM-DD")
      : Moment().format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [filter, setFilter] = useState(
    parameters
      ? {
          value: "jur",
          label: "По юр. лицам",
        }
      : {
          value: "fiz",
          label: "По физ. лицам",
        }
  );
  const [isDateChanging, setDateChanging] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [isInvoiceExcelLoading, setInvoiceExcelLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState({ label: "Все", value: "0" });
  const [points, setPoints] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [transactions, setTransactions] = useState([]);

  const company = companyProps ? companyProps.value : "";
  const options = [
    { value: "fiz", label: "По физ. лицам" },
    { value: "jur", label: "По юр. лицам" },
  ];

  if (!holding) {
    holding = false;
  }

  useEffect(() => {
    if (parameters) {
      getJurBuyers(parameters.customer);
    }
  }, [parameters]);

  useEffect(() => {
    if (company) {
      getPoints();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!company) {
      getPoints();
    }
    getJurBuyers();
  }, []);

  useEffect(() => {
    if (!isDateChanging && point.value) {
      getTransactions();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo, point]);

  useEffect(() => {
    if (!point.value) return;
    handleSearch();
  }, [filter]);

  const clean = () => {
    setTransactions([]);
    setPoint({ label: "Все", value: "0" });
    setPoints([]);
    setConsignator({ label: "Все", value: "0" });
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setFilter({
      value: "fiz",
      label: "По физ. лицам",
    });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company, holding } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: 0 }];
        const p = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints([...all, ...p]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const orderByFunction = (order) => {
    let t = transactions;
    let asc = ascending;
    let prevOrderBy = orderBy;

    prevOrderBy === order ? (asc = !asc) : (asc = true);

    t.sort((a, b) => {
      let textA = parseFloat(a[order]) || a[order];
      let textB = parseFloat(b[order]) || b[order];

      let res = asc
        ? textA < textB
          ? -1
          : textA > textB
          ? 1
          : 0
        : textB < textA
        ? -1
        : textB > textA
        ? 1
        : 0;
      return res;
    });
    setTransactions(t);
    setAscending(asc);
    setOrderBy(order);
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const onConsignatorChange = (event, c) => {
    setConsignator(c);
  };

  const onPointsChange = (event, p) => {
    setPoint(p);
  };

  const onFilterChange = (event, filterr) => {
    if (!filterr.value) return;
    setFilter(filterr);
    setConsignator({ label: "Все", value: "0" });
    setTransaction([]);
  };

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

  const handleSearch = () => {
    if (!point.value) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    getTransactions();
  };

  const getTransactions = () => {
    setLoading(true);
    Axios.get("/api/report/transactions", {
      params: {
        dateFrom,
        dateTo,
        point: point.value,
        client: filter.value,
        company,
        holding,
        consignator: consignator.value,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setTransactions(res);
        setLoading(false);
        setOrderBy("");
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getTransactionsExcel = () => {
    if (dateFrom && dateTo && point) {
      setExcelLoading(true);
      Axios.get("/api/report/transactions/excel", {
        responseType: "blob",
        params: {
          dateFrom,
          dateTo,
          point: point.value,
          client: filter.value,
          company,
          holding,
          consignator: consignator.value,
        },
      })
        .then((res) => res.data)
        .then((stockbalance) => {
          const url = window.URL.createObjectURL(new Blob([stockbalance]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Отчёт по чекам от (${dateFrom}-${dateTo}) ${point.label}.xlsx`
          );
          document.body.appendChild(link);
          link.click();
          setExcelLoading(false);
        })
        .catch((err) => {
          setExcelLoading(false);
          ErrorAlert(err);
        });
    }
  };

  const openDetails = (tr) => {
    setTransaction(tr);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setTransaction("");
    setModalOpen(false);
  };

  const getJurBuyers = (customer) => {
    Axios.get("/api/buyers", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        if (customer) {
          options.forEach((e) => {
            if (e.label === customer) {
              setConsignator({ value: e.value, label: e.label });
            }
          });
        }
        setConsignators([...all, ...options]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getInvoice = (transactionId, ticketId) => {
    setInvoiceExcelLoading(true);
    Axios.get("/api/report/transactions/jur/invoice", {
      responseType: "blob",
      params: { transactionId, company, holding },
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Накладная ${ticketId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setInvoiceExcelLoading(false);
      })
      .catch((err) => {
        setInvoiceExcelLoading(false);
        ErrorAlert(err);
      });
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
          closeDetail={closeDetail}
          holding={holding}
        />
      </ReactModal>
      <Grid container spacing={3}>
        <TransactionsOptions
          changeDate={changeDate}
          consignator={consignator}
          consignators={consignators}
          point={point}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          onPointsChange={onPointsChange}
          points={points}
          filter={filter}
          onFilterChange={onFilterChange}
          onConsignatorChange={onConsignatorChange}
          handleSearch={handleSearch}
          options={options}
        />

        {isLoading && (
          <Grid item xs={12}>
            <SkeletonTable />
          </Grid>
        )}

        {!isLoading && !point && transactions.length === 0 && (
          <Grid item xs={12}>
            <p className={classes.notFound}>Выберите торговую точку</p>
          </Grid>
        )}

        {!isLoading && point && transactions.length === 0 && (
          <Grid item xs={12}>
            <p className={classes.notFound}>
              С выбранными фильтрами ничего не найдено
            </p>
          </Grid>
        )}

        {!isLoading && transactions.length > 0 && (
          <TransactionsTable
            orderByFunction={orderByFunction}
            orderBy={orderBy}
            ascending={ascending}
            filter={filter}
            transactions={transactions}
            openDetails={openDetails}
            isInvoiceExcelLoading={isInvoiceExcelLoading}
            getInvoice={getInvoice}
            isExcelLoading={isExcelLoading}
            getTransactionsExcel={getTransactionsExcel}
          />
        )}
      </Grid>
    </Fragment>
  );
}
