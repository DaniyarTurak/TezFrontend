import React, { Component } from "react";
import { Field, reduxForm, initialize, change } from "redux-form";
import Axios from "axios";
import Alert from "react-s-alert";

import { InputField } from "../fields";
import { RequiredField, ValidateIDN } from "../../validation";
import ReactModal from "react-modal";
import { withStyles } from "@material-ui/core/styles";

import GeneralDetails from "./GeneralDetails";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#28a745",
    "&$checked": {
      color: "#28a745",
    },
    "&$checked + $track": {
      backgroundColor: "#28a745",
    },
  },
  checked: {},
  track: {},
})(Switch);

class GeneralInfo extends Component {
  company_data = JSON.parse(sessionStorage.getItem("isme-company-data"));
  state = {
    companyData: JSON.parse(sessionStorage.getItem("isme-company-data")) || {},
    wholesale:
      JSON.parse(sessionStorage.getItem("isme-company-data")) &&
      JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale
        ? JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale
        : false,
    isEdit: false,
    isEdited: false,
    modalIsOpen: false,
    label: {
      companyInfo: "Общая информация по компании",
      companyBin: "БИН",
      companyName: "Название компании",
      companyAddress: "Юридический адрес компании",
      companyHead: "Руководитель",
      companyHeadIDN: "ИИН Руководителя",
      companyAccountant: "Главный бухгалтер",
      companyAccountantIDN: "ИИН главного бухгалтера",
      hasNds: "Серия",
      ndsRegisterNumber: "Номер",
      ndsDate: "Дата",
      buttonLabel: {
        edit: "Редактировать",
        save: "Сохранить изменения",
        cancel: "Отменить",
      },
    },
    alert: {
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!",
      },
      successEdit: "Изменения сохранены",
      successChangePass: "Пароль успешно изменен",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работаем над решением. Попробуйте позже",
    },
    field: {
      type: "plainText",
    },
    grouping: false,
    isLoading: false,
    editEnabled: false,
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.changepass) {
      Alert.success(this.state.alert.successChangePass, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    Axios.get("/api/erpuser/user/roles")
      .then((res) => res.data)
      .then((roles) => {
        const userRoles = roles.map((role) => {
          return role.id;
        });

        if (userRoles.includes("1")) {
          this.setState({ editEnabled: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.getGeneralInfo();
  }

  UNSAFE_componentWillMount() {
    this.props.initialize({
      certificateseries: "",
      certificatenum: "",
      certificatedate: "",
    });
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  onGroupingChange = (e) => {
    this.state.grouping
      ? this.setState({ grouping: e.target.checked })
      : this.setState({ grouping: e.target.checked, modalIsOpen: true });
    this.props.dispatch(change("generalInfo", "certificateseries", ""));
    this.props.dispatch(change("generalInfo", "certificatenum", ""));
    this.props.dispatch(change("generalInfo", "certificatedate", ""));
  };

  submit = (data) => {
    delete data.bin;
    const reqdata = { company: { ...data, wholesale: this.state.wholesale } };

    Axios.post("/api/company/manage", reqdata)
      .then(() => {
        this.setState({
          isEdit: false,
          isEdited: true,
          field: {
            type: "plainText",
          },
        });

        Alert.success(this.state.alert.successEdit, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });

        this.getGeneralInfo();
        sessionStorage.setItem(
          "isme-company-data",
          JSON.stringify(this.state.companyData)
        );
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? this.state.alert.raiseError
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );

        this.setState({
          isEdited: false,
        });
      });
  };

  getGeneralInfo = () => {
    if (
      Object.keys(this.state.companyData).length === 0 ||
      this.state.isEdited
    ) {
      Axios("/api/company")
        .then((res) => res.data)
        .then((companyData) => {
          sessionStorage.setItem(
            "isme-company-data",
            JSON.stringify(companyData)
          );
          this.props.dispatch(initialize("generalInfo", companyData));
          this.setState({ companyData, sweetalert: null });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.props.dispatch(initialize("generalInfo", this.state.companyData));
    }
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

  handleEdit = () => {
    this.setState({
      isEdit: true,
      field: {
        type: "text",
      },
    });

    this.props.dispatch(initialize("generalInfo", this.state.companyData));
  };

  handleCancel = () => {
    this.setState({
      wholesale:
        JSON.parse(sessionStorage.getItem("isme-company-data")) &&
        JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale
          ? JSON.parse(sessionStorage.getItem("isme-company-data")).wholesale
          : false,
      isEdit: false,
      grouping: false,
      field: {
        type: "plainText",
      },
    });

    this.props.dispatch(initialize("generalInfo", this.state.companyData));
  };

  closeDetail = () => {
    this.setState({ modalIsOpen: false, grouping: false });
  };

  closeDetailSure = () => {
    this.setState({ modalIsOpen: false, grouping: true });
  };

  wholeSalesChange = (event) => {
    console.log(event.target.checked);
  };

  render() {
    const { handleSubmit, submitting } = this.props;
    const {
      companyData,
      isEdit,
      label,
      field,
      isLoading,
      editEnabled,
      modalIsOpen,
      grouping,
      wholesale,
    } = this.state;

    return (
      <div className="general-info">
        <ReactModal
          onRequestClose={() => {
            this.setState({ modalIsOpen: false });
          }}
          shouldCloseOnOverlayClick={false}
          isOpen={modalIsOpen}
          style={customStyles}
        >
          <GeneralDetails
            closeDetail={this.closeDetail}
            closeDetailSure={this.closeDetailSure}
          />
        </ReactModal>

        <div className={`content ${isLoading ? "is-loading" : ""}`}>
          <div className="loader">
            <div className="icon" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h6 className="btn-one-line">{label.companyInfo}</h6>
          </div>

          {!isEdit && editEnabled && (
            <div className="col-md-4 text-right">
              <button className="btn btn-link btn-sm" onClick={this.handleEdit}>
                {label.buttonLabel.edit}
              </button>
            </div>
          )}
        </div>

        <div className="empty-space" />

        <form onSubmit={handleSubmit(this.submit)}>
          <table className="general-info-table">
            <tbody>
              <tr>
                <td>{label.companyBin}</td>
                <td className="bold-text">{companyData.bin}</td>
              </tr>
              <tr>
                <td>{label.companyName}</td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="name"
                    component={InputField}
                    type={field.type}
                    className="form-control"
                    validate={[RequiredField]}
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  {label.companyAddress}
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="address"
                    component={InputField}
                    type={field.type}
                    className="form-control"
                    validate={[RequiredField]}
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  {label.companyHead}
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="head"
                    component={InputField}
                    type={field.type}
                    className="form-control"
                    validate={[RequiredField]}
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  {label.companyHeadIDN}
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="headIin"
                    component={InputField}
                    type={field.type}
                    onChange={this.IinValidation}
                    className="form-control"
                    validate={[RequiredField, ValidateIDN]}
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  {label.companyAccountant}
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="accountant"
                    component={InputField}
                    type={field.type}
                    className="form-control"
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  {label.companyAccountantIDN}
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <Field
                    name="accountantIin"
                    component={InputField}
                    type={field.type}
                    onChange={this.IinValidation}
                    className="form-control"
                  />
                </td>
              </tr>
              <tr>
                <td className={`${isEdit ? "edit-general-info-title" : ""}`}>
                  Оптовые продажи
                </td>
                <td
                  className={`bold-text ${isEdit ? "edit-general-info" : ""}`}
                >
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          disabled={!isEdit}
                          checked={wholesale}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.checked,
                            })
                          }
                          color="primary"
                          name="wholesale"
                        />
                      }
                      label={wholesale ? "Включено" : "Выключено"}
                    />
                  </FormGroup>
                </td>
              </tr>
            </tbody>
            {!companyData.certificateseries && isEdit && (
              <tbody>
                <tr
                  style={{ marginLeft: "20px", marginTop: "20px" }}
                  className="col-md-3 point-block custom-checkbox"
                >
                  <td>
                    <input
                      style={{ marginLeft: "1rem", position: "relative" }}
                      type="checkbox"
                      className="custom-control-input"
                      name="grouping"
                      id="updateprice"
                      checked={grouping}
                      onChange={this.onGroupingChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="updateprice"
                    >
                      Плательщик НДС.
                    </label>
                  </td>
                </tr>
              </tbody>
            )}
            {(grouping || companyData.certificateseries) && (
              <tbody>
                <tr
                  style={{
                    display: "flex",
                    marginTop: "2rem",
                  }}
                >
                  <td style={{ width: "12rem" }}>
                    <div
                      className={`${
                        isEdit && !companyData.certificateseries
                          ? "edit-general-info-title"
                          : ""
                      }`}
                    >
                      {label.hasNds}
                    </div>
                    {companyData.certificateseries ? (
                      <div className="bold-text">
                        {companyData.certificateseries}
                      </div>
                    ) : (
                      <div
                        className={`bold-text ${
                          isEdit ? "edit-general-info" : ""
                        }`}
                      >
                        <Field
                          name="certificateseries"
                          component={InputField}
                          type={field.type}
                          onChange={this.NdsValidation}
                          className="form-control"
                          validate={[RequiredField]}
                        />
                      </div>
                    )}
                  </td>
                  <td style={{ width: "12rem" }}>
                    <div
                      className={`${
                        isEdit && !companyData.certificateseries
                          ? "edit-general-info-title"
                          : ""
                      }`}
                    >
                      {label.ndsRegisterNumber}
                    </div>
                    {companyData.certificateseries ? (
                      <div className="bold-text">
                        {companyData.certificatenum}
                      </div>
                    ) : (
                      <div
                        className={`bold-text ${
                          isEdit ? "edit-general-info" : ""
                        }`}
                      >
                        <Field
                          name="certificatenum"
                          component={InputField}
                          type={field.type}
                          onChange={this.NdsNumValidation}
                          className="form-control"
                          validate={[RequiredField]}
                        />
                      </div>
                    )}
                  </td>
                  <td style={{ width: "12rem" }}>
                    <div
                      className={`${
                        isEdit && !companyData.certificateseries
                          ? "edit-general-info-title"
                          : ""
                      }`}
                    >
                      {label.ndsDate}
                    </div>
                    {companyData.certificateseries ? (
                      <div className="bold-text">
                        {companyData.certificatedate}
                      </div>
                    ) : isEdit ? (
                      <div className="bold-text edit-general-info">
                        <Field
                          name="certificatedate"
                          component={InputField}
                          type="date"
                          className="form-control"
                          validate={[RequiredField]}
                        />
                      </div>
                    ) : (
                      <div className="bold-text">
                        {companyData.certificatedate}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          {isEdit && (
            <div className="text-right">
              <button
                className="btn btn-outline-success btn-sm"
                disabled={submitting}
              >
                {label.buttonLabel.save}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ marginLeft: "10px" }}
                onClick={this.handleCancel}
              >
                {label.buttonLabel.cancel}
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

GeneralInfo = reduxForm({
  form: "generalInfo",
})(GeneralInfo);

export default GeneralInfo;
