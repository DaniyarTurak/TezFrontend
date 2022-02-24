import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import companySettings from "../../../../data/companySettings";
import Searching from "../../../Searching";
import { makeStyles } from "@material-ui/core/styles";
import PointListPage from "./PointListPage";
import Cashbox from "./Cashbox";
import CreatePrefix from "./CreatePrefix";
import StockListPage from "../../ListPages/StockListPage"

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

function CompanySettings({history, location}) {
  const classes = useStyles();
  const [companySelect, setCompanySelect] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageMode, setPageMode] = useState("point");
  const [points, setPoints] = useState([])

  useEffect(() => {
    getCompaniesInfo();
  }, []);

  const onCompanyChange = (c) => {
    setCompanySelect(c);
    getPoints(c.value)
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
  const changePageMode = (e) => {
    setPageMode(e.target.name);
  };


  const getPoints = (id) => {
    Axios.get(`/api/companysettings/storepoint?company=${id}`)
    .then((res) => res.data)
    .then((list) => {
      setPoints(list)
    })
    .catch((err) => {
      console.log(err);
    });
  }


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
        {!!companySelect && (
          <div className={classes.root}>
            <div className={`row ${pageMode ? "pb-10" : ""}`}>
              {companySettings.map((page) => (
                <div className="col-md-3 report-btn-block" key={page.id}>
                  <button
                    className={`btn btn-sm btn-block btn-report ${
                      pageMode === page.route ? "btn-info" : "btn-outline-info"
                    }`}
                    name={page.route}
                    onClick={changePageMode}
                  >
                    {page.caption}
                  </button>
                </div>
              ))}
            </div>
            {pageMode && (
              <Fragment>
                <div className="empty-space" />

                <div className="row mt-10">
                  <div className="col-md-12">
                    {pageMode === "point" && (
                      <PointListPage 
                        history={history} 
                        location={location} 
                        points={points}
                        isLoading={isLoading}
                        />
                    )}
                    {pageMode === "cashbox" && (
                       <Cashbox history={history} location={location} />
                    )}
                    {pageMode === "createprefix" && (
                      <CreatePrefix history={history} location={location} />
                    )}
                    {pageMode === "stock" && (
                      <StockListPage history={history} location={location} />
                    )}

                  </div>
                </div>
              </Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanySettings;
