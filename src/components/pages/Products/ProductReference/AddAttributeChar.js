import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";

export default function AddAttribute({
  clearBoard,
  selected,
  attributeCode,
  attrListProps,
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
      attrListProps(attrListChanged);
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
    Axios.get("/api/foramir")
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

  // const onAttrValueChange = (e) => {
  //   const attrValueChanged =
  //     optionsToRenderSpr.length > 0 ? e.value : e.target.value;
  //   const attrValueSprChanged = optionsToRenderSpr.length > 0 ? e : "";

  //   if (selectedAttrType === "DATE" && attrValueChanged.indexOf("-") === 5)
  //     return;

  //   setAttrValue(attrValueChanged);
  //   setAttrValueSpr(attrValueSprChanged);
  // };

  const handleAdd = () => {
    if (Object.keys(attrName).length === 0) {
      {
        Alert.warning("Выберите значение!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 3000,
        });
        return;
      }
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
        attrListProps(attrListChanged);
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
        attrListProps(newList);
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
      {/* <hr /> */}
      <div className="row justify-content-center" style={{ marginBottom: 5 }}>
        {/* <div className="col-md-8">
          <h6>Дополнительная информация</h6>
        </div> */}
      </div>
      <div className="row justify-content-right">
        <div>
          <span
            className="input-group-text border-0"
            style={{ background: "transparent" }}
          >
            <Select
              className="col-md-11"
              value={attrName}
              onChange={onAttrNameChange}
              options={optionsToRender}
              placeholder={"Выберите"}
              noOptionsMessage={() => "Характеристики не найдены"}
            />
            <span className="message text-danger">{attrNameError}</span>
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={handleAdd}
            >
              Добавить атрибут
            </button>
          </span>
        </div>
      </div>

      {attrList.length > 0 && (
        <div className="row justify-content-right mt-8">
          <div className="col-md-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {attrList.map((attr) => (
                  <tr key={attr.name}>
                    <td>{attr.name}</td>
                    <td className="text-center">
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
