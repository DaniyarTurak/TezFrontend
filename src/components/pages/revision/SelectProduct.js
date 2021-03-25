import React, { Component } from "react";
import { isMobile } from "react-device-detect";

import "../../../sass/revision.sass";

class SelectProduct extends Component {
  state = {
    products: this.props.products,
    selectedIdx: -1,
    isButtonActive: false,
    isLandsape: false,
  };

  componentWillMount() {
    if (isMobile && window.innerWidth > 480)
      this.setState({ isLandsape: true });
  }

  closeModal = () => {
    this.props.closeDetail();
  };

  productSelected = () => {
    this.props.productSelected(this.state.selectedIdx);
  };

  selectProduct(selectedIdx) {
    this.setState({ isButtonActive: true, selectedIdx });
  }

  render() {
    const { products, isButtonActive, isLandsape } = this.state;
    return (
      <div className="select-product">
        <div className="sidebar-toggle-button" onClick={this.closeModal}>
          <button
            className={`btn btn-w-icon close-button cross-black`}
          ></button>
        </div>
        <div className="row">
          {/* <div className="col-md-12 text-center" style={{fontWeight:"bold",marginLeft:"25px"}}> */}
          <div
            className="col-md-12 text-center"
            style={{ fontWeight: "bold", paddingLeft: "60px" }}
          >
            Выберите товар
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 hint mt-20">
            <table className="borderless-table data-table">
              <tbody>
                <tr>
                  <th>Наимменование товара</th>
                  <td>{products[0].name}</td>
                </tr>
                <tr>
                  <th>Штрих-код</th>
                  <td>{products[0].code}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div
            className={`col-md-12 mt-10 table-width${
              isLandsape ? "-landscape" : ""
            }`}
          >
            <table className="table table-sm table-products data-table">
              <thead>
                <tr>
                  <th>Характеристики</th>
                  <th className="text-center" style={{ width: "25%" }}>
                    Количество
                  </th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={idx}>
                    <td>
                      {product.attrvalue ? product.attrvalue : "Не указано"}
                    </td>
                    <td className="text-center">{product.units}</td>
                    <td>
                      <input
                        type="radio"
                        id={idx}
                        name="product"
                        onClick={() => this.selectProduct(idx)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-30">
          <div className="col-md-12 text-center">
            <button
              className="btn btn-success"
              disabled={!isButtonActive}
              onClick={this.productSelected}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectProduct;
