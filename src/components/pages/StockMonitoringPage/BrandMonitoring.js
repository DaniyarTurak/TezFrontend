import React, { useState, Fragment, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Axios from "axios";
import Button from '@material-ui/core/Button';
import useDebounce from "../../ReusableComponents/useDebounce";
import BrandTable from './BrandTable';
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

export default function BrandMonitoring() {
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

  const [brands, setBrands] = useState([]);
  const [brandsWithMS, setBrandsWithMS] = useState([]);
  const [brand, setBrand] = useState("");
  const [minimalStock, setMinimalStock] = useState("");
  const [isSending, setSending] = useState(false);
  const [brandsSelect, setbrandsSelect] = useState([]);
  const debouncedBrand = useDebounce(brand, 500);
  const [brandsTemp, setBrandsTemp] = useState([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    getBrands();
    getMinimalStock();
  }, []);

  useEffect(() => {
    let arr = [];
    brandsTemp.forEach(element => {
      arr.push(element)
    });
    arr.unshift({ brand_id: 0, name: "?????? ????????????" });
    setbrandsSelect(arr);
  }, [brandsTemp]);

  const getBrands = () => {
    Axios.get("/api/brand/search")
      .then((res) => res.data)
      .then((list) => {
        let temp = [];
        list.forEach(element => {
          temp.push({ name: element.brand, brand_id: element.id })
        });
        setBrands(temp);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getMinimalStock = () => {
    Axios.get("/api/brand/withminimalstock")
      .then((res) => res.data)
      .then((list) => {
        setBrandsTemp(list);
        setBrandsWithMS(list);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  useEffect(
    () => {
        if (!debouncedBrand || debouncedBrand === "") {
          Axios.get("/api/brand/search", { params: { brand: "" } })
            .then((res) => res.data)
            .then((list) => {
              let temp = [];
              list.forEach(element => {
                temp.push({ name: element.brand, brand_id: element.id })
              });
              setBrands(temp);
            })
            .catch((err) => {
              ErrorAlert(err);
            });
        }
        else {
          if (debouncedBrand.trim().length > 0) {
            Axios.get("/api/brand/search", { params: { brand: brand } })
              .then((res) => res.data)
              .then((list) => {
                let temp = [];
                list.forEach(element => {
                  temp.push({ name: element.brand, brand_id: element.id })
                });
                setBrands(temp);
              })
              .catch((err) => {
                ErrorAlert(err);
              });
          };
        }

    },
    [debouncedBrand]
  );

  const addMinimalStock = () => {
    setSending(true);
    let brandid = "";
    if (!brand || brand === "") {
      ErrorAlert("???????????????? ??????????")
    }
    else {
      if (!minimalStock || minimalStock === "") {
        ErrorAlert("?????????????? ?????????????????????? ??????????????")
      }
      else {
        brands.forEach(brnd => {
          if (brnd.name === brand) {
            brandid = brnd.brand_id;
          }
        });
        const reqdata = {
          product: brandid,
          units: minimalStock,
          type: 3
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
              setBrand("");
              setMinimalStock("");
              getBrands();
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
    if (value !== "?????? ????????????" && value !== null) {
      brandsTemp.forEach(prod => {
        if (prod.name === value) {
          arr.push(prod);
        }
        setBrandsWithMS(arr);
      });
    }
    else {
      setBrandsWithMS(brandsTemp);
    }
  }
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <label>???????????????? ?????????? ???? ????????????: </label>
          <Autocomplete
            value={brand}
            noOptionsText="?????????? ???? ????????????"
            onChange={(e, value) => { setBrand(value) }}
            onInputChange={(event, value) => { setBrand(value) }}
            options={brands.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                classes={{
                  root: classes.root,
                }}
                {...params}
                placeholder="???????????????????????? ????????????"
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
      {brandsWithMS.length > 0 &&
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
                disabled={!enabled}
                options={brandsSelect.map((option) => option.name)}
                onChange={(e, value) => { searchBrand(value) }}
                noOptionsText="?????????? ???? ????????????"
                renderInput={(params) => (
                  <TextField
                    classes={{
                      root: classes.root,
                    }}
                    onChange={(e, value) => { searchBrand(e.target.value) }}
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
              <BrandTable
                brands={brandsWithMS}
                getMinimalStock={getMinimalStock}
                getBrands={getBrands}
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
