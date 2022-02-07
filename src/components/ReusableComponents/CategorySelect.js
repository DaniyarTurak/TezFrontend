import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import DropdownTreeSelect from "react-dropdown-tree-select";
import Axios from '../../../node_modules/axios/index';
import "./CategorySelect.css";
import { makeStyles } from "@material-ui/core/styles";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}


function CategorySelect() {

  useEffect(() => {
    getCategories();
    assignObjectPaths(categories);
  }, [])

  const [categories, setCategories] = useState([])


  const getCategories = () => {
    Axios.get("/api/categories/get_categories")
      .then((res) => res.data)
      .then((data) => {
       let updatedData = data;
     
       setCategories(updatedData)
      })
      .catch((err) => console.log(err))
  }


  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {nodes.childs.length > 0
        ? nodes.childs.map((node) => renderTree(node))
        : null
      }
    </TreeItem>

  );
  
  console.log(categories)
  const onChange = (currentNode, selectedNodes) => {
    console.log("path::", currentNode.path);
  };
  
  const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach(k => {
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  };
  

  return (
    <Fragment>

      {/* <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        {categories.map((category) => {
          return (
            renderTree(category)
          )
        })}
      </TreeView> */}
      <DropdownTreeSelect 
        data={categories} 
        onChange={onChange} 
        // className="mdl-demo" 
        mode={"radioSelect"}
        texts={{placeholder: 'Категория'}}  
      />


    </Fragment>
  )
}

export default CategorySelect;
