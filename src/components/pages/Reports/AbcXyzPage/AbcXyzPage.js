import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import alert from "react-s-alert";
import ReportTable from "./ReportTable";
import ReportOptions from "./ReportOptions";
import ReportOptionsABCXYZ from "./ReportOptionsABCXYZ";
import Box from "@material-ui/core/Box";
import AccordionAlert from "../../../ReusableComponents/AccordionAlert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  notFound: {
    marginTop: "1rem",
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
  hover: {
    cursor: "pointer",
    color: "#162ece",
    "&:hover": {
      color: "#09135b",
    },
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  heading: {
    display: "flex",
    marginTop: "0.2rem",
    flexDirection: "row",
    flexBasis: "95%",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightRegular,
  },
  secondaryHeading: {
    fontSize: "0.875rem",
    color: "#0d3c61",
    marginLeft: "2rem",
  },
  thirdHeading: {
    marginTop: "0.2rem",
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
  accordion: {
    backgroundColor: "#e8f4fd",
    fontSize: "0.875rem",
    fontWeight: theme.typography.fontWeightRegular,
  },
  root: {
    justifyContent: "space-between",
    "&$expanded": {
      boxShadow: "0 1px 12px 0 rgba(0,0,0,.11)",
    },
  },
  icon: {
    color: "#35a0f4",
  },
}));

const types = [
  { label: "Ежедневных данных", value: "1" },
  { label: "Еженедельных данных", value: "2" },
  { label: "Ежемесячных данных", value: "3" },
];

const periodsDaily = [
  { label: "90 дней", value: "90" },
  // { label: "180 дней", value: "180" },
  // { label: "360 дней", value: "360" },
];

const periodsWeekly = [
  { label: "13 недель", value: "13" },
  { label: "26 недель", value: "26" },
  { label: "52 недели", value: "52" },
];

const periodsMonthly = [
  { label: "6 месяцев", value: "6" },
  { label: "9 месяцев", value: "9" },
  { label: "12 месяцев", value: "12" },
];

const profitAmounts = [
  { label: "Количество проданных товаров", value: "units" },
  { label: "Валовая прибыль", value: "grossprofit" },
];

