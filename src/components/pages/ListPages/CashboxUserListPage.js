import React, { Component } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";

class CashboxUserListPage extends Component {
  state = {
    cashboxusers: [],
    isLoading: true,
    label: {
      list: "Список активных пользователей",
      add: "Добавить нового пользователя",
      empty: "Список пользователей пуст",
      discount: "Разрешено давать скидку?",
      userName: "ФИО",
      userIDN: "ИИН",
      roleName: "Роль пользователя",
      pointName: "Наименование торговой точки",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить пользователя?",
      successDelete: "Пользователь успешно удален",
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
    this.getCashboxUsers();

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

  getCashboxUsers = () => {
    Axios.get("/api/cashboxuser")
      .then((res) => res.data)
      .then((cashboxusers) => {
        //  console.log(cashboxusers);
        this.setState({
          cashboxusers,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    const newUsersList = this.state.cashboxusers.filter((usersList) => {
      return usersList !== item;
    });

    item.deleted = 1;
    const req = { cashboxusr: item };
    Axios.post("/api/cashboxuser/manage", req)
      .then(() => {
        this.setState({
          cashboxusers: newUsersList,
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
      pathname: "cashboxuser/manage",
      state: { userData },
    });
  };

  handleRollback = (newPoint) => {
    let list = this.state.cashboxusers;
    list.push(newPoint);

    this.setState({
      cashboxusers: list,
    });
  };

  render() {
    const { cashboxusers, isLoading, label, sweetalert } = this.state;
    return (
      <div className="cashbox-user-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>

          <div className="col-md-6 text-right">
            <button
              className="btn btn-link btn-sm"
              onClick={() => this.props.history.push("cashboxuser/manage")}
            >
              {label.add}
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {!isLoading && cashboxusers.length === 0 && (
          <AlertBox text={label.empty} />
        )}

        {!isLoading && cashboxusers.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }} />
                  <th style={{ width: "15%" }}>{label.userIDN}</th>
                  <th style={{ width: "30%" }}>{label.userName}</th>
                  <th style={{ width: "20%" }}>{label.roleName}</th>
                  <th style={{ width: "25%" }}>{label.pointName}</th>
                  {/* <th style={{ width: "15%" }}>{label.discount}</th> */}
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.cashboxusers.map((cashboxuser, idx) => (
                  <tr key={cashboxuser.id}>
                    <td>{idx + 1}</td>
                    <td>{cashboxuser.iin}</td>
                    <td>{cashboxuser.name}</td>
                    <td>{cashboxuser.roleName}</td>
                    <td>{cashboxuser.pointName}</td>
                    {/* <td>{cashboxuser.discount === false ? "Нет" : "Да"}</td> */}
                    <td className="text-right">
                      <button
                        className="btn btn-w-icon edit-item"
                        title={label.title.edit}
                        onClick={() => {
                          this.handleEdit(cashboxuser);
                        }}
                      />

                      <button
                        className="btn btn-w-icon delete-item"
                        title={label.title.delete}
                        onClick={() => {
                          this.handleDelete(cashboxuser);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="cashboxuser" />
        )}
      </div>
    );
  }
}

export default CashboxUserListPage;
