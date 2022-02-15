import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import ProductTable from "./ProductTable";
import ProductOptions from "./ProductOptions";

import SkeletonTable from "../../../Skeletons/TableSkeleton";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import Moment from "moment";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "500px",
//     zIndex: 11,
//   },
//   overlay: { zIndex: 10 },
// };

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

export default function ReportProductPerTransfer({ companyProps }) {
  const classes = useStyles();
  const [date, setDate] = useState(new Date());
  const [attribute, setAttribute] = useState({
    value: "@",
    label: "Все",
    format: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attrval, setAttrVal] = useState("");
  const [dateAttrval, setDateAttrval] = useState(null);
  const [selectedStock, setSelectedStock] = useState({
    value: "0",
    label: "Все",
  });
  const [selectedTableStock, setSelectedTableStock] = useState(false);
  const [stockList, setStockList] = useState([]);

  const [productsperiod, setProductsPeriod] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(50);

  const company = companyProps ? companyProps.value : "";

  useEffect(() => {
    getAttributes();
    getStockList();
  }, [company]);

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

    setProductsPeriod([]);
    getProductsPeriod();
  };

  const getProductsPeriod = () => {
    setLoading(true);
    const parameters = {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      point: selectedStock.value,
    };

    const val = attrval || dateAttrval;

    if (attribute.value !== "@") {
      parameters["attribute"] = attribute.value;
    }
    if (val) {
      parameters["value"] = val.label;
    }

    // let val;
    // if (attribute.format === "DATE") {
    //   val = dateAttrval || "";
    // } else {
    //   val = attrval || "";
    // }

    // ?month=${date.getMonth() +
    //   1}&year=${date.getFullYear()}${
    //   selectedStock.value === "0" ? `` : `&point=${selectedStock.value}`
    // }${attribute.value === "@" ? `` : `&attribute=${attribute.value}`}${
    //   val.label !== "Все" ? `&value=${val.label}` : ``
    // }

    Axios.get(`http://tezportal.ddns.net/api/report/movement/product`, {
      params: parameters,
    })
      .then((res) => {
        return res.data;
      })
      .then((productsList) => {
        if (productsList.length > 0) {
          setLoading(false);
          setProductsPeriod(productsList);
          setSelectedTableStock(selectedStock);
        } else {
          setLoading(false);
          Alert.warning(`Нету данных по этому времени`, {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 3000,
          });
        }
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
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
        ErrorAlert(err);
      });
  };

  const getAttributeTypes = (sprid) => {
    if (isNumeric(sprid)) {
      Axios.get("/api/attributes/getsprattr", { params: { sprid, company } })
        .then((res) => res.data)
        .then((attributeTypes) => {
          const all = [{ label: "Все", value: -1 }];
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
          ErrorAlert(err);
        });
    }
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

  const postProductsPeriodExcel = () => {
    let today = new Date();
    const tableData = productsperiod.map(
      ({ product, code, name, income, outcome, units }) => {
        return {
          id: product,
          code,
          name,
          income,
          outcome,
          units,
        };
      }
    );

    Axios({
      method: "POST",
      url: "/api/report/movement/product/excel",
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
        link.download = `Отчет по товарам за период ${date}.xlsx`;
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

  const onAttributeChange = (event, a) => {
    setAttribute(a);
    getAttributeTypes(a.value);
    setAttrVal("");
  };

  const onAttributeTextFieldChange = (event) => {
    event.preventDefault();
    setAttrVal(event.target.value);
  };

  const onAttributeTypeChange = (event, a) => {
    setAttrVal({ value: a.value, label: a.label });
  };

  const onDateChange = (date) => {
    setDate(date);
  };

  const onStockChange = (event, s) => {
    setSelectedStock(s);
  };

  // Get current posts
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = productsperiod.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onRowsPerPageChange = (event) => {
    setPostsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  return (
    <Grid container spacing={2}>
      <ProductOptions
        attribute={attribute}
        attributes={attributes}
        attributeTypes={attributeTypes}
        attrval={attrval}
        date={date}
        dateAttrval={dateAttrval}
        handleSearch={handleSearch}
        setDateAttrval={setDateAttrval}
        selectedStock={selectedStock}
        stockList={stockList}
        onAttributeChange={onAttributeChange}
        onAttributeTextFieldChange={onAttributeTextFieldChange}
        onAttributeTypeChange={onAttributeTypeChange}
        onDateChange={onDateChange}
        onStockChange={onStockChange}
      />

      {isLoading && (
        <Grid item xs={12}>
          <SkeletonTable />
        </Grid>
      )}

      {!isLoading && productsperiod.length > 0 && (
        <Fragment>
          <Grid item xs={12}>
            <ProductTable
              classes={classes}
              currentPage={currentPage}
              paginate={paginate}
              productsperiod={currentPosts}
              postsPerPage={postsPerPage}
              totalPosts={productsperiod.length}
              selectedStock={selectedTableStock}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </Grid>

          <Grid item xs={12}>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={postProductsPeriodExcel}
            >
              Выгрузить в excel
            </button>
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
}
