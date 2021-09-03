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
  setDeleted
}) {
  const [changedAttr, setChangedAttr] = useState([]);
  const [sweetalert, setSweetAlert] = useState(null);

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
    getAttrListId(readyOpt);
  }, [readyOpt]);

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
    let value = event.target.value;
    let index;
    readyOpt.forEach((attr, i) => {
      if (attr.attribute_id === attribute.attribute_id) {
        index = i;
      }
    });
    setReadyOpt((prevState) => {
      let obj = prevState[index];
      obj.attribute_value = value;
      return [...prevState];
    });
    setChangedAttr(readyOpt);
  };

  const onAttrValueChange = (event, attribute) => {
    let index;
    readyOpt.forEach((attr, i) => {
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
    setChangedAttr(readyOpt);
  };

  const getAttrListId = (id) => {
    let a = [];
    if (changedAttr.length > 0) {
      changedAttr.forEach((el, i) => {
        if (id) {
          if (el.attribute_id !== id) {
            a.push({
              code: el.attribute_id,
              value: el.attribute_value,
              name: el.attribute_name,
            });
          }
        }
        else {
          a.push({
            code: el.attribute_id,
            value: el.attribute_value,
            name: el.attribute_name,
          });
        }
      });
    }
    changeState(a);
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
  }

  const deleteAttribute = (attribute) => {
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
          readyOpt.forEach((element, i) => {
            if (element.attribute_id !== attribute.attribute_id) {
              arr.push(element);
            }
          });
          getAttrListId(attribute.attribute_id);
          setReadyOpt(arr);

          setChangedAttr(arr);
        }
        else {
          ErrorAlert(res.text);

        }
      })
      .catch((err) => {
        ErrorAlert(err);
      });


  }

  return (
    <Fragment>
      {sweetalert}
      <div
        className="row justify-content-center"
        style={{ marginBottom: 10 }}
      ></div>
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
                          value={attribute.value_select}
                          onChange={(event) => {
                            onAttrValueChange(event, attribute);
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