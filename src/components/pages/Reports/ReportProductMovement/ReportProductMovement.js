import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Moment from "moment";
import Searching from "../../../Searching";
import Alert from "react-s-alert";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import _ from "lodash";
import MovementDetailsNew from "./MovementDetailsNew";

export default function ReportProductMovement({ company, parameters }) {
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [isLoading, setLoading] = useState(false);
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
      clean();
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
    setSelectedPoint([]);
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
        console.log(err);
      });
  };

  const getProducts = (productName) => {
    const comp = company ? company.value : "";
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByBarcode = (barcode) => {
    const comp = company ? company.value : "";
    Axios.get("/api/products/barcode", { params: { barcode, company: comp } })
      .then((res) => res.data)
      .then((product) => {
        const productSelectValue = {
          value: product.id,
          label: product.name,
          code: product.code,
        };
        setProductSelectValue(productSelectValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
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

  const onPointChange = (p) => {
    setSelectedPoint(p);
  };

  const onBarcodeChange = (e) => {
    let barcode = e.target.value.toUpperCase();
    if (barcode) {
      setBarcode(barcode);
    } else {
      setProductSelectValue("");
      setBarcode("");
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onProductChange = (p) => {
    if (!p.code) {
      setProductSelectValue("");
      setBarcode("");
      return;
    }

    setProductSelectValue(p);
    setBarcode(p.code);
  };

  const onProductListInput = (productName) => {
    if (productName.length > 0) getProducts(productName);
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
        console.log(err);
      });
  };

  return (
    <div className="product-movement">
      <div className="row">
        <div className="col-md-2 today-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </button>
        </div>
        <div className="col-md-2 month-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("month")}
          >
            Текущий месяц
          </button>
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            className="form-control"
            name="datefrom"
            onChange={dateFromChange}
          />
        </div>
        <div className="col-md-2 date-block">
          <label htmlFor="">Дата по</label>
          <input
            type="date"
            value={dateTo}
            className="form-control"
            name="dateto"
            onChange={dateToChange}
          />
        </div>
        <div className="col-md-4 point-block">
          <label htmlFor="">Выберите торговую точку</label>
          <Select
            name="point"
            value={selectedPoint}
            onChange={onPointChange}
            options={points}
            placeholder="Выберите торговую точку"
            noOptionsMessage={() => "Торговая точка не найдена"}
          />
        </div>
      </div>
      <div className={`row pt-10 ${movementDetails.length > 0 ? "pb-10" : ""}`}>
        <div className="col-md-4 point-block">
          <input
            name="barcode"
            value={barcode}
            placeholder="Введите или отсканируйте штрих код"
            onChange={onBarcodeChange}
            onKeyDown={onBarcodeKeyDown}
            type="text"
            className="form-control mt-10"
          />
        </div>
        <div className="col-md-4 point-block">
          <Select
            name="product"
            className="mt-10"
            value={productSelectValue}
            onChange={onProductChange}
            options={products}
            placeholder="Выберите товар"
            onInputChange={onProductListInput.bind(this)}
            noOptionsMessage={() => "Товар не найден"}
          />
        </div>

        <div className="col-md-1 text-right search-btn">
          <button className="btn btn-success mt-10" onClick={handleSearch}>
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && unchangedMovementDetails.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}
      {isDateChanging && (
        <div
          style={{
            opacity: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Нажмите на "Поиск"
        </div>
      )}
      {!isLoading && !isDateChanging && unchangedMovementDetails.length > 0 && (
        <Fragment>
          <div className="empty-space" />
          <div className="row">
            <div
              style={{ fontSize: "20px", fontWeight: "bold" }}
              className="col-md-12 mt-10"
            >
              Движение товара:
            </div>
          </div>

          <MovementDetailsNew
            isDateChanging={isDateChanging}
            movementDetails={movementDetails}
            unchangedMovementDetails={unchangedMovementDetails}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />

          <div className="row">
            <div
              style={{ fontSize: "20px", fontWeight: "bold" }}
              className="col-md-12  mb-10"
            >
              Детализация движения:
            </div>
            <div className="col-md-12">
              <table id="table-to-xls" className="table table-striped">
                <thead className="bg-info text-white">
                  <tr>
                    <td>№ п/п</td>
                    <td>Дата совершения</td>
                    <td className="text-center">Тип</td>
                    <td className="text-center">Количество</td>
                    <td className="text-center">Накладная</td>
                    <td>Характеристики</td>
                  </tr>
                </thead>
                <tbody>
                  {unchangedMovementDetails.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        {Moment(detail.date).format("DD.MM.YYYY HH:mm:ss")}
                      </td>
                      <td
                        className="text-center"
                        data-toggle="tooltip"
                        title={
                          detail.name === "Перемещение со склада"
                            ? detail.sum === 0
                              ? "перемещения не было"
                              : detail.sum > 0
                              ? "переместился c: " + detail.stockfrom
                              : "переместился в: " + detail.stockto
                            : ""
                        }
                      >
                        {detail.name}
                      </td>
                      <td className="text-center">
                        {detail.sum.toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td className="text-center">{detail.invoice}</td>
                      <td>{detail.attr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactHTMLTableToExcel
                className="btn btn-sm btn-outline-success"
                table="table-to-xls"
                filename={`Движение товара за период:${Moment(dateFrom).format(
                  "DD.MM.YYYY"
                )}-${Moment(dateTo).format("DD.MM.YYYY")}`}
                sheet="tablexls"
                buttonText="Выгрузить в Excel"
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
