import React, { Component, Fragment } from "react";
import Select from "react-select";
import Moment from "moment";
import Breadcrumb from "../../Breadcrumb";
import Axios from "axios";
import Alert from "react-s-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import Searching from "../../Searching";

class CreateWriteoffInvoice extends Component {
  state = {
    stockList: [],
    selectedStock: "",
    invoiceNumber: "",
    invoiceDate: Moment().format("YYYY-MM-DD"),
    isLoading: true,
    breadcrumb: [
      { caption: "Товары" },
      { caption: "Списание товара со склада" },
      { caption: "Новая накладная", active: true },
    ],
    alert: {
      selectStock: "Выберите склад",
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
  }

  componentWillMount() {
    this.getFormationInvoice();
  }

  getFormationInvoice = () => {
    Axios.get("/api/invoice", {
      params: { status: "FORMATION", type: "7" },
    })
      .then((res) => res.data)
      .then((activeInvoice) => {
        if (Object.keys(activeInvoice).length === 0) {
          this.setState({ isLoading: false });
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
      pathname: "invoicewriteoff",
      state: {
        invoiceNumber: invoice.invoicenumber,
        invoiceDate: Moment(invoice.invoicedate).utc().format("DD.MM.YYYY"),
        altInvoiceNumber: invoice.altnumber,
        stockFrom: invoice.stockfrom,
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

  getStockList = () => {
    Axios.get("/api/stock")
      .then((res) => res.data)
      .then((list) => {
        const stockList = list.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });

        this.setState({
          stockList,
        });
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

  handleCreateInvoice = () => {
    if (Object.keys(this.state.selectedStock).length === 0) {
      Alert.warning(this.state.alert.selectStock, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
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
      type: "7",
    };

    Axios.post("/api/invoice/create", reqdata)
      .then((res) => res.data)
      .then((serverResponse) => {
        this.props.history.push({
          pathname: "invoicewriteoff",
          state: {
            invoiceNumber: serverResponse.text,
            invoiceDate: Moment(this.state.invoiceDate, "YYYY-MM-DD").format(
              "DD.MM.YYYY"
            ),
            altInvoiceNumber: this.state.invoiceNumber,
            stockFrom: this.state.selectedStock,
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

  render() {
    const {
      stockList,
      label,
      selectedStock,
      sweetalert,
      breadcrumb,
      invoiceNumber,
      invoiceDate,
      isLoading,
    } = this.state;

    return (
      <Fragment>
        {sweetalert}

        <Breadcrumb content={breadcrumb} />

        {isLoading && <Searching />}

        {!isLoading && (
          <div className="create-write-off-invoice">
            <div className="row">
              <div className="col-md-12 zi-4">
                <label htmlFor="">Выберите склад</label>
                <Select
                  name="stock"
                  value={selectedStock}
                  noOptionsMessage={() => "Склад не найден"}
                  onChange={this.handleStockSelectChange}
                  placeholder="Выберите склад из списка"
                  options={stockList || []}
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
                <label>Дата</label>
                <input
                  type="date"
                  name="invoice-date"
                  defaultValue={invoiceDate}
                  className="form-control"
                  onChange={this.handleInvoiceDataChange}
                />
              </div>
            </div>

            <div className="row text-right mt-20">
              <div className="col-md-12">
                {!invoiceNumber && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={this.handleCreateInvoice}
                  >
                    Продолжить без ввода номера
                  </button>
                )}
                <button
                  className="btn btn-outline-success"
                  onClick={this.handleCreateInvoice}
                  disabled={!invoiceNumber}
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

export default CreateWriteoffInvoice;
