import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../../../Searching";
import Alert from "react-s-alert";

import OrderArrow from "../../../../OrderArrow";
import "moment/locale/ru";
Moment.locale("ru");

export default function ReportRevision({ companyProps }) {
  const [ascending, setAscending] = useState(true);
  const [condition, setCondition] = useState(1);
  const [dateRev, setDateRev] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState("");
  const [points, setPoints] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [revisionDetails, setRevisionDetails] = useState({});
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");

  const company = companyProps ? companyProps.value : "";
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-user-data")) || {};

  useEffect(() => {
    if (company) {
      getPoints();
      clean();
    }
  }, [company]);

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
        console.log(err);
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

  const pointsChange = (p) => {
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
        setRevisionDetails({});
        setLoading(false);
        setOrderBy("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDetails = (id, username, date, cond) => {
    let dateRev = Moment(date).format("YYYY-MM-DD HH:mm:ss");
    setCondition(cond);
    getRevisionDetails(id, username, dateRev, date);
    setLoading(true);
    setUserid(id);
  };

  const getRevisionDetails = (id, u, dr, date) => {
    Axios.get("/api/report/revision/details", {
      params: {
        userid: id,
        dateRev: dr,
        submitDate: Moment(date).format("YYYY-MM-DD HH:mm:ss"),
        company,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setRevisionDetails(res);
        setDateRev(dr);
        setUsername(u);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
        console.log(err);
      });
  };

  const getDifferenceExcel = () => {
    Axios.get("/api/report/revision/excel_difference", {
      responseType: "blob",
      params: { userid, point: point.value, dateRev, company },
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
        console.log(err);
      });
  };

  return (
    <div className="report-check">
      <div className="row">
        <div className="col-md-3 point-block">
          <label htmlFor="">Торговая точка</label>
          <Select
            value={point}
            name="point"
            onChange={pointsChange}
            noOptionsMessage={() => "Выберите торговую точку из списка"}
            options={points}
            placeholder="Выберите торговую точку"
          />
        </div>
        <div className="col-md-3 text-right search-btn">
          <button className="btn btn-success mt-30" onClick={handleSearch}>
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
                        onClick={() => orderByFunction("username")}
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
                        handleDetails(
                          revision.userid,
                          revision.username,
                          revision.date,
                          revision.revcondition
                        );
                      }}
                    >
                      <td>{revision.username}</td>
                      <td className="text-center">
                        {Moment(revision.showDate).format(
                          "DD.MM.YYYY HH:mm:ss"
                        )}
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
              <button className="btn btn-secondary" onClick={backToList}>
                Вернуться назад
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
                  <th>Остаток в ценах реализации</th>
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
                    <td className="tenge">
                      {(
                        parseFloat(detail.unitprice) * parseFloat(detail.units)
                      ).toLocaleString("ru", {
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
                    <td>{Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="2">Итого</td>
                  <td />
                  <td>
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.unitswas);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.units);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.unitprice);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return (
                          prev +
                          parseFloat(cur.unitprice) * parseFloat(cur.units)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return (
                          prev +
                          (parseFloat(cur.units) - parseFloat(cur.unitswas))
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="tenge">
                    {revisionDetails
                      .reduce((prev, cur) => {
                        return (
                          prev +
                          (parseFloat(cur.units) - parseFloat(cur.unitswas)) *
                            parseFloat(cur.unitprice)
                        );
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>

            <div className="col-md-12">
              <button
                className="btn btn-sm btn-outline-success"
                onClick={getReportExcel}
              >
                Выгрузить в excel
              </button>
              {condition === 1 && (
                <button
                  className="btn btn-sm btn-outline-success ml-5"
                  onClick={getDifferenceExcel}
                >
                  Товары не прошедшие ревизию
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
