import React, { useState, useEffect, Fragment } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import Axios from "axios";

import { InputField, SelectField } from "../fields";
import {
  RequiredField,
  matchPasswords,
  passwordLength,
  ValidateIDN,
} from "../../validation";

import Alert from "react-s-alert";

let AddErpUserForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const userData = location.state ? location.state.userData : null;
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRoles();

    if (userData) {
      let userDataChanged = userData;
      const roles = userDataChanged.roles;

      userDataChanged.roles = [];
      userDataChanged.role = [];
      roles.forEach((role) => {
        userDataChanged.role.push({ value: role.id, label: role.name });
      });
      dispatch(initialize("AddErpUserForm", userDataChanged));
    }
  }, []);

  const getRoles = () => {
    Axios.get("/api/erpuser/roles")
      .then((res) => res.data)
      .then((res) => {
        setRoles(res);
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

  const handleSubmitFunction = (data) => {
    if (!userData && !data.user_password) {
      return Alert.error("Заполните все необходимые поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    setSubmitting(true);
    submit(data);
  };

  const submit = (data) => {
    data.pass = data.user_password || null;
    delete data.user_password;
    delete data.confirmUserPassword;

    data.roles = [];
    data.role.forEach((role) => {
      data.roles.push({ id: role.value });
    });
    delete data.role;
    const reqdata = { erpusr: data };

    Axios.post("/api/erpuser/manage", reqdata)
      .then(() => {
        userData
          ? history.push({
              pathname: "/usercabinet/erpuser",
              state: {
                fromEdit: true,
              },
            })
          : Alert.success("Пользователь ERP успешно создан", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
        setSubmitting(false);
        dispatch(reset("AddErpUserForm"));
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
    <div id="addErpUser">
      <div className="row">
        <div className="col-md-8">
          <h6 className="btn-one-line">
            {!userData
              ? "Добавить нового ERP пользователя"
              : "Редактировать информацию по ERP пользователю"}
          </h6>
        </div>

        <div className="col-md-4 text-right">
          <button
            className="btn btn-link btn-sm"
            onClick={() => history.push("../erpuser")}
          >
            Список ERP пользоватей
          </button>
        </div>
      </div>

      <div className="empty-space" />

      <form onSubmit={handleSubmit(handleSubmitFunction)}>
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
              onChange={IinValidation}
              className="form-control"
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
              placeholder="Выберите роль"
              className="form-control"
              isMulti={true}
              validate={[RequiredField]}
            />
          </dd>
          {!userData && (
            <Fragment>
              <dt>Email пользователя (логин)</dt>
              <dd>
                <Field
                  name="login"
                  component={InputField}
                  type="text"
                  className="form-control"
                  placeholder="Введите адрес эл.почты пользователя"
                  validate={[RequiredField]}
                />
              </dd>

              <dt>Пароль</dt>
              <dd>
                <Field
                  name="user_password"
                  component={InputField}
                  type="password"
                  placeholder="6 и более символов"
                  className="form-control"
                  validate={[RequiredField, passwordLength, matchPasswords]}
                />
              </dd>

              <dt>Подтвердите пароль</dt>
              <dd>
                <Field
                  name="confirmUserPassword"
                  component={InputField}
                  type="password"
                  placeholder="Введите пароль еще раз"
                  className="form-control"
                  validate={[RequiredField, matchPasswords]}
                />
              </dd>
            </Fragment>
          )}
        </dl>

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
    </div>
  );
};

export default AddErpUserForm = reduxForm({
  form: "AddErpUserForm",
})(AddErpUserForm);
