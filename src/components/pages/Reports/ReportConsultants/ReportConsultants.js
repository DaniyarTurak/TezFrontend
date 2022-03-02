import React, { useState, useEffect } from "react";
import Axios from "axios";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import MaterialDateDefault from "../../../ReusableComponents/MaterialDateDefault";
import ConsultantsTable from "./ConsultantsTable";

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

export default function ReportConsultants({ companyProps }) {
  const classes = useStyles();
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [consultants, setConsultants] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = React.useState(null);
  const [isSearched, setSearched] = useState(false)
  const company = companyProps ? companyProps.value : "";
  const companyName = JSON.parse(sessionStorage.getItem("isme-user-data"))
    .companyname;
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  // useEffect(() => {
  //   if (!company) {
  //     getConsultants();
  //   }
  // }, []);

  useEffect(() => {
    if (company) {
      getConsultants();
      clean();
    }
  }, [company]);

  useEffect(() => {
    // if (!isDateChanging) {
    //   getConsultants();
    // }
    return () => {
      setDateChanging(false);
    };
  }, [dateFrom, dateTo]);

  const clean = () => {
    setDateFrom(Moment().format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
    setConsultants([]);
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
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

  const getConsultants = () => {
    setSearched(true)
    setLoading(true);
    Axios.get("/api/report/transactions/consultants", {
      params: { dateFrom, dateTo, company },
    })
      .then((res) => res.data)
      .then((consultantsList) => {
        consultantsList.forEach((consultant) => {
          consultant.show = false;
        });
        setConsultants(consultantsList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const handleClick = (id) => {
    const newConsultants = [...consultants];
    newConsultants.forEach((e) => {
      if (e.id === id) {
        e.show = !e.show;
      }
    });
    setSelectedID(id);
    setConsultants([...newConsultants]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialDateDefault
          changeDate={changeDate}
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateFromChange={dateFromChange}
          dateToChange={dateToChange}
          searchInvoices={() => getConsultants(dateFrom, dateTo)}
          disableButton={isLoading}
        />
      </Grid>

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && consultants.length === 0 && isSearched &&(
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && consultants.length > 0 && (
        <ConsultantsTable
          classes={classes}
          companyName={companyName}
          dateFrom={dateFrom}
          dateTo={dateTo}
          handleClick={handleClick}
          now={now}
          consultants={consultants}
          selectedID={selectedID}
        />
      )}
    </Grid>
  );
}
