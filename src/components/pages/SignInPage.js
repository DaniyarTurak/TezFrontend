import React, { Component, Fragment } from "react";
//import { NavLink } from "react-router-dom";
import { Field, reduxForm, change } from "redux-form";
import { InputField } from "../fields";
import Alert from "react-s-alert";
import Axios from "axios";
import Moment from "moment";
require("moment/locale/ru");

class LoginPage extends Component {
  state = {
    blockedTimer: 0,
    label: {
      signUpSuccess:
        "Регистрация прошла успешно. Пожалуйста введите логин и пароль",
      sessionTimeOut:
        "В целях безопасности ваша сессия завершена. Пожалуйста авторизуйтесь заново",
      email: "Логин пользователя",
      password: "Пароль",
      forgetPassword: "Забыли пароль?",
      signUpText: "Зарегистрироваться!",
      signInText: "Войти",
      pleaseWait: "Пожалуйста подождите...",
      placeholder: {
        email: "Ваш логин",
        password: "Ваш пароль",
      },
    },
    isLoading: false,
    isWaiting: true,
    isDemo: false,
    signUpSuccess: this.props.location.state
      ? this.props.location.state.signUpSuccess
      : false,
    sessionTimeOut: this.props.location.state
      ? this.props.location.state.sessionTimeOut
      : false,
    signOut: this.props.location.state
      ? this.props.location.state.signOut
      : false,
    alert: {
      authfailed: "Неверный логин или пароль",
      accauntNotActive: "Компания не активна",
      emailIsEmpty: "Введите логин",
      passwordIsEmpty: "Введите пароль",
      notDemo: "Вы можете войти только под логином demo",
    },
  };

  componentWillMount() {
    if (this.props.location.pathname === "/demo") {
      this.props.dispatch(change("loginForm", "username", "demo"));
      this.setState({ isDemo: true });
    }
    if (!this.state.signOut || !this.state.sessionTimeOut) {
      const token = localStorage.getItem("token");
      Axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      Axios.get("/api/auth")
        .then((resp) => {
          this.props.history.push(
            resp.data.role === 1 ? "/adminpage" : "/usercabinet"
          );
        })
        .catch(() => {
          sessionStorage.clear();
          localStorage.clear();
          //localStorage.removeItem("token");
          this.setState({ isWaiting: false });
        });
    } else {
      this.setState({ isWaiting: false });
    }
  }

  handleSignIn = (data) => {
    if (!data.username) {
      Alert.warning(this.state.alert.emailIsEmpty, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else if (!data.password) {
      Alert.warning(this.state.alert.passwordIsEmpty, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      if (this.state.isDemo && data.username !== "demo") {
        Alert.warning(this.state.alert.notDemo, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      } else {
        this.setState({
          isLoading: true,
        });
        this.signIn(data);
      }
    }
  };

  signIn = (data) => {
    Axios.post("/auth/signin", data)
      .then((res) => res.data)
      .then((user) => {
        localStorage.setItem("token", user.accessToken);
        Axios.defaults.headers.common["Authorization"] =
          "Bearer " + user.accessToken;
        this.props.history.push(
          user.role === 1 ? "/adminpage" : "/usercabinet"
        );
      })
      .catch((err) => {
        if (err.response.data.status === "BLOCKED") {
          this.setState({ blockedTimer: new Date(err.response.data.time) });
        }
        let alertText = this.state.alert.authfailed;
        if (err.response && !this.state.blockedTimer) {
          if (err.response.data.status === "UserNotActive") {
            alertText = this.state.alert.accauntNotActive;
          }
        }
        if (!this.state.blockedTimer) {
          Alert.error(alertText, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
        }
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const {
      blockedTimer,
      label,
      isLoading,
      signUpSuccess,
      sessionTimeOut,
      isWaiting,
      isDemo,
    } = this.state;
    return (
      <Fragment>
        {!isWaiting && (
          <div className="login-box">
            <Alert stack={{ limit: 1 }} offset={10} />
            {(signUpSuccess || sessionTimeOut) && (
              <div className="alert alert-success">
                {signUpSuccess
                  ? label.signUpSuccess
                  : sessionTimeOut
                  ? label.sessionTimeOut
                  : ""}
              </div>
            )}
            <form onSubmit={handleSubmit(this.handleSignIn)}>
              <div className="login-row">
                <div className="login-row-text">{label.email}</div>

                <Field
                  name="username"
                  component={InputField}
                  className="form-control"
                  type="input"
                  placeholder={label.placeholder.email}
                  tabIndex="1"
                />
              </div>
              <div className="password-row">
                <div className="password-row-text">
                  <div className="password-row-text-inner">
                    {label.password}
                  </div>
                  <div className="password-row-text-forgot">
                    {/* <NavLink to="/">{label.forgetPassword}</NavLink> */}
                  </div>
                </div>
                <Field
                  name="password"
                  component={InputField}
                  className="form-control"
                  type="password"
                  placeholder={label.placeholder.password}
                  tabIndex="2"
                />
                {isDemo && (
                  <div style={{ padding: "10px", color: "blue" }}>
                    Пароль от пользователя demo Zz123456
                  </div>
                )}
                {blockedTimer !== 0 && (
                  <div style={{ padding: "10px", color: "red" }}>
                    Вы были заблокированы. Попробуйте повторить вход{" "}
                    {Moment(blockedTimer).endOf().fromNow()}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success btn-block mt-10"
                disabled={isLoading}
              >
                {isLoading ? label.pleaseWait : label.signInText}
              </button>
            </form>
          </div>
        )}
      </Fragment>
    );
  }
}

LoginPage = reduxForm({
  form: "loginForm",
})(LoginPage);

export default LoginPage;
