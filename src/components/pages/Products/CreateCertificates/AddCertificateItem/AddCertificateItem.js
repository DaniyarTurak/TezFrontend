import React, { Component } from "react";
import Select from "react-select";
import icons from "glyphicons";
import "./add-certificate-item.sass";

export default class AddCertificateItem extends Component {
  state = {
    point: "",
    points: [],
  };

  render() {
    const {
      balance,
      balanceList,
      disableDelete,
      handleDeletePoint,
      item,
      onBalanceChange,
      onPointChange,
      onQuantityChange,
      point,
      points,
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-6">
          <label>Выберите торговую точку:</label>
          <Select
            name="point"
            value={point}
            onChange={onPointChange}
            options={points}
            placeholder="Выберите торговую точку"
            noOptionsMessage={() => "Точка не найдена"}
          />
        </div>
        <div className="col-md-3">
          <label>Выберите Номинал:</label>
          <Select
            name="balance"
            value={balance}
            onChange={onBalanceChange}
            options={balanceList}
            placeholder="Выберите Номинал"
            noOptionsMessage={() => "Номинал не найден"}
          />
        </div>
        <div className="col-md-3">
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
                onClick={handleDeletePoint}
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
