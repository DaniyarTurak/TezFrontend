import React, { useState, useEffect, Fragment } from "react";
import { TreeSelect } from "antd";
import Axios from "../../../node_modules/axios/index";
import "./CategorySelect.css";

const { SHOW_ALL } = TreeSelect;
const CategorySelect = ({ setCategory, category }) => {
  const [categories, setCategories] = useState([]);
  const onChange = (e) => {
    setCategory(e);
    console.log(e);
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
    <Fragment className="category-select">
      <TreeSelect
        showSearch
        treeNodeFilterProp="label"
        style={{ width: "100%" }}
        value={category}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        treeCheckable={true}
        showCheckedStrategy={SHOW_ALL}
        onChange={onChange}
        treeData={categories}
        className="tree-select"
        placeholder="Категории"
      />
    </Fragment>
  );
};

export default CategorySelect;
