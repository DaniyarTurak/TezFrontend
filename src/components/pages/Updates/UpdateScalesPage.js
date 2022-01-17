import React, { useState, useEffect } from "react";
import Axios from "axios";

import Alert from "react-s-alert";
import Searching from "../../Searching";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";

export default function CreateScales() {
  const [scaleDeleted, setScalesDeleted] = useState([]);
  const [scaleNotDeleted, setScaleNotDeleted] = useState([]);
  const [isHidden, setHidden] = useState(true);
  const [isEdit, setEdit] = useState(true);
  const [isLoading, setLoading] = useState([]);
  const [addNewValue, setAddNewValue] = useState("");
  const [sweetalert, setSweetalert] = useState(null);
  const [stock, setStock] = useState("");
  const [stocks, setStocks] = useState([]);

  const raiseError =
    "Возникла ошибка при обработке вашего запроса. Мы уже работаем над решением. Попробуйте позже";
  const caption = " список неактивных весов";

  useEffect(() => {
    getStocks();
  }, []);

  useEffect(() => {
    if (stock) {
      getScales();
    }
  }, [stock]);

  const getStocks = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((res) => {
        const stocks = res.map((s) => {
          return {
            label: s.name,
            value: s.id,
          };
        });
        setLoading(false);
        setStocks(stocks);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const hideAlert = () => {
    setSweetalert(null);
  };

  const handleEdit = (notDeleted) => {
    sendInfo(notDeleted.name, false, notDeleted.id);
  };

  const handleAddNew = () => {
    if (addNewValue === "") {
      Alert.error("Вы пытаетесь добавить пустое значение", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    sendInfo(addNewValue, false);
    setAddNewValue("");
  };

  const handleDelete = (notDeleted) => {
    setSweetalert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={() => sendInfo(notDeleted.name, true, notDeleted.id)}
        onCancel={() => hideAlert()}
      >
        Вы действительно хотите удалить бренд?
      </SweetAlert>
    );
  };

  const handleRollback = (sDeleted) => {
    sendInfo(sDeleted.name, false, sDeleted.id);
  };

  const sendInfo = (name, deleted, id) => {
    const sc = {
      name: name,
      point: stock.value,
      deleted: deleted,
      id: id,
    };
    Axios.post("/api/productsweight/update_scales", { scale: sc })
      .then(() => {
        setEdit(true);
        setSweetalert(null);
        getScales();
        Alert.success("Успешно", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        const alertText = err.response
          ? err.response.data
            ? err.response.data.text
              ? err.response.data.text
              : raiseError
            : raiseError
          : raiseError;
        Alert.error(alertText, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  const handleHide = () => {
    setHidden(!isHidden);
  };

  const scaleValidation = (e) => {
    const { name } = e.target;
    if (name === "" || name === null) {
      setEdit(true);
    }
  };

  const inputChanged = (index, e) => {
    scaleNotDeleted.forEach((point) => {
      point.name = point.id === index ? e.target.value : point.name;
    });
    setScaleNotDeleted(scaleNotDeleted);
    setEdit(false);
  };

  const inputChangedNew = (index, e) => {
    setAddNewValue(e.target.value);
    setEdit(false);
    setLoading(false);
  };

  const getScales = () => {
    Axios.get("/api/productsweight/scales", { params: { point: stock.value } })
      .then((res) => res.data)
      .then((res) => {
        let deleted = [];
        let notDeleted = [];
        res.forEach((sp) => {
          if (sp.deleted === true) {
            deleted.push({
              name: sp.name,
              id: sp.id,
              deleted: sp.deleted,
            });
          } else
            notDeleted.push({
              name: sp.name,
              id: sp.id,
              deleted: sp.deleted,
            });
        });
        setScalesDeleted(deleted);
        setScaleNotDeleted(notDeleted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const AttributeValidation = (e) => {
    const { value } = e.target;
    if (value === "" || value === null) {
      setEdit(true);
    }
  };

  const onStockChange = (p) => {
    setStock(p);
  };

  return (
    <div className="brand-list">
      {sweetalert}

      <div className="row">
        <div className="col-md-12">
          <h6 className="btn-one-line">Корректировка весов</h6>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && <div className="empty-space" />}

      {!isLoading && (
        <div className="col-md-4 mt-1">
          <label htmlFor="">Склад</label>
          <Select
            value={stock}
            name="stock"
            onChange={onStockChange}
            noOptionsMessage={() => "Склад не найден"}
            options={stocks}
            placeholder="Выберите склад"
          />
        </div>
      )}

      {!isLoading && stock && scaleNotDeleted.length === 0 && (
        <div
          style={{
            opacity: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          На данной точке весы не найдены
        </div>
      )}

      {!isLoading && stock && scaleNotDeleted.length > 0 && (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "2%" }} />
                <th style={{ width: "40%" }}>Наименование весов</th>
                <th style={{ width: "15%" }} />
                <th style={{ width: "43%" }} />
              </tr>
            </thead>
            <tbody>
              {scaleNotDeleted.map((scale, idx) => (
                <tr key={scale.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={scale.name}
                      onKeyDown={scaleValidation}
                      onChange={inputChanged.bind(this, scale.id)}
                    />
                  </td>
                  <td />
                  <td className="text-right">
                    <button
                      className="btn  btn-w-icon edit-item"
                      title="Изменить"
                      disabled={isEdit}
                      onClick={() => {
                        handleEdit(scale);
                      }}
                    />

                    <button
                      className="btn btn-w-icon delete-item"
                      title="Удалить"
                      onClick={() => {
                        handleDelete(scale);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && stock && (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "2%" }} />
                <th style={{ width: "40%" }} />
                <th style={{ width: "15%" }} />
                <th style={{ width: "43%" }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td />
                <td>
                  <input
                    type="text"
                    className="form-control"
                    onKeyDown={AttributeValidation}
                    value={addNewValue}
                    onChange={inputChangedNew.bind(this, "")}
                  />
                </td>
                <td>
                  <button className="btn btn-success" onClick={handleAddNew}>
                    Добавить
                  </button>
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && stock && scaleDeleted.length > 0 && (
        <div>
          <div className="empty-space" />

          <div className="inactive-items">
            <span className="btn-show" onClick={handleHide}>
              {isHidden ? "Показать" + caption : "Скрыть" + caption}
            </span>
          </div>

          <div className={`inactive-items-list ${isHidden ? "d-none" : ""}`}>
            {
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "2%" }} />
                    <th style={{ width: "40%" }}>Удаленные весы</th>
                    <th style={{ width: "43%" }} />
                    <th style={{ width: "15%" }} />
                  </tr>
                </thead>
                <tbody>
                  {scaleDeleted.map((scaleDeleted, idx) => (
                    <tr key={scaleDeleted.id}>
                      <td>{idx + 1}</td>
                      <td>{scaleDeleted.name}</td>
                      <td />
                      <td className="text-right">
                        <button
                          className="btn btn-w-icon rollback-item"
                          title="вернуть"
                          onClick={() => {
                            handleRollback(scaleDeleted);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>
      )}
    </div>
  );
}
