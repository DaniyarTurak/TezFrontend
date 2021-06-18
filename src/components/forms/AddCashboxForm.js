import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import { NavLink } from "react-router-dom";

import Axios from "axios";

import { InputField, SelectField } from "../fields";
import { RequiredField } from "../../validation";
import { modifyToSelect } from "../../actions/helpers/utils";

import Alert from "react-s-alert";

let AddCashBoxForm = ({
  location,
  dispatch,
  handleSubmit,
  pristine,
  reset,
  submitting,
  history,
}) => {
  const [points, setPoints] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSubmiting, setSubmitting] = useState(false);
  const cashboxData = location.state ? location.state.cashboxData : null;

  useEffect(() => {
    if (cashboxData) {
      let cashboxDataChanged = cashboxData;
      cashboxDataChanged.point = modifyToSelect(
        cashboxDataChanged.point,
        cashboxDataChanged.point_name
      );
      dispatch(initialize("addCashBoxForm", cashboxDataChanged));
    }
    getPoints();
  }, []);

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.point = data.point.value;
    const reqdata = { cashbox: data };

    Axios.post("/api/cashbox/manage", reqdata)
      .then(() => {
        cashboxData
          ? history.push({
            pathname: "/usercabinet/cashbox",
            state: {
              fromEdit: true,
            },
          })
          : Alert.success("Касса успешно создана", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        setSubmitting(false);
        dispatch(reset("addCashBoxForm"));
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
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { pointtype: "2" } })
      .then((res) => res.data)
      .then((res) => {
        setPoints(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
            onClick={() => history.push("../cashbox")}
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

        {!isLoading && points.length === 0 && (
          <p className="alert alert-warning text-center">
            Не найдены пользователи,{" "}
            <NavLink to="../cashboxuser/manage">добавить пользователя</NavLink>
          </p>
        )}

        {!isLoading && points.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default AddCashBoxForm = reduxForm({
  form: "addCashBoxForm",
})(AddCashBoxForm);
