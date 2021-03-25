import React, { Component } from "react";
// import Select from 'react-select';
import Axios from "axios";
import { Field, reduxForm, reset, change } from "redux-form";
import { InputField, InputGroup, SelectField } from "../../fields";
import { RequiredField, LessThanZero, NotEqualZero } from "../../../validation";

class EsfDetailForm extends Component {
  state = {
    product: this.props.product,
    esf: this.props.esf,
    truOriginCodes: "",
    truOriginCode: "",
    isSubmitting: false,
    productDetails: {},
  };

  componentDidMount() {
    this.getTruOriginCodes();
    this.getProducts();
  }

  getProducts = (inputValue) => {
    Axios.get("/api/products", { params: { productName: inputValue } })
      .then((res) => res.data)
      .then((productOptions) => {
        this.setState({ productOptions });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  productListChange = (e) => {
    const id = e.value;
    Axios.get("/api/esf/productInfo", { params: { id } })
      .then((res) => res.data)
      .then((productDetails) => {
        const { pricewithtax, rate, cnofeacode } = productDetails;
        const tax = parseFloat((pricewithtax / (rate + 1)) * rate).toFixed(2);
        const unitprice = parseFloat(pricewithtax - tax).toFixed(2);
        const pricewithouttax = unitprice;

        this.props.dispatch(change("EsfDetailForm", "ndsRate", rate * 100));
        this.props.dispatch(
          change("EsfDetailForm", "priceWithTax", pricewithtax)
        );
        this.props.dispatch(
          change("EsfDetailForm", "priceWithoutTax", pricewithouttax)
        );
        this.props.dispatch(change("EsfDetailForm", "unitCode", cnofeacode));
        this.props.dispatch(change("EsfDetailForm", "quantity", 1));
        this.props.dispatch(change("EsfDetailForm", "ndsAmount", tax));
        this.props.dispatch(change("EsfDetailForm", "unitPrice", unitprice));

        productDetails.tax = tax;
        productDetails.unitprice = unitprice;

        this.setState({ productDetails });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  amountChange = (e) => {
    const quantity = e.target.value;
    const { productDetails } = this.state;
    const { pricewithtax, unitprice } = productDetails;
    if (pricewithtax) {
      this.props.dispatch(
        change("EsfDetailForm", "priceWithTax", pricewithtax * quantity)
      );
      this.props.dispatch(
        change("EsfDetailForm", "priceWithoutTax", unitprice * quantity)
      );
      productDetails.quantity = quantity;
      this.setState({ productDetails });
    }
  };

  pricewithtaxChange = (e) => {
    const pricewithtax = e.target.value;
    const { productDetails } = this.state;
    let { quantity, rate } = productDetails;
    const tax = parseFloat((pricewithtax / (rate + 1)) * rate).toFixed(2);
    const unitprice = parseFloat(pricewithtax - tax).toFixed(2);

    if (unitprice) {
      quantity = quantity || 1;
      this.props.dispatch(
        change("EsfDetailForm", "priceWithTax", pricewithtax * quantity)
      );
      this.props.dispatch(
        change("EsfDetailForm", "priceWithoutTax", unitprice * quantity)
      );
      this.props.dispatch(change("EsfDetailForm", "unitPrice", unitprice));
      this.props.dispatch(change("EsfDetailForm", "ndsAmount", tax));
      productDetails.pricewithtax = pricewithtax;
      this.setState({ productDetails });
    }
  };

  getTruOriginCodes = () => {
    Axios.get("/api/esf/truOriginCode")
      .then((res) => res.data)
      .then((truOriginCodes) => {
        this.setState({ truOriginCodes });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  truOriginCodeChange = (truOriginCode) => {
    this.setState({ truOriginCode });
  };

  onProductListInput = (productName) => {
    if (productName.length > 0) this.getProducts(productName);
  };

  closeModal = () => {
    this.props.closeDetail(true);
  };

  onWheelScroll = (e) => {
    e.preventDefault();
  };

  handleAddEsfProduct = (data) => {
    const req = {
      esf_details: {
        esfid: this.state.esf.details.num,
        description: data.product.label,
        ndsamount: data.ndsAmount,
        ndsrate: data.ndsRate,
        pricewithtax: data.priceWithTax,
        pricewithouttax: data.priceWithoutTax,
        productDeclaration: data.productDeclaration,
        productNumberInDeclaration: data.productNumberInDeclaration,
        quantity: data.quantity,
        truorigincode: data.truOriginCode.value,
        unitcode: data.unitCode,
        unitprice: data.unitPrice,
        delete: "N",
      },
    };
    console.log(req);
    Axios.post("/api/esf/detailsManagement", req)
      .then((res) => res.data)
      .then((res) => {
        const newPosition = {
          description: data.product.label,
          ndsAmount: data.ndsAmount,
          ndsRate: data.ndsRate,
          priceWithTax: data.priceWithTax,
          priceWithoutTax: data.priceWithoutTax,
          productDeclaration: data.productDeclaration,
          productNumberInDeclaration: data.productNumberInDeclaration,
          quantity: data.quantity,
          truOriginCode: data.truOriginCode.value,
          unitCode: data.unitCode,
          unitPrice: data.unitPrice,
          turnoverSize: data.priceWithoutTax,
          rowid: res.text,
        };
        this.props.addEsfNewProduct(newPosition);
        console.log("newPosition", newPosition);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { handleSubmit, submitting, pristine } = this.props;
    const {
      /*product,*/ productOptions,
      truOriginCodes,
      isSubmitting,
    } = this.state;
    return (
      <div className="esf-detail-form">
        <div className="row">
          <div className="col-md-12">
            <h5>Добавить новую позицию</h5>
          </div>
        </div>

        <form onSubmit={handleSubmit(this.handleAddEsfProduct)}>
          <div className="row">
            <div className="col-md-12">
              <label htmlFor="">Выберите товар</label>
              <Field
                name="product"
                component={SelectField}
                noOptionsMessage={() => "Товар не найден"}
                onChange={this.productListChange}
                placeholder="Выберите товар из списка"
                onInputChange={this.onProductListInput.bind(this)}
                options={productOptions || []}
                validate={[RequiredField]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="">Номер декларации</label>
              <Field
                name="productDeclaration"
                component={InputField}
                type="text"
                className="form-control"
                validate={[RequiredField, LessThanZero, NotEqualZero]}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="">Позиция в декларации</label>
              <Field
                name="productNumberInDeclaration"
                component={InputField}
                type="text"
                className="form-control"
                validate={[RequiredField, LessThanZero, NotEqualZero]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <label htmlFor="">Признак происхождения ТРУ</label>
              <Field
                name="truOriginCode"
                component={SelectField}
                noOptionsMessage={() => "Признак не найден"}
                onChange={this.truOriginCodeChange}
                placeholder="Выберите признак"
                options={truOriginCodes || []}
                validate={[RequiredField]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="">Количество</label>
              <Field
                name="quantity"
                component={InputField}
                type="number"
                className="form-control"
                onChange={this.amountChange}
                onWheel={(e) => this.onWheelScroll(e)}
                validate={[RequiredField, LessThanZero, NotEqualZero]}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="">Код ТН ВЭД</label>
              <Field
                name="unitCode"
                component={InputField}
                type="text"
                className="form-control"
                validate={[RequiredField]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="">Ставка НДС</label>
              <Field
                name="ndsRate"
                component={InputGroup}
                type="number"
                className="form-control"
                disabled={true}
                appendItem={<span className="input-group-text">%</span>}
                validate={[RequiredField, LessThanZero]}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="">Сумма НДС</label>
              <Field
                name="ndsAmount"
                component={InputGroup}
                type="number"
                className="form-control"
                appendItem={<span className="input-group-text">%</span>}
                validate={[RequiredField, LessThanZero]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <label htmlFor="">
                Стоимость товаров, работ, услуг с учетом косвенных налогов
              </label>
              <Field
                name="priceWithTax"
                component={InputGroup}
                type="number"
                className="form-control"
                onChange={this.pricewithtaxChange}
                onWheel={(e) => this.onWheelScroll(e)}
                appendItem={<span className="input-group-text">&#8376;</span>}
                validate={[RequiredField, LessThanZero]}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="">
                Цена (тариф) за единицу товара, работы, услуги без косвенных
                налогов
              </label>
              <Field
                name="unitPrice"
                component={InputGroup}
                type="number"
                className="form-control"
                onWheel={(e) => this.onWheelScroll(e)}
                appendItem={<span className="input-group-text">&#8376;</span>}
                validate={[RequiredField, LessThanZero]}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="">
                Стоимость товаров, работ, услуг без косвенных налогов
              </label>
              <Field
                name="priceWithoutTax"
                component={InputGroup}
                type="number"
                className="form-control"
                onWheel={(e) => this.onWheelScroll(e)}
                appendItem={<span className="input-group-text">&#8376;</span>}
                validate={[RequiredField, LessThanZero]}
              />
            </div>
          </div>

          <div className="row mt-20">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-success"
                disabled={isSubmitting || pristine || submitting}
              >
                {isSubmitting ? "Пожалуйста подождите..." : "Добавить"}
              </button>
              <button
                className="btn btn-outline-secondary ml-10"
                onClick={this.closeModal}
                disabled={isSubmitting}
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

EsfDetailForm = reduxForm({
  form: "EsfDetailForm",
  reset,
})(EsfDetailForm);

export default EsfDetailForm;
