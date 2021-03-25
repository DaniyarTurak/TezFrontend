import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import alert from "react-s-alert";
import TableSkeleton from "../../../../Skeletons/TableSkeleton";
import Axios from "axios";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Categories from "./Categories";
import Brands from "./Brands";
import Products from "./Products";
//import { Alert, AlertTitle } from "@material-ui/lab";
import ShowInactive from "../../../ClosedListPages/ShowInactive";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#17a2b8",
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  notFound: {
    marginTop: "1rem",
    opacity: "60%",
    display: "flex",
    justifyContent: "center",
  },
});

export default function ExistingCoupons() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = () => {
    setLoading(true);
    Axios.get("/api/coupons", { params: { active: "1" } })
      .then((res) => res.data)
      .then((res) => {
        let categoriesChanged = [];
        let brandsChanged = [];
        let productsChanged = [];
        res.forEach((e) => {
          if (e.objtype === "На категорию") {
            categoriesChanged.push(e);
          } else if (e.objtype === "На бренд") {
            brandsChanged.push(e);
          } else {
            productsChanged.push(e);
          }
        });

        setCategories([...categoriesChanged]);
        setBrands([...brandsChanged]);
        setProducts([...productsChanged]);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const handleDelete = (row, e) => {
    Axios.post("/api/coupons/del", { id: row.id })
      .then(() => {
        getCoupons();
        alert.success("Купон удалён успешно!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return !isLoading ? (
    <div>
      {/* <Alert style={{ marginTop: "1rem" }} severity="info">
        <AlertTitle>
          <strong>Внимание!</strong>
        </AlertTitle>
        В случае наличия у товара общих скидок (по категории/по бренду/по
        товару), скидка по сроку годности будет применена в любом случае. Вы
        можете настроить применение общих скидок в соответствующем разделе.
      </Alert> */}
      {categories.length > 0 ? (
        <Categories
          inactive={false}
          classes={classes}
          categories={categories}
          handleDelete={handleDelete}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Категории не найдены</div>
      )}
      {brands.length > 0 ? (
        <Brands
          inactive={false}
          classes={classes}
          brands={brands}
          handleDelete={handleDelete}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Бренды не найдены</div>
      )}
      {products.length > 0 ? (
        <Products
          inactive={false}
          classes={classes}
          products={products}
          handleDelete={handleDelete}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Товары не найдены</div>
      )}
      <ShowInactive mode="coupons" />
    </div>
  ) : (
    <div className="is-loading-upload">
      <div className="loader">
        <div className="icon" />
      </div>
      <TableSkeleton />
      <TableSkeleton />
      <TableSkeleton />
    </div>
  );
}
