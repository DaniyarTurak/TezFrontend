import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import SaledProductsTable from "./SaledProductsTable";
import SaledProductsOptions from "./SaledProductsOptions";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import Moment from "moment";
import useDebounce from "../../../ReusableComponents/useDebounce";

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

export default function ReportSaledProducts({ companyProps }) {
  const company = companyProps ? companyProps.value : "";
  const classes = useStyles();
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState({ value: "@", label: "Все" });
  const [brands, setBrands] = useState([]);
  const [counterparty, setCounterparty] = useState({
    value: "0",
    label: "Все",
  });
  const [counterparties, setCounterparties] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [inputCounterparty, setInputCounterparty] = useState("");
  const debouncedCounterparty = useDebounce(inputCounterparty, 500);
  const [saledProducts, setSaledProducts] = useState([]);
  const [selectedStock, setSelectedStock] = useState({
    value: "0",
    label: "Все",
  });
  const [stockList, setStockList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(50);

  useEffect(() => {
    getTableData();
    getBrands();
    getCounterparties();
    getProducts();
    getStockList();
  }, [company]);

  const getTableData = () => {
    Axios.get("/api/report/stockbalance/saledproducts")
      .then((res) => res.data)
      .then((data) => {
        setSaledProducts(data);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getProducts = (productName) => {
    //setLoadingProducts(true);
    Axios.get("/api/products", {
      params: { productName, company, report: true },
    })
      .then((res) => res.data)
      .then((list) => {
        const all = [{ label: "Все", value: "" }];
        //setLoadingProducts(false);
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
        ///setLoadingProducts(false);
        ErrorAlert(err);
      });
  };

  const getProductByBarcode = (b) => {
    //setLoadingProducts(true);
    Axios.get("/api/products/barcode", { params: { barcode: b, company } })
      .then((res) => res.data)
      .then((res) => {
        const selected = {
          value: res.id,
          label: res.name,
          code: res.code,
        };
        setProductSelectValue(selected);
        //setLoadingProducts(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        //setLoadingProducts(false);
      });
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
        ErrorAlert(err);
      });
  };

  const getCounterparties = () => {
    Axios.get("/api/counterparties/search", {
      params: { counterparty: inputCounterparty },
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

  // Get current posts
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = saledProducts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const onPaginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onRowsPerPageChange = (event) => {
    setPostsPerPage(+event.target.value);
    setCurrentPage(0);
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

  const onBrandChange = (event, b) => {
    setBrand(b);
  };

  const onBrandListInput = (event, b, reason) => {
    if (reason === "input") getBrands(b);
  };

  const onCounterpartieChange = (event, c) => {
    setCounterparty(c);
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

  const onProductListInput = (event, p, reason) => {
    if (reason === "input") getProducts(p);
  };

  const onStockChange = (event, s) => {
    setSelectedStock(s);
  };

  const handleCounterpartyChange = (event, p) => {
    setCounterparty(p);
  };

  const handleCounterpartyInputChange = (event, p) => {
    setInputCounterparty(p);
  };

  return (
    <Grid container spacing={2}>
      <SaledProductsOptions
        barcode={barcode}
        brand={brand}
        brands={brands}
        counterparty={counterparty}
        counterparties={counterparties}
        handleCounterpartyChange={handleCounterpartyChange}
        handleCounterpartyInputChange={handleCounterpartyInputChange}
        productSelectValue={productSelectValue}
        products={products}
        saledProducts={saledProducts}
        selectedStock={selectedStock}
        stockList={stockList}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        onBrandChange={onBrandChange}
        onStockChange={onStockChange}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
      />

      <Fragment>
        <Grid item xs={12}>
          <SaledProductsTable
            classes={classes}
            saledProducts={currentPosts}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            totalPosts={saledProducts.length}
            onPaginate={onPaginate}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Grid>
      </Fragment>
    </Grid>
  );
}
