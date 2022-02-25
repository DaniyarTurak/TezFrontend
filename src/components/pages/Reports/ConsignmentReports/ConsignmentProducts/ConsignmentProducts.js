import React, { useState, useEffect } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import alert from "react-s-alert";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import ConsignmentTable from "./ConsignmentTable";
import ConsignmentOptions from "./ConsginmentOptions";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
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
}));

export default function ConsginmentProducts({
  companyProps,
  changeParentReportMode,
  parameters,
}) {
  const [brand, setBrand] = useState({ label: "Все", value: "@" });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState({ label: "Все", value: "@" });
  const [categories, setCategories] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [consignator, setConsignator] = useState(
    parameters
      ? { label: parameters.customer, value: parameters.id }
      : { label: "Все", value: "0" }
  );
  const [consignators, setConsignators] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (parameters) {
      getJurBuyers(parameters.customer);
    }
  }, [parameters]);

  useEffect(() => {
    getBrands();
    getCategories();
    if (!parameters) getJurBuyers();
    getConsignment();
  }, []);

  const AlertFunction = (name) => {
    alert.warning(`Введите ${name}!`, {
      position: "top-right",
      effect: "bouncyflip",
      timeout: 2000,
    });
  };
  const getConsignment = () => {
    if (!consignator.value) {
      AlertFunction("Контрагента");
      return;
    } else if (!brand.value) {
      AlertFunction("Бренд");
      return;
    } else if (!category.value) {
      AlertFunction("Категорию");
      return;
    }
    setLoading(true);
    Axios.get("/api/report/consignment", {
      params: {
        brand: brand.value,
        category: category.value,
        consignator: consignator.value,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setConsignments(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBrands = (b) => {
    Axios.get("/api/brand/search", {
      params: { brand: b, company: companyProps },
    })
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

  const getCategories = (c) => {
    Axios.get("/api/categories/getcategories", {
      params: { deleted: false, company: companyProps },
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

  const getJurBuyers = (customer) => {
    Axios.get("/api/buyers", { params: { company: companyProps } })
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
        console.log(err);
      });
  };

  const onBrandChange = (event, b) => {
    setBrand(b);
  };

  const onCategoryChange = (event, c) => {
    setCategory(c);
  };

  const onConsignatorChange = (event, c) => {
    setConsignator(c);
  };

  const onBrandListInput = (event, b, reason) => {
    if (reason === "input") {
      getBrands(b);
    }
  };

  const onCategoryListInput = (event, c, reason) => {
    if (reason === "input") {
      getCategories(c);
    }
  };

  const onConsignatorListInput = (event, c, reason) => {
    if (reason === "input") {
      getJurBuyers(c);
    }
  };

  return (
    <Box>
      <ConsignmentOptions
        brand={brand}
        brands={brands}
        category={category}
        categories={categories}
        classes={classes}
        consignator={consignator}
        consignators={consignators}
        handleConsignment={getConsignment}
        onBrandChange={onBrandChange}
        onBrandListInput={onBrandListInput}
        onCategoryListInput={onCategoryListInput}
        onCategoryChange={onCategoryChange}
        onConsignatorChange={onConsignatorChange}
        onConsignatorListInput={onConsignatorListInput}
        isLoading={isLoading}
      />

      {consignments.length > 0 && !isLoading ? (
        <ConsignmentTable
          classes={classes}
          consignments={consignments}
          changeParentReportMode={changeParentReportMode}
        />
      ) : consignments.length === 0 && !isLoading ? (
        <div className={classes.notFound}>Товары не найдены</div>
      ) : (
        <TableSkeleton />
      )}
    </Box>
  );
}
