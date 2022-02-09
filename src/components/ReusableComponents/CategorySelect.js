import React, { useState, useEffect } from "react";
import { TreeSelect } from "antd";
import Axios from "../../../node_modules/axios/index";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import "antd/dist/antd.css";
import "./CategorySelect.css";

const CategorySelect = ({ setCategory, category }) => {
  const [categories, setCategories] = useState([]);
  const onChange = (e) => {
    setCategory(e);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    Axios.get("/api/categories/get_categories")
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <TreeSelect
      showSearch
      treeNodeFilterProp="label"
      style={{ width: "100%" }}
      value={category}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      treeLine={{ showLeafIcon: false }}
      onChange={onChange}
      treeData={categories}
      className="tree-select"
      placeholder="Категории"
    ></TreeSelect>
  );
};

export default CategorySelect;
