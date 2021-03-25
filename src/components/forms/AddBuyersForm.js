import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";

import { InputField } from "../fields";
import { RequiredField, ValidateIDN } from "../../validation";

import Alert from "react-s-alert";
import Axios from "axios";

let AddBuyersForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [isSubmiting, setSubmitting] = useState(false);
  const buyerData = location.state ? location.state.buyerData : null;

  useEffect(() => {
    if (buyerData) {
      const buyerDataChanged = buyerData;
      dispatch(initialize("addbuyersform", buyerDataChanged));
    }
  }, []);

  const IinValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 12) e.preventDefault();
  };

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.id = buyerData && buyerData.id;
    data.deleted = false;
    const reqdata = { customers: data };

    Axios.post("/api/buyers/manage", reqdata)
      .then(() => {
        buyerData
          ? history.push({
              pathname: "/usercabinet/buyers",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Покупатель успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("addbuyersform"));
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
    <div className="add-buyers-form">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!buyerData
              ? "Добавить нового покупателя"
              : "Редактировать информацию по покупателю"}{" "}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../buyers")}
          >
            Список покупателей
          </button>
        </div>
      </div>

      <div className="empty-space" />

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <dl>
          <dt>БИН покупателя</dt>
          <dd>
            <Field
              name="bin"
              component={InputField}
              type="text"
              className="form-control"
              onChange={IinValidation}
              disabled={buyerData}
              placeholder="Введите БИН покупателя"
              validate={[RequiredField, ValidateIDN]}
            />
          </dd>
          <dt>Наименование покупателя</dt>
          <dd>
            <Field
              name="name"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование покупателя"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Адрес покупателя</dt>
          <dd>
            <Field
              name="address"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите адрес покупателя"
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
            : !buyerData
            ? "Добавить"
            : "Сохранить изменения"}
        </button>

        {!buyerData && (
          <button
            type="button"
            className="btn btn-secondary ml-10"
            disabled={isSubmiting || pristine || submitting}
            onClick={reset}
          >
            Очистить
          </button>
        )}
      </form>
    </div>
  );
};

export default AddBuyersForm = reduxForm({
  form: "addbuyersform",
})(AddBuyersForm);
