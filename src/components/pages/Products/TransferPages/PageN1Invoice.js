import React, { Component, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import Moment from "moment";
import Checkbox from "../../../fields/Checkbox";
import Searching from "../../../Searching";

class PageN1Invoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fromPoint: this.props.fromPoint,
      invoiceOptions: [],
      selectedInvoice: this.props.selectedInvoice || "",
      selectedGoods: this.props.selectedGoods || [],
      productList: [],
      selectedProducts: new Map(),
      allChecked: false,
      stockcurrentfrom: [],
      isLoading: this.props.selectedGoods.length > 0 ? true : false,
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    this.getInvoiceList();
    if (this.state.selectedInvoice) {
      this.selectedInvoiceList(this.state.selectedInvoice);
      this.setState({ stockcurrentfrom: this.state.selectedGoods });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      this.props.selectedGoodsFunc(
        this.state.stockcurrentfrom,
        this.state.selectedInvoice
      );
    }
  }

  getInvoiceList = () => {
    Axios.get("/api/invoice/list", {
      params: {
        type: "2",
        status: "ACCEPTED",
        stockfrom: this.state.fromPoint.value || this.state.fromPoint,
      },
    })
      .then((res) => res.data)
      .then((invoiceList) => {
        const invoiceOptions = invoiceList.map((invoice) => {
          return {
            label:
              "Накладная " +
              invoice.altnumber +
              " от " +
              Moment(invoice.invoicedate).utc().format("DD.MM.YYYY"),
            value: invoice.invoicenumber,
          };
        });
        this.setState({ invoiceOptions });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  selectedInvoiceList = (selectedInvoice) => {
    Axios.get("/api/stockcurrent/products", {
      params: { invoiceNumber: selectedInvoice.value },
    })
      .then((res) => res.data)
      .then((productList) => {
        const selectedGoods = this.state.selectedGoods;
        productList.forEach((product) => {
          product.inputDisabled = true;
          selectedGoods.forEach((good) => {
            if (good.id === product.id) {
              product.inputDisabled = false;
              product.newUnits = good.amount;
              this.setState((prevState) => {
                return {
                  selectedProducts: prevState.selectedProducts.set(
                    product.id + "|" + product.attributes,
                    true
                  ),
                };
              });
              return;
            }
          });
        });
        this.setState({ productList, isLoading: false });
      })
      .catch((err) => console.log(err));
  };

  invoiceListChange = (selectedInvoice) => {
    this.setState({ isLoading: true });
    this.getInvoiceProducts(selectedInvoice);
  };

  getInvoiceProducts = (selectedInvoice) => {
    this.setState({ selectedInvoice });

    Axios.get("/api/stockcurrent/products", {
      params: { invoiceNumber: selectedInvoice.value },
    })
      .then((res) => res.data)
      .then((productList) => {
        productList.forEach((product) => {
          product.inputDisabled = true;
        });
        this.setState({ productList, isLoading: false });
        this.selectAllProducts();
      })
      .catch((err) => console.log(err));
  };

  onUnitsChange = (e) => {
    const value = e.target.value;
    const limit = e.target.getAttribute("limit");
    const productid = e.target.getAttribute("productid");

    let productList = this.state.productList;
    let stockcurrentfrom = this.state.stockcurrentfrom;

    if (+value > +limit) {
      Alert.warning("Количество не может превышать " + limit, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 5000,
      });
      return;
    }

    productList.forEach((product) => {
      if (product.id === productid) product.newUnits = +value;
    });

    stockcurrentfrom.forEach((product) => {
      if (product.id === productid) product.amount = +value;
    });
    this.setState({ productList, stockcurrentfrom });
  };

  selectAllProducts = (e) => {
    const isChecked = e ? e.target.checked : false;
    let productList = this.state.productList;
    let stockcurrentfrom = [];

    productList.forEach((product) => {
      if (isChecked) {
        stockcurrentfrom.push({
          id: product.id,
          amount: product.newUnits || product.units,
          attributes: product.attributes,
          SKU: null,
          code: product.code,
          name:
            product.name.trim() +
            (product.attributescaption ? ", " + product.attributescaption : ""),
        });
      } else {
        stockcurrentfrom = [];
      }

      product.inputDisabled = !isChecked;
      this.setState((prevState) => {
        return {
          selectedProducts: prevState.selectedProducts.set(
            product.id + "|" + product.attributes,
            isChecked
          ),
        };
      });
    });

    this.setState({ allChecked: isChecked, productList, stockcurrentfrom });
  };

  handleCheckboxChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    let productList = this.state.productList;
    let stockcurrentfrom = this.state.stockcurrentfrom;

    productList.forEach((product, idx) => {
      if (product.id + "|" + product.attributes === item) {
        product.inputDisabled = !isChecked;

        if (isChecked) {
          stockcurrentfrom.push({
            id: product.id,
            amount: product.newUnits || product.units,
            attributes: product.attributes,
            SKU: null,
            code: product.code,
            name:
              product.name.trim() +
              (product.attributescaption
                ? ", " + product.attributescaption
                : ""),
          });
        } else {
          stockcurrentfrom.splice(idx, 1);
        }

        this.setState({ stockcurrentfrom });
      }
    });

    this.setState((prevState) => {
      return {
        productList,
        selectedProducts: prevState.selectedProducts.set(item, isChecked),
      };
    });
  }

  render() {
    const {
      invoiceOptions,
      productList,
      selectedProducts,
      selectedInvoice,
      allChecked,
      isLoading,
    } = this.state;
    return (
      <Fragment>
        {/* <Alert stack={{ limit: 1 }} offset={50} /> */}

        <div className="row">
          <div className="col-md-12">
            <label htmlFor="">Выберите накладную</label>
            <Select
              name="invoiceList"
              value={selectedInvoice}
              noOptionsMessage={() => "Накладная не найдена"}
              onChange={this.invoiceListChange}
              placeholder="Выберите накладную из списка"
              options={invoiceOptions}
            />
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && productList.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <table className="table mt-10">
                <thead>
                  <tr>
                    <th style={{ width: "2%" }}></th>
                    <th style={{ width: "20%" }}>Наименование</th>
                    <th style={{ width: "10%" }}>Штрих код</th>
                    <th style={{ width: "30%" }}>Количество</th>
                    <th style={{ width: "2%" }} className="text-right">
                      <input
                        type="checkbox"
                        title={"Выбрать все"}
                        onChange={this.selectAllProducts}
                        checked={allChecked}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, idx) => (
                    <tr key={product.id + "|" + product.attributes}>
                      <td>{idx + 1}</td>
                      <td>
                        {product.name.trim() +
                          (product.attributescaption
                            ? ", " + product.attributescaption
                            : "")}
                      </td>
                      <td>{product.code}</td>
                      <td>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            id={product.id + "|" + product.attributes}
                            readOnly={product.inputDisabled}
                            defaultValue={product.newUnits || product.units}
                            onChange={this.onUnitsChange}
                            productid={product.id}
                            limit={product.units}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              в накладной {product.units}
                            </span>
                          </div>
                          <div className="input-group-append">
                            <span className="input-group-text">
                              на складе {product.totalunits}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <Checkbox
                          name={product.id + "|" + product.attributes}
                          checked={selectedProducts.get(
                            product.id + "|" + product.attributes
                          )}
                          onChange={this.handleCheckboxChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default PageN1Invoice;
