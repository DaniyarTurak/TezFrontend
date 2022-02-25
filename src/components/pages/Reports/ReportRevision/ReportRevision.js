import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Button from "@material-ui/core/Button";
import Alert from "react-s-alert";
import Grid from "@material-ui/core/Grid";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import { makeStyles } from "@material-ui/core/styles";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import AutocompleteSelect from "../../../ReusableComponents/AutocompleteSelect";
import RevisionTable from "./RevisionTable";
import RevisionTableDetails from "./RevisionTableDetails";

import "moment/locale/ru";
Moment.locale("ru");

const useStyles = makeStyles((theme) => ({
  notFound: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: ".875rem",
  },
  button: {
    minHeight: "3.5rem",
    fontSize: ".875rem",
    textTransform: "none",
  },
  tableRow: {
    hover: {
      "&$hover:hover": {
        backgroundColor: "#49bb7b",
      },
    },
  },
  label: {
    fontSize: ".875rem",
    fontWeight: "bold",
  },
}));

export default function ReportRevision({ companyProps }) {
  const classes = useStyles();
  const [ascending, setAscending] = useState(true);
  const [dateRev, setDateRev] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState("");
  const [points, setPoints] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [revisionDetails, setRevisionDetails] = useState({});
  const [username, setUsername] = useState("");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [parametr, setParametr] = useState(1);
  const [revtype, setRevtype] = useState(1);
  const [revtypeName, setRevtypeName] = useState("По всем товарам");
  const [revnumber, setRevnumber] = useState("");

  const company = companyProps ? companyProps.value : "";
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-user-data")) || {};

  useEffect(() => {
    if (company) {
      getPoints();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (revnumber !== "") {
      getRevisionDetails(revnumber);
    }
  }, [onlyDiff, parametr]);

  const clean = () => {
    setPoint("");
    setRevisions([]);
    setRevisionDetails({});
    setOrderBy("");
    setAscending(true);
    setDateRev("");
    setUsername("");
  };

  useEffect(() => {
    getPoints();
  }, []);

  const getPoints = () => {
    setLoading(true);
    Axios.get("/api/point/revision", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const pointsChanged = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints(pointsChanged);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const orderByFunction = (ob) => {
    let revisionsChanged = revisions;
    let ascendingChanged = ascending;
    let prevOrderBy = orderBy;

    prevOrderBy === ob
      ? (ascendingChanged = !ascendingChanged)
      : (ascendingChanged = true);

    revisionsChanged.sort((a, b) => {
      let textA = parseFloat(a[ob]) || a[ob];
      let textB = parseFloat(b[ob]) || b[ob];

      let res = ascendingChanged
        ? textA < textB
          ? -1
          : textA > textB
          ? 1
          : 0
        : textB < textA
        ? -1
        : textB > textA
        ? 1
        : 0;
      return res;
    });
    setRevisions(revisionsChanged);
    setOrderBy(ob);
    setAscending(ascendingChanged);
  };

  const pointsChange = (event, p) => {
    setPoint(p);
    if (p.value) {
      setLoading(true);
      getRevisions(p.value);
    }
  };

  const handleSearch = () => {
    if (!point.value) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setLoading(true);
    getRevisions(point.value);
  };

  const getRevisions = (pointid) => {
    Axios.get("/api/report/revision", {
      params: { pointid, company },
    })
      .then((res) => res.data)
      .then((res) => {
        setRevisions(res);
        if (res.length > 0) {
          setUsername(res[0].username);
          setDateRev(Moment(res[0].submitdate).format("DD.MM.YYYY"));
        }
        setRevisionDetails({});
        setLoading(false);
        setOrderBy("");
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const handleDetails = (revisionnumber) => {
    getRevisionDetails(revisionnumber);
    setRevnumber(revisionnumber);
    setLoading(true);
  };

  const getRevisionDetails = (revisionnumber) => {
    Axios.get("/api/report/revision/details", {
      params: {
        revisionnumber: revisionnumber,
        parametr,
        onlyDiff: onlyDiff ? 1 : 0,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setRevisionDetails(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const backToList = () => {
    setRevisionDetails({});
  };

  const getReportExcel = () => {
    // excelDetails = [{}] -> нужен для того чтобы в результате excel файла все столбцы с цифрами были number.
    let excelDetails = revisionDetails.map((detail) => {
      return {
        barcode: detail.barcode,
        product: detail.product,
        attrvalue: detail.attrvalue,
        unitswas: parseFloat(detail.unitswas, 0),
        units: parseFloat(detail.units, 0),
        unitprice: parseFloat(detail.unitprice, 0),
        unitsTotalAmount:
          parseFloat(detail.unitprice) * parseFloat(detail.units), // результат ревизии в шт.
        unitsResAmount: detail.units - detail.unitswas, // результат ревизии в шт.
        unitsResPrice: (detail.units - detail.unitswas) * detail.unitprice, //результат ревизии в тг.
        date: Moment(detail.date).format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    let revisorData = `Компания: "${companyData.companyname}", торговая точка: "${point.label}", ревизор ${username}, дата проведения: "${dateRev}".`;

    Axios({
      method: "POST",
      url: "/api/report/revision/excel",
      data: { excelDetails, revisorData, company },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((revisionExcel) => {
        const url = window.URL.createObjectURL(new Blob([revisionExcel]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Ревизия ${username} от ${dateRev}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getDifferenceExcel = () => {
    Axios.get("/api/report/revision/excel_difference", {
      responseType: "blob",
      params: { point: point.value, dateRev, company },
    })
      .then((res) => res.data)
      .then((differenceList) => {
        if (differenceList.size === 2) {
          return Alert.warning("Товары, не прошедшие ревизию, отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        const url = window.URL.createObjectURL(new Blob([differenceList]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Товары, не прошедшие ревизию.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <AutocompleteSelect
          value={point}
          onChange={pointsChange}
          options={points}
          noOptions="Торговая точка не найдена"
          label="Торговая точка"
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={handleSearch}
          disabled={isLoading}
        >
          Показать Ревизии
        </Button>
      </Grid>
      <Grid item xs={6} />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && !point && revisions.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Выберите торговую точку</p>
        </Grid>
      )}

      {!isLoading && point && revisions.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            Ревизии по данной точке отсутствуют
          </p>
        </Grid>
      )}

      {!isLoading &&
        revisions.length > 0 &&
        revisionDetails.length === undefined && (
          <RevisionTable
            classes={classes}
            orderByFunction={orderByFunction}
            ascending={ascending}
            orderBy={orderBy}
            revisions={revisions}
            handleDetails={handleDetails}
            getReportExcel={getReportExcel}
            setRevtype={setRevtype}
            setRevtypeName={setRevtypeName}
          />
        )}

      {!isLoading && revisionDetails.length >= 0 && (
        <RevisionTableDetails
          classes={classes}
          username={username}
          dateRev={dateRev}
          backToList={backToList}
          revisionDetails={revisionDetails}
          getDifferenceExcel={getDifferenceExcel}
          revnumber={revnumber}
          parametr={parametr}
          setParametr={setParametr}
          onlyDiff={onlyDiff}
          setOnlyDiff={setOnlyDiff}
          getRevisionDetails={getRevisionDetails}
          revtype={revtype}
          revtypeName={revtypeName}
        />
      )}
    </Grid>
  );
}
