
import React, { useState, useEffect, Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import Moment from "moment";
import Select from "react-select";
import TextField from '@material-ui/core/TextField';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import SweetAlert from "react-bootstrap-sweetalert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";


const StyledTableCell = withStyles((theme) => ({
    head: {
        background: "#17a2b8",
        color: theme.palette.common.white,
        fontSize: ".875rem",
    },
    body: {
        fontSize: ".875rem",
    },
    footer: {
        fontSize: ".875rem",
        fontWeight: "bold",
    },
}))(TableCell);

export default function AttributeWindow({ product, setModalWindow, workorderId }) {

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
    const [listCode, setListCode] = useState(null);
    const [barcode, setBarcode] = useState("");
    const [productAttributes, setProductAttributes] = useState([]);
    const [sweetalert, setSweetAlert] = useState(null);

    useEffect(() => {
        setBarcode(product.code);
        setListCode(product.attributes);
        setProductAttributes(product.attr_json ? product.attr_json : []);
        getAttributes();
    }, []);

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
        else {
            setAttrValues([]);
        }
    };

    const addAttribute = () => {
        if (barcode !== "") {
            if (!selectedAttrName) {
                Alert.warning(`Выберите атрибут`, {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            }
            else {
                if ((attrFormat === "TEXT" && textValue === "") || (attrFormat === "SPR" && sprValue === null)) {
                    Alert.warning(`Введите значение атрибута`, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                else {
                    let flag = false;
                    console.log(productAttributes);
                    productAttributes.forEach(pa => {
                        if (pa.id.toString().trim() === selectedAttrName.value.toString().trim()) {
                            flag = true
                        }
                    });
                    if (flag) {
                        Alert.warning(`Выбранный атрибут уже существует`, {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
                    }
                    else {
                        const reqbody = {
                            attribcode: selectedAttrName.value ? selectedAttrName.value : 0,
                            listcode: listCode,
                            value:
                                attrFormat === "DATE" ? Moment(dateValue).format("YYYY-MM-DD") :
                                    attrFormat === "TEXT" ? textValue :
                                        attrFormat === "SPR" ? sprValue.label : ""
                        }
                        Axios.post("/api/attributes/add", reqbody)
                            .then((res) => res.data)
                            .then((result) => {
                                setListCode(result.text);
                                Axios.post("/api/workorder/details/attributes/update", { workorder_id: workorderId, products: [{ id: product.product, attrid: result.text }] })
                                    .then((res) => res.data)
                                    .then((result) => {
                                        console.log(result);
                                    })
                                    .catch((err) => {
                                        ErrorAlert(err);
                                    });

                                setProductAttributes([...productAttributes, {
                                    format: attrFormat,
                                    id: selectedAttrName.value,
                                    name: selectedAttrName.label,
                                    value: reqbody.value,
                                }]);
                                setAttrFormat("");
                                setSelectedAttrName(null);
                                setTextValue("");
                                setSprValue(null);
                                setDateValue(Moment().format("YYYY-MM-DD"));
                            })
                            .catch((err) => {
                                ErrorAlert(err);
                            });
                    }
                }
            }
        }
        else {
            Alert.warning(`Для начала выберите или создайте товар`, {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
    };

    const closeModal = () => {
        setListCode(null);
        setBarcode("");
        setProductAttributes([]);
        setModalWindow(null);
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
                onConfirm={() =>
                    deleteAttribute(attribute)
                }
                onCancel={() => setSweetAlert(null)}
            >
                Вы действительно хотите удалить атрибут?
            </SweetAlert>
        );
    };

    const deleteAttribute = (attribute) => {
        const reqdata = {
            listcode: listCode,
            attribcode: attribute.id
        };

        Axios.post("/api/attributes/delete", reqdata)
            .then((res) => {
                if (res.data.code === "success") {
                    setSweetAlert(null);
                    let arr = [];
                    productAttributes.forEach((element, i) => {
                        if (element.id !== attribute.id) {
                            arr.push(element);
                        }
                    });
                    setProductAttributes(arr);
                }
                else {
                    setSweetAlert(null);
                    ErrorAlert(res.text);
                }
            })
            .catch((err) => {
                setSweetAlert(null);
                ErrorAlert(err);
            });
    }

    return (
        <Fragment>
            {sweetalert}
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <span style={{ color: "gray", fontSize: "20px" }}> Настройка атрибутов </span>
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right" }}>
                    <button className="btn btn-link btn-sm" onClick={closeModal}>
                        Закрыть
                    </button>
                </Grid>
                <Grid item xs={10}>
                    Штрих-код: {product.code} | Наименование: {product.name}
                </Grid>
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
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
                <Grid item xs={12}>
                    <hr style={{ margin: "0px" }} />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <span style={{ color: "gray" }}>{productAttributes.length > 0 ? 'Список атрибутов' : 'У товара нет атрибутов'} </span>
                </Grid>
                {productAttributes.length > 0 &&
                    <Fragment>
                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px -1px 1px 1px white" }}
                            >
                                <Table id="table-to-xls">
                                    <TableHead>
                                        <TableRow style={{ fontWeight: "bold" }} >
                                            <StyledTableCell align="center">
                                                Наименование
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                Значение
                                            </StyledTableCell>
                                            <StyledTableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productAttributes.map((attr, idx) =>
                                            <TableRow key={idx}>
                                                <StyledTableCell align="center">
                                                    {attr.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {attr.value}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <IconButton onClick={() => showConfiramtion(attr)}>
                                                        <HighlightOffIcon />
                                                    </IconButton>
                                                </StyledTableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={3} />
                    </Fragment>
                }
            </Grid>
        </Fragment>
    )
}