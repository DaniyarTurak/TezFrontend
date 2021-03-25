import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import ExistingMargins from "../ExistingMargins";
import MarginAlerts from "../MarginAlerts";
import CategoryOptions from "./CategoryOptions";

export default function Categories({ classes }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isMarginLoading, setMarginLoading] = useState(false);

  useEffect(() => {
    getActiveMargins();
  }, []);

  const getActiveMargins = () => {
    setMarginLoading(true);
    Axios.get("/api/margin/info", {
      params: { type: 1 },
    })
      .then((res) => res.data)
      .then((res) => {
        setMarginLoading(false);
        setCategoryList(res);
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
        <CategoryOptions
          classes={classes}
          getActiveMargins={getActiveMargins}
        />
        <Grid item xs={12}>
          <ExistingMargins
            getActiveMargins={getActiveMargins}
            list={categoryList}
            type={1}
            classes={classes}
            isMarginLoading={isMarginLoading}
          />
        </Grid>
      </Grid>
    </div>
  );
}
