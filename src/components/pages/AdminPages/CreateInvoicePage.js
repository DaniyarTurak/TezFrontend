import React, { Component } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Moment from "moment";
import Searching from "../../Searching";

class CreateInvoicePage extends Component {
  state = {
    dateFrom: Moment().format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
    isLoading: false,
    barcode: "",
    point: "",
    selectToValue: "",
    productDetails: {},
    toPointOptions: [],
    isUpdating: false,
    isToggleOn: true,
    label: {
      brandid: "№",
      name: "Товар",
      list: "Создание Инвойсов",
      add: "Добавить новую компанию",
      empty: "Cписок компаний пуст",
      product: "Название Компании",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
        detail: "Детали",
        status: "Статус",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить компанию?",
      successDelete: "Компания успешно удалена",
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
    this.getCompaniesList();
    if (this.props.location.state && this.props.location.state.fromEdit) {
    }
  }

  hideAlert = () => {
    this.setState({
      sweetalert: null,
    });
  };

  getCompaniesList = () => {
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((points) => {
        const options = points.map((point) => {
          return {
            value: point.id,
            label: point.name,
          };
        });

        this.setState({ points: options });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPointsByCompany = (companyId) => {
    Axios.get("/api/adminpage/points", { params: { companyId } })
      .then((res) => res.data)
      .then((points) => {
        const toPointOptions = points.map((point) => {
          return { value: point.id, label: point.name };
        });

        this.setState({ toPointOptions });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleFromPointChange = (value) => {
    this.setState({
      selectFromValue: value,
      toPointNoOption: "Касса не найдена",
      selectToValue: "",
    });
    this.getPointsByCompany(value.value);
  };

  handleToPointChange = (value) => {
    this.setState({
      selectToValue: value,
    });
  };

  onBarcodeChange = (e) => {
    let barcode = e.target.value.toUpperCase();
    barcode
      ? this.setState({ barcode })
      : this.setState({
          productSelectValue: "",
          barcode: "",
          stockbalance: "",
        });
  };
  handleSearch = () => {
    const { barcode, selectFromValue, selectToValue } = this.state;
    if (!barcode || !selectFromValue || !selectToValue) {
      return Alert.warning("Заполните все поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    this.setState({ isLoading: true });
    this.getProduct(barcode, selectFromValue.value);
  };

  getProduct = (barcode, company) => {
    Axios.get("/api/adminpage/barcode", {
      params: {
        barcode,
        company,
      },
    })
      .then((res) => res.data)

      .then((productDetails) => {
        this.setState({ productDetails, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendInfo = () => {
    const { barcode, selectToValue } = this.state;
    this.setState({ isUpdating: true });
    const update = {
      code: barcode,
      point: selectToValue.value,
    };
    Axios.post("/api/adminpage/updateposstock", { update })
      .then((resp) => {
        Alert.success(this.state.alert.success, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        this.setState({ isUpdating: false });
        const alertText = err.response
          ? err.response.data
            ? err.response.data.text
              ? err.response.data.text
              : this.state.alert.raiseError
            : this.state.alert.raiseError
          : this.state.alert.raiseError;
        Alert.error(alertText, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      });
  };

  render() {
    const {
      points,
      label,
      toPointOptions,
      selectFromValue,
      selectToValue,
      isLoading,
      productDetails,
    } = this.state;
    return (
      <div className="brand-list">
        <div className="row">
          <div className="col-md-6">
            <h6 className="btn-one-line">{label.list}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 pb-2">
            <Select
              name="company"
              value={selectFromValue}
              onChange={this.handleFromPointChange}
              options={points}
              placeholder="Выберите компанию"
              noOptionsMessage={() => "Компания не найдена"}
            />
          </div>

          <div className="col-md-4 pb-2">
            {console.log(selectToValue)}
            <Select
              name="point"
              value={selectToValue}
              onChange={this.handleToPointChange}
              options={toPointOptions}
              placeholder="Выберите кассу"
              noOptionsMessage={() => "Торговая точка не найдена"}
            />
          </div>
          <div className="col-md-4 pb-2">
            <input
              name="barcode"
              placeholder="Введите или отсканируйте штрих код"
              onChange={this.onBarcodeChange}
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <div className="row pt-10 pb-20">
          <div className="col-md-1 text-right search-btn">
            <button
              className="btn btn-success mt-10"
              onClick={() => this.handleSearch()}
            >
              Поиск
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && !productDetails.code && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              С выбранными фильтрами ничего не найдено
            </div>
          </div>
        )}

        {!isLoading && productDetails.code && (
          <div>
            <table className="table table-hover ">
              <thead>
                <tr>
                  <th style={{ width: "3%" }}>{label.brandid}</th>
                  <th style={{ width: "57%" }}>{label.name}</th>
                  <th style={{ width: "20%" }} />
                  <th style={{ width: "20%" }} />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{productDetails.name}</td>
                  <td />
                  <td className="text-right">
                    <button
                      className={"btn btn-success btn-sm btn-block"}
                      onClick={() => {
                        this.sendInfo();
                      }}
                    >
                      Создать инвойс
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default CreateInvoicePage;
