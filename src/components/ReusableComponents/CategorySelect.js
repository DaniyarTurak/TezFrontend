import React, { useEffect, useState } from "react";
import '../../../node_modules/rc-tree/assets/index.css';
import TreeSelect, { TreeNode, SHOW_PARENT } from "rc-tree-select";
import Axios from "../../../node_modules/axios/index";

function CategorySelect() {
  const [tsOpen, setTsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [lv, setLv] = useState({ value: "", label: "" });

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    Axios.get("/api/categories/get_categories")
      .then((res) => res.data)
      .then((data) => {
        let updatedData = data;

        setCategories(updatedData);
      })
      .catch((err) => console.log(err));
  };

  const isLeaf = (value) => {
    if (!value) {
      return false;
    }
    let queues = [...categories];
    while (queues.length) {
      // BFS
      const item = queues.shift();
      if (item.value === value) {
        if (!item.children) {
          return true;
        }
        return false;
      }
      if (item.children) {
        queues = queues.concat(item.children);
      }
    }
    return false;
  };

  const findPath = (value, data) => {
    const sel = [];
    function loop(selected, children) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        if (selected === item.value) {
          sel.push(item);
          return;
        }
        if (item.children) {
          loop(selected, item.children, item);
          if (sel.length) {
            sel.push(item);
            return;
          }
        }
      }
    }
    loop(value, data);
    return sel;
  };

  const onClick = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSearch = (value, ...args) => {
    console.log("Do Search:", value, ...args);
    setSearchValue(value);
  };

  const onChange = (value, ...rest) => {
    console.log("onChange", value, ...rest);
    setValue(value);
  };

  const onChangeChildren = (...args) => {
    const preValue = value;
    console.log("onChangeChildren", ...args);
    const value = args[0];
    const pre = value ? preValue : undefined;
    setValue(isLeaf(value) ? value : pre);
  };

  const onChangeLV = (value, ...args) => {
    console.log("labelInValue", value, ...args);
    if (!value) {
      setLv(undefined);
      return;
    }
    const path = findPath(value.value, categories)
      .map((i) => i.label)
      .reverse()
      .join(" > ");
    setLv({ value: value.value, label: path });
  };

  const onSelect = (...args) => {
    // use onChange instead
    console.log(args);
  };

  const onDropdownVisibleChange = (visible, info) => {
    console.log(visible, value, info);
    if (Array.isArray(value) && value.length > 1 && value.length < 3) {
      window.alert("please select more than two item or less than one item.");
      return false;
    }
    return true;
  };

  const filterTreeNode = (input, child) => {
    return String(child.props.title).indexOf(input) === 0;
  };

  return (
    <TreeSelect
      style={{ width: 300 }}
      transitionName="rc-tree-select-dropdown-slide-up"
      choiceTransitionName="rc-tree-select-selection__choice-zoom"
      dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
      placeholder={<i>Категории</i>}
      searchPlaceholder="Поиск"
      showSearch
      allowClear
      treeLine
      searchValue={searchValue}
      value={value}
      treeData={categories}
      treeNodeFilterProp="label"
      filterTreeNode={false}
      onSearch={onSearch}
      open={tsOpen}
      onChange={(val, ...args) => {
        console.log("onChange", val, ...args);
        if (val === "") {
          setTsOpen(true);
        } else {
          setTsOpen(false);
        }
        setValue(val)
      }}
      onDropdownVisibleChange={(v, info) => {
        console.log("single onDropdownVisibleChange", v, info);
        // document clicked
        if (info.documentClickClose && value === "") {
          return false;
        }
        setTsOpen(v)
        return true;
      }}
      onSelect={onSelect}
    />
  );
}

export default CategorySelect;
