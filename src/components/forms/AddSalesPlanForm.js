import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import Grid from "@material-ui/core/Grid";
import { InputGroup, SelectField, InputField } from "../fields";
import { RequiredField } from "../../validation";

import Alert from "react-s-alert";
import Axios from "axios";

let AddSalesPlanForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [bonusType, setBonusType] = useState(
    location.state ? location.state.salesPlanData.type : "1"
  );
  const [cashboxUsers, setCashboxUsers] = useState([]);
  const [points, setPoints] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);

  const salesPlanData = location.state ? location.state.salesPlanData : null;

  useEffect(() => {
    if (salesPlanData) {
      let salesPlanDataChanged = salesPlanData;
      salesPlanDataChanged.object = salesPlanDataChanged.name;
      salesPlanDataChanged.objectId = salesPlanDataChanged.id;
      dispatch(initialize("AddSalesPlanForm", salesPlanDataChanged));
    } else {
      getCashboxUsers();
      getPoints();
    };
    console.log(salesPlanData);
    console.log(bonusType);
  }, []);

  const getCashboxUsers = () => {
    Axios.get("/api/cashboxuser")
      .then((res) => res.data)
      .then((res) => {
        setCashboxUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        setPoints(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeBonusType = (b) => {
    setBonusType(b);
    dispatch(reset("AddSalesPlanForm"));
  };

  const handleSubmitFunction = (data) => {
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.object = data.objectId || data.object.value;
    data.type = bonusType;
    data.deleted = false;

    data.daily = data.daily || 0;
    data.monthly = data.monthly || 0;
    data.quarterly = data.quarterly || 0;
    data.yearly = data.yearly || 0;

    data.drate = data.drate || 0;
    data.mrate = data.mrate || 0;
    data.qrate = data.qrate || 0;
    data.yrate = data.yrate || 0;

    const reqdata = { plan: data };
    console.log(reqdata);
    Axios.post("/api/salesplan/manage", reqdata)
      .then(() => {
        Alert.success("План продаж успешно сохранен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setSubmitting(false);
        dispatch(reset("AddSalesPlanForm"));
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
    <div className="sales-plan-form">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!salesPlanData
              ? "Создать новый план продаж"
              : "Редактировать план продаж"}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../salesplan")}
          >
            Список плана продаж
          </button>
        </div>
      </div>

      <div className="empty-space"></div>

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
        {!salesPlanData && (
          <div className="row mt-10">
            <div className="col-md-6">
              <button
                type="button"
                className={`btn btn-block btn-sm ${bonusType === "1" ? "btn-info" : "btn-outline-info"
                  }`}
                onClick={() => changeBonusType("1")}
              >
                Индивидуальный
              </button>
            </div>
            <div className="col-md-6">
              <button
                type="button"
                className={`btn btn-block btn-sm ${bonusType === "3" ? "btn-info" : "btn-outline-info"
                  }`}
                onClick={() => changeBonusType("3")}
              >
                Командный
              </button>
            </div>
          </div>
        )}

        <div className="row mt-10">
          <div className="col-md-12">
            <label htmlFor="">
              {bonusType.toString() === "1"
                ? "Выберите кассира"
                : "Выберите торговую точку"}
            </label>
            {!salesPlanData && (
              <Field
                name="object"
                component={SelectField}
                placeholder={
                  bonusType.toString() === "1"
                    ? "Выберите пользователя"
                    : "Выберите торговую точку"
                }
                options={bonusType === "1" ? cashboxUsers : points}
                className="form-control"
                validate={[RequiredField]}
              />
            )}
            {salesPlanData && (
              <Field
                name="object"
                component={InputField}
                className="form-control"
                disabled={true}
                validate={[RequiredField]}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="">Ежедневный план</label>
            <Field
              name="daily"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Ежедневный план"
              appendItem={<span className="input-group-text">&#8376;</span>}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">Ставка для расчета бонусов</label>
            <Field
              name="drate"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Ставка для расчета бонусов"
              appendItem={<span className="input-group-text">&#37;</span>}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">Месячный план</label>
            <Field
              name="monthly"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Месячный план"
              appendItem={<span className="input-group-text">&#8376;</span>}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">Ставка для расчета бонусов</label>
            <Field
              name="mrate"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Ставка для расчета бонусов"
              appendItem={<span className="input-group-text">&#37;</span>}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="">Квартальный план</label>
            <Field
              name="quarterly"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Квартальный план"
              appendItem={<span className="input-group-text">&#8376;</span>}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">Ставка для расчета бонусов</label>
            <Field
              name="qrate"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Ставка для расчета бонусов"
              appendItem={<span className="input-group-text">&#37;</span>}
            />
          </div>
          {/* <div className="col-md-6">
            <label htmlFor="">Годовой план</label>
            <Field
              name="yearly"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Годовой план"
              appendItem={<span className="input-group-text">&#8376;</span>}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">Ставка для расчета бонусов</label>
            <Field
              name="yrate"
              component={InputGroup}
              type="text"
              className="form-control"
              placeholder="Ставка для расчета бонусов"
              appendItem={<span className="input-group-text">&#37;</span>}
            />
          </div> */}
        </div>
        <div className="row mt-10">
          <div className="col-md-12">
            <button
              className="btn btn-success"
              disabled={isSubmitting || pristine || submitting}
            >
              Сохранить
            </button>
            {!salesPlanData && (
              <button
                className="btn btn-secondary ml-10"
                disabled={isSubmitting || pristine || submitting}
                onClick={reset}
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSalesPlanForm = reduxForm({
  form: "AddSalesPlanForm",
})(AddSalesPlanForm);
