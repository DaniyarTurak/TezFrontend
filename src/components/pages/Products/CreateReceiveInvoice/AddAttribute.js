import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";

export default function AddAttribute({
  clearBoard,
  changeState,
  attributescaption,
  editAttrubutes,
}) {
  const [changedAttr, setChangedAttr] = useState([]);
  const [readyOpt, setReadyOpt] = useState([]);

  useEffect(() => {
    if (attributescaption && attributescaption.length > 0) {
      attributescaption.forEach((element) => {
        element = { ...element, value_select: "" };
      });
      setChangedAttr(attributescaption);
      getAttributes();
    } else {
      if (editAttrubutes && editAttrubutes.length > 0) {
        editAttrubutes.forEach((element) => {
          element = { ...element, value_select: "" };
        });
        setChangedAttr(editAttrubutes);
        getAttributes();
      }
    }
  }, [attributescaption]);

  useEffect(() => {
    if (!editAttrubutes || editAttrubutes === []) {
      clear();
    }
    setReadyOpt([]);
  }, [clearBoard]);

  useEffect(() => {
    getAttrListId(changedAttr);
  }, [changedAttr]);

  const filterSpr = (attributes) => {
    let product =
      attributescaption.length > 0 ? attributescaption : editAttrubutes;
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
          product[i] = { ...product[i], options: element.options };
        }
      });
    });
    setReadyOpt(product);
  };

  const getAttributes = () => {
    Axios.get("/api/attributes")
      .then((res) => res.data)
      .then((attributes) => {
        filterSpr(attributes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clear = () => {
    setChangedAttr(attributescaption);
    setReadyOpt([]);
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

  const getAttrListId = () => {
    let a = [];
    changedAttr.length > 0 &&
      changedAttr.map((el, i) => {
        a.push({
          code: el.attribute_id,
          value: el.attribute_value,
          name: el.attribute_name,
        });
      });
    changeState(a);
  };

  return (
    <Fragment>
      <div
        className="row justify-content-center"
        style={{ marginBottom: 10 }}
      ></div>
      {/* <div className="col-md-3">
              <label htmlFor="">Дополнительная информация</label>
            </div> */}
      {readyOpt.length > 0 &&
        readyOpt.map((attribute, idx) => {
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
                          id="select"
                          placeholder={attribute.attribute_value}
                          value={attribute.value_select}
                          onChange={(event) => {
                            onAttrValueChange(event, attribute);
                          }}
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
