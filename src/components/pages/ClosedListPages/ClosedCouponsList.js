import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import Axios from "axios";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Categories from "../Products/CouponsPage/ExistingCoupons/Categories";
import Brands from "../Products/CouponsPage/ExistingCoupons/Brands";
import Products from "../Products/CouponsPage/ExistingCoupons/Products";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#bdbdbd",
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

export default function ClosedCouponsList({ isHidden }) {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isHidden) getClosedCoupons();
  }, [isHidden]);

  const getClosedCoupons = () => {
    setLoading(true);
    Axios.get("/api/coupons", { params: { active: "0" } })
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
          inactive={true}
          classes={classes}
          categories={categories}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Категории не найдены</div>
      )}
      {brands.length > 0 ? (
        <Brands
          inactive={true}
          classes={classes}
          brands={brands}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Бренды не найдены</div>
      )}
      {products.length > 0 ? (
        <Products
          inactive={true}
          classes={classes}
          products={products}
          StyledTableCell={StyledTableCell}
          StyledTableRow={StyledTableRow}
        />
      ) : (
        <div className={classes.notFound}>Товары не найдены</div>
      )}
    </div>
  ) : (
    <div>
      <TableSkeleton />
      <TableSkeleton />
      <TableSkeleton />
    </div>
  );
}
