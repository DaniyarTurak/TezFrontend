import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Field, reduxForm, change } from "redux-form";
import { InputField } from "../fields";
import {
  RequiredField,
  ValidationEmail,
  ValidateIDN,
  matchPasswords,
  passwordLength,
  NotLessThan4,
} from "../../validation";
import Alert from "react-s-alert";
import Axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import ErrorAlert from "../ReusableComponents/ErrorAlert";

class RegisterPage extends Component {
  state = {
    label: {
      createNewProfile: "Создать новый профиль",
      alreadyRegistered: "Уже зарегистрированы?",
      email: "Email (будет использоваться для входа в портал)",
      userIdn: "Ваш ИИН",
      userName: "Ваше ФИО",
      companyBin: "БИН организации",
      companyName: "Название организации",
      companyAddress: "Юридический адрес",
      headIdn: "ИИН руководителя организации",
      headName: "Руководитель организации",
      hasNds: "Серия",
      ndsRegisterNumber: "Номер",
      ndsDate: "Дата",
      password: "Придумайте пароль",
      confirmPassword: "Подтвердите пароль",
      signUpText: "Зарегистрироваться!",
      signInText: "Войти",
      createProfile: "Создать Ваш профиль",
      placeholder: {
        email: "Введите Ваш адрес эл.почты",
        userIdn: "Введите Ваш ИИН",
        userName: "Ваше ФИО",
        companyBin: "Введите БИН организации",
        companyName: "Введите название организации",
        companyAddress: "Введите юридический адрес",
        headIdn: "Введите ИИН руководителя организации",
        headName: "Введите полное имя руководителя организации",
        hasNds: "Введите серию",
        ndsRegisterNumber: "Введите номер",
        password: "6 или более символов",
        confirmPassword: "Введите пароль еще раз",
      },
      pleaseWait: "Пожалуйста подождите...",
    },
    isLoading: false,
    isVerified: false,
    grouping: true,
    company_has_nds: "",
    company_register_number: "",
    company_nds_date: "",
    alert: {
      signUpfailed:
        "Упс, возникла ошибка при регистрации, мы уже решаем проблему",
      // emailSendfailed: 'Упс, возникла ошибка при отправке email cообщения для активации аккаунта',
      notVerified: "Подтвердите что вы не робот",
    },
  };

