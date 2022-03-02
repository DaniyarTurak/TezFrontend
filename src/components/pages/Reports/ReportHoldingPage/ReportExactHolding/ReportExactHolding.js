import React, { useState, useEffect, Fragment } from "react";
import holdingtypes from "../../../../../data/holdingtypes";
import ReportFizCustomers from "../../../Reports/ReportFizCustomers";
import ReportSalesPlanTeam from "../../../Reports/ReportSalesPlanTeam";
import ReportSalesSection from "../../../Reports/ReportSalesSection";
import ReportTransactions from "../../../Reports/ReportTransactions";
import ReportBonuses from "../ReportBonuses";
import ReportCashboxState from "../../ReportCashboxState";

import Searching from "../../../../Searching";
import Axios from "axios";
import Select from "react-select";

export default function ReportExactHolding() {
  const [reportMode, setRepotrMode] = useState("reportFizCustomers");
  const [companySelect, setCompanySelect] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getCompaniesInfo();
  }, []);

  const changeReportMode = (e) => {
    setRepotrMode(e.target.name);
  };

  const onCompanyChange = (c) => {
    setCompanySelect(c);
  };

  const getCompaniesInfo = () => {
    Axios.get("/api/company/search")
      .then((res) => res.data)
      .then((list) => {
        const companiesChanged = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCompanies(companiesChanged);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div className="report">
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
          <div className="row">
            {holdingtypes.map((report) => (
              <div
                style={{ paddingTop: "5px", paddingBottom: "5px" }}
                className="col-md-4"
                key={report.id}
              >
                <button
                  className={`btn btn-sm btn-block btn-report ${
                    reportMode === report.route
                      ? "btn-info"
                      : "btn-outline-info"
                  }`}
                  name={report.route}
                  onClick={changeReportMode}
                >
                  {report.caption}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {!isLoading && !!companySelect && reportMode && (
        <Fragment>
          <div className="empty-space" />

          <div className="row mt-10">
            <div className="col-md-12">
              {reportMode === "reportcashboxstate" && (
                <ReportCashboxState company={companySelect} holding={false} />
              )}
              {reportMode === "reportFizCustomers" && (
                <ReportFizCustomers
                  companyProps={companySelect}
                  holding={false}
                />
              )}
              {reportMode === "reportbonuses" && (
                <ReportBonuses company={companySelect} holding={false} />
              )}
              {reportMode === "reportsalesplanteam" && (
                <ReportSalesPlanTeam companyProps={companySelect} holding={false} />
              )}
              {reportMode === "reportsalessection" && (
                <ReportSalesSection
                  companyProps={companySelect}
                  holding={false}
                />
              )}
              {reportMode === "reporttransactions" && (
                <ReportTransactions
                  companyProps={companySelect}
                  holding={false}
                />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
