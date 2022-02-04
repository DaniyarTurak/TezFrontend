import React, { Component, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import CustomPopover from "./Popover";


class ERPUserListPage extends Component {
  state = {
    erpusers: [],
    isLoading: true,
    label: {
      list: "Список активных ERP пользователей",
      add: "Добавить нового ERP пользователя",
      empty: "Список ERP пользователей пуст",
      userName: "ФИО",
      login: "Логин",
      accessName: "Доступы пользователя",
      userIDN: "ИИН",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить ERP пользователя?",
      successDelete: "ERP Пользователь успешно удален",
      successEdit: "Изменения сохранены",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!",
      },
    },
    sweetalert: null,
  };

  componentDidMount() {
    this.getErpAccesses();

    if (this.props.location.state && this.props.location.state.fromEdit) {
      Alert.success(this.state.alert.successEdit, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  getErpAccesses = () => {
    Axios.get("/api/erpuser/erpaccesses")
      .then((res) => res.data)
      .then((erpusers) => {
        this.setState({
          erpusers,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDelete = (item) => {
    this.setState({
      sweetalert: (
        <SweetAlert
          warning
          showCancel
          confirmBtnText={this.state.alert.label.sure}
          cancelBtnText={this.state.alert.label.cancel}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title={this.state.alert.label.areyousure}
          onConfirm={() => this.delete(item)}
          onCancel={() => this.hideAlert()}
        >
          {this.state.alert.confirmDelete}
        </SweetAlert>
      ),
    });
  };

  delete = (item) => {
    const newUsersList = this.state.erpusers.filter((usersList) => {
      return usersList !== item;
    });

    item.status = "DISMISS";
    item.pass = null;

    const req = { erpusr: item };
    Axios.post("/api/erpuser/manage", req)
      .then(() => {
        this.setState({
          erpusers: newUsersList,
        });

        Alert.success(this.state.alert.successDelete, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
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
      });

    this.hideAlert();
  };

  handleEdit = (userData) => {
    this.props.history.push({
      pathname: "erpuser/manage",
      state: { userData },
    });
  };

  handleRollback = (newPoint) => {
    let list = this.state.erpusers;
    list.push(newPoint);

    this.setState({
      erpusers: list,
    });
  };
  render() {
    const { erpusers, isLoading, label, sweetalert } = this.state;
    return (
      <div className="cashbox-user-list">
        {/* <Alert stack={{ limit: 1 }} offset={50} /> */}

        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("erpuser/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space"></div>}

        {!isLoading && erpusers.length === 0 && <AlertBox text={label.empty} />}

        {!isLoading && erpusers.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }}></th>
                  <th style={{ width: "20%" }}>{label.userIDN}</th>
                  <th style={{ width: "20%" }}>{label.userName}</th>
                  <th style={{ width: "20%" }}>{label.login}</th>
                  <th style={{ width: "29%" }}>{label.accessName}</th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {this.state.erpusers.map((erpuser, idx) => (
                  <tr key={erpuser.id}>
                    <td>{idx + 1}</td>
                    <td>{erpuser.iin}</td>
                    <td>{erpuser.name}</td>
                    <td>{erpuser.login.toUpperCase()}</td>
                    <td

                    >
                      <p style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "25em"
                      }}>
                        {erpuser.accesses.map((access) => (
                          <Fragment

                            key={erpuser.id + access.id}
                          >
                            {access.name + " , "}
                          </Fragment>
                        ))}
                      </p>
                      <CustomPopover erpuser={erpuser}/>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon edit-item"
                        title={label.title.edit}
                        onClick={() => {
                          this.handleEdit(erpuser);
                        }}
                      ></button>

                      {!erpuser.self && (
                        <button
                          className="btn btn-w-icon delete-item"
                          title={label.title.delete}
                          onClick={() => {
                            this.handleDelete(erpuser);
                          }}
                        ></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="erpuser" />
        )}
      </div>
    );
  }
}

export default ERPUserListPage;