  handleSignUp = (data) => {
    const { isVerified } = this.state;

    isVerified
      ? this.signUp(data)
      : Alert.warning(this.state.alert.notVerified, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
  };

  componentWillMount() {
    this.props.initialize({
      company_has_nds: "",
      company_register_number: "",
      company_nds_date: "",
    });
  }

  onGroupingChange = (e) => {
    this.setState({
      grouping: e.target.checked,
    });

    this.props.dispatch(change("signupform", "company_has_nds", ""));
    this.props.dispatch(change("signupform", "company_register_number", ""));
    this.props.dispatch(change("signupform", "company_nds_date", ""));
  };

  signUp = (data) => {
    this.setState({
      isLoading: true,
    });
    Axios.post("/auth/signup", data)
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        // this.sendMail(res.text, res.hash, res.email);
        this.props.history.push({
          pathname: "/",
          state: {
            signUpSuccess: true,
          },
        });
      })
      .catch((err) => {
        ErrorAlert(err);
        this.setState({ isLoading: false });
      });
  };

  IinValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 12) e.preventDefault();
  };

  NdsValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 5) e.preventDefault();
  };

  NdsNumValidation = (e) => {
    const { value } = e.target;
    if (value.length === 0) return;
    if (!value.match(/^\d+$/)) e.preventDefault();
    if (value.length > 7) e.preventDefault();
  };

  captchaCallback = (type) => {
    const isVerified = type === "clicked" ? true : false;
    this.setState({ isVerified });
  };

  render() {
    const { handleSubmit } = this.props;
    const { label, isLoading, grouping } = this.state;
    return (
      <div className="reg-box">
        <Alert stack={{ limit: 1 }} offset={10} />

        <div className="reg-box-header">
          <h4>{label.createNewProfile}</h4>
        </div>

        <div className="reg-box-body">
          <div className="reg-tip">
            {label.alreadyRegistered} <Link to="/">{label.signInText}</Link>
          </div>
          <form onSubmit={handleSubmit(this.handleSignUp)}>
            <div className="form-detail">
              <dl>
                <dt>{label.userIdn}</dt>
                <dd>
                  <Field
                    name="user_iin"
                    component={InputField}
                    className="form-control"
                    onChange={this.IinValidation}
                    type="input"
                    placeholder={label.placeholder.userIdn}
                    validate={[RequiredField, ValidateIDN]}
                  />
                </dd>
                <dt>{label.userName}</dt>
                <dd>
                  <Field
                    name="user_fullname"
                    component={InputField}
                    className="form-control"
                    type="input"
                    placeholder={label.placeholder.userName}
                    validate={[RequiredField]}
                  />
                </dd>
              </dl>
              <hr />
              <dl>
                <dt>{label.companyBin}</dt>
                <dd>
                  <Field
                    name="company_bin"
                    component={InputField}
                    className="form-control"
                    onChange={this.IinValidation}
                    type="input"
                    placeholder={label.placeholder.companyBin}
                    validate={[RequiredField, ValidateIDN]}
                  />
                </dd>
                <dt>{label.companyName}</dt>
                <dd>
                  <Field
                    name="company_fullname"
                    component={InputField}
                    className="form-control"
                    type="input"
                    placeholder={label.placeholder.companyName}
                    validate={[RequiredField, NotLessThan4]}
                  />
                </dd>
                <dt>{label.companyAddress}</dt>
                <dd>
                  <Field
                    name="company_juraddress"
                    component={InputField}
                    className="form-control"
                    type="input"
                    placeholder={label.placeholder.companyAddress}
                    validate={[RequiredField]}
                  />
                </dd>
                <dt>{label.headIdn}</dt>
                <dd>
                  <Field
                    name="company_head_iin"
                    component={InputField}
                    className="form-control"
                    onChange={this.IinValidation}
                    type="input"
                    placeholder={label.placeholder.headIdn}
                    validate={[RequiredField, ValidateIDN]}
                  />
                </dd>

                <dt>{label.headName}</dt>
                <dd>
                  <Field
                    name="company_head"
                    component={InputField}
                    className="form-control"
                    type="input"
                    placeholder={label.placeholder.headName}
                    validate={[RequiredField]}
                  />
                </dd>
                <div
                  style={{ marginLeft: "20px", marginTop: "20px" }}
                  className="col-md-3 point-block custom-checkbox"
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="grouping"
                    id="updateprice"
                    checked={grouping}
                    onChange={this.onGroupingChange}
                  />
                  <label className="custom-control-label" htmlFor="updateprice">
                    Плательщик НДС
                  </label>
                </div>
                {grouping && (
                  <div>
                    <dt>{label.hasNds}</dt>
                    <dd>
                      <Field
                        name="company_has_nds"
                        component={InputField}
                        className="form-control"
                        onChange={this.NdsValidation}
                        type="input"
                        placeholder={label.placeholder.hasNds}
                        // validate={[RequiredField, ValidateIDN]}
                      />
                    </dd>
                    <dt>{label.ndsRegisterNumber}</dt>
                    <dd>
                      <Field
                        name="company_register_number"
                        component={InputField}
                        className="form-control"
                        onChange={this.NdsNumValidation}
                        type="input"
                        placeholder={label.placeholder.ndsRegisterNumber}
                        // validate={[RequiredField]}
                      />
                    </dd>

                    <dt>{label.ndsDate}</dt>
                    <dd>
                      <Field
                        name="company_nds_date"
                        component={InputField}
                        className="form-control"
                        type="date"
                        placeholder={label.placeholder.ndsDate}
                        // validate={[RequiredField]}
                      />
                    </dd>
                  </div>
                )}
                <hr />

                <dt>{label.email}</dt>
                <dd>
                  <Field
                    name="user_login"
                    component={InputField}
                    className="form-control"
                    type="input"
                    placeholder={label.placeholder.email}
                    validate={[RequiredField, ValidationEmail]}
                  />
                </dd>
                <dt>{label.password}</dt>
                <dd>
                  <Field
                    name="user_password"
                    component={InputField}
                    className="form-control"
                    type="password"
                    placeholder={label.placeholder.password}
                    validate={[RequiredField, passwordLength]}
                  />
                </dd>
                <dt>{label.confirmPassword}</dt>
                <dd>
                  <Field
                    name="user_password_confirm"
                    component={InputField}
                    className="form-control"
                    type="password"
                    placeholder={label.placeholder.confirmPassword}
                    validate={[RequiredField, matchPasswords]}
                  />
                </dd>
              </dl>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <ReCAPTCHA
                sitekey="6LfviKEUAAAAAA-sdbw-YKYZdBJutYZRn6Nree6y"
                onChange={() => this.captchaCallback("clicked")}
                onExpired={() => this.captchaCallback("expired")}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-block"
              disabled={isLoading}
            >
              {isLoading ? label.pleaseWait : label.createProfile}
            </button>
          </form>

          <div className="aggr-box mt-10">
            Нажимая эту кнопку, Вы принимаете условие пользовательского
            соглашения
          </div>
        </div>
      </div>
    );
  }
}

RegisterPage = reduxForm({
  form: "signupform",
})(RegisterPage);

export default RegisterPage;
