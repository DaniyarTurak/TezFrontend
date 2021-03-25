import React, { Component } from "react";
import Select from "react-select";
import icons from "glyphicons";
import "./add-position-product-item.sass";

export default class AddPositionProductItem extends Component {
  render() {
    const {
      handleDeletePosition,
      onPositionProductChange,
      onPositionDiscountChange,
      onPositionProductListInput,
      disableDelete,
      positionProduct,
      positionProducts,
      item,
      gift,
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-8">
          <label>Выберите Товар:</label>
          <Select
            name="positionProduct"
            value={positionProduct}
            onChange={onPositionProductChange}
            options={positionProducts}
            onInputChange={onPositionProductListInput.bind(this)}
            placeholder="Выберите товар"
            noOptionsMessage={() => "Товар не найден"}
          />
        </div>
        <div className="col-md-4">
          {!gift ? <label>Скидка %</label> : <label>Количество</label>}
          <div className="row quantity-item">
            <input
              name="discount"
              value={item}
              className="form-control input-item"
              onChange={onPositionDiscountChange}
              type="text"
            />

            {disableDelete && (
              <button
                className="btn btn-outline-danger btn-labeled"
                onClick={handleDeletePosition}
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
