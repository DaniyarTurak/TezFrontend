import React, { useState, useEffect } from "react";
import Axios from "axios";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import ReactModal from "react-modal";

import TransactionDetails from "../Details/TransactionDetails";
import DebtTransactionDetails from "./DebtTransactionDetails";
import WriteOffDetails from "./WriteOffDetails";
import FizProductDetails from "./FizProductDetails";
import FizCustomersTable from "./FizCustomersTable";
import FizCustomerDetails from "./FizCustomerDetails";

import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

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

const customStylesFiz = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "850px",
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

export default function ReportFizCustomers({ companyProps, holding }) {
  const classes = useStyles();
  const [customerData, setCustomerData] = useState({});
  const [currentDebt, setCurrentDebt] = useState("");
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerInfo, setCustomerInfo] = useState("");
  const [debtModalIsOpen, setDebtModalIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [fizProductModalIsOpen, setFizProductModalIsOpen] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(false);
  const [transaction, setTransaction] = useState("");
  //writeOff стейты ниже используется только для подтягивания информации по списанию, после нажатия на "Погасить". Желательно переделать.
  const [maxValue, setMaxValue] = useState("");
  const [writeOff, setWriteOff] = useState([]);
  const [inputWriteOff, setInputWriteOff] = useState([]);
  const [writeOffIdx, setWriteOffIdx] = useState("");
  const [writeOffModalIsOpen, setWriteOffModalIsOpen] = useState(false);
  const [debtSum, setDebtSum] = useState([]);

  const company = companyProps ? companyProps.value : "";
  const user = JSON.parse(sessionStorage.getItem("isme-user-data")) || null;

  const companyID =
    JSON.parse(sessionStorage.getItem("isme-user-data")).id || null;

  useEffect(() => {
    getCustomersInfo();
  }, [company]);

  const getCustomersInfo = () => {
    if (!holding) {
      holding = false;
    }
    setLoading(true);
    Axios.get("/api/report/fizcustomers", {
      params: { holding, company },
    })
      .then((res) => res.data)
      .then((customersList) => {
        let formattedDebt = [];
        let debtSum = [];

        customersList.map((e, idx) => {
          return formattedDebt.push(e.details.debt);
        });

        // ниже прерписать код
        formattedDebt.forEach((e) => {
          if (e.length > 1) {
            debtSum.push(
              e.reduce((d, next) => {
                return d.debt + next.debt;
              })
            );
          } else debtSum.push(e[0].debt);
        });

        setDebtSum(debtSum);

        let newWriteOff = [];
        for (let i = 0; i <= customers.length; i++) {
          newWriteOff[i] = 0;
        }
        setCustomers(customersList);
        setWriteOff([...newWriteOff]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const invoiceDetails = (data, idx) => {
    setToggleDetails(true);
    setCustomerData(data);
    setCurrentDebt(debtSum[idx]);
  };

  const backToList = () => {
    setToggleDetails(false);
    setDateFrom(Moment().startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
  };

  const dateFromChange = (e) => {
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
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

  const openWriteOffDetails = (data, idx) => {
    const fill = [];
    data.details.debt.map((e, idx) => {
      return fill.push(0);
    });
    setInputWriteOff([...fill]);
    setCustomerInfo(data);
    setWriteOffIdx(idx);
    setMaxValue(data.details.debt);
    setWriteOffModalIsOpen(true);
  };

  const handleWriteOff = (debtElement) => {
    let debt = inputWriteOff[0];
    const writeOffResult = {
      company: debtElement.company,
      writeoff_debt_customers: {
        id: debtElement.id,
        debt,
        user: user.id,
      },
    };
    Axios.post("/api/report/fizcustomers/writeoff_debt", writeOffResult)
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Списание прошло успешно", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        getCustomersInfo();
        closeWriteOffDetail();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleProductDetails = (c, idx) => {
    const newCustomer = { ...c, debtSumById: debtSum[idx] };
    setCustomer(newCustomer);
    setFizProductModalIsOpen(true);
  };

  const openDetails = (t, id) => {
    if (id) {
      setTransaction(t);
      setDebtModalIsOpen(false);
      setModalOpen(true);
    } else {
      setTransaction(t);
      setDebtModalIsOpen(true);
      setModalOpen(false);
    }
  };

  const onWriteOffChange = (idx, e) => {
    let inputChanged = [];
    let check = isNaN(e.target.value) ? 0 : e.target.value;
    inputWriteOff.forEach((el, index) => {
      if (index === idx) {
        inputChanged[index] = check;
      } else inputChanged[index] = el;
    });
    if (parseFloat(inputChanged[0]) > parseFloat(maxValue[0].debt)) {
      return Alert.info("Сумма списание не может быть больше.", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else setInputWriteOff([...inputChanged]);
  };

  const closeFizProductDetail = () => {
    setFizProductModalIsOpen(false);
  };

  const closeWriteOffDetail = () => {
    setWriteOffModalIsOpen(false);
  };

  const closeDetail = () => {
    setTransaction(null);
    setModalOpen(false);
  };

  const closeDebtDetail = () => {
    setTransaction(null);
    setDebtModalIsOpen(false);
  };

  const calculateTotalDebt = (info) => {
    let total = 0;
    let debt = 0;
    let clear = 0;
    let back = 0;

    info.forEach((cur) => {
      if (Math.sign(cur.debt) !== -1 && cur.debttype === 1) {
        debt += cur.debt;
      }
    });

    info.forEach((cur) => {
      if (Math.sign(cur.debt) !== -1 && cur.debttype !== 1) {
        clear += cur.debt;
      }
    });

    info.forEach((cur) => {
      if (Math.sign(cur.debt) === -1) {
        back += cur.debt;
      }
    });

    if (Math.sign(back) === -1) {
      total = debt - clear + back;
    } else total = debt - clear - back;
    return total;
  };

  return (
    <Grid container spacing={3}>
      {fizProductModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setFizProductModalIsOpen(false);
          }}
          isOpen={fizProductModalIsOpen}
          style={customStylesFiz}
        >
          <FizProductDetails
            customer={customer}
            debtSum={debtSum}
            company={company}
            holding={holding}
            closeFizProductDetail={closeFizProductDetail}
          />
        </ReactModal>
      )}

      {writeOffModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setWriteOffModalIsOpen(false);
          }}
          isOpen={writeOffModalIsOpen}
          style={customStyles}
        >
          <WriteOffDetails
            customerInfo={customerInfo}
            writeOffIdx={writeOffIdx}
            writeOff={writeOff}
            inputWriteOff={inputWriteOff}
            handleWriteOff={handleWriteOff}
            onWriteOffChange={onWriteOffChange}
            closeWriteOffDetail={closeWriteOffDetail}
            companyID={companyID}
          />
        </ReactModal>
      )}

      {modalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setModalOpen(false);
          }}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <TransactionDetails
            transaction={transaction}
            parentDetail={2}
            holding={holding}
            closeDetail={closeDetail}
          />
        </ReactModal>
      )}

      {debtModalIsOpen && (
        <ReactModal
          onRequestClose={() => {
            setDebtModalIsOpen(false);
          }}
          isOpen={debtModalIsOpen}
          style={customStyles}
        >
          <DebtTransactionDetails
            transaction={transaction}
            closeDebtDetail={closeDebtDetail}
          />
        </ReactModal>
      )}

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && customers.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Покупатели не найдены</p>
        </Grid>
      )}

      {!isLoading && customers.length > 0 && !toggleDetails && (
        <FizCustomersTable
          classes={classes}
          customers={customers}
          debtSum={debtSum}
          openWriteOffDetails={openWriteOffDetails}
          invoiceDetails={invoiceDetails}
          handleProductDetails={handleProductDetails}
        />
      )}

      {toggleDetails && (
        <Grid item xs={12}>
          <FizCustomerDetails
            backToList={backToList}
            calculateTotalDebt={calculateTotalDebt}
            classes={classes}
            changeDate={changeDate}
            company={company}
            currentDebt={currentDebt}
            customer={customer}
            customerData={customerData}
            dateFrom={dateFrom}
            dateFromChange={dateFromChange}
            dateTo={dateTo}
            dateToChange={dateToChange}
            openDetails={openDetails}
          />
        </Grid>
      )}
    </Grid>
  );
}
