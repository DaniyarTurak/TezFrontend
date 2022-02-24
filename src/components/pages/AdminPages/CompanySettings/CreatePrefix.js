import React, { useState } from "react";
import Alert from "react-s-alert";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function CreatePrefix() {
  const [prefix, setPrefix] = useState(
    JSON.parse(sessionStorage.getItem("isme-user-data")).prefix
  );
  const existingPrefix = JSON.parse(sessionStorage.getItem("isme-user-data"))
    .prefix;

    console.log(existingPrefix)
  const onPrefixChange = (e) => {
    let p = isNaN(e.target.value) ? 0 : e.target.value;
    if (p.length > 2) return;
    setPrefix(p);
  };

  const handleCreatePrefix = () => {
    Axios.post("/api/productsweight/create_prefix", {
      prefix,
    })
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
          Axios.get("/api/erpuser/info")
            .then((res) => res.data)
            .then((user) => {
              sessionStorage.setItem("isme-user-data", JSON.stringify(user));
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <div className="container" style = {{ marginLeft: "1rem"}}>
      {!existingPrefix ? (
        <div className="row">
          <div className="col-md-1 mt-20">
            <label>Префикс:</label>
            <input
              style={{ width: "8rem" }}
              value={prefix}
              placeholder="Введите префикс"
              className="form-control"
              name="prefix"
              onChange={onPrefixChange}
            />
          </div>

          <div
            className="col-md-4"
            style={{ display: "flex", alignItems: "flex-end", marginLeft: "3rem" }}
          >
            <button
              style={{  marginTop: "1rem" }}
              className="btn btn-success"
              onClick={handleCreatePrefix}
            >
              Создать
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12 mt-20">Ваш префикс: {prefix}</div>
        </div>
      )}
    </div>
  );
}
