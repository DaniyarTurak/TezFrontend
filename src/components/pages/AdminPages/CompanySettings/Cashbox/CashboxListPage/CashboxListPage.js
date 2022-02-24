import React, { Component } from "react";
import Axios from "axios";

import ShowInactive from "../../../../ClosedListPages/ShowInactive";

import AlertBox from "../../../../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../../../../Searching";

export default class CashboxListPage extends Component {
  state = {
    cashboxes: [],
    isLoading: true,
    label: {
      list: "Список активных касс",
      add: "Добавить новую кассу",
      empty: "Список активных касс пуст",
      cashboxName: "Наименование кассы",
      pointName: "Наименование торговой точки",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить кассу?",
      successDelete: "Касса успешно удалена",
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
    admin: false,
  };

  componentDidMount() {
    this.getCashboxes();

    if (this.props.location.state && this.props.location.state.fromEdit) {
      Alert.success(this.state.alert.successEdit, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    Axios.get("/api/auth")
      .then((resp) => {
        if (resp.data.role === 1) {
          this.setState({ admin: true })
        };
      });
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  getCashboxes = () => {
    Axios.get("/api/cashbox")
      .then((res) => res.data)
      .then((cashboxes) => {
        this.setState({
          cashboxes,
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
    const newCashboxList = this.state.cashboxes.filter((cashboxlist) => {
      return cashboxlist !== item;
    });

    item.deleted = 1;
    const req = { cashbox: item };

    Axios.post("/api/cashbox/manage", req)
      .then(() => {
        this.setState({
          cashboxes: newCashboxList,
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

  handleEdit = (cashboxData) => {
    this.props.history.push({
      pathname: "cashbox/manage",
      state: { cashboxData },
    });
  };

  handleRollback = (newPoint) => {
    let list = this.state.cashboxes;
    list.push(newPoint);

    this.setState({
      cashboxes: list,
    });
  };

  render() {
    const { cashboxes, isLoading, label, sweetalert } = this.state;
    return (
      <div className="cashbox-list">
        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>
          {this.state.admin &&
            <div className="col-md-6 text-right">
              <button
                className="btn btn-link btn-sm"
                onClick={() => this.props.history.push("cashbox/manage")}
              >
                {label.add}
              </button>
            </div>
          }

        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space" />}

        {!isLoading && cashboxes.length === 0 && (
          <AlertBox text={label.empty} />
        )}

        {!isLoading && cashboxes.length > 0 && (
          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }} />
                  <th style={{ width: "45%" }}>{label.cashboxName}</th>
                  <th style={{ width: "45%" }}>{label.pointName}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cashboxes.map((cashbox, idx) => (
                  <tr key={cashbox.id}>
                    <td>{idx + 1}</td>
                    <td>{cashbox.name}</td>
                    <td>{cashbox.point_name}</td>
                    <td className="text-right"></td>
                    {this.state.admin &&
                      <td className="text-right">
                        <button
                          className="btn btn-w-icon edit-item"
                          title={label.title.edit}
                          onClick={() => {
                            this.handleEdit(cashbox);
                          }}
                        />
                        <button
                          className="btn btn-w-icon delete-item"
                          title={label.title.delete}
                          onClick={() => {
                            this.handleDelete(cashbox);
                          }}
                        />
                      </td>
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="cashbox" />
        )}
      </div>
    );
  }
}
