import React, { Component, Fragment } from "react";
import Axios from "axios";
import Moment from "moment";
import _ from "lodash";
import Select from "react-select";
import Searching from "../../../Searching";
import Alert from "react-s-alert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import DatePickerQuarter from "./DatePickerQuarter";
import DatePickerYear from "./DatePickerYear";
import "./report-sales-plan-team.sass";

export default class ReportSalesPlanTeam extends Component {
  state = {
    bonusResult: [],
    dateFrom: Moment().startOf("month").format("YYYY-MM-DD"),
    dateTo: Moment().format("YYYY-MM-DD"),
    indBonusResult: [],
    indBonusResultRowspan: "",
    points: [],
    point: "",
    quarter: "",
    quarters: ["1", "2", "3", "4"],
    totalAward: 0,
    uniqueSold: [],
    year: Moment().year(),
    type: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.type !== this.state.type) {
      this.clean();
    }
    if (prevProps.company !== this.props.company) {
      this.getPoints();
    }
  }

  clean = () => {
    this.setState({
      bonusResult: [],
      dateFrom: Moment().startOf("month").format("YYYY-MM-DD"),
      dateTo: Moment().format("YYYY-MM-DD"),
      indBonusResult: [],
      indBonusResultRowspan: "",
      quarter: "",
      quarters: ["1", "2", "3", "4"],
      totalAward: 0,
      uniqueSold: [],
      year: Moment().year(),
    });
  };
  componentDidMount() {
    this.getPoints();
  }

  getPoints = () => {
    let holding = this.props.holding;
    let company = this.props.company.value;
    let pointService = holding === false ? "/api/point" : "/api/point/holding";

    Axios.get(pointService, { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const points = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });

        this.setState({ points });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkDateRange = () => {
    const dateFromVal = new Date(this.state.dateFrom);
    const dateFromPlusThree = dateFromVal.setMonth(dateFromVal.getMonth() + 3);
    const dateToVal = new Date(this.state.dateTo);
    return dateFromPlusThree >= dateToVal ? true : false;
  };

  dateFromChange = (e) => {
    const dateFrom = e.target.value;
    this.setState({ dateFrom });
  };

  dateToChange = (e) => {
    const dateTo = e.target.value;
    this.setState({ dateTo });
  };

  handleQuarter = (date) => {
    this.setState({
      dateFrom: Moment(date).startOf("month").format("YYYY-MM-DD"),
      dateTo: Moment(date).startOf("month").add(3, "M").format("YYYY-MM-DD"),
    });
  };

  handleYear = (date) => {
    this.setState({
      dateFrom: Moment(date).startOf("year").format("YYYY-MM-DD"),
      dateTo: Moment(date).startOf("year").add(12, "M").format("YYYY-MM-DD"),
    });
  };

  resetDate = () => {
    this.setState({
      dateFrom: Moment().startOf("month").format("YYYY-MM-DD"),
      dateTo: Moment().format("YYYY-MM-DD"),
    });
  };

  pointsChange = (point) => {
    if (!this.checkDateRange()) {
      return Alert.warning("Максимальный период 3 месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    this.setState({ point });
    this.resetDate();
  };

  // quarterChange = (quarter) => {
  //   this.setState({ quarter });
  // };

  changeDate = (dateStr) => {
    let dateFrom, dateTo;
    if (dateStr === "today") {
      dateFrom = Moment().format("YYYY-MM-DD");
      dateTo = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dateFrom = Moment().startOf("month").format("YYYY-MM-DD");
      dateTo = Moment().format("YYYY-MM-DD");
    }

    this.setState({ dateFrom, dateTo, isLoading: false }, () => {
      this.handleSearch();
    });
  };

  changePlanDate = (type) => {
    let holding = this.props.holding;
    let company = this.props.company.value;

    let point = this.state.point.value;

    if (!point) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    if (!holding) {
      holding = false;
      point = [point];
    }
    this.resetDate();

    if (type === 3) {
      this.setState({
        dateFrom: Moment().startOf("quarter").format("YYYY-MM-DD"),
        dateTo: Moment().startOf("quarter").add(3, "M").format("YYYY-MM-DD"),
      });
    }

    if (type === 4) {
      this.setState({
        dateFrom: Moment().startOf("year").format("YYYY-MM-DD"),
        dateTo: Moment().startOf("year").add(12, "M").format("YYYY-MM-DD"),
      });
    }

    this.setState({ company, holding, type });
  };

  handleSearch = () => {
    const { dateFrom, dateTo, type } = this.state;
    const { company, holding } = this.props;
    let point = this.state.point.value;

    if ((type === 1 || type === 2) && !this.checkDateRange()) {
      return Alert.warning("Максимальный период 3 месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else if (
      type === 2 &&
      ((Moment().month() !== Moment(dateTo).month() &&
        dateTo !== Moment(dateTo).startOf("month").format("YYYY-MM-DD")) ||
        (Moment().month() !== Moment(dateFrom).month() &&
          dateFrom !== Moment(dateFrom).startOf("month").format("YYYY-MM-DD")))
    ) {
      return Alert.warning("Выберите 1-ое число месяца", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    // if(type===4){
    //   this.setState({ dateFrom: Moment().startOf("year").format("YYYY-MM-DD"),
    //   dateTo: Moment().startOf("year").add(11, "M").format("YYYY-MM-DD"),})
    // }

    Axios.get("/api/report/salesplan/team/list", {
      params: {
        dateFrom,
        dateTo,
        company: company.value,
        holding,
        type,
        point,
      },
    })
      .then((res) => res.data)
      .then((response) => {
        const uniqueSold = response.filter(
          (bonus, index, self) =>
            index ===
            self.findIndex((t) => t.dat === bonus.dat && t.sold === bonus.sold)
        );

        const totalAward = response.reduce((prev, cur) => {
          return prev + parseFloat(cur.each_award);
        }, 0);

        const indBonusResultTemp = _.mapValues(
          _.groupBy(response, "name"),
          (list) => list.map((st) => _.omit(st, "name"))
        );
        const indBonusResult = Object.keys(indBonusResultTemp).map((key) => {
          return {
            user: key,
            award: indBonusResultTemp[key],
          };
        });

        const bonusResultTemp = _.mapValues(
          _.groupBy(response, "dat"),
          (list) => list.map((st) => _.omit(st, "dat"))
        );
        const bonusResult = Object.keys(bonusResultTemp).map((key) => {
          return {
            dat: key,
            rowSpan: bonusResultTemp[key].length,
            users: bonusResultTemp[key],
          };
        });

        indBonusResult.sort(function (a, b) {
          var textA = a.user.toUpperCase();
          var textB = b.user.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        this.resetDate();
        this.setState({
          uniqueSold,
          totalAward,
          bonusResult,
          indBonusResult,
          indBonusResultRowspan: indBonusResult.length,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const {
      bonusResult,
      dateFrom,
      dateTo,
      indBonusResult,
      indBonusResultRowspan,
      isLoading,
      points,
      point,
      totalAward,
      type,
      uniqueSold,
    } = this.state;
    const company = JSON.parse(sessionStorage.getItem("isme-user-data"))
      ? JSON.parse(sessionStorage.getItem("isme-user-data")).companyname
      : "";
    const now = Moment().format("DD.MM.YYYY HH:mm:ss");
    return (
      <div className="report-sales-plan">
        <div className="row">
          <div className="col-md-3 point-block">
            <label htmlFor="">Торговая точка</label>
            <Select
              value={point}
              name="point"
              onChange={this.pointsChange}
              noOptionsMessage={() => "Выберите торговую точку из списка"}
              options={points}
              placeholder="Выберите торговую точку"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 today-btn">
            <button
              className={`btn btn-block mt-30 ${
                type === 1 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => this.changePlanDate(1)}
            >
              Ежедневный план
            </button>
          </div>
          <div className="col-md-3 month-btn">
            <button
              className={`btn btn-block mt-30 ${
                type === 2 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => this.changePlanDate(2)}
            >
              Ежемесячный план
            </button>
          </div>
          <div className="col-md-3 month-btn">
            <button
              className={`btn btn-block mt-30 ${
                type === 3 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => this.changePlanDate(3)}
            >
              Ежеквартальный план
            </button>
          </div>
          <div className="col-md-3 month-btn">
            <button
              className={`btn btn-block mt-30 ${
                type === 4 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => this.changePlanDate(4)}
            >
              Ежегодный план
            </button>
          </div>
        </div>
        {(type === 1 || type === 2) && (
          <div className="row">
            <div className="col-md-3 today-btn">
              <button
                className="btn btn-block btn-outline-success mt-30"
                onClick={() => this.changeDate("today")}
              >
                Сегодня
              </button>
            </div>
            <div className="col-md-3 month-btn">
              <button
                className="btn btn-block btn-outline-success mt-30"
                onClick={() => this.changeDate("month")}
              >
                Текущий месяц
              </button>
            </div>
            <div className="col-md-2">
              <label htmlFor="">Дата с</label>
              <input
                type="date"
                value={dateFrom}
                className="form-control"
                name="dateFrom"
                onChange={this.dateFromChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Дата по</label>
              <input
                type="date"
                value={dateTo}
                className="form-control"
                name="dateTo"
                onChange={this.dateToChange}
              />
            </div>
            <div className="col-md-2 today-btn">
              <button
                className="btn btn-block btn-outline-success mt-30"
                onClick={() => this.handleSearch()}
              >
                поиск
              </button>
            </div>
          </div>
        )}

        {type === 3 && (
          <div className="row">
            <DatePickerQuarter handleQuarter={this.handleQuarter} />

            <div className="col-md-2 today-btn">
              <button
                className="btn btn-block btn-outline-success mt-30"
                onClick={() => this.handleSearch()}
              >
                поиск
              </button>
            </div>
          </div>
        )}

        {type === 4 && (
          <div className="row">
            <DatePickerYear handleYear={this.handleYear} />

            <div className="col-md-2 today-btn">
              <button
                className="btn btn-block btn-outline-success mt-30"
                onClick={() => this.handleSearch()}
              >
                поиск
              </button>
            </div>
          </div>
        )}

        {isLoading && <Searching />}

        {!isLoading && !point && bonusResult.length === 0 && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              Выберите торговую точку
            </div>
          </div>
        )}

        {!isLoading && point && bonusResult.length === 0 && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              С выбранными фильтрами ничего не найдено
            </div>
          </div>
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
      </div>
    );
  }
}
