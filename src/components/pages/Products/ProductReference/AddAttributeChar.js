import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";

export default function AddAttribute({
  clearBoard,
  selected,
  attributeCode,
  isEditing,
  editProduct,
}) {
  const [attrList, setAttrList] = useState([]);
  const [attrListCode, setAttrListCode] = useState(null);
  const [attrName, setAttrName] = useState("");
  const [attrNameError, setAttrNameError] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [attrValueSpr, setAttrValueSpr] = useState("");
  const [optionsToRender, setOptionsToRender] = useState([]);
  const [optionsToRenderSpr, setOptionsToRenderSpr] = useState([]);
  const [isHidden, setHidden] = useState(false);
  const [selectedAttrType, setSelectedAttrType] = useState("TEXT");
  const [oldAttributes, setOldAttributes] = useState([]);
  const [isClear, setClear] = useState(false);

  useEffect(() => {
    getAttributes();
  }, []);

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
      setAttrListCode(fields[2]);
      setAttrList(attrListChanged);
    });
  };

  const clear = () => {
    setAttrList([]);
    setAttrListCode(null);
    setHidden(false);
    setAttrValue([]);
    setAttrName([]);
    setAttrValueSpr([]);
    if (isEditing) {
      setClear(true);
    }
  };

  const getAttributes = () => {
    Axios.get("/api/attributes")
      .then((res) => res.data)
      .then((attributes) => {
        formatAttributes(attributes);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const onAttrNameChange = (attrNameChanged) => {
    const selectedAttrTypeChanged =
      attrNameChanged.length === 0 ? "TEXT" : attrNameChanged.type;
    const optionsToRenderSprChanged = attrNameChanged.sprvalues;
    setAttrName(attrNameChanged);
    setSelectedAttrType(selectedAttrTypeChanged);
    setAttrValue("");
    setAttrValueSpr("");
    setOptionsToRenderSpr(optionsToRenderSprChanged);
  };

  const onAttrValueChange = (e) => {
    const attrValueChanged =
      optionsToRenderSpr.length > 0 ? e.value : e.target.value;
    const attrValueSprChanged = optionsToRenderSpr.length > 0 ? e : "";

    if (selectedAttrType === "DATE" && attrValueChanged.indexOf("-") === 5)
      return;

    setAttrValue(attrValueChanged);
    setAttrValueSpr(attrValueSprChanged);
  };

  const handleAdd = () => {
    if (Object.keys(attrName).length === 0 || !attrValue) {
      return setAttrNameError("Поле обязательно для заполнения");
    } else {
      setAttrNameError("");
    }

    let attrListChanged = attrList;

    if (attrListChanged.some((attr) => attr.name === attrName.label)) {
      return Alert.info("Выбранная характеристика товара уже в списке", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }
    const reqbody = {
      listcode: attrListCode,
      value: attrValue,
      attribcode: attrName.value,
    };
    attrListChanged.push({
      value: attrValue,
      name: attrName.label,
      code: attrName.value,
    });
    postAttributes(attrListChanged, reqbody);
  };

  const postAttributes = (attrListChanged, reqbody) => {
    Axios.post("/api/attributes/add", reqbody)
      .then((res) => res.data)
      .then((result) => {
        setAttrListCode(result.text);
        attributeCode(result.text);
        // attrListProps(attrListChanged);
        setAttrList(attrListChanged);
        setAttrValue("");
        setAttrName("");
        setAttrValueSpr("");
        setAttrNameError("");
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };
  const handleDelete = (item) => {
    const newList = attrList.filter((atr) => {
      return atr !== item;
    });
    const req = {
      listcode: attrListCode,
      attribcode: item.code,
    };
    setAttrList(newList);

    Axios.post("/api/attributes/delete", req)
      .then(() => {
        // attrListProps(newList);
        if (attrList.length === 0) {
          attributeCode("0");
        }
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
      });
  };

  return (
    <Fragment>
      <div
        className="row justify-content-center"
        style={{ marginBottom: 5 }}
      ></div>

      {!isHidden && (
        <Fragment>
          <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item xs={5}>
              <label htmlFor="">Характеристика товара</label>
            </Grid>
            <Grid item xs={5}>
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
            <Grid item xs={5}>
              <Select
                value={attrName}
                onChange={onAttrNameChange}
                options={optionsToRender}
                placeholder="Выберите"
                noOptionsMessage={() => "Характеристики не найдены"}
              />
            </Grid>
            <Grid item xs={7}>
              <div className="input-group">
                {selectedAttrType === "TEXT" && (
                  <input
                    value={attrValue}
                    type="text"
                    className="form-control"
                    placeholder="Введите значение"
                    onChange={onAttrValueChange}
                  />
                )}
                {selectedAttrType === "DATE" && (
                  <input
                    value={attrValue}
                    type="date"
                    className="form-control"
                    placeholder="Введите значение"
                    onChange={onAttrValueChange}
                  />
                )}
                {selectedAttrType === "SPR" && (
                  <Select
                    value={attrValueSpr}
                    onChange={onAttrValueChange}
                    options={optionsToRenderSpr}
                    className="form-control attr-spr"
                    placeholder={"Введите значение"}
                    noOptionsMessage={() => "Характеристики не найдены"}
                  />
                )}
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleAdd}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
          <span className="message text-danger">{attrNameError}</span>
        </Fragment>
      )}

      {attrList.length > 0 && (
        <div className="row justify-content-center mt-20">
          <div className="col-md-8">
            <table className="table">
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Значение</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {attrList.map((attr) => (
                  <tr key={attr.name}>
                    <td>{attr.name}</td>
                    <td>{attr.value}</td>
                    <td className="text-right">
                      {!isHidden && (
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleDelete(attr)}
                        >
                          &times;
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Fragment>
  );
}
