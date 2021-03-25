import React from "react";
import { Field, reduxForm } from "redux-form";
import { InputField } from "../fields";
import {
  RequiredField,
  matchPasswords,
  passwordLength,
} from "../../validation";

import Alert from "react-s-alert";
import Axios from "axios";
import ErrorAlert from "../ReusableComponents/ErrorAlert";

let ChangePassword = ({ history, handleSubmit }) => {
  const handleSubmitFunction = (data) => {
    if (data.currentPass === data.user_password) {
      return Alert.warning(
        "Новый пароль не должен совпадать с текущим паролем",
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    }

    submit(data);
  };

  const submit = (data) => {
    Axios.post("/api/erpuser/changepass", data)
      .then(() => {
        history.push({
          pathname: "/usercabinet",
          state: {
            changepass: true,
          },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitFunction)}>
      <div className="change-password">
        <Alert stack={{ limit: 1 }} offset={10} />

        <div className="row">
          <div className="col-md-12">
            <label htmlFor="">Текущий пароль: </label>
            <Field
              name="currentPass"
              component={InputField}
              type="password"
              className="form-control"
              placeholder="Введите текущий пароль"
              validate={[RequiredField]}
            />
          </div>
        </div>
        <div className="row mt-10">
          <div className="col-md-12">
            <label htmlFor="">Новый пароль: </label>
            <Field
              name="user_password"
              component={InputField}
              type="password"
              className="form-control"
              placeholder="6 и более символов"
              validate={[RequiredField, passwordLength]}
            />
          </div>
        </div>
        <div className="row mt-10">
          <div className="col-md-12">
            <label htmlFor="">Подтвердите новый пароль: </label>
            <Field
              name="confirmNewPass"
              component={InputField}
              type="password"
              className="form-control"
              placeholder="Введите новый пароль еще раз"
              validate={[RequiredField, matchPasswords]}
            />
          </div>
        </div>

        <div className="row mt-10 ">
          <div className="col-md-12">
            <button type="submit" className="btn btn-success btn-block">
              Сменить пароль
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword = reduxForm({
  form: "ChangePasswordForm",
})(ChangePassword);
