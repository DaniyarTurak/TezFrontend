import React, { useState, useEffect } from "react";
import Axios from "axios";
import Moment from "moment";
import Alert from "react-s-alert";
import HistoryDetails from "./HistoryDetails";
import HistoryTable from "./HistoryTable";
import Grid from "@material-ui/core/Grid";
import InvoiceOptions from "./InvoiceOptions";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import { makeStyles } from "@material-ui/core/styles";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

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

export default function ReportInvoiceHistory({ companyProps, parameters }) {
  const classes = useStyles();
  const [barcode, setBarcode] = useState("");
  const [consignator, setConsignator] = useState(
    parameters && parameters.isCounterparties
      ? { label: parameters.customer, value: parameters.id }
      : { label: "Все", value: 0 }
  );
  const [consignators, setConsignators] = useState([]);
  const [dateFrom, setDateFrom] = useState(
    parameters
      ? Moment(parameters.date).format("YYYY-MM-DD")
      : Moment().format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [details, setDetails] = useState([]);
  const [invoicetype, setInvoicetype] = useState(
    parameters && parameters.type === 1
      ? {
          value: "17",
          label: "Возврат с консигнации",
        }
      : parameters
      ? {
          value: "16",
          label: "Передача на консигнацию",
        }
      : ""
  );
  const [invoicetypes, setInvoicetypes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isDateChanging, setDateChanging] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDetails, setLoadingDetails] = useState(false);
  const [isLoadingProducts, setLoadingProducts] = useState(false);
  const [markedInvoice, setMarkedInvoice] = useState(null);
  const [counterparty, setCounterparty] = useState({ label: "Все", value: 0 });
  const [counterparties, setCounterparties] = useState([]);
  const [paramState, setParamState] = useState(parameters);
  const [products, setProducts] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [selectedID, setSelectedID] = useState(null);
  const [stockFrom, setStockFrom] = useState({ label: "Все", value: 0 });
  const [stockList, setStockList] = useState([]);
  const [stockTo, setStockTo] = useState({ label: "Все", value: 0 });

  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    getInvoiceTypes();
    getProducts();
    if (!company) {
      getStockList();
    }
  }, []);

  useEffect(() => {
    if (isLoadingDetails) {
      document.body.style.cursor = "wait";
    } else document.body.style.cursor = "default";
  }, [isLoadingDetails]);

  //Данный эффект вызывается только при выполнении перехода из консгинационного отчёта по товарам.
  //Нужен чтобы автоматически заполнить все поля и отправить запрос.
  useEffect(() => {
    if (paramState) {
      getJurBuyers(paramState.customer);
    }
    if (paramState && !paramState.isCounterparties) {
      invoiceDetails({
        invoicedate: paramState.date,
        invoicenumber: paramState.invoice,
        invoicetypeid: "16",
      });
    }
  }, [paramState]);

  useEffect(() => {
    if (invoicetype.value && details.length === 0) {
      searchInvoices();
    }
    setInvoices([]);
    setDetails([]);
  }, [company]);

  useEffect(() => {
    if (!isDateChanging && invoicetype.value) {
      searchInvoices();
      setParamState("");
    }

    return () => {
      setDateChanging(false);
    };
  }, [invoicetype, dateFrom, dateTo, productSelectValue]);

  const getInvoiceTypes = () => {
    Axios.get("/api/invoice/types", {
      params: { invoicetypes: ["1", "2", "7", "0", "16", "17"] },
    })
      .then((res) => res.data)
      .then((list) => {
        const invoicetypesList = list.map((type) => {
          return {
            value: type.id,
            label: type.name,
          };
        });
        setInvoicetypes(invoicetypesList);
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
        ErrorAlert(err);
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

  const handleInvoiceTypeChange = (event, inv) => {
    setInvoicetype(inv);
    !paramState && setDetails([]);
    setConsignator({ label: "Все", value: 0 });
    setCounterparty({ label: "Все", value: 0 });
    if (inv.value === "2") {
      getCounterparties();
    }
    if (inv.value === "16" || inv.value === "17") {
      getJurBuyers();
    }
  };

  const handleStockFromChange = (event, s) => {
    setStockFrom(s);
  };

  const handleStockToChange = (event, s) => {
    setStockTo(s);
  };

  const handleCounterpartyChange = (event, p) => {
    setCounterparty(p);
  };

  const handleConsignatorChange = (event, c) => {
    setConsignator(c);
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

  const onProductChange = (event, p) => {
    if (!p.code) {
      setProductSelectValue({ value: "", label: "Все" });
      setBarcode("");
    } else {
      setProductSelectValue(p);
      setBarcode(p.code);
    }
  };

  const onBarcodeKeyDown = (e) => {
    if (e.keyCode === 13) getProductByBarcode(barcode);
  };

  const onProductListInput = (event, p, reason) => {
    if (reason === "input") getProducts(p);
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

  const handleSearch = () => {
    searchInvoices();
  };

  const searchInvoices = () => {
    if (!invoicetype.value) {
      return Alert.warning("Выберите тип накладной", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    setLoading(true);
    Axios.get("/api/report/history/invoices", {
      params: {
        prodID: productSelectValue.value,
        company,
        dateFrom,
        dateTo,
        invoicetype: invoicetype.value,
        stockFrom: stockFrom.value,
        stockTo: stockTo.value,
        counterpartie: counterparty.value,
        consignator: consignator.value,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setInvoices(res);

        !paramState && setDetails([]);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setDetails([]);
        setLoading(false);
      });
  };

  const getJurBuyers = (customer) => {
    Axios.get("/api/buyers", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const all = [{ label: "Все", value: "0" }];
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });
        if (customer) {
          options.forEach((e) => {
            if (e.label === customer) {
              setConsignator({ value: e.value, label: e.label });
            }
          });
        }
        setConsignators([...all, ...options]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCounterparties = () => {
    Axios.get("/api/counterparties/search", {
      params: { company },
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

  const getStockList = () => {
    Axios.get("/api/stock", { params: { company } })
      .then((res) => res.data)
      .then((res) => {
        const options = res.map((stock) => {
          return {
            value: stock.id,
            label: stock.name,
          };
        });

        const allStock = [{ value: "0", label: "Все" }];
        setStockList([...allStock, ...options]);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const invoiceDetails = (inv) => {
    setSelectedID(inv.invoicenumber);
    setMarkedInvoice(inv);
    setLoadingDetails(true);
    Axios.get("/api/report/history/invoice/details", {
      params: {
        company,
        invoicetype: inv.invoicetypeid,
        invoicenumber: inv.invoicenumber,
      },
    })
      .then((res) => res.data)
      .then((detailsList) => {
        setLoadingDetails(false);
        if (detailsList.length === 0) {
          return Alert.info("Товаров в данной накладной нет", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        const copyDetails = detailsList.slice();
        const detailNull = copyDetails.shift();
        if (detailNull.units === null) {
          return Alert.info("Детали по данной накладной отсутствуют", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        setDetails(detailsList);
        setLoading(false);
      })
      .catch((err) => {
        setLoadingDetails(false);
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const backToList = () => {
    setDetails([]);
    setMarkedInvoice(null);
    if (paramState) {
      searchInvoices();
    }
  };

  return (
    <Grid container spacing={3}>
      <InvoiceOptions
        changeDate={changeDate}
        consignator={consignator}
        consignators={consignators}
        counterparty={counterparty}
        counterparties={counterparties}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        handleInvoiceTypeChange={handleInvoiceTypeChange}
        handleStockFromChange={handleStockFromChange}
        handleStockToChange={handleStockToChange}
        handleCounterpartyChange={handleCounterpartyChange}
        handleConsignatorChange={handleConsignatorChange}
        handleSearch={handleSearch}
        invoicetype={invoicetype}
        invoicetypes={invoicetypes}
        stockList={stockList}
        stockTo={stockTo}
        stockFrom={stockFrom}
        barcode={barcode}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        productSelectValue={productSelectValue}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        products={products}
        isLoadingProducts={isLoadingProducts}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}
      {!isLoading &&
        invoices.length === 0 &&
        (!paramState || paramState.isCounterparties) && (
          <Grid item xs={12}>
            <p className={classes.notFound}>Накладные не найдены</p>
          </Grid>
        )}
      {!isLoading && invoices.length > 0 && details.length === 0 && (
        <HistoryTable
          classes={classes}
          invoices={invoices}
          invoiceDetails={invoiceDetails}
          invoicetype={invoicetype}
          selectedID={selectedID}
        />
      )}
      {details.length > 0 && !isLoadingDetails && (
        <HistoryDetails
          markedInvoice={markedInvoice}
          backToList={backToList}
          details={details}
          invoicetype={invoicetype}
          dateFrom={dateFrom}
          dateTo={dateTo}
          classes={classes}
        />
      )}
    </Grid>
  );
}
