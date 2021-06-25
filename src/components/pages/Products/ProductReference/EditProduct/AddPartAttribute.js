import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";

export default function AddAttribute({
  clearBoard,
  selected,
  attributeCode,
  isEditing,
  editProduct,
  capations,
  setAttributes,
  attributes,
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
  const [date] = useState(Moment().format("YYYY-MM-DD"));

  useEffect(() => {
    getAttributes();
  }, []);

  useEffect(() => {
    clear();
  }, [clearBoard]);

  const getOldAttributes = () => {
    let arr = [];
    if (capations && capations.length > 0) {
      capations.forEach((element) => {
        if (element.attribute_id !== null) {
          arr.push({
            value: element.attribute_value,
            name: element.attribute_name,
            code: element.attribute_id,
          });
        } else {
          [];
        }
      });
      setAttrList(arr);
    }
  };

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
      getOldAttributes();
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
    let reqbody = {
      listcode: attrListCode,
      value: attrValue,
      attribcode: attrName.value,
    };
    if (reqbody.attribcode === "2") {
      reqbody.value = Moment(date).format("YYYY-MM-DD");
    }

    attrListChanged.push({
      value:
        attrName.value === "2" ? Moment(date).format("YYYY-MM-DD") : attrValue,
      name: attrName.label,
      code: attrName.value,
    });
    postAttributes(attrListChanged, reqbody);
    setAttributes(attrListChanged);
  };

  const postAttributes = (attrListChanged, reqbody) => {
    Axios.post("/api/attributes/add", reqbody)
      .then((res) => res.data)
      .then((result) => {
        setAttrListCode(result.text);
        attributeCode(result.text);
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
    setAttributes(newList);
    setAttrList(newList);
  };

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={2}
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
        <Grid item xs={5}>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={handleAdd}
          >
            Добавить атрибут
          </button>
        </Grid>
        <Grid>
          <Tooltip title={<h6>Добавьте все нужные атрибуты</h6>}>
            <span>
              <Button disabled>
                <InfoIcon color="primary" fontSize="large" />
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      {attrList.length > 0 && (
        <div className="row justify-content-left mt-8">
          <div className="col-md-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {attrList.length === 0
                  ? []
                  : attrList.map((attr) => (
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
