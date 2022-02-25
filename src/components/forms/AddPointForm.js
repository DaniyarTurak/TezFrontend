import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";

import { InputField, SelectField } from "../fields";
import { RequiredField } from "../../validation";

import { modifyToSelect } from "../../actions/helpers/utils";

import logistic from "../../data/logistic";
import Alert from "react-s-alert";
import Axios from "axios";

let AddPointForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
  pointData,
  company
}) => {
  const [isSubmiting, setSubmitting] = useState(false);

  // const pointData = location.state ? location.state.pointData : null;

  useEffect(() => {
    if (pointData) {
      let pointDataChanged = pointData;
      pointDataChanged.is_minus = modifyToSelect(
        pointDataChanged.is_minus ? "1" : "0",
        pointDataChanged.is_minus ? "Да" : "Нет"
      );
      pointDataChanged.point_type = modifyToSelect(
        pointDataChanged.point_type,
        pointDataChanged.point_type_name
      );
      dispatch(initialize("addpointform", pointDataChanged));
    }
  }, []);

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.is_minus = data.is_minus.value;
    const reqdata = { id: data.id, address: data.address, is_minus: data.is_minus, name: data.name };
    if (pointData) {
      Axios.put("/api/companysettings/storepoint/edit", reqdata)
      .then(() => {
        Alert.success("Изменения успешно сохранены", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
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
      Axios.post("/api/companysettings/storepoint/create", {...reqdata, company: company.value })
      .then(() => {
        Alert.success("Торговая точка успешно создана", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
        dispatch(reset("addpointform"));
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
    <div id="addPoint">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!pointData
              ? "Добавить новую торговую точку"
              : "Редактировать информацию по торговой точке"}{" "}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../point")}
          >
            Список торговых точек
          </button>
        </div>
      </div>

      <div className="empty-space"></div>

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        <dl>
          <dt>Наименование торговой точки</dt>
          <dd>
            <Field
              name="name"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование торговой точки"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Адрес торговой точки</dt>
          <dd>
            <Field
              name="address"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите местоположение торговой точки"
              validate={[RequiredField]}
            />
          </dd>
          {(!pointData || (pointData && pointData.point_type !== 0)) && (
            <span>
              <dt>Отрицательный учет товаров</dt>
              <dd>
                <Field
                  name="is_minus"
                  component={SelectField}
                  placeholder="Разрешить отрицательный учет товаров?"
                  options={logistic}
                  className="form-control"
                  validate={[RequiredField]}
                />
              </dd>
            </span>
          )}
        </dl>

        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmiting || pristine || submitting}
        >
          {isSubmiting
            ? "Пожалуйста подождите..."
            : !pointData
            ? "Добавить"
            : "Сохранить изменения"}
        </button>

        {!pointData && (
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

export default AddPointForm = reduxForm({
  form: "addpointform",
})(AddPointForm);
