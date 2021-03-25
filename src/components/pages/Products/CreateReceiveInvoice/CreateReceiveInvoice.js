import React, { Component, Fragment } from "react";
import { reduxForm } from "redux-form";
import Moment from "moment";
import Axios from "axios";
import Breadcrumb from "../../../Breadcrumb";
import Alert from "react-s-alert";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import Searching from "../../../Searching";

class CreateReceiveInvoice extends Component {
  state = {
    invoiceNumber: "",
    invoiceDate: Moment().format("YYYY-MM-DD"),
    stockOptions: [],
    counterpartiesOptions: [],
    selectedStock: {},
    selectedСounterparty: {},
    isLoading: true,
    isUpdating: false,
    breadcrumb: [
      { caption: "Товары" },
      { caption: "Прием нового товара на склад" },
      { caption: "Новая накладная", active: true },
    ],
    alert: {
      selectStock: "Выберите склад",
      selectСounterparty: "Выберите контрагента",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      hasActiveInvoice:
        "У Вас имеется незавершенная накладная, хотите продолжить заполнение?",
      successDelete: "Накладная успешно удалена",
      label: {
        attention: "Внимание",
        continue: "Продолжить",
        delete: "Нет, удалить накладную",
      },
    },
    sweetalert: null,
  };

  componentDidMount() {
    this.getStockList();
    this.getCounterparties();
  }

  componentWillMount() {
    this.getFormationInvoice();
  }

  getStockList = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((stockList) => {
        const stockOptions = stockList.map((stock) => {
          return { value: stock.id, label: stock.name };
        });

        this.setState({ stockOptions });
      })
      .catch((err) => console.log(err));
  };

  getCounterparties = () => {
    Axios.get("/api/counterparties")
      .then((res) => res.data)
      .then((counterparties) => {
        const counterpartiesOptions = counterparties.map((counterparty) => {
          return {
            value: counterparty.id,
            label: `${counterparty.bin} | ${counterparty.name}`,
          };
        });

        this.setState({ counterpartiesOptions });
      })
      .catch((err) => console.log(err));
  };

  getFormationInvoice = () => {
    Axios.get("/api/invoice", {
      params: { status: "FORMATION", type: "2" },
    })
      .then((res) => res.data)
      .then((activeInvoice) => {
        if (Object.keys(activeInvoice).length === 0) {
          this.setState({
            isLoading: false,
          });
        } else {
          this.setState({
            sweetalert: (
              <SweetAlert
                warning
                showCancel
                confirmBtnText={this.state.alert.label.continue}
                cancelBtnText={this.state.alert.label.delete}
                confirmBtnBsStyle="success"
                cancelBtnBsStyle="danger"
                title={this.state.alert.label.attention}
                allowEscape={false}
                closeOnClickOutside={false}
                onConfirm={() => this.continueFilling(activeInvoice)}
                onCancel={() => this.deleteInvoice(activeInvoice)}
              >
                {this.state.alert.hasActiveInvoice}
              </SweetAlert>
            ),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  continueFilling = (invoice) => {
    this.props.history.push({
      pathname: "invoice",
      state: {
        invoiceNumber: invoice.invoicenumber,
        invoiceDate: Moment(invoice.invoicedate).format("DD.MM.YYYY"),
        altInvoiceNumber: invoice.altnumber,
        stockTo: invoice.stockto,
      },
    });
  };

  deleteInvoice = (invoice) => {
    const req = { invoice: invoice.invoicenumber };

    Axios.post("/api/invoice/delete", req)
      .then(() => {
        this.setState({
          isLoading: false,
          sweetalert: null,
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
  };

  handleCreateInvoice = () => {
    if (
      !this.state.selectedStock.value ||
      !this.state.selectedСounterparty.value
    ) {
      Alert.warning(
        !this.state.selectedStock.value
          ? this.state.alert.selectStock
          : this.state.alert.selectСounterparty,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        }
      );
      return;
    }

    if (!this.state.invoiceDate) {
      Alert.warning(`Заполните дату!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
    }

    const reqdata = {
      stockfrom: this.state.selectedStock.value,
      stockto: this.state.selectedStock.value,
      altinvoice: this.state.invoiceNumber,
      invoicedate: Moment(this.state.invoiceDate, "YYYY-MM-DD").format(
        "DD.MM.YYYY"
      ),
      counterparty: this.state.selectedСounterparty.value,
      type: "2",
    };
    this.setState({ isUpdating: true });
    Axios.post("/api/invoice/create", reqdata)
      .then((res) => res.data)
      .then((serverResponse) => {
        this.props.history.push({
          pathname: "invoice",
          state: {
            invoiceNumber: serverResponse.text,
            invoiceDate: Moment(this.state.invoiceDate, "YYYY-MM-DD").format(
              "DD.MM.YYYY"
            ),
            altInvoiceNumber: this.state.invoiceNumber,
            stockTo: this.state.selectedStock.value,
            counterparty: this.state.selectedСounterparty,
          },
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
  };

  handleInvoiceNumberChange = (e) => {
    this.setState({ invoiceNumber: e.target.value });
  };

  handleInvoiceDateChange = (e) => {
    this.setState({ invoiceDate: e.target.value });
  };

  handleStockSelectChange = (selectedStock) => {
    this.setState({ selectedStock });
  };

  handleСounterpartiesChange = (selectedСounterparty) => {
    this.setState({ selectedСounterparty });
  };

  render() {
    const {
      invoiceNumber,
      invoiceDate,
      breadcrumb,
      stockOptions,
      counterpartiesOptions,
      isLoading,
      isUpdating,
      selectedStock,
      selectedСounterparty,
      sweetalert,
    } = this.state;
    return (
      <Fragment>
        {sweetalert}

        <Breadcrumb content={breadcrumb} />

        {isLoading && <Searching />}

        {!isLoading && (
          <div className="create-product-invoice">
            <div className="row">
              <div className="col-md-12">
                <label htmlFor="">Выберите склад</label>
                <Select
                  onChange={this.handleStockSelectChange}
                  options={stockOptions}
                  //value={selectedStock}
                  noOptionsMessage={() => "Склады не найдены"}
                  placeholder={"Выберите склад..."}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label htmlFor="">Выберите контрагента</label>
                <Select
                  onChange={this.handleСounterpartiesChange}
                  options={counterpartiesOptions}
                  // value={selectedСounterparty}
                  noOptionsMessage={() => "Контрагенты не найдены"}
                  placeholder={"Выберите контрагента..."}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <label>Номер накладной</label>
                <input
                  type="text"
                  name="invoice-num"
                  value={invoiceNumber}
                  className="form-control"
                  onChange={this.handleInvoiceNumberChange}
                />
              </div>
              <div className="col-md-4">
                <label>Дата накладной</label>
                <input
                  type="date"
                  name="invoice-date"
                  defaultValue={invoiceDate}
                  className="form-control"
                  onChange={this.handleInvoiceDateChange}
                />
              </div>
            </div>

            <div className="row text-right mt-20">
              <div className="col-md-12">
                {!invoiceNumber && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={this.handleCreateInvoice}
                    disabled={
                      selectedStock.value === undefined ||
                      selectedСounterparty.value === undefined ||
                      isUpdating
                    }
                  >
                    Продолжить без ввода номера
                  </button>
                )}
                <button
                  className="btn btn-outline-success"
                  onClick={this.handleCreateInvoice}
                  disabled={!invoiceNumber || isUpdating}
                >
                  Далее
                </button>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

CreateReceiveInvoice = reduxForm({
  form: "CreateReceiveInvoice",
})(CreateReceiveInvoice);

export default CreateReceiveInvoice;
