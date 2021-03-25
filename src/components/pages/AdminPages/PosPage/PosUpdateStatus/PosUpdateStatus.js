import React, { useState, useEffect } from "react";
import Axios from "axios";

import Select from "react-select";
import Alert from "react-s-alert";
import "./pos-update-status.sass";
import { Progress } from "reactstrap";

import Checkbox from "../../../../fields/Checkbox";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

export default function PosUpdateStatus() {
  const [cashboxes, setCashboxes] = useState([]);
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [point, setPoint] = useState(false);
  const [points, setPoints] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    getTerminals();
    getCompanies();
  }, []);

  const getTerminals = () => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/info/companies")
      .then((res) => res.data)
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getCompanies = () => {
    Axios.get("/api/company/cashboxes")
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "0", points: [] }];
        const companiesChanged = list.map((result) => {
          return {
            label: result.name,
            value: result.company,
            points: result.points,
          };
        });
        setCompanies([...all, ...companiesChanged]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const getPoints = (com) => {
    const pointsChanged = com.map((p) => {
      return {
        label: p.name,
        value: p.point,
        cashboxes: p.cashboxes,
      };
    });
    setPoints([...pointsChanged]);
    setPoint("");
    setCashboxes([]);
  };

  const getCashboxes = (p) => {
    const cashboxesChanged = p.map((c) => {
      return {
        label: c.name,
        value: c.cashbox,
        checked: true,
      };
    });
    setCashboxes([...cashboxesChanged]);
  };

  const onCompanyChange = (comp) => {
    setCompany(comp);
    getPoints(comp.points);
  };

  const onPointChange = (p) => {
    setPoint(p);
    getCashboxes(p.cashboxes);
  };
  function handleCheckboxChange(index, e) {
    const isChecked = e.target.checked;
    let cashboxesChanged = cashboxes;
    cashboxesChanged[index].checked = isChecked;
    setCashboxes([...cashboxesChanged]);
  }

  const handleSelectedFile = (e) => {
    setSelectedFile(e.target.files[0]);
    setLoaded(0);
  };

  const handleFetchFromExcel = () => {
    let cash = [];
    if (!company.value || company.value === "0") {
      cash = null;
    }
    if (!point && company.value !== 0) {
      points.forEach((p) => {
        p.cashboxes.forEach((c) => {
          cash.push(c.cashbox);
        });
      });
    }

    if (point) {
      cashboxes.forEach((c) => {
        if (c.checked) {
          cash.push(c.value);
        }
      });
    }

    if (!selectedFile) {
      return Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    let data = new FormData();
    data.append("file", selectedFile, selectedFile.name);
    Axios.post("/api/cashbox/upload", data, {
      onUploadProgress: (ProgressEvent) => {
        setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        setLoading(true);
      },
    })
      .then(() => {
        Alert.success("Файл успешно выгружен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setLoaded(0);
        setLoading(true);
      })
      .catch((err) => {
        setLoaded(0);
        ErrorAlert(err);
      });

    let filename = selectedFile.name;
    Axios.get("/api/cashbox/updates", { params: { filename, cashboxes: cash } })
      .then((res) => res.data)
      .then(() => {
        getTerminals();
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <div className="terminal-list">
      {!isLoading && (
        <ul style={{ listStyle: "none", opacity: "40%", padding: "10px" }}>
          <li>
            - Загружаемый файл должен отличаться по названию от всех предыдущих
            выгрузок;
          </li>
          <li> - Без вложенных папок;</li>
          <li> - Название по шаблону: DD_MM_YYYY_Version.zip</li>
        </ul>
      )}

      <div>
        <div className="form-group files">
          <input
            style={{ color: "#2ea591" }}
            type="file"
            className="form-control"
            name="file"
            onChange={handleSelectedFile}
          />
        </div>
        <div className="row justify-content-center">
          <div className="col-md-3 point-block">
            <label htmlFor="">Компания</label>
            <Select
              name="company"
              value={company}
              onChange={onCompanyChange}
              options={companies}
              placeholder="Выберите компанию"
              noOptionsMessage={() => "Компания не найдена"}
            />
          </div>
          <div className="col-md-3 point-block">
            <label htmlFor="">Торговая точка</label>
            <Select
              name="point"
              value={point}
              onChange={onPointChange}
              options={points}
              placeholder="Выберите торговую точку"
              noOptionsMessage={() => "Торговая точка не найдена"}
            />
          </div>
        </div>
        {cashboxes.length > 0 && (
          <div className="form-group">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>ID кассы</th>
                  <th style={{ width: "65%" }}>Наименование кассы</th>
                  <th className="text-center" style={{ width: "20%" }}></th>
                </tr>
              </thead>
              <tbody>
                {cashboxes.map((cashbox, idx) => (
                  <tr key={cashbox.value}>
                    <td>{cashbox.value}</td>
                    <td>{cashbox.label}</td>
                    <td className="text-center">
                      <Checkbox
                        name={cashbox.label}
                        checked={cashbox.checked ? cashbox.checked : false}
                        onChange={(e) => handleCheckboxChange(idx, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: "1rem" }} className="form-group">
          <Progress max="100" color="success" value={loaded}>
            {Math.round(loaded, 2)}%
          </Progress>
        </div>
        <button
          style={{ marginBottom: "10px" }}
          className="btn btn-success form-control"
          onClick={handleFetchFromExcel}
        >
          Выгрузить
        </button>
      </div>
    </div>
  );
}
