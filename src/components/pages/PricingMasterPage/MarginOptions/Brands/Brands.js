import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import ExistingMargins from "../ExistingMargins";
import MarginAlerts from "../MarginAlerts";
import BrandOptions from "./BrandOptions";

export default function Brands({ classes }) {
  const [brandList, setBrandList] = useState([]);
  const [isMarginLoading, setMarginLoading] = useState(false);

  useEffect(() => {
    getActiveMargins();
  }, []);

  const getActiveMargins = () => {
    setMarginLoading(true);
    Axios.get("/api/margin/info", {
      params: { type: 2 },
    })
      .then((res) => res.data)
      .then((res) => {
        setMarginLoading(false);
        setBrandList(res);
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
        <BrandOptions classes={classes} getActiveMargins={getActiveMargins} />
        <Grid item xs={12}>
          <ExistingMargins
            getActiveMargins={getActiveMargins}
            classes={classes}
            list={brandList}
            type={2}
            isMarginLoading={isMarginLoading}
          />
        </Grid>
      </Grid>
    </div>
  );
}
