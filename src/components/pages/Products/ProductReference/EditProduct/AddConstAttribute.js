import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";

export default function AddConstAttribute({
  productAttributes,
  listAllAttributes,
  setConstAttribCode,
  setDetailsValues,
  deleteListCode,
  isDeleteListCode
}) {

  const [selectedAttrType, setSelectedAttrType] = useState("TEXT");
  const [listProductAttributes, setListProductAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [attrValueOptions, setAttrValueOptions] = useState([]);
  const [isExist, setExist] = useState(false);
  const [listCode, setListCode] = useState("");

  useEffect(() => {
    if (listCode !== "") {
      deleteListCode(listCode);
    }
  }, [isDeleteListCode]);

  useEffect(() => {
    if (productAttributes && productAttributes.length > 0) {
      setDetailsValues(productAttributes);
      setListProductAttributes(productAttributes);
      setListCode(productAttributes[0].attribute_listcode);
      setConstAttribCode(productAttributes[0].attribute_listcode);
    }
  }, [productAttributes]);

  const attrNameChange = (value) => {
    setAttrName(value);
    setAttrValue("");
    setExist(false);
    let type = "";
    listAllAttributes.forEach(element => {
      if (element.values === value.label) {
        setSelectedAttrType(element.format);
        type = element.format;
        let temp = [];
        element.sprvalues.forEach((option, id) => {
          temp.push({ value: id, label: option })
        });
        setAttrValueOptions(temp);
      }
    });
    listProductAttributes.forEach(el => {
      if (el.attribute_name === value.label) {
        setExist(true);
        if (type === "SPR") {
          setAttrValue({ value: el.attribute_id, label: el.attribute_value });
        }
        else {
          setAttrValue(el.attribute_value);
        }
      }
    });
  };

  const attrValueChange = (e) => {
    if (selectedAttrType === "SPR") {
      setAttrValue(e);
    }
    else {
      setAttrValue(e.target.value);
    }
  };

  const changeOrAddAtrribute = () => {
    let temp = [];
    listProductAttributes.forEach(element => {
      temp.push(element);
    });
    if (attrName === "") {
      Alert.warning("Выберите характеристику")
    }
    else {
      if (!attrValue) {
        Alert.warning("Введите значение атрибута")
      }
      else {
        if (!isExist) {
          listAllAttributes.forEach(element => {
            if (element.values === attrName.label) {
              temp.push({
                attribute_format: selectedAttrType,
                attribute_id: Number(element.id),
                attribute_name: attrName.label,
                attribute_value: selectedAttrType === "SPR" ? attrValue.label : attrValue,
                attribute_listcode: listCode !== "" ? listCode : null
              })
              const reqbody = {
                attribcode: element.id,
                listcode: listCode !== "" ? listCode : null,
                value: selectedAttrType === "SPR" ? attrValue.label : attrValue
              }
              addAttribute(reqbody);
            }
          });
        }
        else {
          let idx;
          listProductAttributes.forEach((element, id) => {
            if (element.attribute_name === attrName.label) {
              idx = id;
            }
          });
          setListProductAttributes(prevState => {
            let obj = prevState[idx];
            obj.attribute_value = selectedAttrType === "SPR" ? attrValue.label : attrValue;
            return [...prevState];
          })
        }
        setDetailsValues(temp);
        setListProductAttributes(temp);
        setAttrName("");
        setAttrValue("");
      }
    }
  };

  const addAttribute = (reqbody) => {
    Axios.post("/api/attributes/add", reqbody)
      .then((res) => res.data)
      .then((result) => {
        setListCode(result.text);
        setConstAttribCode(result.text);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const deleteAttribute = (attr) => {
    let index;
    let temp = [];
    listProductAttributes.forEach((element, id) => {
      if (element.attribute_id === attr.attribute_id) {
        index = id;
      }
    });
    listProductAttributes.forEach((el, idx) => {
      if (idx !== index) {
        temp.push(el);
      }
    });
    if (temp.length === 0) {
      deleteListCode(listCode);
      setConstAttribCode(0);
      setListCode(null);
    }
    setDetailsValues(temp);
    setListProductAttributes(temp);
  };

  return (
    <Fragment>
      <div
        className="row justify-content-center"
        style={{ marginBottom: 5 }}
      ></div>

      <Fragment>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item xs={6}>
            <label htmlFor="">Характеристика товара</label>
          </Grid>
          <Grid item xs={4}>
            <label htmlFor="">Укажите значение</label>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={6}>
            <Select
              value={attrName}
              onChange={(value) => { attrNameChange(value) }}
              options={listAllAttributes.map(option => { return { value: option.id, label: option.values } })}
              placeholder="Выберите характеристику"
              noOptionsMessage={() => "Характеристики не найдены"}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="input-group">
              {selectedAttrType === "TEXT" && (
                <input
                  value={attrValue}
                  type="text"
                  className="form-control"
                  placeholder="Введите значение"
                  onChange={attrValueChange}
                />
              )}
              {selectedAttrType === "DATE" && (
                <input
                  value={attrValue}
                  type="date"
                  className="form-control"
                  placeholder="Введите значение"
                  onChange={attrValueChange}
                />
              )}
              {selectedAttrType === "SPR" && (
                <Select
                  value={attrValue}
                  onChange={attrValueChange}
                  options={attrValueOptions}
                  className="form-control attr-spr"
                  placeholder={"Введите значение"}
                  noOptionsMessage={() => "Характеристики не найдены"}
                />
              )}
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-info"
                  onClick={changeOrAddAtrribute}
                >
                  {!isExist ? "Добавить" : "Изменить"}
                </button>
              </div>
            </div>
          </Grid>
        </Grid>
        {listProductAttributes.length > 0 && (
          <div className="row justify-content-left mt-8">
            <div className="col-md-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>Наименование</th>
                    <th>Значение</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {listProductAttributes.map((attr, id) => (
                    <tr key={id}>
                      <td>{attr.attribute_name}</td>
                      <td>{attr.attribute_value}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => deleteAttribute(attr)}
                        >
                          &times;
                            </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Fragment>
    </Fragment>
  );
};