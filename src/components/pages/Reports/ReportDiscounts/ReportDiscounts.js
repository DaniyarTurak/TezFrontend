import React, { useState, useEffect } from "react";
import Axios from "axios";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import DiscountOptions from "./DiscountOptions";
import DiscountsTable from "./DiscountsTable";
import Moment from "moment";
import ReactModal from "react-modal";
import TransactionDetails from "../Details/TransactionDetails";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

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
    marginTop: "1rem",
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
  hover: {
    cursor: "pointer",
    color: "#162ece",
    "&:hover": {
      color: "#09135b",
    },
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  heading: {
    display: "flex",
    marginTop: "0.2rem",
    flexDirection: "row",
    flexBasis: "95%",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightRegular,
  },
  secondaryHeading: {
    fontSize: "0.875rem",
    color: "#0d3c61",
    marginLeft: "2rem",
  },
  thirdHeading: {
    marginTop: "0.2rem",
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
  accordion: {
    backgroundColor: "#e8f4fd",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightRegular,
  },
  root: {
    justifyContent: "space-between",
  },
  icon: {
    color: "#35a0f4",
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

export default function ReportDiscounts({ companyProps }) {
  const classes = useStyles();
  const [cashier, setCashier] = useState({
    value: "@",
    label: "Все",
    pointName: "",
  });
  const [cashiers, setCashiers] = useState([]);
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [discounts, setDiscounts] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [point, setPoint] = useState({ value: "0", label: "Все" });
  const [points, setPoints] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    if (!company) {
      getDiscounts();
      getCashboxUsers();
      getPoints();
    }
  }, []);

  useEffect(() => {
    if (company) {
      getDiscounts();
      getCashboxUsers();
      getPoints();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!isDateChanging) {
      getDiscounts();
    }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

  const clean = () => {
    setCashier({ value: "@", label: "Все", pointName: "" });
    setCashiers([]);
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setDiscounts([]);
    setPoint({ value: "0", label: "Все" });
  };

  const onCashierChange = (e, c) => {
    setCashier(c);
  };

  const onPointChange = (e, p) => {
    setPoint(p);
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

  const dateFromChange = (e) => {
    setDateFrom(e);
    setDateChanging(true);
  };

  const dateToChange = (e) => {
    setDateTo(e);
    setDateChanging(true);
  };

  const getCashboxUsers = () => {
    setLoading(true);
    Axios.get("/api/cashboxuser", { params: { company } })
      .then((res) => res.data)
      .then((cashiersList) => {
        const all = [{ value: "@", label: "Все", pointName: "" }];
        const cashboxusers = cashiersList.map((cashier) => {
          return {
            value: cashier.id,
            label: cashier.name,
            pointName: cashier.pointName,
          };
        });
        setCashiers([...all, ...cashboxusers]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const pointsList = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints([...all, ...pointsList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDiscounts = () => {
    setLoading(true);
    Axios.get("/api/report/transactions/discounts", {
      params: {
        cashier: cashier.value,
        dateFrom,
        dateTo,
        point: point.value,
        company,
      },
    })
      .then((res) => res.data)
      .then((discountsList) => {
        setDiscounts(discountsList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setLoading(true);
    getDiscounts();
  };

  const openDetails = (t) => {
    setTransaction(t);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setTransaction("");
    setModalOpen(false);
  };

  return (
    <Grid container spacing={3}>
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
          parentDetail={3}
          closeDetail={closeDetail}
        />
      </ReactModal>
      <DiscountOptions
        cashier={cashier}
        cashiers={cashiers}
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        handleSearch={handleSearch}
        isLoading={isLoading}
        onCashierChange={onCashierChange}
        onPointChange={onPointChange}
        point={point}
        points={points}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && discounts.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Скидки не найдены</p>
        </Grid>
      )}

      {!isLoading && discounts.length > 0 && (
        <Grid item xs={12}>
          <DiscountsTable
            classes={classes}
            dateFrom={dateFrom}
            dateTo={dateTo}
            discounts={discounts}
            openDetails={openDetails}
          />
        </Grid>
      )}
    </Grid>
  );
}
