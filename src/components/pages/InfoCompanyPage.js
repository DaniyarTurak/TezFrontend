import React, { Component } from "react";
import { reduxForm, initialize } from "redux-form";

import Searching from "../Searching";
import Alert from "react-s-alert";
import Axios from "axios";

class InfoCompanyPage extends Component {
  state = {
    companyData: this.props.location.state
      ? this.props.location.state.companyData
      : null,
    isEdit: false,
    isEdited: false,
    isLoading: true,
    label: {
      companyInfo: "Общая информация по компании",
      companyBin: "БИН",
      companyName: "Название компании",
      companyAddress: "Юридический адрес компании",
      companyHead: "Руководитель",
      companyHeadIDN: "ИИН Руководителя",
      companyAccountant: "Главный бухгалтер",
      companyAccountantIDN: "ИИН главного бухгалтера",
      certificateSeries: "Серия НДС",
      certificateNum: "Регистрационный номер НДС",
      certificateDate: "Дата НДС",
      buttonLabel: {
        edit: "Редактировать",
        save: "Сохранить изменения",
        cancel: "Отменить"
      }
    },
    alert: {
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        empty: "Cписок компаний пуст",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!"
      },
      successEdit: "Изменения сохранены",
      successChangePass: "Пароль успешно изменен",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
    }
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.changepass) {
      Alert.success(this.state.alert.successChangePass, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000
      });
    }
    let id = this.state.companyData.id;
    Axios.get("/api/adminpage/company/info", { params: { id } })
      .then(res => res.data)
      .then(companyData => {
        this.setState({ companyData, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });

    this.getCompaniesInfo();
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null
    });
  };

  submit = data => {
    delete data.name;
    delete data.bin;

    const reqdata = { company: data };

    Axios.post("/api/adminpage/company/info", reqdata)
      .then(() => {
        this.setState({
          isEdit: false,
          isEdited: true,
          isLoading: false
        });

        Alert.success(this.state.alert.successEdit, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000
        });

        this.getCompaniesInfo();
        sessionStorage.setItem(
          "isme-company-data",
          JSON.stringify(this.state.companyData)
        );
      })
      .catch(err => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? this.state.alert.raiseError
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000
          }
        );

        this.setState({
          isEdited: false
        });
      });
  };

  getCompaniesInfo = () => {
    if (
      Object.keys(this.state.companyData).length === 0 ||
      this.state.isEdited
    ) {
      Axios("/api/adminpage/company/info")
        .then(res => res.data)
        .then(companyData => {
          sessionStorage.setItem(
            "isme-company-data",
            JSON.stringify(companyData)
          );
          this.props.dispatch(initialize("generalInfo", companyData));
          this.setState({ companyData, sweetalert: null, isLoading: false });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.props.dispatch(initialize("generalInfo", this.state.companyData));
    }
  };

  handleBack = companyData => {
    this.props.history.push({
      pathname: "../companies",
      state: { companyData }
    });
  };

  handleCancel = () => {
    this.setState({
      isEdit: false
    });

    this.props.dispatch(initialize("generalInfo", this.state.companyData));
  };

  render() {
    const { handleSubmit } = this.props;
    const { companyData, label, isLoading } = this.state;

    return (
      <div className="general-info">
        <div className="row">
          <div className="col-md-8">
            <h6 className="btn-one-line">
              {label.companyInfo} {companyData.name}
            </h6>
          </div>
        </div>

        {isLoading && <Searching />}
        {!isLoading && <div className="empty-space" />}

        {!isLoading && (
          <form onSubmit={handleSubmit(this.submit)}>
            <table className="general-info-table">
              <tbody>
                <tr>
                  <td>{label.companyBin}</td>
                  <td className="bold-text">{companyData.bin}</td>
                </tr>
                <tr>
                  <td>{label.companyName}</td>
                  <td className="bold-text">{companyData.name}</td>
                </tr>
                <tr>
                  <td>{label.companyAddress}</td>
                  <td className="bold-text">{companyData.address}</td>
                </tr>
                <tr>
                  <td>{label.companyHead}</td>
                  <td className="bold-text">{companyData.head}</td>
                </tr>
                <tr>
                  <td>{label.companyHeadIDN}</td>
                  <td className="bold-text">{companyData.headIin}</td>
                </tr>
                <tr>
                  <td>{label.companyAccountant}</td>
                  <td className="bold-text">{companyData.accountant}</td>
                </tr>
                <tr>
                  <td>{label.companyAccountantIDN}</td>
                  <td className="bold-text">{companyData.accountantIin}</td>
                </tr>
                <tr>
                  <td>{label.certificateSeries}</td>
                  <td className="bold-text">{companyData.certificateSeries}</td>
                </tr>
                <tr>
                  <td>{label.certificateNum}</td>
                  <td className="bold-text">{companyData.certificateNum}</td>
                </tr>
                <tr>
                  <td>{label.certificateDate}</td>
                  <td className="bold-text">{companyData.certificateDate}</td>
                </tr>
              </tbody>
            </table>

            <button
              className="btn btn-lg btn-info"
              onClick={() => {
                this.handleBack();
              }}
            >
              Назад
            </button>
          </form>
        )}
      </div>
    );
  }
}

InfoCompanyPage = reduxForm({
  form: "infocompanypage"
})(InfoCompanyPage);

export default InfoCompanyPage;
