import React, { useState } from "react";
import ReportStockBalance from "../ReportStockBalance";
import ReportStockBalanceSimple from "../ReportStockBalanceSimple";

const ReportStockBalanceParent = ({ history, location }) => {
  const [extended, setExtended] = useState(false);

  const pageChange = () => {
    setExtended(!extended);
  };

  if (extended) {
    return (
      <ReportStockBalance
        history={history}
        location={location}
        pageChange={pageChange}
      />
    );
  } else {
    return (
      <ReportStockBalanceSimple
        history={history}
        location={location}
        pageChange={pageChange}
      />
    );
  }
};

export default ReportStockBalanceParent;