export default function AbcXyzPage() {
  const [isLoading, setLoading] = useState(false);
  const [isClicked, setClicked] = useState(`units`);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [isValidationError, setValidationError] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [period, setPeriod] = useState(`12`);
  const [profitAmount, setProfitAmount] = useState(`units`);
  const [point, setPoint] = useState("all");
  const [pointName, setPointName] = useState("Все")
  const [points, setPoints] = useState([])
  const [reports, setReports] = useState([]);
  const [type, setType] = useState(`3`);
  const [abc_a, setAbc_a] = useState(25);
  const [abc_b, setAbc_b] = useState(50);
  const [xyz_x, setXyz_x] = useState(10);
  const [xyz_y, setXyz_y] = useState(25);
  const classes = useStyles();

  useEffect(() => {
    getAbcXyzReport();
    getPointsByCompany();
  }, []);

  const alertWarning = (name) => {
    alert.warning(`Введите ${name}!`, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };

  const getAbcXyzReport = () => {
    if (!period) {
      return alertWarning("Выберите период!");
    } else if (!type) {
      return alertWarning("Выберите тип!");
    } else if (!profitAmount) {
      return alertWarning(
        "Выберите из двух опций: Количество/Валовая прибыль!"
      );
    }

    setLoading(true);

    setClicked(profitAmount);

    const httpClient = Axios.create();

    httpClient.defaults.timeout = 0;

    httpClient
      .get("/api/report/analytics/abc_yxz", {
        params: {
          point: point,
          type: parseInt(type, 0),
          period: parseInt(period, 0),
          profit_amount: profitAmount,
          a: abc_a,
          b: abc_b,
          x: xyz_x,
          y: xyz_y,
        },
      })
      .then((res) => res.data)
      .then((res) => {
        setReports(res);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(JSON.stringify(err));
        setLoading(false);
      });
  };

  let onTypeChange = (event) => {
    setType(event.target.value);
    switch (event.target.value) {
      case "1": { setPeriod("90"); break; }
      case "2": { setPeriod("13"); break; }
      case "3": { setPeriod("12"); break; }
      default: { setPeriod("90"); break; }
    }
  };

  let onPeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  let onProfitAmountChange = (event) => {
    setProfitAmount(event.target.value);
  };

  const getStockbalanceExcel = () => {
    setExcelLoading(true);
    const httpClient = Axios.create();

    httpClient.defaults.timeout = 0;

    httpClient
      .get("/api/report/analytics/abc_xyz_excel", {
        responseType: "blob",
        params: {
          type: parseInt(type, 0),
          period: parseInt(period, 0),
          profit_amount: profitAmount,
          a: abc_a,
          b: abc_b,
          x: xyz_x,
          y: xyz_y,
        },
      })
      .then((res) => res.data)
      .then((stockbalance) => {
        const url = window.URL.createObjectURL(new Blob([stockbalance]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ABC_XYZ_${pointName}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        setExcelLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setExcelLoading(false);
        ErrorAlert(err);
      });
  };

  const getDetailsExcel = () => {
    setExcelLoading(true);
    const httpClient = Axios.create();

    httpClient.defaults.timeout = 0;

    httpClient
      .get("/api/report/analytics/details_excel", {
        responseType: "blob",
        params: {
          pointname: pointName,
          type: parseInt(type, 0),
          period: parseInt(period, 0),
          profit_amount: profitAmount,
          a: abc_a,
          b: abc_b,
          x: xyz_x,
          y: xyz_y,
        },
      })
      .then((res) => res.data)
      .then((stockbalance) => {
        const url = window.URL.createObjectURL(new Blob([stockbalance]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ABC_XYZ_${pointName}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        setExcelLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setExcelLoading(false);
        ErrorAlert(err);
      });
  };

  const onAbc_AChange = (e) => {
    const value = isNaN(e.target.value) ? 0 : e.target.value;
    if (value > 100) {
      return;
    }
    let newVal = isValidationError;
    if (value > abc_b) {
      newVal[0] = true;
      setValidationError([...newVal]);
      alert.warning(`Значение А не может быть больше значения Б!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      newVal[0] = false;
      setValidationError([...newVal]);
    }
    setAbc_a(value);
  };
  const onAbc_BChange = (e) => {
    const value = isNaN(e.target.value) ? 0 : e.target.value;
    if (value > 100) {
      return;
    }
    let newVal = isValidationError;
    if (value < abc_a) {
      newVal[1] = true;
      setValidationError([...newVal]);
      alert.warning(`Значение А не может быть больше значения Б!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      newVal[1] = false;
      setValidationError([...newVal]);
    }
    setAbc_b(value);
  };

  const onXyz_XChange = (e) => {
    const value = isNaN(e.target.value) ? 0 : e.target.value;
    if (value > 100) {
      return;
    }
    let newVal = isValidationError;
    if (value > xyz_y) {
      newVal[2] = true;
      setValidationError([...newVal]);
      alert.warning(`Значение X не может быть больше значения Y!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      newVal[2] = false;
      setValidationError([...newVal]);
    }
    setXyz_x(value);
  };

  const onXyz_YChange = (e) => {
    const value = isNaN(e.target.value) ? 0 : e.target.value;
    if (value > 100) {
      return;
    }
    let newVal = isValidationError;
    if (value < xyz_x) {
      newVal[3] = true;
      setValidationError([...newVal]);
      alert.warning(`Значение X не может быть больше значения Y!`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    } else {
      newVal[3] = false;
      setValidationError([...newVal]);
    }
    setXyz_y(value);
  };

  const getPointsByCompany = () => {
    Axios.get("/api/point")
      .then((res) => res.data)
      .then((res) => {
        let temp = [{ label: "Все", value: "all" }]
        res.forEach(point => {
          if (point.name !== "Центральный склад") {
            temp.push({ value: point.id, label: point.name })
          }
        });
        setPoints(temp);
      })
      .catch((err) => {
        ErrorAlert(JSON.stringify(err));
      });
  };

  const pointChange = (e, value) => {
    setPointName(value.props.children);
    setPoint(e.target.value);
  }

  return (
    <Box>
      <ReportOptions
        type={type}
        types={types}
        period={period}
        periodsDaily={periodsDaily}
        periodsWeekly={periodsWeekly}
        periodsMonthly={periodsMonthly}
        classes={classes}
        getAbcXyzReport={getAbcXyzReport}
        onTypeChange={onTypeChange}
        onPeriodChange={onPeriodChange}
        profitAmount={profitAmount}
        profitAmounts={profitAmounts}
        onProfitAmountChange={onProfitAmountChange}
        point={point}
        points={points}
        pointChange={pointChange}
      />
      <ReportOptionsABCXYZ
        isValidationError={isValidationError}
        abc_a={abc_a}
        abc_b={abc_b}
        onAbc_AChange={onAbc_AChange}
        onAbc_BChange={onAbc_BChange}
        xyz_x={xyz_x}
        xyz_y={xyz_y}
        onXyz_XChange={onXyz_XChange}
        onXyz_YChange={onXyz_YChange}
        getAbcXyzReport={getAbcXyzReport}
      />
      <Grid container spacing={3} justify="center" alignItems="center" style={{ paddingTop: "20px" }}>
        <button
          className="btn btn-success"
          disabled={isValidationError.some((isError) => isError) || isLoading}
          onClick={getAbcXyzReport}
        >
          Применить
        </button>
      </Grid>
      <AccordionAlert
        classes={classes}
        text={`Разбивка по категориям АВС зависит от доли товара нарастающим итогом в соответствующем критерии, в продажах в штуках или валовой прибыли.
<br>
Категория A - самые важные товары, приносящие 80% от всех продаж в штуках или валовой прибыли.
Категория B - товары средней важности, приносящие 15% от всех продаж в штуках или валовой прибыли. 
Категория C - менее ценные товары, приносящие 5% от всех продаж в штуках или валовой прибыли.
<br>
Разбивка по категориям XYZ зависит от того, насколько стабильны продажи товара или, другими словами, насколько стабильным спросом пользуется товар, что определяется размером коэффициента вариации продаж за анализируемый период.
<br>
Категория X - товары с устойчивым спросом (коэффициент от 0% до 10%) 
Категория Y - товары с изменчивым спросом (коэффициент от 10% до 25%)
Категория Z - товары со случайным спросом (коэффициент выше 25%)
<br>
Значение Н/Д для коэффициента вариации продаж значит, что продаж по данному товару за весь анализируемый период не было.
<br>
Внимание:
<br>
Отчёт ABC/XYZ строится на основе данных по продажам и наличию товара на складе. Если по товару не было продаж и он отсутствовал на складе каждый день за ВЕСЬ анализируемый период, такой товар не попадет в отчёт. Если же по товару не было продаж, но он был на складе хотя бы ОДИН день из всего анализируемого периода, то он будет включен в отчёт с нулевыми продажами и, соответственно, попадет в категорию С.
<br>
В выгрузке в формате Excel, доступной в самом низу отчёта, Вы можете увидеть разбивку данных, на основании которых был подготовлен данный отчёт. 
<br>
Пустые ячейки в таблице Excel означают, что товар отсутствовал на складе и по нему не было продаж за соответствующий период - для ежемесячных данных за весь конкретный месяц, для еженедельных данных за всю конкретную неделю, для ежедневных данных - за весь конкретный день. 
<br>
Нулевые ячейки в таблице Excel означают, что товар присутствовал на складе, однако продаж по нему за конкретный период не было.`}
        title={` Пояснение к отчёту`}
      />
      {reports.length > 0 && !isLoading ? (
        <ReportTable
          isClicked={isClicked}
          reports={reports}
          getStockbalanceExcel={getStockbalanceExcel}
          getDetailsExcel={getDetailsExcel}
          isExcelLoading={isExcelLoading}
          profitAmount={profitAmount}
        />
      ) : reports.length === 0 && !isLoading ? (
        <div className={classes.notFound}>Данные не найдены</div>
      ) : (
        <Fragment>
          <Grid
            style={{ paddingTop: "10px" }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <span>Формирование отчёта, пожалуйста подождите..</span>

          </Grid>
          <LinearProgress />
        </Fragment>
      )}
    </Box>
  );
}
