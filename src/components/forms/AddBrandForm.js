import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";

import { InputField } from "../fields";
import { RequiredField } from "../../validation";

import Alert from "react-s-alert";
import Axios from "axios";

let AddBrandForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [isSubmiting, setSubmitting] = useState(false);
  const brandData = location.state ? location.state.brandData : null;

  useEffect(() => {
    if (brandData) {
      const brandDataChanged = brandData;
      dispatch(initialize("addbrandform", brandDataChanged));
    }
  }, []);

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.deleted = false;
    const reqdata = { brand: data };
    Axios.post("/api/brand/manage", reqdata)
      .then(() => {
        brandData
          ? history.push({
              pathname: "../brand",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Бренд успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("addbrandform"));
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
    <div id="addBrand">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!brandData
              ? "Добавить новый бренд"
              : "Редактировать информацию о бренде"}{" "}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../brand")}
          >
            Список брендов
          </button>
        </div>
      </div>

      <div className="empty-space" />

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <dl>
          <dt>Наименование бренда</dt>
          <dd>
            <Field
              name="brand"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование бренда"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Компания</dt>
          <dd>
            <Field
              name="manufacturer"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите компанию бренда"
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
            : !brandData
            ? "Добавить"
            : "Сохранить изменения"}
        </button>

        {!brandData && (
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

export default AddBrandForm = reduxForm({
  form: "addbrandform",
})(AddBrandForm);
