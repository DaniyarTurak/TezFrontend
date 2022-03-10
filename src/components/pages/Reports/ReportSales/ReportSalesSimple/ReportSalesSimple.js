import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import SimpleSalesTable from "./SimpleSalesTable";
import SimpleSalesOptions from "./SimpleSalesOptions";
import SkeletonTable from "../../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import Moment from "moment";
import useDebounce from "../../../../ReusableComponents/useDebounce";

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

export default function ReportSalesSimple({ companyProps }) {
  const classes = useStyles();
  const company = companyProps ? companyProps.value : "";

  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState({ value: "@", label: "Все" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState(undefined);
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
  const [sales, setSales] = useState([]);
  const [selectedStock, setSelectedStock] = useState({
    value: "0",
    label: "Все",
  });
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [inputCounterparty, setInputCounterparty] = useState("");
  const debouncedCounterparty = useDebounce(inputCounterparty, 500);

  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));

  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(50);

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const dateFromChange = (e) => {
    setDateFrom(e);
  };

  const dateToChange = (e) => {
    setDateTo(e);
  };

  const handleSearch = () => {
    getTableData();
  };

  useEffect(() => {
    getBrands();
    getCounterparties();
    getProducts();
    getStockList();
  }, [company]);

  useEffect(() => {
    if (debouncedCounterparty) {
      if (
        debouncedCounterparty.trim().length === 0 ||
        debouncedCounterparty.trim() === "Все"
      ) {
        Axios.get("/api/counterparties/search", {
          params: { counterparty: "" },
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
      } else {
        if (
          debouncedCounterparty.trim().length >= 2 &&
          debouncedCounterparty.trim() !== "Все"
        ) {
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
        }
      }
    }
  }, [debouncedCounterparty]);

  const getTableData = () => {
    setIsLoading(true);
    const params = {
      barcode: barcode,
      brand: brand.value,
      category: category,
      stockID: selectedStock.value,
      counterparty: counterparty.value,
      dateFrom: Moment(dateFrom).format("L"),
      dateTo: Moment(dateTo).format("L"),
    };

    console.log("Parametters: ", params);

    Axios.get("/api/report/sales/simple", { params: params })
      .then((res) => res.data)
      .then((data) => {
        if (data.length === 0) {
          Alert.warning(`Нет данных`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
        setSales(data);
        setCurrentPage(0);
        setIsLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setIsLoading(false);
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
        ErrorAlert(err);
      });
  };

  const getProductByBarcode = (b) => {
    Axios.get("/api/products/barcode", { params: { barcode: b, company } })
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
        ErrorAlert(err);
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

  // const postExcel = () => {
  //   let today = new Date();
  //   const tableData = saledProducts.map(
  //     ({
  //       pointname,
  //       code,
  //       productname,
  //       price,
  //       purchaseprice,
  //       units,
  //       brand,
  //       category,
  //       counterparty,
  //       nds,
  //     }) => {
  //       return {
  //         point: pointname,
  //         code,
  //         name: productname,
  //         price,
  //         purchaseprice,
  //         units,
  //         brand,
  //         category,
  //         counterparty,
  //         nds,
  //       };
  //     }
  //   );

  //   Axios({
  //     method: "POST",
  //     url: "/api/report/stockbalance/simple/excel",
  //     data: {
  //       dat: `${today.getFullYear()}.${today.getMonth()}.${today.getDay()}`,
  //       company: company,
  //       products: tableData,
  //     },
  //     responseType: "blob",
  //   })
  //     .then((res) => res.data)
  //     .then((res) => {
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(new Blob([res]));
  //       link.download = `Остаток на складе ${selectedStock.label}.xlsx`;
  //       document.body.appendChild(link);
  //       link.click();

  //       Alert.success("Excel загрузилась!", {
  //         position: "top-right",
  //         effect: "bouncyflip",
  //         timeout: 3000,
  //       });
  //     })
  //     .catch((err) => {
  //       ErrorAlert(err);
  //     });
  // };

  // Get current posts
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sales.slice(indexOfFirstPost, indexOfLastPost);

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

  const onCounterpartieListInput = (event, c, reason) => {
    if (reason === "input") getCounterparties(c);
  };

  const handleCounterpartyChange = (event, p) => {
    setCounterparty(p);
  };

  const handleCounterpartyInputChange = (event, p) => {
    setInputCounterparty(p);
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

  return (
    <Grid container spacing={2}>
      <SimpleSalesOptions
        barcode={barcode}
        brand={brand}
        brands={brands}
        category={category}
        counterparty={counterparty}
        counterparties={counterparties}
        changeDate={changeDate}
        dateFrom={dateFrom}
        dateTo={dateTo}
        dateFromChange={dateFromChange}
        dateToChange={dateToChange}
        handleSearch={handleSearch}
        isLoading={isLoading}
        products={products}
        productSelectValue={productSelectValue}
        setCategory={setCategory}
        selectedStock={selectedStock}
        stockList={stockList}
        onBarcodeChange={onBarcodeChange}
        onBarcodeKeyDown={onBarcodeKeyDown}
        onBrandChange={onBrandChange}
        onBrandListInput={onBrandListInput}
        onCounterpartieChange={onCounterpartieChange}
        onCounterpartieListInput={onCounterpartieListInput}
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        onStockChange={onStockChange}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && typeof sales !== "undefined" && (
        <Grid item xs={12}>
          <SimpleSalesTable
            data={currentPosts}
            totalPosts={sales.length}
            classes={classes}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPaginate={onPaginate}
            onRowsPerPageChange={onRowsPerPageChange}
          />

          {/* <Grid item xs={12}>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={postExcel}
            >
              Выгрузить в excel
            </button>
          </Grid> */}
        </Grid>
      )}
    </Grid>
  );
}
