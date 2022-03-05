import React, { useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import SkeletonTable from "../../../Skeletons/TableSkeleton";
import Moment from "moment";
import Alert from "react-s-alert";
import IlliquidTable from "./IlliquidTable";
import IlliquidOptions from "./IlliquidOptions";
import AccordionAlert from "../../../ReusableComponents/AccordionAlert";
import { makeStyles } from "@material-ui/core/styles";

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

const ReportIlliquidProducts = ({ companyProps }) => {
  const classes = useStyles();
  const [illiquidProducts, setIlliquidProducts] = useState();
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState({ value: "@", label: "Все" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [productSelectValue, setProductSelectValue] = useState({
    value: "",
    label: "Все",
  });
  const [selectedStock, setSelectedStock] = useState({
    value: "0",
    label: "Все",
  });
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(50);

  const [dateFrom, setDateFrom] = useState(Moment().format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));

  const company = companyProps ? companyProps.value : "";

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

  useEffect(() => {
    getBrands();
    getProducts();
    getStockList();
  }, [company]);

  const handleSearch = () => {
    getIlliquidProducts();
  };

  const getIlliquidProducts = () => {
    setIsLoading(true);

    const params = {
      barcode: barcode,
      brand: brand.value,
      category: category,
      stockID: selectedStock.value,
      dateFrom: Moment(dateFrom).format("L"),
      dateTo: Moment(dateTo).format("L"),
    };

    Axios.get(`/api/report/illiquidproducts`, { params: params })
      .then((res) => res.data)
      .then((illiquidList) => {
        if (illiquidList.length === 0) {
          Alert.warning(`Нет данных`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
          setIlliquidProducts(undefined);
        } else {
          setIlliquidProducts(illiquidList);
        }
        setCurrentPage(0);
        setIsLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setIsLoading(false);
      });
  };

  const postExcel = () => {
    let today = new Date();
    const tableData = illiquidProducts.map(
      ({ id, code, point_name, product_name, category, brand }) => {
        return {
          id,
          code,
          point_name,
          product_name,
          category,
          brand,
        };
      }
    );

    Axios({
      method: "POST",
      url: "/api/report/illiquidproducts/excel",
      data: {
        dat: `${today.getFullYear()}.${today.getMonth()}.${today.getDay()}`,
        company: company,
        products: tableData,
      },
      responseType: "blob",
    })
      .then((res) => res.data)
      .then((res) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res]));
        link.download = `Отчет по неликвидным товарам за период ${dateFrom} - ${dateTo}.xlsx`;
        document.body.appendChild(link);
        link.click();

        Alert.success("Excel загрузилась!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
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

  // Get current posts
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    typeof illiquidProducts !== "undefined"
      ? illiquidProducts.slice(indexOfFirstPost, indexOfLastPost)
      : "";

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
      <Grid item xs={12}>
        <AccordionAlert
          classes={classes}
          text={`- отчет предназначен для выявления непроданных товаров за указанный период времени; 
- с помощью фильтров Вы можете посмотреть неликвидные товары в различных разрезах, например, по неликвидности товаров в определенной торговой точке, по неликвидностям в конкретной категории, по неликвидности конкретного бренда, по определенным товарам с поиском по штрихкоду или по названию;`}
          title={`Пояснение к отчёту`}
        />
      </Grid>
      <IlliquidOptions
        barcode={barcode}
        brand={brand}
        brands={brands}
        category={category}
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
        onProductChange={onProductChange}
        onProductListInput={onProductListInput}
        onStockChange={onStockChange}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && typeof illiquidProducts !== "undefined" && (
        <Grid item xs={12}>
          <IlliquidTable
            data={currentPosts}
            totalPosts={illiquidProducts.length}
            classes={classes}
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            onPaginate={onPaginate}
            onRowsPerPageChange={onRowsPerPageChange}
          />

          <Grid item xs={12}>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={postExcel}
            >
              Выгрузить в excel
            </button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ReportIlliquidProducts;
