import React, { Component } from "react";
import Select from "react-select";
import icons from "glyphicons";
import "./add-product-item.sass";

export default class AddProductItem extends Component {
  render() {
    const {
      handleDeleteSet,
      onProductChange,
      onQuantityChange,
      onProductListInput,
      disableDelete,
      product,
      products,
      item,
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-8">
          <label>Выберите Товар:</label>

          <Select
            name="product"
            value={product}
            onChange={onProductChange}
            options={products}
            onInputChange={onProductListInput.bind(this)}
            placeholder="Выберите товар"
            noOptionsMessage={() => "Товар не найден"}
          />
        </div>
        <div className="col-md-4">
          <label>Количество</label>
          <div className="row quantity-item">
            <input
              name="quantity"
              value={item}
              className="form-control input-item"
              onChange={onQuantityChange}
              type="text"
            />

            {disableDelete && (
              <button
                className="btn btn-outline-danger btn-labeled"
                onClick={handleDeleteSet}
              >
                <span className="btn-label">{icons.cancel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
