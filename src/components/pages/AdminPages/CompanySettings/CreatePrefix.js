import React, { useEffect, useState } from "react";
import Alert from "react-s-alert";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function CreatePrefix({
  companySelect,
  prefix,
  setPrefix,
  getPrefix,
}) {
  const [newPrefix, setNewPrefix] = useState(0);

  const onPrefixChange = (e) => {
    let p = isNaN(e.target.value) ? 0 : e.target.value;
    if (p.length > 2) return;
    setNewPrefix(p);
  };

  const handleCreatePrefix = () => {
    Axios.post(
      `/api/companysettings/create_prefix?company=${companySelect.value}`,
      {
        prefix: newPrefix,
      }
    )
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        if (resp.code === "success") {
          Alert.success("Префикс создан успешно!", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          getPrefix(companySelect.value);
          setNewPrefix(0)
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <div className="container" style={{ marginLeft: "1rem" }}>
      {!prefix ? (
        <div className="row">
          <div className="col-md-1 mt-20">
            <label>Префикс:</label>
            <input
              style={{ width: "8rem" }}
              value={newPrefix}
              placeholder="Введите префикс"
              className="form-control"
              name="prefix"
              onChange={onPrefixChange}
            />
          </div>

          <div
            className="col-md-4"
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: "3rem",
            }}
          >
            <button
              style={{ marginTop: "1rem" }}
              className="btn btn-success"
              onClick={handleCreatePrefix}
            >
              Создать
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 mt-20">Ваш префикс: {prefix}</div>
          <div className="col-md-6 mt-20 text-right" >
            <button
              className="btn btn-link btn-sm"
              onClick={() => setPrefix(undefined)}
            >
              Изменить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
