import React from "react";

import AddPositionProductItem from "../AddPositionProductItem";
import "./position-items.sass";

const SetItems = ({
  positionItems,
  handleDeletePosition,
  onPositionProductChange,
  onPositionDiscountChange,
  onPositionProductListInput,
  positionProducts,
  gift,
}) => {
  const elements = positionItems.map((item) => {
    const { id, value, product, barcode, ...itemProps } = item;
    const disableDelete = item.id === 100 ? false : true;
    return (
      <li key={id} className="lists">
        <AddPositionProductItem
          {...itemProps}
          disableDelete={disableDelete}
          handleDeletePosition={() => handleDeletePosition(id)}
          positionProduct={item.product}
          positionProducts={positionProducts}
          item={item.value}
          gift={gift}
          barcode={item.barcode}
          onPositionProductChange={(product) =>
            onPositionProductChange(id, product)
          }
          onPositionDiscountChange={(e) => onPositionDiscountChange(id, e)}
          onPositionProductListInput={(product) =>
            onPositionProductListInput(product)
          }
        />
      </li>
    );
  });

  return <ul className="list-group todo-list">{elements}</ul>;
};

export default SetItems;
