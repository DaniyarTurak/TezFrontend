import React, { useState, useEffect } from "react";
import reports from "../../../data/adminReports";

import ReportCashboxState from "../Reports/ReportCashboxState";
import ReportConsultants from "../Reports/ReportConsultants";
import ReportDiscounts from "../Reports/ReportDiscounts";
import ReportIncome from "../Reports/ReportIncome";
// import ConsignmentReports from "../Reports/ConsignmentReports";
import ReportLoyalty from "../Reports/ReportLoyalty";
import ReportSales from "../Reports/ReportSales";
import ReportSalesPlan from "../Reports/ReportSalesPlan";
import ReportSalesSection from "../Reports/ReportSalesSection";
import ReportStockBalance from "../Reports/ReportStockBalance";
import ReportTransactions from "../Reports/ReportTransactions";
import ReportProductMovement from "../Reports/ReportProductMovement";
import ReportInvoiceHistory from "../Reports/ReportInvoiceHistory";

import CertificatesPage from "../Reports/CertificatesPage";
import ReportRevisionPage from "../Reports/ReportRevisionPage";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Searching from "../../Searching";
import Axios from "axios";
import Select from "react-select";

import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>{children}</Box>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "1rem",
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function ReportAdminPage({ user }) {
  const classes = useStyles();
  const [companySelect, setCompanySelect] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reportMode, setReportMode] = useState("ReportCashboxAdmin");
  const [reportSupport, setReportSupport] = useState("");

  useEffect(() => {
    getCompaniesInfo();
    if (user === "support") {
      setReportSupport([reports[0]]);
    } else setReportSupport(reports);
  }, []);

  const changeReportMode = (e, newValue) => {
    setReportMode(newValue);
  };

  const onCompanyChange = (c) => {
    setCompanySelect(c);
  };

  const getCompaniesInfo = () => {
    setLoading(true);
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((list) => {
        const companiesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCompanies(companiesList);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className={classes.root1}>
      {isLoading && <Searching />}

      <div className="col-md-12">
        <Select
          name="companySelect"
          value={companySelect}
          onChange={onCompanyChange}
          options={companies}
          placeholder="Выберите компанию"
          noOptionsMessage={() => "Компания не найдена"}
        />
        {!isLoading && !!companySelect && (
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={reportMode}
                onChange={changeReportMode}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                {reportSupport.map((report, idx) => (
                  <Tab
                    key={idx}
                    value={report.route}
                    label={report.caption}
                    icon={<AssessmentIcon />}
                    {...a11yProps(report.route)}
                  />
                ))}
              </Tabs>
            </AppBar>
            <TabPanel
              value={reportMode}
              index={reportMode}
              style={{ marginTop: "1rem" }}
            >
              {reportMode === "ReportCashboxAdmin" && (
                <ReportCashboxState company={companySelect} />
              )}
              {reportMode === "ReportConsultantsAdmin" && (
                <ReportConsultants companyProps={companySelect} />
              )}
              {reportMode === "ReportDiscountsAdmin" && (
                <ReportDiscounts companyProps={companySelect} />
              )}
              {reportMode === "ReportIncomeAdmin" && (
                <ReportIncome companyProps={companySelect} />
              )}
              {/* {reportMode === "ConsignmentReports" && (
                <ConsignmentReports companyProps={companySelect} />
              )} */}
              {reportMode === "ReportLoyaltyAdmin" && (
                <ReportLoyalty companyProps={companySelect} />
              )}
              {reportMode === "ReportSalesAdmin" && (
                <ReportSales companyProps={companySelect} />
              )}
              {reportMode === "ReportSalesPlanAdmin" && (
                <ReportSalesPlan companyProps={companySelect} />
              )}
              {reportMode === "ReportSalesSectionAdmin" && (
                <ReportSalesSection companyProps={companySelect} />
              )}
              {reportMode === "ReportAdminStockBalance" && (
                <ReportStockBalance companyProps={companySelect} />
              )}
              {reportMode === "ReportTransactionsAdmin" && (
                <ReportTransactions companyProps={companySelect} />
              )}
              {reportMode === "ReportAdminProductMovement" && (
                <ReportProductMovement company={companySelect} />
              )}
              {reportMode === "ReportCertificatesAdmin" && (
                <CertificatesPage companyProps={companySelect} />
              )}
              {reportMode === "ReportRevisionAdmin" && (
                <ReportRevisionPage companyProps={companySelect} />
              )}

              {reportMode === "ReportAdminInvoiceHistory" && (
                <ReportInvoiceHistory companyProps={companySelect} />
              )}
            </TabPanel>
          </div>
        )}
      </div>
    </div>
  );
}
