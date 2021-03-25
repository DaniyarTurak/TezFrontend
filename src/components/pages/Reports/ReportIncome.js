import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import Searching from "../../Searching";
import Alert from "react-s-alert";
import Pagination from "react-js-pagination";

import Modal from "react-modal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import OrderArrow from "../../OrderArrow";

import IncomeDetails from "./Details/IncomeDetails";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-10%",
    transform: "translate(-30%, -50%)",
    maxWidth: "80%",
    maxHeight: "80vh",
    overlfow: "scroll",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

export default function ReportIncome({ companyProps }) {
  const [activePage, setActivePage] = useState(1);
  const [attrval, setAttrVal] = useState({ value: "", label: "Все" });
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [barcode, setBarcode] = useState("");
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
  const [grouping, setGrouping] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [nds, setNds] = useState({ value: "@", label: "Все" });
  const [orderBy, setOrderBy] = useState("");
  const [points, setPoints] = useState([]);
  const [products, setProducts] = useState([]);
  const [point, setPoint] = useState({ value: "0", label: "Все" });
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [sales, setSales] = useState([]);

  const company = companyProps ? companyProps.value : "";
  const itemsPerPage = 10;
  const ndses = [
    { value: "@", label: "Все" },
    { value: "0", label: "Без НДС" },
    { value: "1", label: "С НДС" },
  ];
  const pageRangeDisplayed = 5;

  useEffect(() => {
    if (company) {
      getBrands();
      getProducts();
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
      getProducts();
      getPoints();
      getCounterparties();
      getCategories();
      getAttributes();
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
    point,
    counterparty,
    category,
    brand,
    attribute,
    attrval,
    grouping,
    nds,
    dateFrom,
    dateTo,
  ]);

  const clean = () => {
    setCurrentRange({
      first: activePage * itemsPerPage - itemsPerPage,
      last: activePage * itemsPerPage - 1,
    });
    setSales([]);
    setAttrVal("");
    setPoints([]);
    setBarcode("");
    setProducts([]);
    setCounterparties([]);
    setCategories([]);
    setBrands([]);
    setAttributeTypes([]);
    setNds({ value: "@", label: "Все" });
  };

  const handleDetails = () => {
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
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

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();

    if (barcodeChanged) {
      setBarcode(barcodeChanged);
    } else {
      setProductSelectValue({ value: "", label: "Все" });
      setBarcode("");
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onProductChange = (selected) => {
    if (!selected.code) {
      setProductSelectValue(selected);
      setBarcode("");
      return;
    }
    setProductSelectValue(selected);
    setBarcode(selected.code);
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

  const onNdsChange = (n) => {
    setNds(n);
  };

  const onProductListInput = (p) => {
    if (p.length > 0) getProducts(p);
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

  const getProductByBarcode = (b) => {
    Axios.get("/api/products/barcode", { params: { barcode: b, company } })
      .then((res) => res.data)
      .then((res) => {
        const productValue = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(productValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = (productName) => {
    Axios.get("/api/products", {
      params: { productName, company, report: true },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "" }];
        const productsList = list.map((product) => {
          return {
            label: product.name,
            value: product.id,
            code: product.code,
          };
        });
        setProducts([...all, ...productsList]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    if (Moment(dateFrom).isBefore("2019-10-01")) {
      return Alert.warning(
        `Дата для запроса слишком старая. Исторические данные доступны, начиная с 1 октября 2019 года`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    } else if (!dateFrom || !dateTo) {
      const text = !dateFrom ? "Дата с" : !dateTo ? "Дата по" : "Фильтр";
      Alert.warning(`Заполните поле  ${text}`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
      return;
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
    Axios.get("/api/report/grossprofit", {
      params: {
        dateFrom,
        dateTo,
        barcode,
        company,
        counterparty: counterparty.value,
        point: point.value,
        category: category.value,
        brand: brand.value,
        attribute: attribute.value,
        attrval: attrval.label === "Все" ? "" : attrval.label,
        notattr,
        nds: nds.value,
      },
    })
      .then((res) => res.data)
      .then((salesRes) => {
        setSales(salesRes);
        setLoading(false);
        setActivePage(1);
        setCurrentRange({
          first: itemsPerPage - itemsPerPage,
          last: itemsPerPage - 1,
        });
        setOrderBy("");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="report-sales">
      <Modal
        onRequestClose={() => {
          setModalOpen(false);
        }}
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <IncomeDetails closeDetail={closeDetail} />
      </Modal>
      <div className="row text-center">
        <div className="col-md-6 today-btn">
          <button
            className="btn btn-block btn-outline-warning mt-30"
            onClick={() => handleDetails()}
          >
            Пояснения к отчёту
          </button>
        </div>
      </div>
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
          <label htmlFor="">Штрихкод</label>
          <input
            name="barcode"
            value={barcode}
            placeholder="Введите или отсканируйте штрих код"
            onChange={onBarcodeChange}
            onKeyDown={onBarcodeKeyDown}
            type="text"
            className="form-control"
          />
        </div>
        <div className="col-md-3 point-block">
          <label htmlFor="">Наименование Товара</label>
          <Select
            name="product"
            value={productSelectValue}
            onChange={onProductChange}
            options={products}
            placeholder="Выберите товар"
            onInputChange={onProductListInput.bind(this)}
            noOptionsMessage={() => "Товар не найден"}
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
        <div className="col-md-3 point-block">
          <label htmlFor="">НДС</label>
          <Select
            name="nds"
            value={nds}
            onChange={onNdsChange}
            options={ndses}
            placeholder="Выберите с НДС или без"
            noOptionsMessage={() => "НДС не найден"}
          />
        </div>
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
          <button className="btn btn-success mt-20" onClick={handleSearch}>
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
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan="12" style={{ display: "none" }}>
                    Торговая точка: "{point.label}". Выбранный период: С "
                    {dateFrom}" По "{dateTo}"
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ width: "2%" }}></td>
                  <td style={{ width: "20%" }}>
                    <span
                      className="hand"
                      onClick={() => orderByFunction("name")}
                    >
                      Наименование товара
                    </span>{" "}
                    {orderBy === "name" && <OrderArrow ascending={ascending} />}
                  </td>
                  <td style={{ width: "5%" }}>Штрихкод</td>
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
                      onClick={() => orderByFunction("salesamount")}
                    >
                      Сумма реализации
                    </span>{" "}
                    {orderBy === "salesamount" && (
                      <OrderArrow ascending={ascending} />
                    )}
                  </td>
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("cost")}
                    >
                      Себестоимость проданного товара
                    </span>{" "}
                    {orderBy === "cost" && <OrderArrow ascending={ascending} />}
                  </td>
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("gross_profit")}
                    >
                      Валовая прибыль
                    </span>{" "}
                    {orderBy === "gross_profit" && (
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
                  <td style={{ width: "10%" }} className="text-center">
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
                  <td style={{ width: "5%" }} className="text-center">
                    <span
                      className="hand"
                      onClick={() => orderByFunction("nds")}
                    >
                      НДС
                    </span>{" "}
                    {orderBy === "nds" && <OrderArrow ascending={ascending} />}
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
                    <td>{product.name}</td>
                    <td className="text-center">{product.code}</td>
                    <td className="text-center">
                      {parseFloat(product.units).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {parseFloat(product.salesamount).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {parseFloat(product.cost).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {parseFloat(product.gross_profit).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">{product.brand}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">{product.nds}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="3">Итого</td>
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
                        return prev + parseFloat(cur.salesamount);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.cost);
                      }, 0)
                      .toLocaleString("ru", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    {sales
                      .reduce((prev, cur) => {
                        return prev + parseFloat(cur.gross_profit);
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
              filename={`Валовая прибыль "(${point.label})" с ${Moment(
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
