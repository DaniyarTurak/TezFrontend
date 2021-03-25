import React, { useState, useEffect } from "react";
import { Field, reduxForm, initialize, change } from "redux-form";
import { NavLink } from "react-router-dom";
import Axios from "axios";

import { InputField, SelectField, SelectFieldRadio } from "../fields";
import { RequiredField, ValidateIDN } from "../../validation";
import { modifyToSelect } from "../../actions/helpers/utils";
import logistic from "../../data/logistic";

import Alert from "react-s-alert";

let AddCashBoxUserForm = ({
  location,
  history,
  dispatch,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [discount, setDiscount] = useState("");
  const [points, setPoints] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [checkName, setCheckName] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const userData = location.state ? location.state.userData : null;

  useEffect(() => {
    if (userData) {
      let userDataChanged = userData;
      userDataChanged.point = modifyToSelect(
        userDataChanged.point,
        userDataChanged.pointName
      );
      userDataChanged.role = modifyToSelect(
        userDataChanged.role,
        userDataChanged.roleName
      );
      userDataChanged.discount =
        userDataChanged.discount === false ? "Нет" : "Да";
      userDataChanged.discount = modifyToSelect(
        userDataChanged.discount,
        userDataChanged.discount
      );
      let disc = userDataChanged.discount.value;
      setDiscount(disc);
      setRole(userDataChanged.role);
      userDataChanged.discountInfo = !!userDataChanged.discountperc
        ? userDataChanged.discountperc
        : 100;
      dispatch(initialize("addCashBoxUserForm", userDataChanged));
    }

    const discountChanged = {
      label: "Нет",
      value: false,
    };
    dispatch(change("addCashBoxUserForm", discountChanged));
    getPoints();
    getRoles();
    getCashboxUsers();
  }, []);

  const getCashboxUsers = () => {
    Axios.get("/api/cashboxuser")
      .then((res) => res.data)
      .then((res) => {
        setLoading(false);
        getClosedCashboxUsers(res);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getClosedCashboxUsers = (c) => {
    Axios.get("/api/cashboxuser/inactive")
      .then((res) => res.data)
      .then((res) => {
        const checkNames = [...c, ...res];
        let checkNameChanged = [];
        checkNames.forEach((e) => {
          checkNameChanged.push(e.name);
        });
        setCheckName(checkNameChanged);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
        setLoading(false);
        console.log(err);
      });
  };

  const getRoles = () => {
    Axios.get("/api/cashboxuser/roles")
      .then((res) => res.data)
      .then((res) => {
        setRoles(res);
        setLoading(false);

        const roleChanged = {
          label: res[0].name,
          value: res[0].id,
        };
        dispatch(change("addCashBoxUserForm", roleChanged));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const IinValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 12) e.preventDefault();
  };

  const DiscountValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value > 100) e.preventDefault();
  };

  const handleSubmitChanged = (data) => {
    if (!userData) {
      let alreadyTakenChanged = false;
      checkName.forEach((a) => {
        if (data.name === a) {
          alreadyTakenChanged = true;
        }
      });
      if (alreadyTakenChanged) {
        Alert.warning(`Выбранное имя уже занято!`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        alreadyTakenChanged = false;
        return;
      }
    }
    if (!data.point) {
      return Alert.warning(`Выберите торговую точку!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    if (!data.role) {
      return Alert.warning(`Выберите роль!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setSubmitting(true);

    data.point = data.point.value;
    data.role = data.role.value;
    const disc = { label: "Нет", value: false };
    if (!data.discount) {
      data.discount = disc;
      dispatch(change("addCashBoxUserForm", "discountInfo", 0));
    }
    data.discount = data.discount.label === "Да" ? true : false;

    const reqdata = { cashboxusr: data };
    Axios.post("/api/cashboxuser/manage", reqdata)
      .then(() => {
        userData
          ? history.push({
              pathname: "/usercabinet/options/cashboxuser",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Пользователь успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("addCashBoxUserForm"));
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
        dispatch(reset("addCashBoxUserForm"));
      });
  };

  const onDiscountChange = (e) => {
    setDiscount(e.label);
    if (e.label === "Да") {
      dispatch(change("addCashBoxUserForm", "discountInfo", 100));
    } else dispatch(change("addCashBoxUserForm", "discountInfo", 0));
  };

  const onNameChange = (e) => {
    let check = e.target.value;
    checkName.forEach((a) => {
      if (check === a) {
        return Alert.warning(`Имя ${check} уже занято!`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      }
    });
  };

  const roleChange = (r) => {
    setRole(r);
    const disc = { label: "Нет", value: false };
    if (role.value === "4") {
      dispatch(change("addCashBoxUserForm", "discount", disc));
      dispatch(change("addCashBoxUserForm", "discountInfo", 0));
    }
  };

  return (
    <div id="addCashboxUser">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!userData
              ? "Добавить нового пользователя"
              : "Редактировать информацию по пользователю"}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../cashboxuser")}
          >
            Список пользоватей
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
          <form onSubmit={handleSubmit(handleSubmitChanged)}>
            <div className="loader">
              <div className="icon" />
            </div>
            <dl>
              <dt>ИИН пользователя</dt>
              <dd>
                <Field
                  name="iin"
                  component={InputField}
                  type="text"
                  className="form-control"
                  onChange={IinValidation}
                  placeholder="Введите ИИН сотрудника"
                  validate={[RequiredField, ValidateIDN]}
                />
              </dd>
              <dt>ФИО пользователя</dt>
              <dd>
                <Field
                  name="name"
                  component={InputField}
                  type="text"
                  className="form-control"
                  onChange={onNameChange}
                  placeholder="Введите полное имя сотрудника"
                  validate={[RequiredField]}
                />
              </dd>
              <dt>Выберите роль</dt>
              <dd>
                <Field
                  name="role"
                  component={SelectField}
                  options={roles}
                  onChange={roleChange}
                  value={role}
                  placeholder="Выберите роль"
                  className="form-control"
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
              {role.value !== "4" && (
                <div>
                  <dt>Разрешить предоставлять ручную скидку?</dt>
                  <dd>
                    <Field
                      name="discount"
                      value={discount}
                      component={SelectFieldRadio}
                      placeholder="Выберите да/нет"
                      onChange={onDiscountChange}
                      options={logistic}
                      className="form-control"
                      validate={[RequiredField]}
                    />
                  </dd>
                </div>
              )}
            </dl>
            {discount === "Да" && role.value !== "4" && (
              <div>
                <dt>
                  Максимальный уровень разрешённой ручной скидки (до 100%)
                </dt>
                <dd>
                  <Field
                    name="discountInfo"
                    component={InputField}
                    type="text"
                    className="form-control"
                    onChange={DiscountValidation}
                    placeholder="Введите ограничение"
                    validate={[RequiredField]}
                  />
                </dd>
              </div>
            )}
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || pristine || submitting}
            >
              {isSubmitting
                ? "Пожалуйста подождите..."
                : !userData
                ? "Добавить"
                : "Сохранить изменения"}
            </button>

            {!userData && (
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSubmitting || pristine || submitting}
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

export default AddCashBoxUserForm = reduxForm({
  form: "addCashBoxUserForm",
})(AddCashBoxUserForm);
