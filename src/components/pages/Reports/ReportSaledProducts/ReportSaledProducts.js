import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import SaledProductsTable from "./SaledProductsTable";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import Moment from "moment";

const useStyles = makeStyles((theme) => ({
  notFound: { textAlign: "center", color: theme.palette.text.secondary },
  hover: {
    cursor: "pointer",
    color: "#162ece",
    "&:hover": {
      color: "#09135b",
    },
  },
}));

export default function ReportSaledProducts({ companyProps }) {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    getTableData();
  }, [company]);

  const getTableData = () => {
    Axios.get("/api/report/stockbalance/saledproducts")
      .then((res) => res.data)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <SaledProductsTable classes={classes} products={products} />
      </Grid>

      {/* <Grid item xs={12}>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={postProductsPeriodExcel}
            >
              Выгрузить в excel
            </button>
          </Grid> */}
    </Fragment>
  );
}
