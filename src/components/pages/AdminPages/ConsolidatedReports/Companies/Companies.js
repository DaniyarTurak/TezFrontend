import React, { useEffect, useState, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Moment from "moment";
import Chart from "./Chart";
import DateTime from "./DateTime";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import Details from "./Details";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import admincompanygraphs from "../../../../../data/admincompanygraphs.json";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  labelRoot: {
    fontSize: 21,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  fixedHeight: {
    height: 240,
  },
  notFound: {
    marginTop: "1rem",
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
  table: {
    minWidth: 700,
  },
  buttonGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: "0.5rem",
  },
  button: { width: "12rem" },
}));

export default function Companies() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [companyData, setCompanyData] = useState([]);
  const [companyDetail, setCompanyDetail] = useState({});
  const [dateFrom, setDateFrom] = useState(
    Moment().subtract(1, "year").format()
  );
  const [dateTo, setDateTo] = useState(Moment().format());
  const [detailDate, setDetailDate] = useState("");
  const [isDetail, setDetail] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isHovered, setHovered] = useState(admincompanygraphs);

  useEffect(() => {
    getCompaniesRep();
  }, []);

  const dateFromChange = (date) => {
    setDateFrom(date);
  };

  const dateToChange = (date) => {
    setDateTo(date);
  };

  const getCompaniesRep = () => {
    setLoading(true);
    Axios.get("/api/adminpage/companiesrep", { params: { dateFrom, dateTo } })
      .then((res) => res.data)
      .then((res) => {
        setLoading(false);
        setCompanyData(res);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const hoverIn = (index) => {
    let hovered = [...admincompanygraphs];

    hovered.forEach((e, idx) => {
      if (index === idx) {
        e.hover = true;
      } else e.hover = false;
    });
    setHovered(hovered);
  };

  const hoverOut = (index) => {
    let NotHovered = [...admincompanygraphs];

    NotHovered.forEach((e, idx) => {
      if (index === idx) {
        e.hover = false;
      }
    });
    setHovered(NotHovered);
  };

  const handleClick = (company, date) => {
    if (company.clickable) {
      setDetail(true);
      setDetailDate(date);
      setCompanyDetail(company);
    }
  };
  const closeDetails = () => {
    setDetail(false);
  };
  return (
    <Grid container spacing={3}>
      {companyData.length > 0 && !isLoading && !isDetail ? (
        <Fragment>
          <DateTime
            dateFrom={dateFrom}
            dateTo={dateTo}
            classes={classes}
            dateFromChange={dateFromChange}
            dateToChange={dateToChange}
            getCompanies={getCompaniesRep}
          />
          {admincompanygraphs.map((company, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                className={fixedHeightPaper}
                style={{
                  backgroundColor:
                    isHovered[index].hover && company.clickable
                      ? "#eeeeee"
                      : "white",
                }}
                // onClick={() => handleClick(company, index)}
                onMouseEnter={() => hoverIn(index)}
                onMouseLeave={() => hoverOut(index)}
              >
                <Chart
                  company={company}
                  companyData={companyData}
                  handleClick={handleClick}
                />
              </Paper>
            </Grid>
          ))}
        </Fragment>
      ) : !isLoading && isDetail ? (
        <Grid item xs={12}>
          <Details
            closeDetails={closeDetails}
            classes={classes}
            date={detailDate}
            companyDetail={companyDetail}
          />
        </Grid>
      ) : isLoading ? (
        <Grid item xs={12}>
          <TableSkeleton />
          <TableSkeleton />
          <TableSkeleton />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <div className={classes.notFound}>Данные не найдены</div>
        </Grid>
      )}
    </Grid>
  );
}
