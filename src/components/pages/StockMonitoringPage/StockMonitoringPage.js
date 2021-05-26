import React, { useState, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ProductMonitoring from './ProductMonitoring';
import CategoryMonitoring from './CategoryMonitoring';
import BrandMonitoring from './BrandMonitoring';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

export default function StockMonitoringPage() {

  const ParametrInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: "0px",
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      fontWeight: "bold",
      padding: '5px 40px 7px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);

  const [parametr, setParametr] = useState("brand");
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setParametr(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
          Добавление минимального остатка на
          &nbsp;
        <Select
            input={<ParametrInput />}
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={parametr}
            onChange={handleChange}
          >
            <MenuItem value={"brand"}>бренд</MenuItem>
            <MenuItem value={"category"}>категорию</MenuItem>
            <MenuItem value={"product"}>товар</MenuItem>
          </Select>
        </h6>
      </Grid>
      { parametr === "product" &&
        <ProductMonitoring />
      }
      { parametr === "category" &&
        <CategoryMonitoring />
      }
      { parametr === "brand" &&
        <BrandMonitoring />
      }
    </Fragment>
  );
}
