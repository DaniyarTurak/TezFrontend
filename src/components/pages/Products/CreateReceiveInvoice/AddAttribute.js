import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function AddAttribute({
  clearBoard,
  selected,
  changeState,
  attributeCode,
  attrListProps,
  isEditing,
  editProduct,
  attributescaption,
}) {
  const [attrList, setAttrList] = useState([]);
  const [attrListCode, setAttrListCode] = useState(null);
  //const [attrName, setAttrName] = useState("");
  //const [attrValue, setAttrValue] = useState({ id: "", value: "" });
  // const [attrValueSpr, setAttrValueSpr] = useState("");
  const [optionsToRender, setOptionsToRender] = useState([]);
  const [isHidden, setHidden] = useState(false);
  const [oldAttributes, setOldAttributes] = useState([]);
  const [isClear, setClear] = useState(false);
  //const [allAttributes, setAllAttributes] = useState([]);
  const [changedAttr, setChangedAttr] = useState([]);
  // const [attrIdVal, setAttrIdVal] = useState([]);

  useEffect(() => {
    if (attributescaption && attributescaption.length > 0) {
      attributescaption.forEach((element) => {
        element = { ...element, value_select: "" };
      });
      setChangedAttr(attributescaption);
      getAttributes();
    }
  }, [attributescaption]);

  const getAttributes = () => {
    Axios.get("/api/attributes")
      .then((res) => res.data)
      .then((attributes) => {
        formatAttributes(attributes);
        //setAllAttributes(attributes);
        filterSpr(attributes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterSpr = (attributes) => {
    let product = attributescaption;
    let allSpr = [];
    attributes.forEach((attr) => {
      if (attr.format === "SPR") {
        allSpr.push(attr);
      }
    });
    let sprToProd = [];

    attributescaption.forEach((ca) => {
      allSpr.forEach((as) => {
        if (ca.attribute_id.toString() === as.id) {
          sprToProd.push({ id: as.id, values: as.sprvalues });
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
          product[i] = { ...product[i], options: element.options };
        }
      });
    });
    setChangedAttr(product);
  };

  useEffect(() => {
    clear();
  }, [clearBoard]);

  useEffect(() => {
    if (selected.length > 0) {
      const attrListChanged = selected.map((attr) => {
        return {
          value: attr.value,
          name: attr.values,
          code: attr.attribute,
        };
      });
      setAttrList(attrListChanged);
      setHidden(true);
    } else if (!isEditing) {
      setAttrList([]);
      setAttrListCode(null);
      setHidden(false);
    }
  }, [selected]);

  useEffect(() => {
    if (isEditing && isClear) {
      pushNewAttribute();
    }
    return () => {
      setClear(false);
    };
  }, [isClear]);

  useEffect(() => {
    if (isEditing && oldAttributes.length > 0) {
      clear();
    } else if (isEditing) {
      pushNewAttribute();
    }
  }, [isEditing, editProduct]);

  const pushNewAttribute = () => {
    const attrListChanged = attrList;
    editProduct.attributesarray.forEach((attr, ind) => {
      const fields = attr.split("|");
      const field = {
        value: fields[1],
        name: fields[3],
        code: fields[0],
      };
      attrListChanged.push(field);
      setOldAttributes(attrListChanged);
      attrListProps(attrListChanged);
      setAttrListCode(fields[2]);
      setAttrList(attrListChanged);
    });
  };

  const clear = () => {
    setAttrList([]);
    setAttrListCode(null);
    setHidden(false);
    // setAttrValue([]);
    // setAttrName([]);
    if (isEditing) {
      setClear(true);
    }
  };

  const formatAttributes = (attributes) => {
    let optionsToRenderChanged = [];
    attributes.forEach((attr) => {
      const sprvalues = attr.sprvalues.map((sprValue) => {
        return {
          label: sprValue,
          value: sprValue,
        };
      });
      const option = {
        label: attr.values,
        value: attr.id,
        type: attr.format,
        sprvalues: sprvalues,
      };
      optionsToRenderChanged.push(option);
    });
    setOptionsToRender(optionsToRenderChanged);
  };

  const nonSprChange = (event, attribute) => {
    let index;
    changedAttr.forEach((attr, i) => {
      if (attr.attribute_id === attribute.attribute_id) {
        index = i;
      }
    });
    const temp = event.target.value;
    setChangedAttr((prevState) => {
      let obj = prevState[index];
      obj.attribute_value = temp;
      return [...prevState];
    });
  };

  const onAttrValueChange = (event, attribute) => {
    let index;
    changedAttr.forEach((attr, i) => {
      if (attr.attribute_id === attribute.attribute_id) {
        index = i;
      }
    });

    setChangedAttr((prevState) => {
      let obj = prevState[index];
      obj.attribute_value = event.label;
      obj.value_select = event;
      return [...prevState];
    });
  };
  useEffect(() => {
    getAttrListId(changedAttr);
  }, [changedAttr]);

  const getAttrListId = () => {
    let a = [];
    changedAttr.map((el, i) => {
      a.push({ code: el.attribute_id, value: el.attribute_value });
    });
    changeState(a);
  };

  return (
    <Fragment>
      <div className="row justify-content-center" style={{ marginBottom: -10 }}>
        <div className="col-md-8">
          <h6> </h6>
        </div>
      </div>
      {changedAttr.length > 0 &&
        changedAttr.map((attribute, idx) => {
          return (
            <Fragment key={idx}>
              <div className="row justify-content-center">
                <div className="col-md-12 zi-3"></div>
              </div>

              <div className="row justify-content-center">
                <div className="col-md-8">
                  <label htmlFor="">{attribute.attribute_name}</label>
                  <div className="input-group">
                    {attribute.attribute_format === "TEXT" && (
                      <input
                        name="text"
                        value={attribute.attribute_value}
                        type="text"
                        className="form-control"
                        placeholder="Введите значение"
                        onChange={(event) => nonSprChange(event, attribute)}
                      />
                    )}
                    {attribute.attribute_format === "DATE" && (
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
                    )}
                    {attribute.attribute_format === "SPR" && (
                      <Fragment>
                        <Select
                          placeholder={attribute.attribute_value}
                          value={attribute.value_select}
                          onChange={(event) =>
                            onAttrValueChange(event, attribute)
                          }
                          options={attribute.options}
                          className="form-control attr-spr"
                          placeholder={"Введите значение"}
                          noOptionsMessage={() => "Характеристики не найдены"}
                        />
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
    </Fragment>
  );
}
