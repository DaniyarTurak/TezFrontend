import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";

import { InputField } from "../fields";
import { RequiredField, ValidateIDN } from "../../validation";

import Alert from "react-s-alert";
import Axios from "axios";

let AddCounterpartiesForm = ({
  dispatch,
  location,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const counterpartyData = location.state
    ? location.state.counterpartyData
    : null;

  useEffect(() => {
    if (counterpartyData) {
      dispatch(initialize("addcounterpartyform", counterpartyData));
    }
  }, []);

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const IinValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 12) e.preventDefault();
  };

  const submit = (data) => {
    data.id = counterpartyData && counterpartyData.id;
    data.deleted = false;
    const reqdata = { counterparties: data };

    Axios.post("/api/counterparties/manage", reqdata)
      .then(() => {
        counterpartyData
          ? history.push({
              pathname: "/usercabinet/counterparties",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Контрагент успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("addcounterpartyform"));
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

  return (
    <div className="add-counterparties-form">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!counterpartyData
              ? "Добавить нового контрагента"
              : "Редактировать информацию по контрагенту"}{" "}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../counterparties")}
          >
            Список контрагентов
          </button>
        </div>
      </div>

      <div className="empty-space" />

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <dl>
          <dt>БИН контрагента</dt>
          <dd>
            <Field
              name="bin"
              component={InputField}
              type="text"
              onChange={IinValidation}
              className="form-control"
              disabled={counterpartyData}
              placeholder="Введите БИН контрагента"
              validate={[RequiredField, ValidateIDN]}
            />
          </dd>
          <dt>Наименование контрагента</dt>
          <dd>
            <Field
              name="name"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование контрагента"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Адрес электронной почты</dt>
          <dd>
            <Field
              name="email"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите адрес электронной почты"
            />
          </dd>
        </dl>

        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmitting || pristine || submitting}
        >
          {isSubmitting
            ? "Пожалуйста подождите..."
            : !counterpartyData
            ? "Добавить"
            : "Сохранить изменения"}
        </button>

        {!counterpartyData && (
          <button
            type="button"
            className="btn btn-secondary ml-10"
            disabled={isSubmitting || pristine || submitting}
            onClick={reset}
          >
            Очистить
          </button>
        )}
      </form>
    </div>
  );
};

export default AddCounterpartiesForm = reduxForm({
  form: "addcounterpartyform",
})(AddCounterpartiesForm);
