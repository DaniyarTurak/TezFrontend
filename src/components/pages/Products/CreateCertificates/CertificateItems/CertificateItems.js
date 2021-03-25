import React from "react";

import AddCertificateItem from "../AddCertificateItem";
import "./certificate-items.sass";

const CertificateItems = ({
  balanceList,
  certificateItems,
  handleDeletePoint,
  onBalanceChange,
  onPointChange,
  onQuantityChange,
  points,
}) => {
  const elements = certificateItems.map((item) => {
    const { id, value, point, balance, ...itemProps } = item;
    const disableDelete = item.id === 100 ? false : true;
    return (
      <li key={id} className="lists">
        <AddCertificateItem
          {...itemProps}
          disableDelete={disableDelete}
          handleDeletePoint={() => handleDeletePoint(id)}
          point={item.point}
          balance={item.balance}
          balanceList={balanceList}
          points={points}
          item={item.value}
          onBalanceChange={(balance) => onBalanceChange(id, balance)}
          onPointChange={(point) => onPointChange(id, point)}
          onQuantityChange={(e) => onQuantityChange(id, e)}
        />
      </li>
    );
  });

  return <ul className="list-group todo-list">{elements}</ul>;
};

export default CertificateItems;
