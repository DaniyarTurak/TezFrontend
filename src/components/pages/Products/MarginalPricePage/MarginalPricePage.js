import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Searching from "../../../Searching";
import { RequiredField, LessThanZero, NotEqualZero } from "../../../../validation";
import _ from "lodash";
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
  const [productsWithStaticPrice, setProductsWithStaticPrice] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [listForSelect, setListForSelect] = useState([]);
  const [listForSelectStat, setListForSelectStat] = useState([]);
  const [productNameForSelect, setProductNameForSelect] = useState({ label: "Все товары", value: 0 });
  const [prodName, setProdName] = useState("");
  const [filteredProds, setFilteredProds] = useState([])
  const [save, setSave] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = (productName) => {
    setLoading(true);
    Axios.get("/api/products/withprice", { params: { productName } })
      .then((res) => res.data)
      .then((list) => {
        let opts = [];
        let stat = [];
        let optsstat = [];
        list.map((product) => {
          opts.push({ label: product.name, value: product.id })
          if (product.staticprice) {
            stat.push(product);
            optsstat.push({ label: product.name, value: product.id });
          }
        });
        let newStat = [];
        stat.forEach((element, i) => {
          element = { ...element, indx: i + 1, ischangedprice: false };
          newStat.push(element);
        });
        optsstat.unshift({ value: 0, label: "Все товары" });
        setProducts(list);
        setListForSelect(opts);
        setProductsWithStaticPrice(newStat);
        setFilteredProds(newStat);
        setListForSelectStat(optsstat);
        setLoading(false);
      })
      .catch((err) => {
        ErrorAlert(err);
        setLoading(false);
      });
  };

  const productOnChange = (e, data) => {
    let arr = productsWithStaticPrice;
    if (data && data.value !== 0) {
      arr.forEach(product => {
        if (product.id === data.value) {
          console.log(product.name)
          setProdName(product.name);
          setProductNameForSelect({ label: product.name, value: product.id });
          // setFilteredProds([{ ...product, indx: 1 }]);
          setFilteredProds([product]);
        }
      });
    }
    else {
      setFilteredProds(arr);
    }
  };

  const productOnInputChange = (e, name) => {
    setProdName(name);
  };

  const saveChanges = () => {
    setSave(!save);
  };

  const saveFalse = () => {
    setSave(false);
  };

  const makeDisabled = () => {
    setDisabled(true);
  }

  const makeEnabled = () => {
    setDisabled(false);
    setProductNameForSelect({ label: "Все товары", value: 0 });
  }

  return (
    <Fragment>
      <AddMarginalPrice getProducts={getProducts} isLoading={isLoading} products={products} listForSelect={listForSelect} />
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
            id="outlined-basic"
            disabled={isDisabled}
            options={listForSelectStat}
            value={productNameForSelect}
            onChange={productOnChange}
            noOptionsText="Товар не найден"
            onInputChange={productOnInputChange}
            filterOptions={(options) =>
              options.filter((option) => option !== "")
            }
            getOptionLabel={(option) => (option ? option.label : "")}
            getOptionSelected={(option, value) =>
              option.label === value.value
            }
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
        {productsWithStaticPrice.length > 0 && !isLoading && (
          <Grid item xs={12} >
            <MarginalPriceTable
              products={filteredProds}
              save={save}
              saveFalse={saveFalse}
              getProducts={getProducts}
              makeDisabled={makeDisabled}
              makeEnabled={makeEnabled}
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