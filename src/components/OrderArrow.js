import React from "react";

const OrderArrow = ({ ascending }) => {
  return (
    <span style={{ marginLeft: "5px" }}>
      {ascending && <i className="arrow up"></i>}
      {!ascending && <i className="arrow down"></i>}
    </span>
  );
};

export default OrderArrow;
