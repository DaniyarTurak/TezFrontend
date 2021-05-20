import React, { useState, useEffect } from "react";
import Axios from "axios";

import AlertBox from "../../AlertBox";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import ResetPasswordPage from "../AdminPages/ResetPasswordPage";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const CompanyList = ({ history }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [compID, setCompID] = useState("");

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = () => {
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((companiesList) => {
        companiesList.forEach((comp) => {
          comp.show = false;
        });
        setCompanies(companiesList);
        setLoading(false);
        setUpdating(false);
      })
      .catch((err) => {
        setUpdating(false);
        setLoading(false);
      });
  };

  const handleClick = (id) => {
    const newCompanies = [...companies];
    newCompanies.forEach((e) => {
      if (e.id === id) {
        e.show = !e.show;
      }
    });
    setCompanies([...newCompanies]);
    setOpenDialog(true);
    setCompID(id);
  };

  const handleInfo = (companyData) => {
    history.push({
      pathname: "companies/info",
      state: { companyData },
    });
  };

  const handleUpdate = (id, status) => {
    status = status === "ACTIVE" ? "CLOSE" : "ACTIVE";
    let company = { id, status };
    setUpdating(true);
    Axios.post("/api/adminpage/companies/manage", { company })
      .then(() => {
        this.getCompanies();
        Alert.success("Изменения сохранены", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        setUpdating(false);
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      });
  };

  return (
    <div className="company-list">
      {isOpenDialog && (
        <ResetPasswordPage
          handleCloseDialog={() => setOpenDialog(false)}
          comp_id={compID}
          isOpenDialog={isOpenDialog}
        />
      )}
      <div className="row">
        <div className="col-md-6">
          <h6 className="btn-one-line">Список активных компаний</h6>
        </div>
      </div>
      {loading && <Searching />}
      {!loading && <div className="empty-space" />}
      {!loading && companies.length === 0 && (
        <AlertBox text="Cписок компаний пуст" />
      )}
      {!loading && companies.length > 0 && (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Название Компании</th>
                <th style={{ width: "10%", textAlign: "center" }}>Статус</th>
                <th style={{ width: "12%" }}>ID компании</th>
                <th style={{ width: "16%", textAlign: "center" }}>БИН</th>
                <th style={{ width: "16%" }}></th>
                <th style={{ width: "16%" }}></th>
                <th style={{ width: "16%" }}></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td
                    style={{
                      textAlign: "center",
                      color: company.status === "ACTIVE" ? "green" : "red",
                    }}
                  >
                    {company.status}
                  </td>
                  <td style={{ textAlign: "center" }}>{company.id}</td>
                  <td style={{ textAlign: "center" }}>{company.bin}</td>
                  <td className="text-right">
                    <button
                      className="btn btn-info btn-sm btn-block"
                      disabled={updating ? true : false}
                      onClick={() => {
                        handleInfo(company);
                      }}
                      key={company.id}
                    >
                      Подробно
                    </button>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-warning btn-sm btn-block"
                      disabled={updating ? true : false}
                      onClick={() => {
                        handleClick(company.id);
                      }}
                      key={company.id}
                    >
                      Сбросить пароль
                    </button>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-success btn-sm btn-block"
                      disabled={updating ? true : false}
                      onClick={() => {
                        handleUpdate(company.id, company.status);
                      }}
                    >
                      {company.status === "ACTIVE"
                        ? "Деактивировать"
                        : "Активировать"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
