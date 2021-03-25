import React, { Component, Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import { InputField } from "../../fields";
import Alert from "react-s-alert";
import Axios from "axios";

import "../../../sass/revision.sass";

class RevisionLoginPage extends Component {
  state = {
    label: {
      sessionTimeOut:
        "В целях безопасности ваша сессия завершена. Пожалуйста авторизуйтесь заново",
      email: "Логин пользователя",
      password: "Пароль",
      signInText: "Войти",
      pleaseWait: "Пожалуйста подождите...",
      placeholder: {
        email: "Ваш логин",
        password: "Ваш пароль",
      },
    },
    isLoading: false,
    isWaiting: true,
    sessionTimeOut: this.props.location.state
      ? this.props.location.state.sessionTimeOut
      : false,
    signOut: this.props.location.state
      ? this.props.location.state.signOut
      : false,
    alert: {
      authfailed: "Неверный логин или пароль",
      accauntNotActivated: "Аккаунт не активирован",
      accauntNotActive: "Аккаунт не активен",
      emailIsEmpty: "Введите логин",
      passwordIsEmpty: "Введите пароль",
    },
  };

  componentWillMount() {
    if (!this.state.signOut || !this.state.sessionTimeOut) {
      const token = localStorage.getItem("token");
      // const token = localStorage.getItem('revisionToken');
      Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      if (token) {
        Axios.get("/api/revauth")
          .then((resp) => {
            this.props.history.push("revision/params");
          })
          .catch(() => {
            sessionStorage.clear();
            localStorage.clear();

            // localStorage.removeItem('revisionToken');
            // sessionStorage.removeItem('revision-params');
            // sessionStorage.removeItem('saved-state');
            // sessionStorage.removeItem('login');
            this.setState({ isWaiting: false });
          });
      } else {
        this.setState({ isWaiting: false });
      }
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
      this.setState({
        isLoading: true,
      });
      this.signIn(data);
    }
  };

  signIn = (data) => {
    Axios.post("/auth/revsignin", data)
      .then((res) => res.data)
      .then((user) => {
        // localStorage.setItem('revisionToken', user.accessToken);
        localStorage.setItem("token", user.accessToken);
        // sessionStorage.setItem('login', data.username);
        Axios.defaults.headers.common["Authorization"] =
          "Bearer " + user.accessToken;
        this.props.history.push("revision/params");
      })
      .catch((err) => {
        let alertText = this.state.alert.authfailed;
        if (err.response) {
          if (err.response.data.status === "UserNotActivated") {
            alertText = this.state.alert.accauntNotActivated;
          } else if (err.response.data.status === "UserNotActive") {
            alertText = this.state.alert.accauntNotActive;
          }
        }

        Alert.error(alertText, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { label, isLoading, sessionTimeOut, isWaiting } = this.state;
    return (
      <Fragment>
        {!isWaiting && (
          <div className="login-box-revision">
            <Alert stack={{ limit: 1 }} offset={10} />

            {sessionTimeOut && (
              <div className="alert alert-success">
                {sessionTimeOut ? label.sessionTimeOut : ""}
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
                </div>
                <Field
                  name="password"
                  component={InputField}
                  className="form-control"
                  type="password"
                  placeholder={label.placeholder.password}
                  tabIndex="2"
                />
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

RevisionLoginPage = reduxForm({
  form: "revisionLoginForm",
})(RevisionLoginPage);

export default RevisionLoginPage;
