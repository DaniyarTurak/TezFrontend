import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../Searching";
import Alert from "react-s-alert";
import Pagination from "react-js-pagination";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import OrderArrow from "../../OrderArrow";

export default function ReportSales({ companyProps }) {
  const [activePage, setActivePage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attrval, setAttrVal] = useState({ value: "", label: "Все" });
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [brand, setBrand] = useState({ value: "@", label: "Все" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState({ value: "@", label: "Все" });
  const [categories, setCategories] = useState([]);
  const [counterparty, setCounterParty] = useState({
    value: "0",
    label: "Все",
  });
  const [counterparties, setCounterparties] = useState([]);
  const [currentRange, setCurrentRange] = useState({ first: 0, last: 0 });
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [grouping, setGrouping] = useState(false);
  const [handleGrouping, setHandleGrouping] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState({ value: "0", label: "Все" });
  const [points, setPoints] = useState([]);
  const [sales, setSales] = useState([]);
  const [type, setType] = useState({ value: "@", label: "Все" });

  const company = companyProps ? companyProps.value : "";
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");
  const types = [
    { value: "@", label: "Все" },
    { value: "0", label: "Продажи" },
    { value: "1", label: "Возвраты" },
  ];
  const itemsPerPage = 10;
  const pageRangeDisplayed = 5;

  useEffect(() => {
    if (company) {
      getBrands();
      getPoints();
      getCounterparties();
      getCategories();
      getAttributes();
      clean();
    }
  }, [company]);

  useEffect(() => {
    if (!company) {
      getBrands();
      getPoints();
      getCounterparties();
      getCategories();
      getAttributes();
      getSales();
    }
  }, []);

  useEffect(() => {
    if (!isDateChanging) {
      getSales();
    }
    return () => {
      setDateChanging(false);
    };
  }, [
    attribute,
    attrval,
    brand,
    counterparty,
    category,
    dateFrom,
    dateTo,
    grouping,
    point,
    type,
  ]);

  const clean = () => {
    setCurrentRange({
      first: activePage * itemsPerPage - itemsPerPage,
      last: activePage * itemsPerPage - 1,
    });
    setSales([]);
    setAttrVal("");
    setPoints([]);
    setCounterparties([]);
    setCategories([]);
    setBrands([]);
    setAttributeTypes([]);
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

  const orderByFunction = (order) => {
    let salesChanged = sales;
    let ascendingChanged = ascending;
    let prevOrderBy = orderBy;

    prevOrderBy === order
      ? (ascendingChanged = !ascendingChanged)
      : (ascendingChanged = true);

    salesChanged.sort((a, b) => {
      let textA = parseFloat(a[order]) || a[order];
      let textB = parseFloat(b[order]) || b[order];

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
    setSales(salesChanged);
    setOrderBy(order);
    setAscending(ascendingChanged);
  };

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setCurrentRange({
      first: pageNumber * itemsPerPage - itemsPerPage,
      last: pageNumber * itemsPerPage - 1,
    });
  }

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e.target.value);
  };

  const onPointChange = (p) => {
    setPoint(p);
  };

  const onCounterpartieChange = (c) => {
    setCounterParty(c);
  };

  const onBrandChange = (b) => {
    setBrand(b);
  };

  const onTypeChange = (t) => {
    setType(t);
  };

  const onCategoryChange = (c) => {
    setCategory(c);
  };

  const onAttributeChange = (a) => {
    setAttribute(a);
    setAttrVal("");
    getAttributeTypes(a.value);
  };

  const onAttributeTypeChange = (a) => {
    setAttrVal(a);
  };

  const onGroupingChange = (e) => {
    setGrouping(e.target.checked);
  };

  const onCounterpartieListInput = (c) => {
    if (c.length > 0) getCounterparties(c);
  };

  const onBrandListInput = (b) => {
    if (b.length > 0) getBrands(b);
  };

  const onCategoryListInput = (c) => {
    if (c.length > 0) getCategories(c);
  };

  const getAttributes = () => {
    Axios.get("/api/attributes", { params: { deleted: false, company } })
      .then((res) => res.data)
      .then((attributesList) => {
        const all = [{ label: "Все", value: "@" }];
        const attr = attributesList.map((point) => {
          return {
            value: point.id,
            label: point.values,
            format: point.format,
          };
        });
        setAttributes([...all, ...attr]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAttributeTypes = (sprid) => {
    Axios.get("/api/attributes/getsprattr", { params: { sprid, company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "" }];
        const attrtype = list.map((attrtype) => {
          return {
            value: attrtype.id,
            label: attrtype.value,
            deleted: attrtype.deleted,
          };
        });
        let newattrtype = [];
        newattrtype = attrtype.filter((value) => {
          return value.deleted === false;
        });
        setAttributeTypes([...all, ...newattrtype]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue, company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "@" }];
        const brandsList = list.map((result) => {
          return {
            label: result.brand,
            value: result.id,
          };
        });
        setBrands([...all, ...brandsList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategories = () => {
    Axios.get("/api/categories", { params: { deleted: false, company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "@" }];
        const categoriesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCategories([...all, ...categoriesList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCounterparties = (сounterpartie) => {
    Axios.get("/api/counterparties/search", {
      params: { сounterpartie, company },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "0" }];
        const counterpartiesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCounterparties([...all, ...counterpartiesList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "0" }];
        const pointsList = list.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });

        setPoints([...all, ...pointsList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStockbalanceExcelPure = () => {
    Axios.get("/api/report/stockbalance/excelpurebeauty_sold", {
      responseType: "blob",
      params: {
        dateFrom,
        dateTo,
        counterparty: counterparty.value,
        point: point.value,
        category: category.value,
        brand: brand.value,
        type: type.value,
        attribute: attribute.value,
        attrval: attrval.label === "Все" ? "" : attrval.label,
      },
    })
      .then((res) => res.data)
      .then((stockbalance) => {
        const url = window.URL.createObjectURL(new Blob([stockbalance]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Проданные товары ${point.label}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    if (!dateFrom || !dateTo) {
      const text = !dateFrom ? "Дата с" : !dateTo ? "Дата по" : "Фильтр";
      return Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else if (dateFrom > dateTo) {
      return Alert.warning(`Заполните дату правильно`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    getSales();
  };

  const getSales = () => {
    let notattr;
    if (grouping === false) {
      notattr = 0;
    } else notattr = 1;
    setLoading(true);
    setSubmitting(true);
    Axios.get("/api/report/sales", {
      params: {
        dateFrom,
        dateTo,
        counterparty: counterparty.value,
        point: point.value,
        category: category.value,
        brand: brand.value,
        type: type.value,
        attribute: attribute.value,
        attrval: attrval.label === "Все" ? "" : attrval.label,
        notattr,
        company,
      },
    })
      .then((res) => res.data)
      .then((salesList) => {
        setSales(salesList);
        setLoading(false);
        setSubmitting(false);
        setHandleGrouping(true);
        setActivePage(1);
        setCurrentRange({
          first: itemsPerPage - itemsPerPage,
          last: itemsPerPage - 1,
        });
        setOrderBy("");
      })
      .catch((err) => {
        setSubmitting(false);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="report-sales">
      <div className="row">
        <div className="col-md-3 today-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("today")}
          >
            Сегодня
          </button>
        </div>
        <div className="col-md-3 month-btn">
          <button
            className="btn btn-block btn-outline-success mt-30"
            onClick={() => changeDate("month")}
          >
            Текущий месяц
          </button>
        </div>
        <div className="col-md-3 date-block">
          <label htmlFor="">Дата с</label>
          <input
            type="date"
            value={dateFrom}
            className="form-control"
            name="dateFrom"
            onChange={dateFromChange}
          />
        </div>
        <div className="col-md-3 date-block">
          <label htmlFor="">Дата по</label>
          <input
            type="date"
            value={dateTo}
            className="form-control"
            name="dateTo"
            onChange={dateToChange}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Торговая точка</label>
          <Select
            name="point"
            value={point}
            onChange={onPointChange}
            noOptionsMessage={() => "Выберите торговую точку из списка"}
            options={points}
            placeholder="Выберите торговую точку"
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Контрагенты</label>
          <Select
            name="counterpartie"
            value={counterparty}
            onChange={onCounterpartieChange}
            options={counterparties}
            placeholder="Выберите контрагента"
            onInputChange={onCounterpartieListInput.bind(this)}
            noOptionsMessage={() => "Контрагент не найден"}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Бренды</label>
          <Select
            name="brand"
            value={brand}
            onChange={onBrandChange}
            options={brands}
            placeholder="Выберите Бренд"
            onInputChange={onBrandListInput.bind(this)}
            noOptionsMessage={() => "Бренд не найден"}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Категории</label>
          <Select
            name="category"
            value={category}
            onChange={onCategoryChange}
            options={categories}
            placeholder="Выберите Категорию"
            onInputChange={onCategoryListInput.bind(this)}
            noOptionsMessage={() => "Категория не найдена"}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Тип (Продажа, Возврат)</label>
          <Select
            name="type"
            value={type}
            onChange={onTypeChange}
            options={types}
            placeholder="Выберите Тип"
            noOptionsMessage={() => "Тип не найден"}
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Атрибуты</label>
          <Select
            name="attribute"
            value={attribute}
            onChange={onAttributeChange}
            options={attributes}
            isDisabled={!grouping}
            placeholder="Выберите Атрибут"
            noOptionsMessage={() => "Атрибут не найден"}
          />
        </div>
        {attribute.format === "TEXT" && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Значение Атрибута</label>
            <input
              type="text"
              value={attrval}
              className="form-control"
              isDisabled={!grouping}
              name="attr"
              onChange={onAttributeTypeChange}
            />
          </div>
        )}
        {attribute.format === "SPR" && (
          <div className="col-md-3 point-block">
            <label htmlFor="">Значение Атрибута</label>
            <Select
              name="attributeType"
              value={attrval}
              onChange={onAttributeTypeChange}
              options={attributeTypes}
              isDisabled={!grouping}
              placeholder="Выберите Значение"
              noOptionsMessage={() => "Значение не найдено"}
            />
          </div>
        )}
        <div
          style={{ marginLeft: "20px", marginTop: "20px" }}
          className="col-md-3 point-block custom-checkbox"
        >
          <input
            type="checkbox"
            className="custom-control-input"
            name="grouping"
            id="updateAttributes"
            checked={grouping}
            onChange={onGroupingChange}
          />
          <label className="custom-control-label" htmlFor="updateAttributes">
            Разбить по Атрибутам (Например: по цвету, размеру и т.д.)
          </label>
        </div>
        <div className="col-md-1 text-right search-btn">
          <button
            className="btn btn-success mt-20"
            disabled={isSubmitting}
            onClick={handleSearch}
          >
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && !point && sales.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            Выберите торговую точку
          </div>
        </div>
      )}

      {!isLoading && point && sales.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && sales.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead
                style={{
                  display: "none",
                }}
              >
                <tr className="text-center font-weight-bold">
                  Отчет по проданым товарам
                </tr>
                <tr>
                  <td className="text-center font-weight-bold">Компания:</td>
                  <td colSpan="2">{companyData.companyname}</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
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
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan="12" style={{ display: "none" }}>
                    {" "}
                    Торговая точка: "{point.label}". Выбранный период: С "
                    {dateFrom}" По "{dateTo}"
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td rowSpan="2" style={{ width: "2%" }}></td>
                  <td rowSpan="2" style={{ width: "5%" }}>
                    <span
                      className="hand"
                      onClick={() => orderByFunction("type")}
                    >
                      Тип
                    </span>{" "}
                    {orderBy === "type" && <OrderArrow ascending={ascending} />}
                  </td>
                  <td rowSpan="2" style={{ width: "25%" }}>
                    <span
                      className="hand"
                      onClick={() => orderByFunction("name")}
                    >
                      Наименование товара
                    </span>{" "}
                    {orderBy === "name" && <OrderArrow ascending={ascending} />}
                  </td>
                  <td
                    colSpan="2"
                    style={{ width: "22%" }}
                    className="text-center"
                  >
                    <span
                      className="hand"
                      onClick={() => orderByFunction("price")}
                    >
                      Итоговая сумма
                    </span>{" "}
                    {orderBy === "price" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  {handleGrouping && grouping && (
                    <td style={{ width: "5%" }} className="text-center">
                      <span
                        className="hand"
                        onClick={() => orderByFunction("")}
                      >
                        НДС
                      </span>{" "}
                      {orderBy === "taxrate" && (
                        <OrderArrow ascending={ascending} />
                      )}
                    </td>
                  )}
                  {handleGrouping && grouping && (
                    <td style={{ width: "5%" }} className="text-center">
                      <span
                        className="hand"
                        onClick={() => orderByFunction("tax")}
                      >
                        Итого НДС
                      </span>{" "}
                      {orderBy === "tax" && (
                        <OrderArrow ascending={ascending} />
                      )}
                    </td>
                  )}
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("units")}
                    >
                      Количество
                    </span>{" "}
                    {orderBy === "units" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("stock")}
                    >
                      Текущий Остаток
                    </span>{" "}
                    {orderBy === "stock" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("counterparty")}
                    >
                      Контрагент
                    </span>{" "}
                    {orderBy === "counterparty" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "8%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("brand")}
                    >
                      Бренд
                    </span>{" "}
                    {orderBy === "brand" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "15%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("category")}
                    >
                      Категория
                    </span>{" "}
                    {orderBy === "category" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ width: "9%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("price_discount")}
                    >
                      С учётом применённой скидки
                    </span>{" "}
                    {orderBy === "price_discount" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "13%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("price_discount_bonus")}
                    >
                      С учётом применённой скидки <br /> (за минусом
                      использованных бонусов)
                    </span>{" "}
                    {orderBy === "price_discount_bonus" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                </tr>
              </thead>
              <tbody>
                {sales.map((product, idx) => (
                  <tr
                    className={`${
                      currentRange.first <= idx && idx <= currentRange.last
                        ? ""
                        : "d-none"
                    }`}
                    key={idx}
                  >
                    <td>{idx + 1}</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: product.type === "Продажа" ? "green" : "red",
                      }}
                    >
                      {product.type}
                    </td>
                    <td>{product.name}</td>
                    <td className="text-center tenge">
                      {parseFloat(product.price_discount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center tenge">
                      {parseFloat(
                        product.price_discount_bonus
                      ).toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    {handleGrouping && grouping && (
                      <td className="text-center tax">{product.taxrate}</td>
                    )}
                    {handleGrouping && grouping && (
                      <td className="text-center tenge">
                        {parseFloat(product.tax).toLocaleString("ru", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    )}
                    <td className="text-center">
                      {parseFloat(product.units).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {parseFloat(product.stock).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">{product.counterparty}</td>
                    <td className="text-center">{product.brand}</td>
                    <td className="text-center">{product.category}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="2">Итого</td>
                  <td />
                  <td className="text-center tenge">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.price_discount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center tenge">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.price_discount_bonus);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  {handleGrouping && grouping && <td></td>}
                  {handleGrouping && grouping && (
                    <td className="text-center tenge">
                      {sales
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.tax);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  )}
                  <td className="text-center">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.units);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.stock);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {sales.length > itemsPerPage && (
            <div className="col-md-12 text-right">
              <Pagination
                hideDisabled
                hideNavigation={
                  sales.length / itemsPerPage < pageRangeDisplayed
                }
                hideFirstLastPages={
                  sales.length / itemsPerPage < pageRangeDisplayed
                }
                activePage={activePage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={sales.length}
                pageRangeDisplayed={pageRangeDisplayed}
                innerClass="pagination justify-content-center"
                itemClass="page-item"
                linkClass="page-link"
                onChange={handlePageChange.bind(this)}
              />
            </div>
          )}
          <div className="col-md-12">
            <ReactHTMLTableToExcel
              className="btn btn-sm btn-outline-success"
              table="table-to-xls"
              filename={`Продажи (${point.label}) с ${Moment(dateFrom).format(
                "DD.MM.YYYY"
              )} по ${Moment(dateTo).format("DD.MM.YYYY")}`}
              sheet="tablexls"
              buttonText="Выгрузить в excel"
            />
            {/* for PureBeauty */}
            {(companyData.id === "17" ||
              companyData.id === "9" ||
              companyData.id === "23") && (
              <button
                className="btn btn-sm btn-outline-success ml-10"
                onClick={getStockbalanceExcelPure}
              >
                Выгрузка для "Мой склад"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
