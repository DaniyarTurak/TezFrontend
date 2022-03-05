import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import { NavLink } from "react-router-dom";

import Axios from "axios";

import { InputField, SelectField } from "../../../../../fields";
import { RequiredField } from "../../../../../../validation";
import { modifyToSelect } from "../../../../../../actions/helpers/utils";

import Alert from "react-s-alert";

let AddCashBoxForm = ({
  location,
  dispatch,
  handleSubmit,
  pristine,
  reset,
  submitting,
  history,
  cashboxData,
  setEdit,
  setCashboxData,
  getCashboxes,
  company,
  points
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmiting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cashboxData) {
      let cashboxDataChanged = cashboxData;
      cashboxDataChanged.point = modifyToSelect(
        cashboxDataChanged.point,
        cashboxDataChanged.point_name
      );
      dispatch(initialize("addCashBoxForm", cashboxDataChanged));
    }
  }, []);

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.point_name = data.point.label
    data.point = data.point.value;  
    console.log(data)
    if(cashboxData) {
      Axios.put("/api/companysettings/cashbox/edit", data)
      .then(() => {
        Alert.success("Изменения успешно сохранены", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
        setEdit(false);
        getCashboxes(company.value);
        setCashboxData(null)
      })
      .catch((err) => {
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
        setSubmitting(false);
        
      });
    } else {
      Axios.post("/api/companysettings/cashbox/create", {name: data.name, point: data.point })
      .then(() => {
        Alert.success("Касса успешно создана", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
        dispatch(reset("addpointform"));
        setEdit(false)
        getCashboxes(company.value)
      })
      .catch((err) => {
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
        setSubmitting(false);
      });
    }
  };

  return (
    <div id="AddCashbox">
      <div className="row">
        <div className="col-md-6">
          <h6 className="btn-one-line">
            {!cashboxData
              ? "Добавить новую кассу"
              : "Редактировать информацию по кассе"}
          </h6>
        </div>

        <div className="col-md-6 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setEdit(false);
              setCashboxData(null);
            }}
          >
            Список касс
          </button>
        </div>
      </div>

      {!isLoading && <div className="empty-space" />}

      <div className={`content ${isLoading ? "is-loading" : ""}`}>
        <div className="loader">
          <div className="icon" />
        </div>
        <form onSubmit={handleSubmit(handleSubmitFunction)}>
          <dl>
            <dt>Наименование кассы</dt>
            <dd>
              <Field
                name="name"
                component={InputField}
                type="text"
                className="form-control"
                placeholder="Введите наименование кассы"
                validate={[RequiredField]}
              />
            </dd>
            <dt>Наименование торговой точки</dt>
            <dd>
              <Field
                name="point"
                component={SelectField}
                options={points}
                placeholder="Выберите торговую точку из списка"
                className="form-control"
                validate={[RequiredField]}
              />
            </dd>
          </dl>

          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmiting || pristine || submitting}
          >
            {isSubmiting
              ? "Пожалуйста подождите..."
              : !cashboxData
              ? "Добавить"
              : "Сохранить изменения"}
          </button>

          {!cashboxData && (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmiting || pristine || submitting}
              onClick={reset}
              style={{ marginLeft: "10px" }}
            >
              Очистить
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCashBoxForm = reduxForm({
  form: "addCashBoxForm",
})(AddCashBoxForm);
