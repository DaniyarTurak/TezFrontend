import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Searching from "../../../Searching";
import Alert from "react-s-alert";
import ReactModal from "react-modal";
import ProductDetails from "../../Products/ProductDetails";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import StockbalanceOptions from "./StockbalanceOptions";
import { makeStyles } from "@material-ui/core/styles";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import StockbalanceTable from "./StockbalanceTable";

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

const useStyles = makeStyles((theme) => ({
  notFound: { textAlign: "center", color: theme.palette.text.secondary },
  hover: {
    cursor: "pointer",
    color: "#162ece",
    "&:hover": {
      color: "#09135b",
    },
  },
}));

export default function ReportStockBalance({ companyProps }) {
  const classes = useStyles();
  const [activePage, setActivePage] = useState(0);
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attrval, setAttrVal] = useState(
    attribute.format === "SPR" ? { value: "", label: "Все" } : ""
  );
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
  const [date, setDate] = useState(Moment().format("YYYY-MM-DD"));
  const [flag, setFlag] = useState(true);
  const [grouping, setGrouping] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
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
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const company = companyProps ? companyProps.value : "";

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
  }, [activePage, itemsPerPage]);

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

  const onDateChange = (date) => {
    setDateChanging(true);
    setDate(date);
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

  const onProductChange = (event, p) => {
    if (!p.code) {
      setProductSelectValue({ value: "", label: "Все" });
      setBarcode("");
    } else {
      setProductSelectValue(p);
      setBarcode(p.code);
    }
  };

  const onStockChange = (event, s) => {
    setSelectedStock(s);
  };

  const onCounterpartieChange = (event, c) => {
    setCounterParty(c);
  };

  const onBrandChange = (event, b) => {
    setBrand(b);
  };

  const onCategoryChange = (event, c) => {
    setCategory(c);
  };

  const onAttributeChange = (event, a) => {
    setAttribute(a);
    setAttrVal("");
    getAttributeTypes(a.value);
  };

  const onAttributeTypeChange = (event, a) => {
    setAttrVal(a);
  };

  const onGroupingChange = (event) => {
    setGrouping(event.target.checked);
  };

  const onConsignmentChange = (event) => {
    setConsignment(event.target.checked);
  };

  const onNdsChange = (event, n) => {
    if (nds.value) {
      setNds(n);
    }
  };

  const onProductListInput = (event, p, reason) => {
    if (reason === "input") getProducts(p);
  };

  const onCounterpartieListInput = (event, c, reason) => {
    if (reason === "input") getCounterparties(c);
  };

  const onBrandListInput = (event, b, reason) => {
    if (reason === "input") getBrands(b);
  };

  const onCategoryListInput = (event, c, reason) => {
    if (reason === "input") getCategories(c);
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
    setLoadingProducts(true);
    Axios.get("/api/products/barcode", { params: { barcode, company } })
      .then((res) => res.data)
      .then((res) => {
        const selected = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(selected);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingProducts(false);
      });
  };

  const getProducts = (productName) => {
    setLoadingProducts(true);
    Axios.get("/api/products", {
      params: { productName, company, report: true },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "" }];
        setLoadingProducts(false);
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
        setLoadingProducts(false);
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
      const page = activePage ? activePage + 1 : 1;
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

  const handlePageChange = (event, pN) => {
    setFlag(false);
    setPaginationLoading(true);
    setActivePage(pN);
  };

  const handleChangeRowsPerPage = (event) => {
    setFlag(false);
    setPaginationLoading(true);
    setItemsPerPage(+event.target.value);
    setActivePage(0);
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

  return (
    <Fragment>
      <ReactModal isOpen={modalIsOpen} style={customStyles}>
        <ProductDetails
          product={product}
          closeDetail={closeDetail}
          invoiceNumber={false}
        />
      </ReactModal>
      <Grid container spacing={2}>
        <StockbalanceOptions
          attrval={attrval}
          attribute={attribute}
          attributes={attributes}
          attributeTypes={attributeTypes}
          barcode={barcode}
          brand={brand}
          brands={brands}
          category={category}
          categories={categories}
          consignment={consignment}
          counterparty={counterparty}
          counterparties={counterparties}
          date={date}
          grouping={grouping}
          handleSearch={handleSearch}
          isLoading={isLoading}
          isLoadingProducts={isLoadingProducts}
          nds={nds}
          ndses={ndses}
          onAttributeTypeChange={onAttributeTypeChange}
          onBarcodeChange={onBarcodeChange}
          onBarcodeKeyDown={onBarcodeKeyDown}
          onConsignmentChange={onConsignmentChange}
          onDateChange={onDateChange}
          onGroupingChange={onGroupingChange}
          onNdsChange={onNdsChange}
          onProductChange={onProductChange}
          onProductListInput={onProductListInput}
          onStockChange={onStockChange}
          onCounterpartieChange={onCounterpartieChange}
          onCounterpartieListInput={onCounterpartieListInput}
          onBrandChange={onBrandChange}
          onBrandListInput={onBrandListInput}
          onCategoryChange={onCategoryChange}
          onCategoryListInput={onCategoryListInput}
          onAttributeChange={onAttributeChange}
          productSelectValue={productSelectValue}
          products={products}
          selectedStock={selectedStock}
          stockList={stockList}
        />

        {!isLoading && stockbalance.length === 0 && (
          <Grid item xs={12}>
            <p className={classes.notFound}>
              {(selectedStock.length === 0 && "Выберите склад или товар") ||
                (stockbalance.length === 0 && "Список товаров пуст")}
            </p>
          </Grid>
        )}

        {isLoading && (
          <Grid item xs={12}>
            <SkeletonTable />
          </Grid>
        )}

        {isPaginationLoading && <Searching className="text-center" />}

        {!isLoading && !isPaginationLoading && stockbalance.length > 0 && (
          <Fragment>
            <Grid item xs={12}>
              <StockbalanceTable
                stockbalance={stockbalance}
                activePage={activePage}
                itemsPerPage={itemsPerPage}
                handleProductDtl={handleProductDtl}
                totalcost={totalcost}
                totalprice={totalprice}
                totalunits={totalunits}
                totalCount={totalCount}
                isPaginationLoading={isPaginationLoading}
                pageRangeDisplayed={pageRangeDisplayed}
                handlePageChange={handlePageChange}
                isExcelLoading={isExcelLoading}
                getStockbalanceExcel={getStockbalanceExcel}
                classes={classes}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>

            <Grid item xs={12}>
              <button
                className="btn btn-sm btn-outline-success"
                disabled={isExcelLoading}
                onClick={getStockbalanceExcel}
              >
                Выгрузить в excel
              </button>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
}
