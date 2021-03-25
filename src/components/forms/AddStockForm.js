import React, { useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import { InputField } from "../fields";
import { RequiredField } from "../../validation";
import { modifyToSelect } from "../../actions/helpers/utils";

import Alert from "react-s-alert";
import Axios from "axios";

let AddStockForm = ({
  location,
  history,
  dispatch,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const stockData = location.state ? location.state.stockData : null;

  useEffect(() => {
    if (stockData) {
      let stockDataChanged = stockData;
      stockDataChanged.point_type = modifyToSelect(
        stockDataChanged.point_type,
        stockDataChanged.point_type_name
      );
      dispatch(initialize("AddStockForm", stockDataChanged));
    }
  }, []);

  const submit = (data) => {
    data.point_type = "1";
    const reqdata = { point: data };

    Axios.post(stockData ? "/api/point/change" : "/api/point/manage", reqdata)
      .then(() => {
        stockData
          ? history.push({
              pathname: "/usercabinet/stock",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Склад успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });

        dispatch(reset("AddStockForm"));
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
      });
  };

  return (
    <div id="addStock">
      <div className="row">
        <div className="col-md-6">
          <h6 className="btn-one-line">
            {!stockData
              ? "Добавить новый склад"
              : "Редактировать информацию по складу"}
          </h6>
        </div>

        <div className="col-md-6 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../stock")}
          >
            Список складов
          </button>
        </div>
      </div>

      <div className="empty-space"></div>

      <form onSubmit={handleSubmit(submit)}>
        <dl>
          <dt>Наименование склада</dt>
          <dd>
            <Field
              name="name"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите наименование склада"
              validate={[RequiredField]}
            />
          </dd>
          <dt>Адрес склада</dt>
          <dd>
            <Field
              name="address"
              component={InputField}
              type="text"
              className="form-control"
              placeholder="Введите местоположение склада"
              validate={[RequiredField]}
            />
          </dd>
        </dl>

        <button
          type="submit"
          className="btn btn-success"
          disabled={pristine || submitting}
        >
          {!stockData ? "Добавить" : "Сохранить изменения"}
        </button>

        {!stockData && (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={pristine || submitting}
            onClick={reset}
            style={{ marginLeft: "10px" }}
          >
            Очистить
          </button>
        )}
      </form>
    </div>
  );
};

export default AddStockForm = reduxForm({
  form: "AddStockForm",
})(AddStockForm);
