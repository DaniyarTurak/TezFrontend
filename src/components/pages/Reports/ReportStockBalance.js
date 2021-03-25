import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Select from "react-select";
import Searching from "../../Searching";
import Alert from "react-s-alert";
import Pagination from "react-js-pagination";
import ReactModal from "react-modal";
import ProductDetails from "../Products/ProductDetails";
import Moment from "moment";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    zIndex: 11,
  },
  overlay: { zIndex: 10 },
};

ReactModal.setAppElement("#root");

export default function ReportStockBalance({ companyProps }) {
  const [activePage, setActivePage] = useState(0);
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attrval, setAttrVal] = useState({ value: "", label: "Все" });
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState({ value: "@", label: "Все" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState({ value: "@", label: "Все" });
  const [categories, setCategories] = useState([]);
  const [consignment, setConsignment] = useState(false);
  const [counterparty, setCounterParty] = useState({
    value: "0",
    label: "Все",
  });
  const [counterparties, setCounterparties] = useState([]);
  const [currentRange, setCurrentRange] = useState({ first: 0, last: 0 });
  const [date, setDate] = useState(Moment().format("YYYY-MM-DD"));
  const [flag, setFlag] = useState(true);
  const [grouping, setGrouping] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isExcelLoading, setExcelLoading] = useState(false);
  const [isPaginationLoading, setPaginationLoading] = useState(false);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [nds, setNds] = useState({ value: "@", label: "Все" });
  const [product, setProduct] = useState({ value: "", label: "Все" });
  const [products, setProducts] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [searchKey, setSearchKey] = useState("");
  const [selectedStock, setSelectedStock] = useState({
    value: "0",
    label: "Все",
  });
  const [stockbalance, setStockbalance] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [totalprice, setTotalprice] = useState(0);
  const [totalcost, setTotalcost] = useState(0);
  const [totalunits, setTotalunits] = useState(0);

  const company = companyProps ? companyProps.value : "";
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};
  const itemsPerPage = 50;
  const ndses = [
    { value: "@", label: "Все" },
    { value: "0", label: "Без НДС" },
    { value: "1", label: "С НДС" },
  ];
  const pageRangeDisplayed = 5;

  useEffect(() => {
    if (!company) {
      getAttributes();
      getBrands();
      getCategories();
      getCounterparties();
      getProducts();
      getStockList();
      setCurrentRange({
        first: activePage * itemsPerPage - itemsPerPage,
        last: activePage * itemsPerPage - 1,
      });
      setDateChanging(true);
    }
  }, []);

  useEffect(() => {
    if (company) {
      getAttributes();
      getBrands();
      getCategories();
      getCounterparties();
      getProducts();
      getStockList();
      handleSearch();
      clean();
      setDateChanging(true);
    }
  }, [company]);

  useEffect(() => {
    if (!isDateChanging && !isPaginationLoading) {
      handleSearch();
    }
    return () => {
      setDateChanging(false);
    };
  }, [
    barcode,
    selectedStock,
    counterparty,
    category,
    brand,
    attribute,
    attrval,
    grouping,
    nds,
    consignment,
  ]);

  useEffect(() => {
    if (isPaginationLoading) {
      handleSearch();
    }
    return () => {
      setPaginationLoading(false);
    };
  }, [activePage]);

  const clean = () => {
    setAttribute({ value: "@", label: "Все", format: "" });
    setAttrVal({ value: "", label: "Все" });
    setBarcode("");
    setBrand({ value: "@", label: "Все" });
    setBrands([]);
    setCategory({ value: "@", label: "Все" });
    setCategories([]);
    setCounterParty({ value: "0", label: "Все" });
    setCounterparties([]);
    setDate(Moment().format("YYYY-MM-DD"));
    setStockbalance([]);
    setSelectedStock({ value: "0", label: "Все" });
    setProductSelectValue({ value: "", label: "Все" });
    setProduct({ value: "", label: "Все" });
  };

  const onDateChange = (e) => {
    setDateChanging(true);
    setDate(e.target.value);
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

  const onProductChange = (p) => {
    if (!p.code) {
      setProductSelectValue(p);
      setBarcode("");
      return;
    }
    setProductSelectValue(p);
    setBarcode(p.code);
  };

  const onStockChange = (s) => {
    setSelectedStock(s);
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

  const onSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const onGroupingChange = (e) => {
    setGrouping(e.target.checked);
  };

  const onConsignmentChange = (e) => {
    setConsignment(e.target.checked);
  };

  const onNdsChange = (n) => {
    if (nds.value) {
      setNds(n);
    }
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
    getCategories(c);
  };

  const getStockList = () => {
    Axios.get("/api/stock", { params: { company } })
      .then((res) => res.data)
      .then((stockList) => {
        const options = stockList.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        const allStock = [{ value: "0", label: "Все" }];
        setStockList([...allStock, ...options]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProductByBarcode = (barcode) => {
    Axios.get("/api/products/barcode", { params: { barcode, company } })
      .then((res) => res.data)
      .then((res) => {
        const selected = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(selected);
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

  const getCategories = (inputValue) => {
    Axios.get("/api/categories/search", {
      params: { deleted: false, company, category: inputValue },
    })
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

  const getAttributes = () => {
    Axios.get("/api/attributes", { params: { deleted: false, company } })
      .then((res) => res.data)
      .then((attributes) => {
        const all = [{ label: "Все", value: "@" }];
        const attr = attributes.map((point) => {
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
      .then((attributeTypes) => {
        const all = [{ label: "Все", value: "" }];
        const attrtype = attributeTypes.map((attrtype) => {
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

  const handleSearch = () => {
    if (Moment(date).isBefore("2019-11-06")) {
      return Alert.warning(
        `Дата для запроса слишком старая. Исторические данные доступны, начиная с 25 ноября 2019 года`,
        {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        }
      );
    } else if (!date) {
      return Alert.warning(`Заполните дату`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }

    if (!selectedStock) {
      return Alert.warning("Выберите склад", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setStockbalance([]);
    getStockbalance();
  };

  const getStockbalance = () => {
    if (selectedStock.value) {
      let notattr;
      if (grouping === false) {
        notattr = 0;
      } else notattr = 1;
      const page = activePage ? activePage : "1";
      setLoading(true);
      Axios.get("/api/report/stockbalance", {
        params: {
          attribute: attribute.value,
          attrval: attrval.label === "Все" ? "" : attrval.label,
          barcode,
          brand: brand.value,
          category: category.value,
          counterparty: counterparty.value,
          company,
          consignment,
          date,
          flag,
          itemsPerPage,
          notattr,
          nds: nds.value,
          pageNumber: page,
          stockID: selectedStock.value,
        },
      })
        .then((res) => res.data)
        .then((stockbalanceList) => {
          if (!totalprice || flag === true) {
            setTotalprice(JSON.parse(stockbalanceList).totalprice);
            setTotalcost(JSON.parse(stockbalanceList).totalcost);
            setTotalunits(JSON.parse(stockbalanceList).totalunits);
            setTotalCount(JSON.parse(stockbalanceList).totalCount);
          }
          setStockbalance(JSON.parse(stockbalanceList).data);
          setLoading(false);
          setPaginationLoading(false);
          setActivePage(page);
          setCurrentRange({
            first: itemsPerPage - itemsPerPage,
            last: itemsPerPage - 1,
          });
        })
        .catch((err) => {
          setLoading(false);
          setPaginationLoading(false);
          console.log(err);
        });
    } else {
      setStockbalance([]);
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleProductDtl = (p) => {
    setProduct(p);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
  };

  const handlePageChange = (itemsPerPage, pN) => {
    setFlag(false);
    setPaginationLoading(true);
    setActivePage(pN);
    setCurrentRange({
      first: pN * itemsPerPage - itemsPerPage,
      last: pN * itemsPerPage - 1,
    });
  };

  const getStockbalanceExcel = () => {
    const stockID = selectedStock.value;
    setExcelLoading(true);
    setLoading(true);
    if (stockID) {
      let notattr;
      if (grouping === false) {
        notattr = 0;
      } else notattr = 1;
      Axios.get("/api/report/stockbalance/excel", {
        responseType: "blob",
        params: {
          itemsPerPage,
          pageNumber: activePage ? activePage : "1",
          date,
          barcode,
          stockID,
          counterparty: counterparty.value,
          category: category.value,
          brand: brand.value,
          attribute: attribute.value,
          attrval: attrval.label === "Все" ? "" : attrval.label,
          notattr,
          nds: nds.value,
          flag,
          company,
          consignment,
        },
      })
        .then((res) => res.data)
        .then((stockbalance) => {
          const url = window.URL.createObjectURL(new Blob([stockbalance]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Остаток на складе ${selectedStock.label}.xlsx`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
          setLoading(false);
          setExcelLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setExcelLoading(false);
          console.log(err);
        });
    } else {
      setStockbalance([]);
      setLoading(false);
      setExcelLoading(false);
    }
  };

  const getStockbalanceExcelPure = (barcode, stockID) => {
    if (stockID || barcode) {
      setLoading(true);
      setExcelLoading(true);
      Axios.get("/api/report/stockbalance/excelpurebeauty", {
        responseType: "blob",
        params: { barcode, stockID, company },
      })
        .then((res) => res.data)
        .then((stockbalanceList) => {
          const url = window.URL.createObjectURL(new Blob([stockbalanceList]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Остаток на складе ${selectedStock.label}.xlsx`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
          setLoading(false);
          setExcelLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setExcelLoading(false);
          console.log(err);
        });
    } else {
      setStockbalance([]);
      setLoading(false);
      setExcelLoading(false);
    }
  };
  
  return (
    <div className="report-stock-balance">
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <ProductDetails
          product={product}
          closeDetail={closeDetail}
          invoiceNumber={false}
        />
      </ReactModal>
      <div className="row">
        <div className="col-md-3 date-block">
          <label htmlFor="">Дата</label>
          <input
            type="date"
            value={date}
            className="form-control"
            name="date"
            onChange={onDateChange}
          />
        </div>
      </div>
      <div className="row">
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
          <label htmlFor="">Склад</label>
          <Select
            name="stock"
            value={selectedStock}
            onChange={onStockChange}
            options={stockList}
            placeholder="Выберите склад"
            noOptionsMessage={() => "Склад не найден"}
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
            isDisabled={!grouping}
            options={attributes}
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
              isDisabled={!grouping}
              className="form-control"
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
            id="updateprice"
            checked={grouping}
            onChange={onGroupingChange}
          />
          <label className="custom-control-label" htmlFor="updateprice">
            Разбить по Атрибутам (Например: по цвету, размеру и т.д.)
          </label>
        </div>
        <div
          style={{ marginLeft: "20px", marginTop: "20px" }}
          className="col-md-3 point-block custom-checkbox"
        >
          <input
            type="checkbox"
            className="custom-control-input"
            name="consignment"
            id="consignment"
            checked={consignment}
            onChange={onConsignmentChange}
          />
          <label className="custom-control-label" htmlFor="consignment">
            Включая товары, находящиеся на консигнации
          </label>
        </div>
        <div className="col-md-1 text-right search-btn">
          <button
            className="btn btn-success mt-30 mb-5"
            disabled={isLoading}
            onClick={handleSearch}
          >
            Поиск
          </button>
        </div>
      </div>

      {!isLoading && stockbalance.length === 0 && (
        <div className="row mt-10">
          <div className="col-md-12">
            <p className="text-center not-found-text">
              {(selectedStock.length === 0 && "Выберите склад или товар") ||
                (stockbalance.length === 0 && "Список товаров пуст")}
            </p>
          </div>
        </div>
      )}

      {!isLoading && stockbalance.length > 0 && (
        <Fragment>
          <div className="empty-space" />
          <div className="row mt-20">
            <div className="col-md-6">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <span className="ico-mglass" />
                  </span>
                </div>
                <input
                  name="search"
                  value={searchKey}
                  type="text"
                  placeholder="Поиск по наименованию товара"
                  className="form-control"
                  onChange={onSearchChange}
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {isLoading && <Searching className="text-center" />}
      {isPaginationLoading && <Searching className="text-center" />}
      {!isLoading && !isPaginationLoading && stockbalance.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped" id="table-to-xls">
              <thead>
                <tr>
                  <th />
                  <th className="text-center">Склад</th>
                  <th className="text-center">Наименование товара</th>
                  <th className="text-center">Штрих код</th>
                  <th className="text-center">
                    <span>Общая себестоимость</span>
                  </th>
                  <th className="text-center">
                    <span>Остаток в ценах реализации</span>
                  </th>
                  <th className="text-center">
                    <span>Количество</span>
                  </th>
                  {/* <th className="text-center">Контрагент</th> */}
                  <th className="text-center">Бренд</th>
                  <th className="text-center">Категория</th>
                  <th className="text-center">НДС</th>
                </tr>
              </thead>
              <tbody>
                {stockbalance.map((product, idx) => (
                  <tr
                    className={`${
                      currentRange.first <= idx && idx <= currentRange.last
                        ? ""
                        : "d-none"
                    }`}
                    key={idx}
                  >
                    <td>{idx + 1 + (activePage - 1) * itemsPerPage}</td>
                    <td className="text-center">
                      {product.pointname === `Склад точки ""`
                        ? "Центральный Склад"
                        : product.pointname}
                    </td>

                    <td
                      onClick={() => {
                        handleProductDtl(product);
                      }}
                      className="link-row"
                    >
                      {product.productname +
                        (product.attributescaption
                          ? ", " + product.attributescaption
                          : "")}
                    </td>
                    <td className="text-center">{product.code}</td>
                    <td className="text-center tenge">
                      {parseFloat(product.cost).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center tenge">
                      {parseFloat(product.price).toLocaleString("ru", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-center">
                      {Number(product.units ? product.units : 0)}
                    </td>
                    {/* <td className="text-center">{product.counterparty}</td> */}
                    <td className="text-center">{product.brand}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">{product.nds}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-info text-white">
                <tr>
                  <td colSpan="4">Общий итог</td>
                  <td className="text-center tenge">
                    {parseFloat(totalcost).toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-center tenge">
                    {parseFloat(totalprice).toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-center">
                    {parseFloat(totalunits).toLocaleString("ru", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td colSpan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {totalCount !== 0 && !isPaginationLoading && (
            <div className="col-md-12 text-right">
              <Pagination
                hideDisabled
                hideNavigation={
                  (totalCount * itemsPerPage) / itemsPerPage <
                  pageRangeDisplayed
                }
                hideFirstLastPages={
                  (totalCount * itemsPerPage) / itemsPerPage <
                  pageRangeDisplayed
                }
                activePage={activePage}
                itemsCountPerPage={1 % itemsPerPage}
                totalItemsCount={totalCount}
                pageRangeDisplayed={pageRangeDisplayed}
                innerClass="pagination justify-content-center"
                itemClass="page-item"
                linkClass="page-link"
                onChange={handlePageChange.bind(this, itemsPerPage)}
              />
            </div>
          )}
          <div className="col-md-12">
            <div className="col-md-12">
              <button
                className="btn btn-sm btn-outline-success"
                disabled={isExcelLoading}
                onClick={getStockbalanceExcel}
              >
                Выгрузить в excel
              </button>

              {/* for PureBeauty */}
              {(companyData.id === "9" || companyData.id === "23") && (
                <button
                  className="btn btn-sm btn-outline-success ml-10"
                  disabled={isExcelLoading}
                  onClick={() => {
                    getStockbalanceExcelPure(barcode, selectedStock.value);
                  }}
                >
                  Выгрузка для "Мой Склад"
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
