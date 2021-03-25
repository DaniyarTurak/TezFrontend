import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import TableSkeleton from "../../../Skeletons/TableSkeleton";

export default function ReportConsultantsDetails({ dateFrom, dateTo, id }) {
  useEffect(() => {
    getConsdetails();
  }, []);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);

  const getConsdetails = () => {
    setLoading(true);
    Axios.get("/api/report/transactions/consultantdetails", {
      params: { dateFrom, dateTo, id },
    })
      .then((res) => res.data)
      .then((consultantDetails) => {
        setDetails(consultantDetails);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Fragment>
      {loading && <TableSkeleton />}
      {!loading && (
        <table className="table table-striped " width="100%">
          <thead>
            <tr>
              <td className="text-center font-weight-bold">№</td>
              <td className="text-center font-weight-bold">Штрих-код</td>
              <td className="text-center font-weight-bold">Наименование</td>
              <td className="text-center font-weight-bold">Количество</td>
            </tr>
          </thead>
          {details.length !== 0 && (
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="text-center">{detail.code}</td>
                  <td className="text-center">{detail.name}</td>
                  <td className="text-center">{detail.units}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      )}
    </Fragment>
  );
}
