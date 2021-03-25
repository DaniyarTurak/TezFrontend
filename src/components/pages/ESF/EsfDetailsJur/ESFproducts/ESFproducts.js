import React, { Component } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import Select from "react-select";

export default class EsfProducts extends Component {
  state = {
    esf: this.props.esf,
    tableCounter: Array.from(new Array(14), (val, index) => index + 1),
    editableForm: false,
    editedProducts: [],
    truOriginCodes: [
      { label: 1, value: 1 },
      { label: 2, value: 2 },
      { label: 3, value: 3 },
      { label: 4, value: 4 },
      { label: 5, value: 5 },
      { label: 6, value: 6 },
    ],
  };

  componentDidMount() {
    const { esf } = this.state;
    const editableForm =
      esf.esfstatus === "FORMATION" || esf.esfstatus === "FAILED"
        ? true
        : false;
    this.setState({ editableForm });
  }

  changeEsf = () => {
    const { esf, editedProducts } = this.state;

    if (editedProducts.length > 0) {
      const esf_details = editedProducts
        .map((newValues, idx) => {
          const unitcode =
            typeof newValues.unitCode !== "undefined"
              ? newValues.unitCode
              : esf.products[idx].unitCode;
          const truorigincode =
            typeof newValues.truOriginCode !== "undefined"
              ? newValues.truOriginCode
              : esf.products[idx].truOriginCode;
          const declaration =
            typeof newValues.productDeclaration !== "undefined"
              ? newValues.productDeclaration
              : esf.products[idx].productDeclaration;
          const numberindeclaration =
            typeof newValues.productNumberInDeclaration !== "undefined"
              ? newValues.productNumberInDeclaration === ""
                ? 0
                : newValues.productNumberInDeclaration
              : esf.products[idx].productNumberInDeclaration.length > 0
              ? esf.products[idx].productNumberInDeclaration
              : 0;
          const esfid = esf.num;
          return {
            rowid: esf.products[idx].rowid,
            unitcode,
            truorigincode,
            declaration,
            numberindeclaration,
            esfid,
          };
        })
        .filter((unitCode) => {
          if (!unitCode) return false;
          return true;
        });

      Axios.post("/api/esf/detailsManagement", { esf_details })
        .then((res) => res.data)
        .then((result) => {
          editedProducts.forEach((element, idx) => {
            if (element) {
              if (typeof element.unitCode !== "undefined")
                esf.products[idx].unitCode = element.unitCode;
              if (typeof element.truOriginCode !== "undefined")
                esf.products[idx].truOriginCode = element.truOriginCode;
              if (typeof element.productDeclaration !== "undefined")
                esf.products[idx].productDeclaration =
                  element.productDeclaration;
              if (typeof element.productNumberInDeclaration !== "undefined")
                esf.products[idx].productNumberInDeclaration =
                  element.productNumberInDeclaration;
            }
          });
          this.props.closeDetail();
        })
        .catch((err) => {
          console.log(err);
          Alert.warning("Произошла ошибка сохранения изменений", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 10000,
          });
        });
    } else {
      this.props.closeDetail();
    }
  };

  truOriginCodeChange = (productEdited, e) => {
    const { editedProducts } = this.state;
    const value = e.value;
    editedProducts[productEdited] = editedProducts[productEdited]
      ? editedProducts[productEdited]
      : {};
    editedProducts[productEdited].truOriginCode = value;
    this.setState({ editedProducts });
  };

  fieldChange = (productEdited, e) => {
    const { editedProducts } = this.state;
    const value = e.target.value;
    const fieldName = e.target.name;
    editedProducts[productEdited] = editedProducts[productEdited]
      ? editedProducts[productEdited]
      : {};
    editedProducts[productEdited][fieldName] = value.length === 0 ? "" : value;
    this.setState({ editedProducts });
  };

  closeEsf = () => {
    this.props.closeEsf();
  };

  render() {
    const {
      esf,
      tableCounter,
      editableForm,
      editedProducts,
      truOriginCodes,
    } = this.state;
    return (
      <div className="esd-details">
        <div className="row">
          <div className="col-md-12 text-center">
            <table className="table table-bordered">
              <thead className="text-center bg-info text-white">
                <tr>
                  <td rowSpan="2">№ п/п</td>
                  <td rowSpan="2">
                    Признак происхождения товара, работ, услуг
                  </td>
                  <td rowSpan="2">Наименование товаров, работ, услуг</td>
                  <td rowSpan="2" style={{ minWidth: "150px" }}>
                    Код товара (ТН ВЭД ЕАЭС)
                  </td>
                  <td
                    rowSpan="2"
                    style={{ minWidth: editableForm ? "200px" : "0px" }}
                  >
                    Номер декларации
                  </td>
                  <td rowSpan="2">Позиция в декларации</td>
                  <td rowSpan="2">Единица измерения</td>
                  <td rowSpan="2">Количество (объем)</td>
                  <td rowSpan="2">
                    Цена (тариф) за единицу товара, работы, услуги без косвенных
                    налогов
                  </td>
                  <td rowSpan="2">
                    Стоимость товаров, работ, услуг без косвенных налогов
                  </td>
                  <td rowSpan="2">
                    Размер оборота по реализации (облагаемый/ необлагаемый
                    оборот)
                  </td>
                  <td colSpan="2">НДС</td>
                  <td rowSpan="2">
                    Стоимость товаров, работ, услуг с учетом косвенных налогов
                  </td>
                </tr>
                <tr>
                  <td>Ставка</td>
                  <td>Сумма</td>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr className="bg-grey">
                  {tableCounter.map((col) => (
                    <td key={col}>{col}</td>
                  ))}
                </tr>
                {esf.products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      {editableForm ? (
                        <Select
                          name="truOriginCode"
                          value={{
                            label:
                              editedProducts[idx] &&
                              editedProducts[idx].truOriginCode
                                ? editedProducts[idx].truOriginCode
                                : product.truOriginCode,
                            value:
                              editedProducts[idx] &&
                              editedProducts[idx].truOriginCode
                                ? editedProducts[idx].truOriginCode
                                : product.truOriginCode,
                          }}
                          onChange={(e) => this.truOriginCodeChange(idx, e)}
                          placeholder="Выберите признак"
                          options={truOriginCodes}
                        />
                      ) : (
                        product.truOriginCode
                      )}
                    </td>
                    <td>{product.description}</td>
                    <td>
                      {editableForm ? (
                        <input
                          type="number"
                          value={
                            editedProducts[idx] &&
                            typeof editedProducts[idx].unitCode !== "undefined"
                              ? editedProducts[idx].unitCode
                              : product.unitCode
                          }
                          className="form-control"
                          name="unitCode"
                          onChange={(e) => this.fieldChange(idx, e)}
                        />
                      ) : (
                        product.unitCode
                      )}
                    </td>
                    <td>
                      {editableForm ? (
                        <input
                          type="text"
                          value={
                            editedProducts[idx] &&
                            typeof editedProducts[idx].productDeclaration !==
                              "undefined"
                              ? editedProducts[idx].productDeclaration
                              : product.productDeclaration
                          }
                          className="form-control"
                          name="productDeclaration"
                          onChange={(e) => this.fieldChange(idx, e)}
                        />
                      ) : (
                        product.productDeclaration
                      )}
                    </td>
                    <td>
                      {editableForm ? (
                        <input
                          type="number"
                          value={
                            editedProducts[idx] &&
                            typeof editedProducts[idx]
                              .productNumberInDeclaration !== "undefined"
                              ? editedProducts[idx].productNumberInDeclaration
                              : product.productNumberInDeclaration
                          }
                          className="form-control"
                          name="productNumberInDeclaration"
                          onChange={(e) => this.fieldChange(idx, e)}
                        />
                      ) : (
                        product.productNumberInDeclaration
                      )}
                    </td>
                    <td>шт.</td>
                    <td>{product.quantity}</td>
                    <td className="tenge">
                      {parseFloat(product.unitPrice).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="tenge">
                      {parseFloat(product.priceWithoutTax).toLocaleString(
                        "ru",
                        { minimumFractionDigits: 2 }
                      )}
                    </td>
                    <td className="tenge">
                      {parseFloat(product.turnoverSize).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="tax">{product.ndsRate}</td>
                    <td className="tenge">
                      {parseFloat(product.ndsAmount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="tenge">
                      {parseFloat(product.priceWithTax).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr className="text-center">
                  <td className="text-left" colSpan="8">
                    Итого
                  </td>
                  <td className="tenge">
                    {esf.products
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.unitPrice);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {esf.products
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.priceWithoutTax);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {esf.products
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.turnoverSize);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                  <td className="tenge">
                    {esf.products
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.ndsAmount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {esf.products
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.priceWithTax);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div
            style={{ marginBottom: "1rem" }}
            className="col-md-12 text-center"
          >
            <button
              className="btn btn-success mt-10  mr-10"
              onClick={this.changeEsf}
            >
              Сохранить изменения
            </button>
            <button className="btn btn-secondary mt-10" onClick={this.closeEsf}>
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }
}
