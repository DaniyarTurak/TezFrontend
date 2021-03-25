import React, { Component, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../ClosedListPages/ShowInactive";

import AlertBox from "../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../Searching";

class StockList extends Component {
  state = {
    stockList: [],
    isLoading: true,
    label: {
      list: "Список активных складов",
      add: "Добавить новый склад",
      name: "Наименование",
      address: "Адрес",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить склад?",
      successDelete: "Склад успешно удален",
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
  };

  componentDidMount() {
    this.getStock();

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

  getStock = () => {
    Axios.get("/api/stock")
      .then((stockList) => {
        this.setState({
          stockList: stockList.data,
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
    const newStockList = this.state.stockList.filter((stocksList) => {
      return stocksList !== item;
    });

    delete item.is_minus;
    item.status = "CLOSE";
    const req = { user: "5", point: item };

    Axios.post("/api/point/change", req)
      .then(() => {
        this.setState({
          stockList: newStockList,
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

  handleEdit = (stockData) => {
    this.props.history.push({
      pathname: "stock/manage",
      state: { stockData },
    });
  };

  handleRollback = (newPoint) => {
    let list = this.state.stockList;
    list.push(newPoint);

    this.setState({
      stockList: list,
    });
  };

  render() {
    const { stockList, isLoading, label, sweetalert } = this.state;
    return (
      <div className="stock-list">
        {/* <Alert stack={{ limit: 1 }} offset={50} /> */}

        {sweetalert}

        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && <div className="empty-space"></div>}

        {!isLoading && stockList.length === 0 && (
          <AlertBox text={label.empty} />
        )}

        {!isLoading && stockList.length > 0 && (
          <Fragment>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "1%" }}></th>
                  <th style={{ width: "40%" }}>{label.name}</th>
                  <th style={{ width: "40%" }}>{label.address}</th>
                </tr>
              </thead>
              <tbody>
                {stockList.map((stock, idx) => (
                  <tr key={stock.id}>
                    <td>{idx + 1}</td>
                    <td>{stock.name}</td>
                    <td>{stock.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        )}

        {!isLoading && (
          <ShowInactive callback={this.handleRollback} mode="stock" />
        )}
      </div>
    );
  }
}

export default StockList;
