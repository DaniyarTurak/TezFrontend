import React, { useState, useEffect, Fragment } from "react";
import { Field, reduxForm, initialize } from "redux-form";
import Axios from "axios";
import { InputField} from "../fields";
import {
  RequiredField,
  ValidateIDN,
} from "../../validation";
import AddUserAccessForm from "./AddUserAccessForm";

let AddErpUserForm = ({
  location,
  dispatch,
  history,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  // const userData = location.state ? location.state.userData : null;
  const [isSubmitting, setSubmitting] = useState(false);
  const [accessForm, setAccessForm] = useState(false);
  const [userData, setUserData] = useState(
    location.state ? location.state.userData : null
  );
  const [userName, setUserName] = useState();
  useEffect(() => {
    if (userData) {
      getUserAccesses();
    }
    if (userData) {
      dispatch(initialize("AddErpUserForm", userData));
    }
  }, []);

  const getUserAccesses = () => {
    Axios.get(`/api/erpuser/getuseraccesses?id=${userData.id}`)
      .then((res) => res.data)
      .then((data) => {
        setUserData((prev) => {
          return { ...prev, accesses: data[0].accesses };
        });
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

  const handleNextFunction = (data) => {
    setUserName(data.name);
    setAccessForm(true);
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
      {accessForm ? (
        <AddUserAccessForm
          isSubmitting={isSubmitting}
          pristine={pristine}
          submitting={submitting}
          userData={userData}
          setAccessForm={setAccessForm}
          history={history}
          handleSubmit={handleSubmit}
          setSubmitting={setSubmitting}
          dispatch={dispatch}
          reset={reset}
          userName={userName}
        />
      ) : (
        <Fragment>
          <form>
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
                </Fragment>
              )}
            </dl>

            <button
              type="submit"
              className="btn btn-success"
              onClick={handleSubmit(handleNextFunction)}
            >
              Далее
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
        </Fragment>
      )}
    </div>
  );
};

export default AddErpUserForm = reduxForm({
  form: "AddErpUserForm",
})(AddErpUserForm);
