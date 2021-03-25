import React, { Component } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";

import OrderArrow from "../../../../OrderArrow";
import "moment/locale/ru";
Moment.locale("ru");

export default class RevisionConfirm extends Component {
  state = {
    revisions: [],
    revision: null,
    points: [],
    point: "",
    ascending: true,
    orderBy: "",
    activePage: 1,
    itemsPerPage: 10,
    pageRangeDisplayed: 5,
    currentRange: { first: 0, last: 0 },
    revisorName: "",
    revisionDate: "",
    revisionDetails: {},
    isLoading: true,
    product: "",
    companyData: JSON.parse(sessionStorage.getItem("isme-user-data")) || {},
    userid: "",
  };

  componentDidMount() {
    this.getPoints();

    this.setState({
      currentRange: {
        first:
          this.state.activePage * this.state.itemsPerPage -
          this.state.itemsPerPage,
        last: this.state.activePage * this.state.itemsPerPage - 1,
      },
    });
  }

  getPoints = () => {
    Axios.get("/api/point/revision")
      .then((res) => res.data)
      .then((res) => {
        const points = res.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });

        this.setState({ points, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  orderBy = (orderBy) => {
    let revisions = this.state.revisions;
    let ascending = this.state.ascending;
    let prevOrderBy = this.state.orderBy;

    prevOrderBy === orderBy ? (ascending = !ascending) : (ascending = true);

    revisions.sort((a, b) => {
      let textA = parseFloat(a[orderBy]) || a[orderBy];
      let textB = parseFloat(b[orderBy]) || b[orderBy];

      let res = ascending
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

    this.setState({ revisions, orderBy, ascending, activePage: 1 });
  };

  pointsChange = (point) => {
    this.setState({ point });
    if (point.value) {
      this.setState({ isLoading: true });
      this.getRevisions(point.value);
    }
  };

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber,
      currentRange: {
        first: pageNumber * this.state.itemsPerPage - this.state.itemsPerPage,
        last: pageNumber * this.state.itemsPerPage - 1,
      },
    });
  }

  handleSearch = () => {
    if (!this.state.point.value) {
      return Alert.warning("Выберите торговую точку", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    this.setState({ isLoading: true });
    this.getRevisions(this.state.point.value);
  };

  getRevisions = (pointid) => {
    Axios.get("/api/report/revision/notconfirmed", {
      params: { pointid },
    })
      .then((res) => res.data)
      .then((revisions) => {
        this.setState({
          revisions,
          revisionDetails: {},
          isLoading: false,
          activePage: 1,
          currentRange: {
            first: this.state.itemsPerPage - this.state.itemsPerPage,
            last: this.state.itemsPerPage - 1,
          },
          orderBy: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDetails = (id, username, date) => {
    let dateRev = Moment(date).format("YYYY-MM-DD HH:mm:ss");
    this.getRevisionDetails(id, username, dateRev, date);
    this.setState({ isLoading: true, userid: id });
  };

  getRevisionDetails = (id, username, dateRev, date) => {
    Axios.get("/api/report/revision/details", {
      params: {
        userid: id,
        dateRev,
        submitDate: Moment(date).format("YYYY-MM-DD HH:mm:ss"),
      },
    })
      .then((res) => res.data)
      .then((revisionDetails) => {
        this.setState({ revisionDetails, dateRev, username, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  backToList = () => {
    this.setState({ revisionDetails: {} });
  };

  getReportExcel = () => {
    const {
      revisionDetails,
      username,
      dateRev,
      point,
      companyData,
    } = this.state;

    // excelDetails = [{}] -> нужен для того чтобы в результате excel файла все столбцы с цифрами были number.
    let excelDetails = revisionDetails.map((detail) => {
      return {
        product: detail.product,
        attrvalue: detail.attrvalue,
        unitswas: parseInt(detail.unitswas, 0),
        units: parseInt(detail.units, 0),
        unitprice: parseInt(detail.unitprice, 0),
        unitsResAmount: detail.units - detail.unitswas, // результат ревизии в шт.
        unitsResPrice: (detail.units - detail.unitswas) * detail.unitprice, //результат ревизии в тг.
        date: Moment(detail.date).format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    let revisorData = `Компания: "${companyData.companyname}", торговая точка: "${point.label}", ревизор ${username}, дата проведения: "${dateRev}".`;
    this.setState({ isExcelLoading: true });
    Axios({
      method: "POST",
      url: "/api/report/revision/excel",
      data: { excelDetails, revisorData },
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
        this.setState({ isLoading: false, isExcelLoading: false });
        console.log(err);
      });
  };

  getDifferenceExcel = () => {
    const { point, dateRev, userid } = this.state;

    Axios.get("/api/report/revision/excel_difference", {
      responseType: "blob",
      params: { userid, point: point.value, dateRev },
    })
      .then((res) => res.data)
      .then((differenceList) => {
        if (differenceList.size === 2) {
          return Alert.warning("Товары не прошедшие ревизию отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        const url = window.URL.createObjectURL(new Blob([differenceList]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Товары не прошедшие ревизию.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  confirmRevision = () => {
    const { revisionDetails } = this.state;

    const productsToSend = revisionDetails.map((selectedProduct) => {
      return {
        createdate: selectedProduct.date,
        prodid: selectedProduct.prodid,
        unitswas: selectedProduct.unitswas,
        time: Moment(selectedProduct.date).format("MM.DD.YYYY HH:mm:ss"),
        attribute: selectedProduct.attribute,
        units: selectedProduct.units,
        unitsSelled: 0,
      };
    });

    Axios.post("/api/revision", {
      user: this.props.location.state.username,
      pointid: this.props.location.state.pointId,
      // revtype,
      products: productsToSend,
      revsubmit: 2,
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        console.log(resp);
        Alert.error("Ревизия подтверждена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        Alert.error("Сервис временно не доступен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      });
  };

  render() {
    const {
      points,
      point,
      revisions,
      ascending,
      orderBy,
      revisionDetails,
      isLoading,
      username,
      dateRev,
    } = this.state;

    return (
      <div className="report-check">
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
          <div className="col-md-3 text-right search-btn">
            <button
              className="btn btn-success mt-30"
              onClick={() => this.handleSearch()}
            >
              Показать Ревизии
            </button>
          </div>
        </div>

        {isLoading && <Searching />}

        {!isLoading && !point && revisions.length === 0 && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              Выберите торговую точку
            </div>
          </div>
        )}

        {!isLoading && point && revisions.length === 0 && (
          <div className="row mt-10 text-center">
            <div className="col-md-12 not-found-text">
              Ревизии по данной точке отсутствуют
            </div>
          </div>
        )}
        {!isLoading &&
          revisions.length > 0 &&
          revisionDetails.length === undefined && (
            <div className="row mt-20">
              <div className="col-md-12">
                <table
                  className="table table-striped table-hover"
                  id="table-to-xls"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "30%" }}>
                        <span
                          className="hand"
                          onClick={() => this.orderBy("username")}
                        >
                          Ревизор
                        </span>
                        {orderBy === "username" && (
                          <OrderArrow ascending={ascending} />
                        )}
                      </th>
                      <th className="text-center" style={{ width: "15%" }}>
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revisions.map((revision, idx) => (
                      <tr
                        className="hand"
                        key={idx}
                        onClick={() => {
                          this.handleDetails(
                            revision.userid,
                            revision.username,
                            revision.date
                          );
                        }}
                      >
                        <td>{revision.username}</td>
                        <td className="text-center">
                          {Moment(revision.date).format("DD.MM.YYYY HH:mm:ss")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        {!isLoading && revisionDetails.length > 0 && (
          <div style={{ marginTop: "25px" }}>
            <div className="row">
              <b className="col-md-8">
                Ревизор {username} от {dateRev}
              </b>
              <div
                style={{ paddingRight: "30px" }}
                className="col-md-4 text-right"
              >
                <button className="btn btn-secondary" onClick={this.backToList}>
                  Вернуться назад
                </button>
              </div>
              <div
                style={{ paddingRight: "30px" }}
                className="col-md-4 text-right"
              >
                <button
                  className="btn btn-primary"
                  onClick={this.confirmRevision}
                >
                  Подтвердить ревизию
                </button>
              </div>
            </div>

            <div className="col-md-12">
              <table className="table table-hover" id="table-to-xls">
                <thead>
                  <tr>
                    <th></th>
                    <th>Наименование товара</th>
                    <th>Атрибут</th>
                    <th>До ревизии</th>
                    <th>После ревизии</th>
                    <th>Цена реализации на момент ревизии</th>
                    <th>Результат ревизии в шт.</th>
                    <th>Результат ревизии в тг.</th>
                    <th>Время проведения ревизии</th>
                  </tr>
                </thead>
                <tbody>
                  {revisionDetails.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{detail.product}</td>
                      <td>{detail.attrvalue}</td>
                      <td>{detail.unitswas}</td>
                      <td>{detail.units}</td>

                      <td className="tenge">
                        {parseFloat(detail.unitprice).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </td>
                      <td>{detail.units - detail.unitswas}</td>
                      <td className="tenge">
                        {parseFloat(
                          (detail.units - detail.unitswas) * detail.unitprice
                        ).toLocaleString("ru", {
                          minimumFractionDigits: 1,
                        })}
                      </td>
                      <td>
                        {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="col-md-12">
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={this.getReportExcel}
                >
                  Выгрузить в excel
                </button>
                <button
                  className="btn btn-sm btn-outline-success ml-5"
                  onClick={this.getDifferenceExcel}
                >
                  Товары не прошедшие ревизию
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
