import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import Breadcrumb from "../../Breadcrumb";
import PageN1 from "./ChangePricePages/PageN1";
import PageN2 from "./ChangePricePages/PageN2";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  header: {
    padding: theme.spacing(2),
    fontWeight: 1000,
    color: theme.palette.text.initial,
  },
  actions: {
    padding: theme.spacing(2),
  },
}));

export default function ChangePrice({ history }) {
  const classes = useStyles();

  const [isWholesale, setWholeSale] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isSmaller, setisSmaller] = useState(false);
  const [oldPrice, setoldPrice] = useState([]);
  const [pages, setPages] = useState({
    n1: true,
    n2: false,
    width: "50%",
  });
  const [productList, setproductList] = useState(
    JSON.parse(sessionStorage.getItem("changePriceProductList")) || []
  );

  const breadcrumb = [
    { caption: "Товары" },
    { caption: "Изменения цен", active: true },
  ];
  const selectedPointsList = [];

  useEffect(() => {
    if (oldPrice.length > 0) {
      setisSmaller(true);
      setPages({ n1: true, n2: false, width: "50%" });
    }
  }, [oldPrice]);

  const productListFunc = (newproductList) => {
    setproductList(newproductList);
  };

  const paginate = (e) => {
    switch (e.target.name) {
      case "prevPgBtn":
        setPages({ n1: true, n2: false, width: "50%" });
        break;
      case "nextPgBtn":
        let newproductList = [];
        productList.forEach((e) => {
          if (e.oldPrice > e.price) newproductList.push(e);
        });
        setoldPrice(newproductList);
        setPages({ n1: false, n2: true, width: "100%" });
        break;
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    setisSubmitting(true);
    submitChangePrice();
  };

  const submitChangePrice = () => {
    let changes = [];
    let products = "";
    productList.forEach((product) => {
      product.selectedPoints.forEach((point) => {
        const change = {
          stockid: point.stockcurrentid,
          newprice: product.price,
          pieceprice: product.pieceprice,
          pointid: point.id,
          oldprice: product.oldPrice.toString(),
          new_wprice: product.wholesale_price,
          old_wprice: product.oldWholesale_price.toString()
        };

        changes.push(change);
      });
      products = product.id;
    });
    const reqdata = { changes: changes, product: products };
    Axios.post("/api/invoice/changeprice", reqdata)
      .then(() => {
        sessionStorage.removeItem("changePriceProductList");

        history.push({
          pathname: "/usercabinet/product",
          state: {
            fromChangePrice: true,
          },
        });
      })
      .catch((err) => {
        setisSubmitting(false);
        ErrorAlert(err);
      });
  };
  const handleGoBack = () => {
    setisSmaller(false);
    setPages({ n1: true, n2: false, width: "50%" });
  };

  return (
    <div className="product-change-price">
      <Fragment>
        <Dialog open={isSmaller}>
          <DialogTitle className={classes.header}>
            Вы выбрали цену меньше текущей цены для следующих товаров:
          </DialogTitle>

          <DialogContent>
            <List className={classes.root}>
              {oldPrice.map((e, idx) => (
                <ListItem key={e.name} divider>
                  <ListItemText
                    primary={e.name}
                    secondary={`Старая цена: ${e.oldPrice}, Новая цена: ${e.price}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGoBack} variant="outlined">
              Вернутся назад
            </Button>

            <Button
              variant="outlined"
              disabled={isSubmitting}
              color="primary"
              onClick={handleSubmit}
              autoFocus
            >
              {isSubmitting ? "Пожалуйста подождите" : "Отправить новые цены"}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
      <div className="progress mt-10" style={{ height: "1px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: pages.width }}
        />
      </div>

      <div className="mt-10">
        <Breadcrumb content={breadcrumb} />
      </div>

      {pages.n1 && <PageN1 productListProps={productListFunc} isWholesale={isWholesale} setWholeSale={setWholeSale} />}
      {pages.n2 && <PageN2 productList={productList} isWholesale={isWholesale} />}

      {productList.length > 0 && (
        <div className="text-right mt-20">
          {!pages.n1 && (
            <button
              name="prevPgBtn"
              className="btn btn-info"
              onClick={paginate}
            >
              Назад
            </button>
          )}

          {!pages.n2 && (
            <button
              name="nextPgBtn"
              className="btn btn-success ml-10"
              disabled={
                (pages.n1 && productList.length === 0) ||
                (pages.n2 && selectedPointsList.length === 0)
              }
              onClick={paginate}
            >
              Далее
            </button>
          )}

          {pages.n2 && (
            <button
              name="submit"
              disabled={isSubmitting}
              className="btn btn-success ml-10"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Пожалуйста подождите" : "Отправить новые цены"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
