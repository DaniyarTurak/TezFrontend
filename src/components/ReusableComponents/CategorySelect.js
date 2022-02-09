// import React, { useState, Fragment, useEffect } from 'react';
// import DropdownTreeSelect from "react-dropdown-tree-select";
// import Axios from '../../../node_modules/axios/index';
// import "./CategorySelect.css";



// function CategorySelect({onCategoryChange, setCategory}) {

//   useEffect(() => {
//     getCategories();
//     assignObjectPaths(categories);
//   }, [])

//   const [categories, setCategories] = useState([])


//   const getCategories = () => {
//     Axios.get("/api/categories/get_categories")
//       .then((res) => res.data)
//       .then((data) => {
//        let updatedData = data;
     
//        setCategories(updatedData)
//       })
//       .catch((err) => console.log(err))
//   }

//   const onChange = (currentNode, selectedNodes) => {
//     setCategory(currentNode)
//     console.log(currentNode)
//   };
  
//   const assignObjectPaths = (obj, stack) => {
//     Object.keys(obj).forEach(k => {
//       const node = obj[k];
//       if (typeof node === "object") {
//         node.path = stack ? `${stack}.${k}` : k;
//         assignObjectPaths(node, node.path);
//       }
//     });
//   };
  

//   return (
//     <Fragment>
//       <DropdownTreeSelect 
//         data={categories} 
//         onChange={onChange}
//         className="treeview-selector" 
//         mode={"radioSelect"}
//         texts={{label: 'Категории'}}  
//       />


//     </Fragment>
//   )
// }

// export default CategorySelect;
