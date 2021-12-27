import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Alert from "react-s-alert";
import Grid from "@material-ui/core/Grid";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import SalesOptions from "./SalesOptions";
import SalesTable from "./SalesTable";
import { makeStyles } from "@material-ui/core/styles";
import useDebounce from "../../../ReusableComponents/useDebounce";
import SalesWithoutDateTable from "./SalesWithoutDateTable";

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
}));

export default function ReportSales({ companyProps }) {
  const classes = useStyles();
  const [ascending, setAscending] = useState(true);
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attrval, setAttrVal] = useState({ value: "", label: "Все" });
  const [textAttrval, setTextAttrval] = useState("");
  const [dateAttrval, setDateAttrval] = useState(null)
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
  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [grouping, setGrouping] = useState(false);
  const [withoutDate, setWithoutDate] = useState(false);
  const [handleGrouping, setHandleGrouping] = useState(false);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [point, setPoint] = useState({ value: "0", label: "Все" });
  const [points, setPoints] = useState([]);
  const [sales, setSales] = useState([]);
  const [type, setType] = useState({ value: "@", label: "Все" });
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);

  const [sellType, setSellType] = useState({ value: "@", label: "Все" });
  const sellTypes = [
    {
      value: "@", label: 'Все'
    },
    {
      value: "0", label: 'Розничная'
    },
    {
      value: "1", label: 'Оптовая'
    },
  ];

  const [clientType, setClientType] = useState({ value: "@", label: "Все" });

  const clientTypes = [
    {
      value: "@", label: 'Все'
    },
    {
      value: "0", label: 'Физ. лицо'
    },
    {
      value: "1", label: 'Юр. лицо'
    },
  ]

  const debouncedName = useDebounce(name, 500);
  const debouncedBarcode = useDebounce(barcode, 500);

  const company = companyProps ? companyProps.value : "";
  const companyData =
    JSON.parse(sessionStorage.getItem("isme-company-data")) || {};
  const now = Moment().format("DD.MM.YYYY HH:mm:ss");
  const types = [
    { value: "@", label: "Все" },
    { value: "0", label: "Продажи" },
    { value: "1", label: "Возвраты" },
  ];


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
      getProductsList();
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
      if (withoutDate) {
        getWithoutDate();
      }
      else {
        getSales();

      }
    }
    return () => {
      setDateChanging(false);
    };
  }, []);

  useEffect(
    () => {
      if (!debouncedName || debouncedName === "") {
        Axios.get("/api/products", { params: { productName: "" } })
          .then((res) => res.data)
          .then((list) => {
            setProducts(list);
          })
          .catch((err) => {
            ErrorAlert(err);
          });
      }
      else {
        if (debouncedName.trim().length >= 3) {
          Axios.get("/api/products", { params: { productName: name } })
            .then((res) => res.data)
            .then((list) => {
              setProducts(list);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        };
      }
    },
    [debouncedName]
  );

  useEffect(
    () => {
      if (debouncedBarcode) {
        if (debouncedBarcode.trim().length === 0) {
          Axios.get("/api/products/stockmonitoring", { params: { barcode: "" } })
            .then((res) => res.data)
            .then((list) => {
              setProducts(list);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
        else {
          if (debouncedBarcode.trim().length >= 3) {
            Axios.get("/api/products/stockmonitoring", { params: { barcode: barcode } })
              .then((res) => res.data)
              .then((list) => {
                setProducts(list);
              })
              .catch((err) => {
                ErrorAlert(err);
              });
          };
        }
      }
    },
    [debouncedBarcode]
  );

  const getProductsList = () => {
    Axios.get("/api/products", { productName: name })
      .then((res) => res.data)
      .then((list) => {
        setProducts(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };


  const clean = () => {
    // setSales([]);
    // setAttrVal("");
    // setTextAttrval("");
    // setAttributes([]);
    // setPoints([]);
    // setCounterparties([]);
    // setCategories([]);
    // setBrands([]);
    // setAttributeTypes([]);
    setAttrVal({ value: "", label: "Все" });
    setBarcode("");
    setBrand({ value: "@", label: "Все" });
    setBrands([]);
    setCategory({ value: "@", label: "Все" });
    setCategories([]);
    setCounterparties([]);
    setAttribute({ value: "@", label: "Все", format: "" });
    setSales([])
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

  const nameChange = (value) => {
    setName(value);
    setBarcode("");
    products.forEach(element => {
      if (element.name === value) {
        setBarcode(element.code);
      }
    });
  };

  const barcodeChange = (value) => {
    setBarcode(value);
    setName("");
    products.forEach(element => {
      if (element.code === value) {
        setName(element.name);
      }
    });
  };

  const dateFromChange = (e) => {
    setDateChanging(true);
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateChanging(true);
    setDateTo(e);
  };

  const onPointChange = (event, p) => {
    setPoint(p);
  };

  const onCounterpartieChange = (event, c) => {
    setCounterParty(c);
  };

  const onBrandChange = (event, b) => {
    setBrand(b);
  };

  const onTypeChange = (event, t) => {
    setType(t);
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
    setTextAttrval(event.target.value);
  };

  const onGroupingChange = (e) => {
    setGrouping(e.target.checked);
    if(e.target.checked===false) {
      clean()
    }
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
        ErrorAlert(err);
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
        ErrorAlert(err);
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
        ErrorAlert(err);
      });
  };

  const getCategories = (inputValue) => {
    Axios.get("/api/categories/search", {
      params: { deleted: false, category: inputValue, company },
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
        ErrorAlert(err);
      });
  };

  const getCounterparties = (counterparty) => {
    Axios.get("/api/counterparties/search", {
      params: { counterparty, company },
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
        ErrorAlert(err);
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
        ErrorAlert(err);
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
    } else if (dateFrom > dateTo || Moment(dateTo).format("YYYY-MM-DD") > Moment(dateFrom).add(1,'M').format("YYYY-MM-DD")  ) {
      return Alert.warning(`Заполните дату правильно`, {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    } else {
      if (withoutDate) {
        getWithoutDate();
      } else {
        getSales();
      }
    }
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
        code: barcode,
        counterparty: counterparty.value,
        point: point.value,
        category: category.value,
        brand: brand.value,
        transaction_type: type.value,
        sell_type: sellType.value,
        client_type: clientType.value,
        attribute: attribute.value,
        attrval: attribute.format==="TEXT" ? textAttrval : attribute.format==="DATE" ? dateAttrval : attrval.label === "Все" ? "" : attrval.label,
        notattr,
        company,
      },
    })
      .then((res) => res.data)
      .then((salesList) => {
        let temp = [];
        salesList.forEach((el, idx) => {
          temp.push({ ...el, num: idx + 1 })
        });
        setSales(temp);
        setLoading(false);
        setSubmitting(false);
        setHandleGrouping(true);
        setOrderBy("");
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const onWithoutDateChange = (e) => {
    setWithoutDate(e.target.checked);
    if (e.target.checked) {
      getWithoutDate();
    }
    else {
      getSales();
    }
  };

  const getWithoutDate = () => {
    setLoading(true);
    setSubmitting(true);

    Axios.get("/api/report/sales/withoutdate", {
      params: {
        barcode,
        counterparty: counterparty.value,
        point: point.value,
        category: category.value,
        brand: brand.value,
        transaction_type: type.value,
        sell_type: sellType.value,
        client_type: clientType.value,
        dateFrom,
        dateTo
      },
    })
      .then((res) => res.data)
      .then((salesList) => {
        let temp = [];
        salesList.forEach((el, idx) => {
          temp.push({ ...el, num: idx + 1 })
        });
        setSales(temp);
        setLoading(false);
        setSubmitting(false);
        setHandleGrouping(true);
        setOrderBy("");
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        setLoading(false);
        ErrorAlert(err);
      });
  }

  return (
    <Grid container spacing={3}>
      <SalesOptions
        attrval={attrval}
        textAttrval={textAttrval}
        attribute={attribute}
        attributes={attributes}
        attributeTypes={attributeTypes}
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
        isSubmitting={isSubmitting}
        onPointChange={onPointChange}
        onCounterpartieChange={onCounterpartieChange}
        onCounterpartieListInput={onCounterpartieListInput}
        onBrandChange={onBrandChange}
        onBrandListInput={onBrandListInput}
        onCategoryChange={onCategoryChange}
        onCategoryListInput={onCategoryListInput}
        onTypeChange={onTypeChange}
        onAttributeChange={onAttributeChange}
        onAttributeTypeChange={onAttributeTypeChange}
        onGroupingChange={onGroupingChange}
        point={point}
        points={points}
        type={type}
        types={types}
        barcode={barcode}
        barcodeChange={barcodeChange}
        name={name}
        setName={setName}
        setBarcode={setBarcode}
        nameChange={nameChange}
        products={products}
        withoutDate={withoutDate}
        onWithoutDateChange={onWithoutDateChange}
        clientType={clientType}
        setClientType={setClientType}
        sellType={sellType}
        setSellType={setSellType}
        clientTypes={clientTypes}
        sellTypes={sellTypes}
        dateAttrval={dateAttrval}
        setDateAttrval={setDateAttrval}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && !point && sales.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>Выберите торговую точку</p>
        </Grid>
      )}

      {!isLoading && point && sales.length === 0 && (
        <Grid item xs={12}>
          <p className={classes.notFound}>
            С выбранными фильтрами ничего не найдено
          </p>
        </Grid>
      )}

      {!isLoading && sales.length > 0 && !withoutDate && (
        <SalesTable
          ascending={ascending}
          companyData={companyData}
          dateFrom={dateFrom}
          dateTo={dateTo}
          grouping={grouping}
          handleGrouping={handleGrouping}
          now={now}
          orderBy={orderBy}
          orderByFunction={orderByFunction}
          point={point}
          sales={sales}
          name={name}
          withoutDate={withoutDate}

        />
      )}
      {!isLoading && sales.length > 0 && withoutDate && (
        <SalesWithoutDateTable
          ascending={ascending}
          companyData={companyData}
          dateFrom={dateFrom}
          dateTo={dateTo}
          grouping={grouping}
          handleGrouping={handleGrouping}
          now={now}
          orderBy={orderBy}
          orderByFunction={orderByFunction}
          point={point}
          sales={sales}
          name={name}
        />
      )}
    </Grid>
  );
}
