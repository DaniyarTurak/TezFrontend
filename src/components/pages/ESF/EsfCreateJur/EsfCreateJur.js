import React, { Component } from "react";
import Moment from "moment";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";

import Checkbox from "../../../fields/Checkbox";

export default class EsfCreateJur extends Component {
  state = {
    counter: 0,
    dateFrom: Moment().format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
    disabledButtons: [],
    point: "",
    points: [],
    transactions: [],
  };

  componentDidMount() {
    this.getPoints();
  }

  dateFromChange = (e) => {
    const dateFrom = e.target.value;
    this.setState({ dateFrom });
  };

  dateToChange = (e) => {
    const dateTo = e.target.value;
    this.setState({ dateTo });
  };

  onPointChange = (point) => {
    this.setState({ point });
  };

  getPoints = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const points = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });

        this.setState({ points: [...all, ...points] });
      })
      .catch((err) => {
        console.log(err);
        Alert.warning(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 10000,
        });
      });
  };

  getTransactions = () => {
    const { dateFrom, dateTo, point } = this.state;
    if (!point) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    Axios.get("/api/esf/findTransactions", {
      params: { dateFrom, dateTo, point: point.value },
    })
      .then((res) => res.data)
      .then((transactions) => {
        transactions.forEach((transaction) => {
          transaction.checked = false;
        });
        this.setState({
          transactions,
          disabledButtons: new Array(transactions.length).fill(false),
        });
      })
      .catch((err) => {
        console.log(err);
        Alert.warning(err, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 10000,
        });
      });
  };

  createOneEsf = () => {
    const { transactions } = this.state;
    let transaction = [];
    let items = [];

    let checkedTransactions = [];

    transactions.forEach((t) => {
      if (t.checked) {
        const stock = { id: t.id };
        checkedTransactions.push(stock);
      }
    });

    checkedTransactions.forEach((item) => {
      items.push(parseInt(item.id, 0));
    });

    if (checkedTransactions.length === 0) {
      return Alert.warning("Выберите одну транзакцию", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    transaction = [{ id: parseInt(items, 0) }];

    Axios.post("/api/esf/createOneEsf", { transaction })
      .then((res) => res.data)
      .then((esf) => {
        this.props.closeEsfCreateForm();
      })
      .catch((err) => {
        Alert.error("Ошибка при отправке данных", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        console.log(err);
      });
  };

  closeEsfCreateForm = () => {
    this.props.closeEsfCreateForm();
  };

  handleCheckboxChange(index, e) {
    const isChecked = e.target.checked;
    let transactions = this.state.transactions;
    let disabledButtons = this.state.disabledButtons;
    transactions[index].checked = isChecked;

    disabledButtons.forEach((e, idx) => {
      if (!e && index !== idx) {
        this.setState((oldState) => {
          const newDisabledButtons = [...oldState.disabledButtons];
          newDisabledButtons[idx] = true;
          return {
            transactions,
            disabledButtons: newDisabledButtons,
          };
        });
      } else if (e && index !== idx) {
        this.setState((oldState) => {
          const newDisabledButtons = [...oldState.disabledButtons];
          newDisabledButtons[idx] = false;
          return {
            transactions,
            disabledButtons: newDisabledButtons,
          };
        });
      } else {
        this.setState((oldState) => {
          const newDisabledButtons = [...oldState.disabledButtons];
          newDisabledButtons[idx] = false;
          return {
            transactions,
            disabledButtons: newDisabledButtons,
          };
        });
      }
    });
  }

  render() {
    const {
      dateFrom,
      dateTo,
      disabledButtons,
      point,
      points,
      transactions,
    } = this.state;
    return (
      <div>
        <div className="row pt-10">
          <div className="col-md-3">
            <label htmlFor="">Дата с</label>
            <input
              type="date"
              className="form-control"
              value={dateFrom}
              onChange={this.dateFromChange}
            ></input>
          </div>
          <div className="col-md-3">
            <label htmlFor="">Дата по</label>
            <input
              type="date"
              className="form-control"
              value={dateTo}
              onChange={this.dateToChange}
            ></input>
          </div>
          <div className="col-md-4">
            <label htmlFor="">Торговая точка</label>
            <Select
              name="point"
              value={point}
              onChange={this.onPointChange}
              noOptionsMessage={() => "Выберите торговую точку из списка"}
              options={points}
              placeholder="Выберите торговую точку"
            />
          </div>
          <div style={{ marginTop: "1.5rem" }} className="col-md-2 text-right">
            <button className="btn btn-info" onClick={this.getTransactions}>
              Поиск
            </button>
          </div>
        </div>

        {transactions.length === 0 && (
          <div className="row">
            <div className="col-md-12 text-center not-found-text">
              Данных не найдено
            </div>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="form-group">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "5%" }} />
                  <th style={{ width: "25%" }}>Пользователь кассы</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Касса
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Дата
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Сумма
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Торговая точка
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Наименование
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    BIN
                  </th>
                  <th className="text-center" style={{ width: "10%" }} />
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{transaction.cashboxuser}</td>
                    <td>{transaction.cashbox}</td>
                    <td>
                      {Moment(transaction.date).format("YYYY-MM-DD hh-mm-ss")}
                    </td>
                    <td>{transaction.price}</td>
                    <td>{transaction.pointname}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.bin}</td>
                    <td className="text-center">
                      <Checkbox
                        disabled={disabledButtons[idx]}
                        name={transaction.name}
                        checked={
                          transaction.checked ? transaction.checked : false
                        }
                        onChange={(e) => this.handleCheckboxChange(idx, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="row">
          <div className="col-md-12 text-right">
            <button
              style={{ width: "10rem", marginRight: "1rem" }}
              className="btn btn-info"
              onClick={this.createOneEsf}
            >
              Создать
            </button>
            <button
              style={{ width: "10rem" }}
              className="btn btn-secondary"
              onClick={this.closeEsfCreateForm}
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }
}
