import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import ExistingMargins from "../ExistingMargins";
import MarginAlerts from "../MarginAlerts";
import ProductOptions from "./ProductOptions";

export default function Products({ classes }) {
  const [productList, setProductList] = useState([]);
  const [isMarginLoading, setMarginLoading] = useState(false);

  useEffect(() => {
    getActiveMargins();
  }, []);

  const getActiveMargins = () => {
    setMarginLoading(true);
    Axios.get("/api/margin/info", {
      params: { type: 3 },
    })
      .then((res) => res.data)
      .then((res) => {
        setProductList(res);
        setMarginLoading(false);
      })
      .catch((err) => {
        setMarginLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <div className={classes.option}>
      <Grid container spacing={3}>
        <MarginAlerts />
        <ProductOptions classes={classes} getActiveMargins={getActiveMargins} />

        <ExistingMargins
          getActiveMargins={getActiveMargins}
          list={productList}
          type={3}
          classes={classes}
          isMarginLoading={isMarginLoading}
        />
      </Grid>
    </div>
  );
}
