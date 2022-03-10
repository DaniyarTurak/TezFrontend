import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";
import AccordionAlert from "../../../ReusableComponents/AccordionAlert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IncomeOptions from "./IncomeOptions";
import IncomeTable from "./IncomeTable";

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
  },
  icon: {
    color: "#35a0f4",
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
}));

export default function ReportIncome({ companyProps }) {
  const classes = useStyles();
  const [attrval, setAttrVal] = useState({ value: "-1", label: "Все" });
  const [textAttrval, setTextAttrval] = useState("");
  const [attribute, setAttribute] = useState({
    value: -1,
    label: "Все",
    format: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState({ value: -1, label: "Все" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [counterparty, setCounterParty] = useState({
    value: -1,
    label: "Все",
  });
  const [counterparties, setCounterparties] = useState([]);
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [grouping, setGrouping] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [nds, setNds] = useState({ value: -1, label: "Все" });
  const [orderBy, setOrderBy] = useState("");
  const [points, setPoints] = useState([]);
  const [products, setProducts] = useState([]);
  const [point, setPoint] = useState({ value: -1, label: "Все" });
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [sales, setSales] = useState([]);
  const [isSearched, setSearched] = useState(false);

  const company = companyProps ? companyProps.value : "";
  const ndses = [
    { value: "-1", label: "Все" },
    { value: "0", label: "Без НДС" },
    { value: "1", label: "С НДС" },
  ];

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


  const clean = () => {
    setSales([]);
    setAttrVal({ value: "-1", label: "Все" });
    setBarcode("");
    setAttributeTypes([]);
    setAttribute({ value: "-1", label: "Все", format: "" });
    setNds({ value: "-1", label: "Все" });
    setSearched(false)
    setTextAttrval("")
    setCategory(undefined)
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

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
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

  const onProductChange = (e, p) => {
    if (!p.code) {
      setProductSelectValue({ value: "", label: "Все" });
      setBarcode("");
    } else {
      setProductSelectValue(p);
      setBarcode(p.code);
    }
  };

  const onPointChange = (e, p) => {
    setPoint(p);
  };

  const onCounterpartieChange = (e, c) => {
    setCounterParty(c);
  };

  const onBrandChange = (e, b) => {
    setBrand(b);
  };

  const onAttributeChange = (e, a) => {
    setAttribute(a);
    setAttrVal("");
    getAttributeTypes(a.value);
  };

  const onAttributeTypeChange = (e, a) => {
    setAttrVal(a);
    setTextAttrval(e.target.value);
  };

  const onGroupingChange = (e) => {
    setGrouping(e.target.checked);
    if(e.target.checked===false) {
      clean()
    }
  };

  const onNdsChange = (e, n) => {
    setNds(n);
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

  const getAttributes = () => {
    Axios.get("/api/attributes", { params: { deleted: false, company } })
      .then((res) => res.data)
      .then((attributesList) => {
        const all = [{ label: "Все", value: "-1" }];
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
        ErrorAlert(err);
      });
  };

  const getAttributeTypes = (sprid) => {
    Axios.get("/api/attributes/getsprattr", { params: { sprid, company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "-1" }];
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
        ErrorAlert(err);
      });
  };

  const getBrands = (inputValue) => {
    Axios.get("/api/brand/search", { params: { brand: inputValue, company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "-1" }];
        const brandsList = list.map((result) => {
          return {
            label: result.brand,
            value: result.id,
          };
        });
        setBrands([...all, ...brandsList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCategories = (inputValue) => {
    Axios.get("/api/categories/search", { params: { deleted: false, category: inputValue } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "-1" }];
        const categoriesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCategories([...all, ...categoriesList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCounterparties = (counterparty) => {
    Axios.get("/api/counterparties/search", {
      params: { counterparty, company },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "-1" }];
        const counterpartiesList = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCounterparties([...all, ...counterpartiesList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getPoints = () => {
    Axios.get("/api/point", { params: { company } })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "-1" }];
        const pointsList = list.map((point) => {
          return {
            label: point.name,
            value: point.id,
          };
        });

        setPoints([...all, ...pointsList]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getProductByBarcode = (b) => {
    setLoadingProducts(true);
    Axios.get("/api/products/barcode", { params: { barcode: b, company } })
      .then((res) => res.data)
      .then((res) => {
        const productValue = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(productValue);
        setLoadingProducts(false);
      })
      .catch((err) => {
        ErrorAlert(err);
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
        const all = [{ label: "Все", value: "-1" }];
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
        ErrorAlert(err);
      });
  };

  const handleSearch = () => {
    setSearched(true)
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

  // const getSales = () => {
  //   let notattr;
  //   if (grouping === false) {
  //     notattr = 0;
  //   } else notattr = 1;
  //   setLoading(true);
  //   Axios.get("/api/report/grossprofit", {
  //     params: {
  //       dateFrom,
  //       dateTo,
  //       barcode,
  //       company,
  //       counterparty: counterparty.value,
  //       point: point.value,
  //       category: category.value,
  //       brand: brand.value,
  //       attribute: attribute.value,
  //       attrval: attribute.format==="TEXT" ? textAttrval : attrval.label === "Все" ? "" : attrval.label,
  //       notattr,
  //       nds: nds.value,
  //     },
  //   })
  //     .then((res) => res.data)
  //     .then((salesRes) => {
  //       setSales(salesRes);
  //       setLoading(false);
  //       setOrderBy("");
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       ErrorAlert(err);
  //     });
  // };
  const getSales = () => {
    let notattr;
    if (grouping === false) {
      notattr = 0;
    } else notattr = 1;
    setLoading(true);
    Axios.get("/api/report/grossprofit/stock", {
      params: {
        startdate: Moment(dateFrom).format("YYYY-MM-DD"),
        enddate: Moment(dateTo).format("YYYY-MM-DD"),
        barcode,
        company,
        counterparty: counterparty.value,
        point: point.value,
        category: category,
        brand: brand.value,
        attribute: attribute.value,
        attrval: attribute.format==="TEXT" ? textAttrval === "" ? "-1" : textAttrval : attrval.label? attrval.label === "Все" ? "-1" : attrval.label : "-1",
        tax: nds.value,
      },
    })
      .then((res) => res.data)
      .then((salesRes) => {
        setSales(salesRes);
        setLoading(false);
        setOrderBy("");
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AccordionAlert
          classes={classes}
          text={`- с помощью фильтров Вы можете посмотреть валовую прибыль в различных разрезах, например, по всем продажам в определенной торговой точке, по всем продажам товаров от определенного поставщика, по всем продажам в конкретной категории, по всем продажам конкретного бренда, по всем продажам с определенными атрибутами (цветом, размером, объемом и т.д.), по определенным товарам с поиском по штрихкоду или по названию;
- валовая прибыль за период считается по фактическим ценам реализации с учетом оформленных скидок и себестоимости товаров, рассчитанной по методу FIFO;
- отрицательные значения означают возвраты товаров, т.е. корректировку ранее оформленных продаж;
- соответственно, отрицательная валовая прибыль для таких возвратов означает корректировку к ранее полученной валовой прибыли по таким ранее оформленным продажам.`}
          title={`Пояснение к отчёту`}
        />
      </Grid>
      <IncomeOptions
        attrval={attrval}
        textAttrval={textAttrval}
        attribute={attribute}
        attributes={attributes}
        attributeTypes={attributeTypes}
        barcode={barcode}
        brand={brand}
        brands={brands}
        category={category}
        categories={categories}
        changeDate={changeDate}
        counterparty={counterparty}
        counterparties={counterparties} 
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        grouping={grouping}
        handleSearch={handleSearch}
        isLoadingProducts={isLoadingProducts}
        isLoading={isLoading}
        nds={nds}
        ndses={ndses}
        onAttributeChange={onAttributeChange}
        onAttributeTypeChange={onAttributeTypeChange}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        onBrandChange={onBrandChange}
        onBrandListInput={onBrandListInput}
        onCounterpartieChange={onCounterpartieChange}
        onCounterpartieListInput={onCounterpartieListInput}
        setCategory={setCategory}
        onGroupingChange={onGroupingChange}
        onNdsChange={onNdsChange}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        onPointChange={onPointChange}
        point={point}
        points={points}
        products={products}
        productSelectValue={productSelectValue}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && !point && sales.length === 0 && isSearched && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Выберите торговую точку</p>
        </Grid>
      )}

      {!isLoading && point && sales.length === 0 && isSearched && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && sales.length > 0 && (
        <Grid item xs={12}>
          <IncomeTable
            ascending={ascending}
            classes={classes}
            dateFrom={dateFrom}
            dateTo={dateTo}
            orderBy={orderBy}
            orderByFunction={orderByFunction}
            point={point}
            sales={sales}
          />
        </Grid>
      )}
    </Grid>
  );
}
