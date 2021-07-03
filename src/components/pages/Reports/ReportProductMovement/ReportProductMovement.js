import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import MovementOptions from "./MovementOptions";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import Alert from "react-s-alert";
import _ from "lodash";
import MovementDetailsNew from "./MovementDetailsNew";
import MovementDetailsTable from "./MovementDetailsTable";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  notFound: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: ".875rem",
  },
  label: { fontWeight: "bold", fontSize: ".875rem" },
}));

export default function ReportProductMovement({ company, parameters }) {
  const classes = useStyles();
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [movementDetails, setMovementDetails] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState("");
  const [unchangedMovementDetails, setUnchangedMovementDetails] = useState("");
  const [points, setPoints] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState("");

  useEffect(
    () => {
      getProducts();
      getPointList();
      if (company) {
        clean();
      }
    },
    company ? [company.value] : []
  );

  //Данный эффект вызывается только при выполнении перехода из консгинационного отчёта по товарам.
  //Нужен чтобы автоматически заполнить все поля и отправить запрос.
  useEffect(() => {
    if (parameters && points.length > 0) {
      setDateFrom(Moment(parameters.date).format("YYYY-MM-DD"));

      points.forEach((e, idx) => {
        if (e.value === parameters.point) {
          setSelectedPoint(e);
          getProductByBarcode(parameters.codename);
        }
      });
      setBarcode(parameters.codename);
    }
  }, [parameters, points]);

  useEffect(() => {
    if (!isDateChanging && barcode && selectedPoint) {
      getProductMovement();
    }
    return () => {
      setDateChanging(false);
    };
  }, [barcode, selectedPoint]);

  const clean = () => {
    setBarcode("");
    setSelectedPoint("");
    setProductSelectValue("");
    setMovementDetails([]);
    setUnchangedMovementDetails([]);
  };

  const getPointList = () => {
    const comp = company ? company.value : "";
    Axios.get("/api/point", { params: { company: comp } })
      .then((res) => res.data)
      .then((list) => {
        const points = list.map((point) => {
          return {
            value: point.id,
            label: point.name,
          };
        });
        setPoints(points);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getProducts = (productName) => {
    const comp = company ? company.value : "";
    setLoadingProducts(true);
    Axios.get("/api/products", {
      params: { productName, company: comp, report: true },
    })
      .then((res) => res.data)
      .then((list) => {
        const products = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });
        setProducts(products);
        setLoadingProducts(false);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const getProductByBarcode = (barcode) => {
    const comp = company ? company.value : "";
    setLoadingProducts(true);
    Axios.get("/api/products/barcode", { params: { barcode, company: comp } })
      .then((res) => res.data)
      .then((product) => {
        const productSelectValue = {
          value: product.id,
          label: product.name,
          code: product.code,
        };
        setLoadingProducts(false);
        setProductSelectValue(productSelectValue);
      })
      .catch((err) => {
        setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const changeDate = (dateStr) => {
    let dateFrom, dateTo;
    if (dateStr === "today") {
      dateFrom = Moment().format("YYYY-MM-DD");
      dateTo = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dateFrom = Moment().startOf("month").format("YYYY-MM-DD");
      dateTo = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dateFrom);
    setDateTo(dateTo);
  };

  const onPointChange = (event, p) => {
    setSelectedPoint(p);
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    if (barcodeChanged) {
      setBarcode(barcodeChanged);
    } else {
      setProductSelectValue("");
      setBarcode("");
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onProductChange = (event, p) => {
    if (!p.code) {
      setProductSelectValue("");
      setBarcode("");
    } else {
      setProductSelectValue(p);
      setBarcode(p.code);
    }
  };

  const onProductListInput = (productName) => {
    if (productName && productName.length > 0) getProducts(productName);
  };

  const handleSearch = () => {
    if (!barcode || !selectedPoint || !dateFrom || !dateTo) {
      return Alert.warning("Заполните все поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    getProductMovement();
  };

  const getProductMovement = () => {
    if (Moment(dateFrom).isBefore("2019-11-25")) {
      return Alert.warning(
        `Дата для запроса слишком старая. Исторические данные доступны, начиная с 25 ноября 2019 года`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    } else setLoading(true);

    const comp = company ? company.value : "";
    Axios.get("/api/report/movement", {
      params: {
        barcode,
        point: selectedPoint.value,
        dateFrom,
        dateTo,
        company: comp,
      },
    })
      .then((res) => res.data)
      .then((movementDetails) => {
        setLoading(false);
        setDateChanging(false);
        let unchangedMovementDetails = _.clone(movementDetails);

        setMovementDetails(movementDetails);
        setUnchangedMovementDetails(unchangedMovementDetails);
      })
      .catch((err) => {
        setDateChanging(false);
        setLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <MovementOptions
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        handleSearch={handleSearch}
        selectedPoint={selectedPoint}
        onPointChange={onPointChange}
        points={points}
        barcode={barcode}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        productSelectValue={productSelectValue}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        products={products}
        isLoadingProducts={isLoadingProducts}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && unchangedMovementDetails.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}
      {isDateChanging && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Нажмите "Поиск"</p>
        </Grid>
      )}
      {!isLoading && !isDateChanging && unchangedMovementDetails.length > 0 && (
        <Fragment>
          <MovementDetailsNew
            classes={classes}
            isDateChanging={isDateChanging}
            movementDetails={movementDetails}
            unchangedMovementDetails={unchangedMovementDetails}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />

          <MovementDetailsTable
            classes={classes}
            dateFrom={dateFrom}
            dateTo={dateTo}
            unchangedMovementDetails={unchangedMovementDetails}
          />
        </Fragment>
      )}
    </Grid>
  );
}
