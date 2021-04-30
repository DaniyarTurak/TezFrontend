import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Searching from "../../../Searching";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import AddMarginalPrice from "./AddMarginalPrice";
import MarginalPriceTable from "./MarginalPriceTable";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const SaveButton = withStyles((theme) => ({
  root: {
    color: "white",
    border: "1px solid #17a2b8",
    backgroundColor: "#17a2b8",
    '&:hover': {
      border: "1px solid #17a2b8",
      color: "#17a2b8",
      backgroundColor: "transparent",
    },
  },
}))(Button);

export default function MarginalPricePage() {

  const useStyles = makeStyles(theme =>
    createStyles({
      root: {
        '& label.Mui-focused': {
          color: '#17a2b8',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#17a2b8',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ced4da',
          },
          '&:hover fieldset': {
            borderColor: '#ced4da',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#17a2b8',
          },
        },
      },
    })
  );
  const classes = useStyles();

  const [products, setProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedProd, setSelectedProd] = useState("");
  const [filteredProds, setFilteredProds] = useState([]);
  const [save, setSave] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    let arr = [];
    if (selectedProd === "Все товары") {
      arr = products;
      setFilteredProds(arr);
    }
    else {
      products.forEach(prod => {
        if (prod.name === selectedProd) {
          arr.push(prod);
        }
        setFilteredProds(arr);
      });
    }
  }, [selectedProd]);

  const getProducts = (productName) => {
    setLoading(true);
    Axios.get("/api/products/withprice", { params: { productName, type: "list" } })
      .then((res) => res.data)
      .then((list) => {

        let stat = [];
        list.map((product) => {
          if (product.staticprice !== null) {
            stat.push(product);
          }
        });

        let newStat = [];
        stat.forEach((element, i) => {
          element = { ...element, indx: i + 1, ischangedprice: false };
          newStat.push(element);
        });
        setProducts(newStat);
        setFilteredProds(newStat);
        let listProds = stat;
        listProds.unshift({ name: "Все товары" })
        setListProducts(listProds);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };


  const saveChanges = () => {
    setSave(!save);
  };

  const saveFalse = () => {
    setSave(false);
  };

  const makeDisabled = () => {
    setDisabled(true);
  };

  const makeEnabled = () => {
    setDisabled(false);
  };

  const [selectDisabled, setSelectDisable] = useState(false);

  const selectState = (state) => {
    setSelectDisable(state);
}

return (
  <Fragment>
    <AddMarginalPrice isLoading={isLoading} />
    <br />
    <div className="empty-space"></div>
    <br />
    <Grid item xs={12} >
      <h6 style={{ fontWeight: "bold" }}>Перечень товаров с предельной ценой</h6>
    </Grid>
    <Grid item xs={12} >
      Быстрый поиск по перечню:
      </Grid>
    <Grid container style={{ paddingBottom: "15px" }} spacing={3}>
      <Grid item xs={6}>
        <Autocomplete
          id="prods"
          disabled={selectDisabled}
          options={listProducts.map((option) => option.name)}
          onChange={(e, value) => { setSelectedProd(value) }}
          noOptionsText="Товар не найден"
          renderInput={(params) => (
            <TextField
              classes={{
                root: classes.root,
              }}
              {...params}
              placeholder="Выберите товар"
              variant="outlined"
              size="small"
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <SaveButton
          disabled={!isDisabled}
          onClick={saveChanges}
        >
          Cохранить изменения
          </SaveButton>
      </Grid>
    </Grid>
    {isLoading && <Searching />}
    <Fragment>
      {filteredProds.length > 0 && !isLoading && (
        <Grid item xs={12} >
          <MarginalPriceTable
            products={filteredProds}
            save={save}
            saveFalse={saveFalse}
            getProducts={getProducts}
            makeDisabled={makeDisabled}
            makeEnabled={makeEnabled}
            selectState={selectState}
          />
        </Grid>
      )}
    </Fragment>
    {products.length === 0 && !isLoading && (
      <Grid item xs={12} >
        Товары не найден
      </Grid>
    )}
  </Fragment>
);
};