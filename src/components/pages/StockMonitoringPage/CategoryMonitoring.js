import React, { useState, Fragment, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Axios from "axios";
import Button from '@material-ui/core/Button';
import useDebounce from "../../ReusableComponents/useDebounce";
import CategoryTable from './CategoryTable';
import Alert from "react-s-alert";

const AddButton = withStyles((theme) => ({
  root: {
    color: "white",
    border: "1px solid #28a745",
    backgroundColor: "#28a745",
    '&:hover': {
      border: "1px solid #28a745",
      color: "#28a745",
      backgroundColor: "transparent",
    },
  },
}))(Button);

export default function CategoryMonitoring() {
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

  const [categories, setCategories] = useState([]);
  const [categoriesWithMS, setCategoriesWithMS] = useState([]);
  const [category, setCategory] = useState("");
  const [minimalStock, setMinimalStock] = useState("");
  const [isSending, setSending] = useState(false);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const debouncedCategory = useDebounce(category, 500);
  const [categoriesTemp, setCategoriesTemp] = useState([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    getCategories();
    getMinimalStock();
  }, []);

  useEffect(() => {
    let arr = [];
    categoriesTemp.forEach(element => {
      arr.push(element)
    });
    arr.unshift({ id: 0, category: "?????? ??????????????????" });
    setCategoriesSelect(arr);
  }, [categoriesTemp]);

  const getCategories = () => {
    Axios.get("/api/categories/search")
      .then((res) => res.data)
      .then((list) => {
        setCategories(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getMinimalStock = () => {
    Axios.get("/api/categories/withminimalstock")
      .then((res) => res.data)
      .then((list) => {
        setCategoriesTemp(list);
        setCategoriesWithMS(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };


  useEffect(
    () => {
      if (!debouncedCategory || debouncedCategory === "") {
          Axios.get("/api/categories/search", { params: { category: "" } })
            .then((res) => res.data)
            .then((list) => {
              setCategories(list);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
        else {
          if (debouncedCategory.trim().length > 0) {
            Axios.get("/api/categories/search", { params: { category: category } })
              .then((res) => res.data)
              .then((list) => {
                setCategories(list);
              })
              .catch((err) => {
                ErrorAlert(err);
              });
          };
        }
    },
    [debouncedCategory]
  );

  const addMinimalStock = () => {
    setSending(true);
    let categoryid = "";
    if (!category || category === "") {
      ErrorAlert("???????????????? ??????????????????")
    }
    else {
      if (!minimalStock || minimalStock === "") {
        ErrorAlert("?????????????? ?????????????????????? ??????????????")
      }
      else {
        categories.forEach(cat => {
          if (cat.name === category) {
            categoryid = cat.id;
          }
        });
        const reqdata = {
          product: categoryid,
          units: minimalStock,
          type: 2
        };
        console.log(reqdata);

        Axios.post("/api/stock/stockm/add", reqdata)
          .then((result) => {
            if (result.data.code === "success") {
              Alert.success("?????????????????????? ?????????????? ?????????????? ????????????????????", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
              });
              setCategory("");
              setMinimalStock("");
              getCategories("");
              getMinimalStock();
              setSending(false);
            }
            else {
              Alert.error(result.data.text, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
              })
              setSending(false);
            }
          })
          .catch((err) => {
            Alert.error(err, {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            }
            );
            setSending(false);
          });
      }
    }
  };

  const minimalStockChange = (e) => {
    setMinimalStock(e.target.value);
  };

  const searchBrand = (value) => {
    let arr = [];
    if (value !== "?????? ??????????????????" && value !== null) {
      categoriesTemp.forEach(prod => {
        if (prod.category === value) {
          arr.push(prod);
        }
        setCategoriesWithMS(arr);
      });
    }
    else {
      setCategoriesWithMS(categoriesTemp);
    }
  }
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <label>???????????????? ?????????????????? ???? ????????????: </label>
          <Autocomplete
            value={category}
            noOptionsText="?????????????????? ???? ????????????"
            onChange={(e, value) => { setCategory(value) }}
            onInputChange={(event, value) => { setCategory(value) }}
            options={categories.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                classes={{
                  root: classes.root,
                }}
                {...params}
                placeholder="???????????????????????? ??????????????????"
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <label>?????????????? ?????????????????????? ??????????????: </label>
          <TextField
            fullWidth
            classes={{
              root: classes.root,
            }}
            value={minimalStock}
            onChange={minimalStockChange}
            placeholder="?????????????????????? ??????????????"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={4}>
          <br />
          <AddButton
            onClick={addMinimalStock}
            disabled={isSending}
          >
            ????????????????
              </AddButton>
        </Grid>
      </Grid>
      {categoriesWithMS.length > 0 &&
        <Fragment>
          <br />
          <div className="empty-space"></div>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              ???????????? ?? ?????????????????????????? ?????????????????????? ????????????????
        </Grid>
            <Grid item xs={12} style={{ paddingBottom: "0px" }} >
              ?????????????? ?????????? ???? ??????????????:
        </Grid>
            <Grid item xs={6} style={{ paddingTop: "0px" }}>
              <Autocomplete
                id="prods"
                disabled={!enabled}
                options={categoriesSelect.map((option) => option.name)}
                onChange={(e, value) => { searchBrand(value) }}
                noOptionsText="?????????? ???? ????????????"
                renderInput={(params) => (
                  <TextField
                    classes={{
                      root: classes.root,
                    }}
                    {...params}
                    placeholder="???????????????? ??????????"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={12}>
              <CategoryTable
                categories={categoriesWithMS}
                getMinimalStock={getMinimalStock}
                getCategories={getCategories}
                enabled={enabled}
                setEnabled={setEnabled}
              />
            </Grid>
          </Grid>
        </Fragment>
      }
    </Fragment>
  );
}
