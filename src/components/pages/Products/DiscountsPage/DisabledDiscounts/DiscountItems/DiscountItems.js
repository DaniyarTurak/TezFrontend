import React from "react";

import AddDiscountItem from "../AddDiscountItem";
import "./discount-items.sass";

const DiscountItems = ({ discountItems, handleDeleteProduct }) => {
  const elements = discountItems.map(item => {
    const { id, ...itemProps } = item;

    return (
      <li key={id} className="lists list-group-item">
        <AddDiscountItem
          {...itemProps}
          item={item}
          handleDeleteProduct={() => handleDeleteProduct(id)}
        />
      </li>
    );
  });
  if (elements.length > 0) {
    return (
      <table style={{ marginTop: "10px" }} className="table table-hover">
        <thead>
          <tr className="table-discounts">
            <th style={{ width: "75%" }}>Наименования товаров</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ul className="list-group list">{elements}</ul>
            </td>
          </tr>
        </tbody>
      </table>
    );
  } else return <ul />;
};

export default DiscountItems;
