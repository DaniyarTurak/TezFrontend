import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import _ from "lodash";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import SalesPlanTeamOptions from "./SalesPlanTeamOptions";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  notFound: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: ".875rem",
  },
  tableRow: {
    hover: {
      "&$hover:hover": {
        backgroundColor: "#49bb7b",
      },
    },
  },
  label: {
    color: "orange",
    fontSize: ".875rem",
  },
  invoiceOptions: {
    fontSize: ".875rem",
  },
  button: {
    minHeight: "3.5rem",
    fontSize: ".875rem",
    textTransform: "none",
  },
  buttonGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

export default function ReportSalesPlanTeam({ companyProps, holding }) {
  const classes = useStyles();
  const [bonusResult, setBonusResult] = useState([]);
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
  const [indBonusResult, setIndBonusResult] = useState([]);
  const [indBonusResultRowspan, setIndBonusResultRowspan] = useState("");
  const [points, setPoints] = useState([]);
  const [point, setPoint] = useState("");
  const [totalAward, setTotalAward] = useState(0);
  const [uniqueSold, setUniqueSold] = useState([]);
  const [type, setType] = useState(1);
  const [planType, setPlanType] = useState({ value: 1, label: "Ежедневный" });

  const company = JSON.parse(sessionStorage.getItem("isme-user-data"))
    ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
    : "";
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");

  useEffect(() => {
    getPoints();
  }, []);

  useEffect(() => {
    clean();
  }, [planType.value]);

  useEffect(() => {
    getPoints();
  }, [companyProps]);

  const clean = () => {
    setBonusResult([]);
    // setDateFrom(Moment().startOf("month").format("YYYY-MM-DD"));
    // setDateTo(Moment().format("YYYY-MM-DD"));
    setIndBonusResult([]);
    setIndBonusResultRowspan("");
    setTotalAward(0);
    setUniqueSold([]);
  };

  const getPoints = () => {
    let pointService = holding === false ? "/api/point" : "/api/point/holding";
    Axios.get(pointService, { params: { company: companyProps.value } })
      .then((res) => res.data)
      .then((res) => {
        const pointsChanged = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });
        setPoints(pointsChanged);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const checkDateRange = () => {
    const dateFromVal = new Date(dateFrom);
    const dateFromPlusThree = dateFromVal.setMonth(dateFromVal.getMonth() + 3);
    const dateToVal = new Date(dateTo);
    return dateFromPlusThree >= dateToVal ? true : false;
  };

  const dateFromChange = (e) => {
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
  };

  const handleQuarter = (date) => {
    setDateFrom(Moment(date).startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment(date).startOf("month").add(3, "M").format("YYYY-MM-DD"));
  };

  const handleYear = (date) => {
    setDateFrom(Moment(date).startOf("year").format("YYYY-MM-DD"));
    setDateTo(Moment(date).startOf("year").add(12, "M").format("YYYY-MM-DD"));
  };

  const resetDate = () => {
    setDateFrom(Moment().startOf("month").format("YYYY-MM-DD"));
    setDateTo(Moment().format("YYYY-MM-DD"));
  };

  const onPointChange = (event, p) => {
    if (!checkDateRange()) {
      return Alert.warning("Максимальный период 3 месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setPoint(p);
    // resetDate();
  };

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const changePlanDate = (t) => {
    let holdingChanged = holding;
    let pointChanged = point.value;

    if (!pointChanged) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    if (!holdingChanged) {
      holdingChanged = false;
      pointChanged = [pointChanged];
    }
    resetDate();

    if (t === 3) {
      setDateFrom(Moment().startOf("quarter").format("YYYY-MM-DD"));
      setDateTo(Moment().startOf("quarter").add(3, "M").format("YYYY-MM-DD"));
    }

    if (t === 4) {
      setDateFrom(Moment().startOf("year").format("YYYY-MM-DD"));
      setDateTo(Moment().startOf("year").add(12, "M").format("YYYY-MM-DD"));
    }
    setType(t);
  };

  const handleSearch = () => {
    if (point === "") {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    else {
      if ((planType.value === 1 || planType.value === 2) && !checkDateRange()) {
        return Alert.warning("Максимальный период 3 месяца", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      } else 
      // if (
      //   planType.value === 2 &&
      //   ((Moment().month() !== Moment(dateTo).month() &&
      //     dateTo !== Moment(dateTo).startOf("month").format("YYYY-MM-DD")) ||
      //     (Moment().month() !== Moment(dateFrom).month() &&
      //       dateFrom !== Moment(dateFrom).startOf("month").format("YYYY-MM-DD")))
      // ) {
      //   return Alert.warning("Выберите 1-ое число месяца", {
      //     position: "top-right",
      //     effect: "bouncyflip",
      //     timeout: 3000,
      //   });
      // }
      setLoading(true);
      let path = "";
      switch (planType.value) {
        case 1:
          path = `/daily`
          break;
        case 2:
          path = `/monthly`
          break;
        case 3:
          path = `/quarterly`
          break;
        default:
          break;
      }
      Axios.get(`/api/report/salesplan/team${path}`, {
        params: {
          dateFrom,
          dateTo,
          company: company.value,
          holding,
          type: planType.value,
          point: point.value,
        },
      })
        .then((res) => res.data)
        .then((response) => {
          const uniqueSoldChanged = response.filter(
            (bonus, index, self) =>
              index ===
              self.findIndex((t) => t.dat === bonus.dat && t.sold === bonus.sold)
          );

          const totalAwardChanged = response.reduce((prev, cur) => {
            return prev + parseFloat(cur.each_award);
          }, 0);

          const indBonusResultTemp = _.mapValues(
            _.groupBy(response, "name"),
            (list) => list.map((st) => _.omit(st, "name"))
          );
          const indBonusResultChanged = Object.keys(indBonusResultTemp).map(
            (key) => {
              return {
                user: key,
                award: indBonusResultTemp[key],
              };
            }
          );

          const bonusResultTemp = _.mapValues(
            _.groupBy(response, "dat"),
            (list) => list.map((st) => _.omit(st, "dat"))
          );
          const bonusResultChanged = Object.keys(bonusResultTemp).map((key) => {
            return {
              dat: key,
              rowSpan: bonusResultTemp[key].length,
              users: bonusResultTemp[key],
            };
          });

          indBonusResultChanged.sort(function (a, b) {
            var textA = a.user.toUpperCase();
            var textB = b.user.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          });

          // resetDate();
          setUniqueSold(uniqueSoldChanged);
          setTotalAward(totalAwardChanged);
          setBonusResult(bonusResultChanged);
          setIndBonusResult(indBonusResultChanged);
          setIndBonusResultRowspan(indBonusResultChanged.length);
          setLoading(false);
        })
        .catch((err) => {
          ErrorAlert(err);
          setLoading(false);
        });
    }
  };

  return (
    <Grid container spacing={3}>
      <SalesPlanTeamOptions
        changeDate={changeDate}
        changePlanDate={changePlanDate}
        classes={classes}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        handleSearch={handleSearch}
        handleQuarter={handleQuarter}
        handleYear={handleYear}
        onPointChange={onPointChange}
        point={point}
        points={points}
        planType={planType}
        setPlanType={setPlanType}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && !point && bonusResult.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Выберите торговую точку</p>
        </Grid>
      )}

      {!isLoading && point && bonusResult.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && bonusResult.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table
              className="table table-bordered table-tfoot"
              id="table-to-xls"
            >
              <thead
                style={{
                  display: "none",
                }}
              >
                <tr>
                  <td className="text-center font-weight-bold">
                    Отчет по командным бонусам
                  </td>
                  <td colSpan="2"></td>
                </tr>
                <tr></tr>
                <tr>
                  <td className="text-center font-weight-bold">Компания:</td>
                  <td colSpan="2">{company}</td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">
                    Торговая точка:
                  </td>
                  <td colSpan="2">{point.label}</td>
                </tr>
                <tr>
                  <th className="text-center font-weight-bold">За период:</th>
                  <td colSpan="2">
                    {Moment(dateFrom).format("DD.MM.YYYY HH:mm:ss")} -{" "}
                    {Moment(dateTo).format("DD.MM.YYYY HH:mm:ss")}
                  </td>
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">
                    Время формирования отчёта:
                  </td>
                  <td colSpan="2">{now}.</td>
                </tr>
                <tr>
                  <td colSpan="9" style={{ height: "30px" }}></td>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th style={{ width: "2%" }}></th>
                  <th style={{ width: "5%" }}>Дата</th>
                  <th style={{ width: "10%" }}>Ежедневный план продаж</th>
                  <th style={{ width: "10%" }}>Сумма продаж</th>
                  <th style={{ width: "10%" }}>Сумма бонусов</th>
                  <th style={{ width: "15%" }}>Пользователь</th>
                  <th style={{ width: "10%" }}>Индивидуальная сумма</th>
                </tr>
              </thead>
              <tbody>
                {bonusResult.map((bonus, idx) => (
                  <Fragment key={idx}>
                    <tr>
                      <td rowSpan={bonus.rowSpan}>{idx + 1}</td>
                      <td rowSpan={bonus.rowSpan}>
                        {Moment(bonus.date).format("DD-MM-YYYY")}
                      </td>
                      <td rowSpan={bonus.rowSpan} className="tenge">
                        {bonus.users[0].plan.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td rowSpan={bonus.rowSpan} className="tenge">
                        {bonus.users[0].sold.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td rowSpan={bonus.rowSpan} className="tenge">
                        {parseFloat(
                          bonus.users[0].total_award
                        ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                      </td>
                      <td>{bonus.users[0].name}</td>
                      <td className="tenge">
                        {parseFloat(
                          bonus.users[0].each_award
                        ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {bonus.users.slice(1).map((bn, idx) => (
                      <tr key={idx}>
                        <td>{bn.name}</td>
                        <td className="tenge">
                          {parseFloat(bn.each_award).toLocaleString("ru", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td rowSpan={indBonusResultRowspan} colSpan="3">
                    Итого
                  </td>
                  <td rowSpan={indBonusResultRowspan} className="tenge">
                    {uniqueSold
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.sold);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td rowSpan={indBonusResultRowspan} className="tenge">
                    {parseFloat(totalAward).toLocaleString("ru", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{indBonusResult[0].user}</td>
                  <td className="tenge">
                    {indBonusResult[0].award
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.each_award);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                </tr>

                {indBonusResult.slice(1).map((indbonus, idx) => (
                  <tr key={idx}>
                    <td>{indbonus.user}</td>
                    <td className="tenge">
                      {indbonus.award
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.each_award);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Командный бонус ${point.label} c ${Moment(
                dateFrom
              ).format("DD.MM.YYYY")} по ${Moment(dateTo).format(
                "DD.MM.YYYY"
              )}`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
          </div>
        </div>
      )}
    </Grid>
  );
}
