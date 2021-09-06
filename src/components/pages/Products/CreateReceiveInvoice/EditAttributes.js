import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import SweetAlert from "react-bootstrap-sweetalert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function AddAttribute({
  readyOpt,
  setReadyOpt,
  clearBoard,
  changeState,
  attributescaption,
  editAttrubutes,
  setDeleted,
  attrIdandValue,
  setAttrIdandValue,
  newAttrs,
  setNewAttrs,

  productAttributes,
  setProductAttributes
}) {
  // const [changedAttr, setChangedAttr] = useState([]);
  const [sweetalert, setSweetAlert] = useState(null);

  // useEffect(() => {
  //   if (attributescaption && attributescaption.length > 0) {
  //     attributescaption.forEach((element) => {
  //       element = { ...element, value_select: "" };
  //     });
  //     setChangedAttr(attributescaption);
  //     getAttributes();
  //   } else {
  //     if (editAttrubutes && editAttrubutes.length > 0) {
  //       editAttrubutes.forEach((element) => {
  //         element = { ...element, value_select: "" };
  //       });
  //       setChangedAttr(editAttrubutes);
  //       getAttributes();
  //     }
  //   }
  // }, [attributescaption]);

  // useEffect(() => {
  //   if (!editAttrubutes || editAttrubutes === []) {
  //     clear();
  //   }
  //   setReadyOpt([]);
  // }, [clearBoard]);

  // useEffect(() => {
  //   getAttrListId(readyOpt);
  //   // console.log(readyOpt);
  // }, [readyOpt]);

  const [listAttributes, setListAttributes] = useState([]);

  useEffect(() => {
    getAttributes();
  }, []);

  const filterSpr = (attributes) => {
    let product =
      attributescaption && attributescaption.length > 0 ? attributescaption : editAttrubutes;
    let allSpr = [];
    attributes.forEach((attr) => {
      if (attr.format === "SPR") {
        allSpr.push(attr);
      }
    });
    let sprToProd = [];
    product.forEach((ca) => {
      allSpr.forEach((as) => {
        if (ca.attribute_id !== 0 && !ca.attribute_id) {
        } else {
          if (ca.attribute_id.toString() === as.id) {
            sprToProd.push({ id: as.id, values: as.sprvalues });
          }
        }
      });
    });
    sprToProd.forEach((element, indx) => {
      let a = [];
      element.values.forEach((el, i) => {
        a.push({ id: i, label: el });
      });
      sprToProd[indx] = { ...sprToProd[indx], options: a };
    });
    product.forEach((prod, i) => {
      sprToProd.forEach((element) => {
        if (prod.attribute_id.toString() === element.id) {
          product[i] = {
            ...product[i],
            options: element.options,
            attribute_value: "",
          };
        }
      });
    });
    product.forEach((element, i) => {
      if (element.attribute_format === "DATE") {
        product[i] = {
          ...product[i],
          attribute_value: "",
        };
      }
    });
    setReadyOpt(product);
  };

  const getAttributes = () => {
    Axios.get("/api/attributes")
      .then((res) => res.data)
      .then((attributes) => {
        console.log(attributes);
        attributes.forEach(attr => {
          if (attr.sprvalues.length > 0) {
            let temp = [];
            attr.sprvalues.forEach((el, id) => {
              temp.push({ value: id, label: el })
            });
            attr.options = temp;
          }
          console.log(attributes);
          setListAttributes(attributes);
          productAttributes.forEach((prod, idx) => {
            attributes.forEach(attr => {
              if (prod.attribute_id.toString() === attr.id.toString()) {
                console.log("attr.options", attr.options);
                setProductAttributes(prevState => {
                  let obj = prevState[idx];
                  obj.options = attr.options;
                  return [...prevState];
                })
              }
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const clear = () => {
  //   setChangedAttr(attributescaption);
  //   setReadyOpt([]);
  // };





  // const getAttrListId = (id) => {
  //   let a = [];
  //   if (changedAttr.length > 0) {
  //     changedAttr.forEach((el, i) => {
  //       if (id) {
  //         if (el.attribute_id !== id) {
  //           a.push({
  //             code: el.attribute_id,
  //             value: el.attribute_value,
  //             name: el.attribute_name,
  //           });
  //         }
  //       }
  //       else {
  //         a.push({
  //           code: el.attribute_id,
  //           value: el.attribute_value,
  //           name: el.attribute_name,
  //         });
  //       }
  //     });
  //   }
  //   changeState(a);
  // };


  const deleteAttribute = (attribute) => {
    console.log(attribute);
    setDeleted(true);
    const reqdata = {
      listcode: attribute.attribute_listcode,
      attribcode: attribute.attribute_id
    };
    Axios.post("/api/attributes/delete", reqdata)
      .then((res) => {
        if (res.data.code === "success") {
          setSweetAlert(null);
          let arr = [];
          productAttributes.forEach((element, i) => {
            if (element.attribute_id !== attribute.attribute_id) {
              arr.push(element);
            }
          });
          setProductAttributes(arr);
        }
        else {
          ErrorAlert(res.text);

        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  }

  const nonSprChange = (event, attribute) => {
    let value = event.target.value;
    let index;
    productAttributes.forEach((attr, i) => {
      if (attr.attribute_id === attribute.attribute_id) {
        index = i;
      }
    });
    setProductAttributes((prevState) => {
      let obj = prevState[index];
      obj.attribute_value = value;
      return [...prevState];
    });
  };

  const sprChange = (event, attribute) => {
    console.log(event, attribute);
    let index;
    productAttributes.forEach((attr, i) => {
      if (attr.attribute_id === attribute.attribute_id) {
        index = i;
      }
    });
    setReadyOpt((prevState) => {
      let obj = prevState[index];
      obj.attribute_value = event.label;
      obj.value_select = event;
      return [...prevState];
    });
  };

  const showConfiramtion = (attribute) => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={() => deleteAttribute(attribute)}
        onCancel={() => setSweetAlert(null)}
      >
        Вы действительно хотите удалить атрибут?
      </SweetAlert>
    );
  };


  const showOptions = (attribute_id) => {
    let a = {};
    listAttributes.forEach(element => {
      if (element.id === attribute_id) {
        a = element.options;

      }
    });
    console.log(a);
    return a;
  }

  return (
    <Fragment>
      {sweetalert}
      <div
        className="row justify-content-center"
        style={{ marginBottom: 10 }}
      ></div>
      {productAttributes.length > 0 &&
        productAttributes.map((attribute, idx) => {
          return (
            <Fragment key={idx}>
              <div className="row justify-content-center">
                <div className="col-md-12 zi-3"></div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-9">
                  <label htmlFor="">{attribute.attribute_name}</label>
                  <div className="input-group">
                    {attribute.attribute_format === "TEXT" && (
                      <Fragment>
                        <input
                          name="text"
                          value={attribute.attribute_value}
                          type="text"
                          className="form-control"
                          placeholder="Введите значение"
                          onChange={(event) => nonSprChange(event, attribute)}
                        />
                        <IconButton onClick={() => showConfiramtion(attribute)} style={{ padding: "6px" }}>
                          <HighlightOffIcon />
                        </IconButton>
                      </Fragment>
                    )}
                    {attribute.attribute_format === "DATE" && (
                      <Fragment>
                        <input
                          name="date"
                          value={attribute.attribute_value}
                          type="date"
                          className="form-control"
                          placeholder="Введите значение"
                          onChange={(event) => {
                            nonSprChange(event, attribute);
                          }}
                        />
                        <IconButton onClick={() => showConfiramtion(attribute)} style={{ padding: "6px" }}>
                          <HighlightOffIcon />
                        </IconButton>
                      </Fragment>
                    )}
                    {attribute.attribute_format === "SPR" && (
                      <Fragment>
                        <Select
                          id="select"
                          placeholder={attribute.attribute_value}
                          value={attribute.value_select ? attribute.value_select : { id: attribute.attribute_id, label: attribute.attribute_value }}
                          onChange={(event) => {
                            sprChange(event, attribute);
                          }}
                          options={attribute.options}
                          className="form-control attr-spr"
                          noOptionsMessage={() => "Характеристики не найдены"}
                        />
                        <IconButton onClick={() => showConfiramtion(attribute)} style={{ padding: "6px" }}>
                          <HighlightOffIcon />
                        </IconButton>
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
            </Fragment >
          );
        })}
    </Fragment >
  );
}