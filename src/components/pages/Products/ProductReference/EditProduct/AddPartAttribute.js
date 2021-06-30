import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Grid from "@material-ui/core/Grid";
import Moment from "moment";

export default function AddPartAttribute({
  productAttributes,
  listAllAttributes,
  setPartAttribCode,
  setAttributesValues,
  deleteListCode,
  isDeleteListCode
}) {

  const [selectedAttrType, setSelectedAttrType] = useState("TEXT");
  const [listProductAttributes, setListProductAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [isExist, setExist] = useState(false);
  const [listCode, setListCode] = useState("");

  useEffect(() => {
    if (listCode !== "") {
      deleteListCode(listCode);
    }
  }, [isDeleteListCode]);

  useEffect(() => {
    if (productAttributes && productAttributes.length > 0) {
      setAttributesValues(productAttributes);
      setListProductAttributes(productAttributes);
      setListCode(productAttributes[0].attribute_listcode);
      setPartAttribCode(productAttributes[0].attribute_listcode);
    }
  }, [productAttributes]);

  const attrNameChange = (value) => {
    setAttrName(value);
    setExist(false);
    listAllAttributes.forEach(element => {
      if (element.values === value.label) {
        setSelectedAttrType(element.format);
      }
    });
    listProductAttributes.forEach(el => {
      if (el.attribute_name === value.label) {
        setExist(true);
        Alert.warning("Товар уже имеет данную характеристику")
      }
    });
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
      listAllAttributes.forEach(element => {
        if (element.values === attrName.label) {
          temp.push({
            attribute_format: selectedAttrType,
            attribute_id: Number(element.id),
            attribute_name: attrName.label,
            attribute_listcode: listCode !== "" ? listCode : null
          })
          const reqbody = {
            attribcode: element.id,
            listcode: listCode !== "" ? listCode : null,
            value: selectedAttrType === "DATE" ? Moment().format("YYYY-MM-DD") : ""
          }
          addAttribute(reqbody);
        }
      });
      setAttributesValues(temp);
      setListProductAttributes(temp);
      setAttrName("");
    }
  };

  const addAttribute = (reqbody) => {
    Axios.post("/api/attributes/add", reqbody)
      .then((res) => res.data)
      .then((result) => {
        setListCode(result.text);
        setPartAttribCode(result.text);
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
      setPartAttribCode(0);
      setListCode(null);
    }
    setAttributesValues(temp);
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
          <Grid item xs={10}>
            <label htmlFor="">Характеристика товара</label>
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
          <Grid>
            <button
              disabled={isExist}
              type="button"
              className="btn btn-outline-info"
              onClick={changeOrAddAtrribute}
            >
              Добавить
            </button>
          </Grid>
        </Grid>
        {listProductAttributes.length > 0 && (
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
                  {listProductAttributes.map((attr, id) => (
                    <tr key={id}>
                      <td>{attr.attribute_name}</td>
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