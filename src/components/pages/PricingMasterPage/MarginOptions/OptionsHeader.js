import React from "react";

export default function OptionsHeader({
  isToggleBrand,
  toggleBrand,
  isToggleCategory,
  toggleCategory,
  isToggleProduct,
  toggleProduct,
}) {
  return (
    <div className="row">
      <div className="col-md-3 month-btn">
        <button
          className={`btn btn-sm btn-block btn-report ${
            isToggleProduct ? "btn-info" : "btn-outline-info"
          }`}
          onClick={toggleProduct}
        >
          Товары
        </button>
      </div>

      <div className="col-md-3 month-btn">
        <button
          className={`btn btn-sm btn-block btn-report ${
            isToggleBrand ? "btn-info" : "btn-outline-info"
          }`}
          onClick={toggleBrand}
        >
          Бренды
        </button>
      </div>

      <div className="col-md-3 month-btn">
        <button
          className={`btn btn-sm btn-block btn-report ${
            isToggleCategory ? "btn-info" : "btn-outline-info"
          }`}
          onClick={toggleCategory}
        >
          Категории
        </button>
      </div>
    </div>
  );
}
