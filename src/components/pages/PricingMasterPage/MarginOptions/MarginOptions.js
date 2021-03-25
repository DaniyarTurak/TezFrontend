import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OptionsHeader from "./OptionsHeader";
import Brands from "./Brands";
import Categories from "./Categories";
import Products from "./Products";

const useStyles = makeStyles((theme) => ({
  option: {
    marginTop: "1rem",
    color: theme.palette.text.secondary,
  },
  labelRoot: {
    fontSize: ".875rem",
  },
  paragraph: {
    display: "flex",
    justifyContent: "center",
    opacity: "60%",
  },
}));

export default function MarginOptions() {
  const classes = useStyles();

  const [isToggleCategory, setToggleCategory] = useState(false);
  const [isToggleBrand, setToggleBrand] = useState(false);
  const [isToggleProduct, setToggleProduct] = useState(true);

  const toggleCategory = () => {
    setToggleBrand(false);
    setToggleCategory(true);
    setToggleProduct(false);
  };

  const toggleBrand = () => {
    setToggleBrand(true);
    setToggleCategory(false);
    setToggleProduct(false);
  };

  const toggleProduct = () => {
    setToggleBrand(false);
    setToggleCategory(false);
    setToggleProduct(true);
  };

  return (
    <div>
      <OptionsHeader
        isToggleBrand={isToggleBrand}
        toggleBrand={toggleBrand}
        isToggleCategory={isToggleCategory}
        toggleCategory={toggleCategory}
        isToggleProduct={isToggleProduct}
        toggleProduct={toggleProduct}
      />

      {isToggleProduct && <Products classes={classes} />}
      {isToggleCategory && <Categories classes={classes} />}
      {isToggleBrand && <Brands classes={classes} />}
    </div>
  );
}
