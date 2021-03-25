import React, { Component } from "react";
import "./add-discount-item.sass";

export default class AddDiscountItem extends Component {
  state = {};

  render() {
    const { handleDeleteProduct, item } = this.props;

    return (
      <span className="row list-item">
        <span className="list-item-label">{item.label}</span>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm float-right"
          onClick={handleDeleteProduct}
        >
          Убрать из списка
        </button>
      </span>
    );
  }
}
