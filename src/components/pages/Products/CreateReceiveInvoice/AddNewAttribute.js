import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import Axios from "axios";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import Alert from "react-s-alert";

export default function AddNewAttribute({
    productID,
    listCode,
    setListCode,
    attributescaption,
    setAttributeCapation,
    getProductByBarcode,
    barcode }) {
    const useStylesAC = makeStyles(theme =>
        createStyles({
            root: {
                '& label.Mui-focused': {
                    color: '#17a2b8',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#17a2b8',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#ced4da',
                    },
                    '&:hover fieldset': {
                        borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#17a2b8',
                    },
                },
            },
        })
    );
    const classesAC = useStylesAC();

    const [listAttributes, setListAttributes] = useState([]);
    const [attrNames, setAttrNames] = useState([]);
    const [attrValues, setAttrValues] = useState([]);
    const [selectedAttrName, setSelectedAttrName] = useState(null);
    const [attrFormat, setAttrFormat] = useState("");
    const [textValue, setTextValue] = useState("");
    const [dateValue, setDateValue] = useState(Moment().format("YYYY-MM-DD"));
    const [sprValue, setSprValue] = useState(null);
    const [partAttribCode, setPartAttribCode] = useState(null);

    let temp_atc = [];

    useEffect(() => {
        getAttributes();
    }, []);

    useEffect(() => {
        console.log(attributescaption);
        if (attributescaption && attributescaption.length > 0) {
            attributescaption.forEach(element => {
                temp_atc.push(element);
            });
        }
    }, [attributescaption]);

    const getAttributes = () => {
        Axios.get("/api/attributes")
            .then((res) => res.data)
            .then((attributes) => {
                setListAttributes(attributes);
                let temp = [];
                attributes.forEach(element => {
                    temp.push({ value: element.id, label: element.values })
                });
                setAttrNames(temp);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const attrNameChange = (attribute) => {
        setSelectedAttrName(attribute);
        let temp = [];
        listAttributes.forEach(element => {
            if (attribute.value === element.id) {
                temp = element.sprvalues;
                setAttrFormat(element.format);
            }
        });
        let temp2 = [];
        if (temp.length > 0) {
            temp.forEach((element, id) => {
                temp2.push({ value: id, label: element })
            });
            setAttrValues(temp2);
        }
    };

    const addAttribute = () => {
        if (barcode !== "") {

            const reqbody = {
                attribcode: selectedAttrName.value,
                listcode: listCode === "0" ? null : listCode,
                // value: ""
                // attrFormat === "DATE" ? Moment(dateValue).format("YYYY-MM-DD") :
                //     attrFormat === "TEXT" ? textValue :
                //         attrFormat === "SPR" ? sprValue.label : ""
            }
            Axios.post("/api/attributes/add", reqbody)
                .then((res) => res.data)
                .then((result) => {
                    setListCode(result.text);
                    setPartAttribCode(result.text);
                    getProductByBarcode(barcode);
                    temp_atc.push({
                        attribute_format: attrFormat,
                        attribute_id: selectedAttrName.value,
                        attribute_listcode: listCode,
                        attribute_name: selectedAttrName.label,
                        attribute_value: "",
                    });
                    setAttributeCapation(temp_atc);
                })
                .catch((err) => {
                    ErrorAlert(err);
                });
        }
        else {
            Alert.warning(`Для начала выберите или создайте товар`, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
    };

    return (
        <Fragment>
            <Grid container spacing={1}>
                <Grid item xs={5}>
                    <Select
                        placeholder="Имя атрибута"
                        value={selectedAttrName}
                        onChange={(attribute) => {
                            attrNameChange(attribute);
                        }}
                        options={attrNames}
                        className="form-control attr-spr"
                        noOptionsMessage={() => "Характеристики не найдены"}
                    />
                </Grid>
                <Grid item xs={5}>
                    {
                        attrFormat === "SPR" ?
                            <Select
                                placeholder="Значение атрибута"
                                value={sprValue}
                                onChange={(attribute) => {
                                    setSprValue(attribute);
                                }}
                                options={attrValues}
                                className="form-control attr-spr"
                                noOptionsMessage={() => "Характеристики не найдены"}
                            />
                            : attrFormat === "DATE" ?
                                <input
                                    name="date"
                                    value={dateValue}
                                    type="date"
                                    className="form-control"
                                    placeholder="Введите значение"
                                    onChange={(event) => {
                                        setDateValue(event.target.value);
                                    }}
                                /> :
                                attrFormat === "TEXT" ?
                                    <TextField
                                        fullWidth
                                        value={textValue}
                                        classes={{
                                            root: classesAC.root,
                                        }}
                                        onChange={(e) => setTextValue(e.target.value)}
                                        placeholder="Значение атрибута"
                                        variant="outlined"
                                        size="small"
                                    /> : <TextField
                                        fullWidth
                                        disabled={true}
                                        classes={{
                                            root: classesAC.root,
                                        }}
                                        placeholder="Значение атрибута"
                                        variant="outlined"
                                        size="small"
                                    />
                    }
                </Grid>
                <Grid item xs={2}>
                    <button
                        className="btn btn-success"
                        onClick={addAttribute}>
                        Добавить
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    );
}