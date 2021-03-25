import React from "react";

import AddProductItem from "../AddProductItem";
import "./set-items.sass";

const SetItems = ({
  setItems,
  handleDeleteSet,
  onProductChange,
  onQuantityChange,
  onProductListInput,
  products,
}) => {
  const elements = setItems.map((item) => {
    const { id, value, product, ...itemProps } = item;
    const disableDelete = item.id === 100 ? false : true;
    return (
      <li key={id} className="lists">
        <AddProductItem
          {...itemProps}
          disableDelete={disableDelete}
          handleDeleteSet={() => handleDeleteSet(id)}
          product={item.product}
          products={products}
          item={item.value}
          onProductChange={(product) => onProductChange(id, product)}
          onQuantityChange={(e) => onQuantityChange(id, e)}
          onProductListInput={(product) => onProductListInput(product)}
        />
      </li>
    );
  });
  return <ul className="list-group todo-list">{elements}</ul>;
};

export default SetItems;
