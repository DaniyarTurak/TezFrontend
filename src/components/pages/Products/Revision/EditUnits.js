import React, { Fragment, useState, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import TextField from '@material-ui/core/TextField';
import Alert from "react-s-alert";
import { withStyles } from '@material-ui/core/styles';

export default function EditUnits({
    product,
    revNumber,
    setEditingUnits,
    getRevisionProducts
}) {

    const CustomField = withStyles({
        root: {
            '& label.Mui-focused': {
                color: '#17a2b8',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#17a2b8',
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#17a2b8',
                },
                '&:hover fieldset': {
                    borderColor: '#17a2b8',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#17a2b8',
                },
            },
        },
    })(TextField);

    const [tempUnits, setTempUnits] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (product !== {}) {
            setTempUnits(product.units)
        }
    }, [])

    const sendUnits = () => {
        if (tempUnits !== "" && parseInt(tempUnits) > 0) {
            setLoading(true);
            Axios.post("/api/revision/revisiontemp/edit", { revnumber: revNumber, units: tempUnits, product: product.product, attributes: product.attributes })
                .then((res) => res.data)
                .then((res) => {
                    console.log(res);
                    if (res.command && res.command === "UPDATE") {
                        Alert.success("Количество изменено", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
                        setLoading(false);
                        getRevisionProducts();
                        setEditingUnits(false);

                    } else {
                        Alert.error("Возникла непредвиденная ошибка", {
                            position: "top-right",
                            effect: "bouncyflip",
                            timeout: 2000,
                        });
                        setLoading(false);

                    }
                })
                .catch((err) => {
                    console.log(err);
                    Alert.error(err, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setLoading(false);
                });
        }
        else {
            Alert.warning("Введите корректное количество", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
    }

    return (
        <Fragment >
            <Grid
                style={{ maxWidth: 480 }}
                container
                spacing={2}
                alignItems="center"
            >
                <Grid item xs={12}>
                    {product.code} - {product.name} &nbsp;
                    {product.attrname && "(" + product.attrvalue ? product.attrname + ": " + product.attrvalue + ")" : ""}
                </Grid>
                <Grid item xs={12}>
                    <CustomField
                        fullWidth
                        variant="outlined"
                        label="Количество"
                        value={tempUnits}
                        autoFocus={true}
                        onChange={(e) => setTempUnits(e.target.value)}
                    />
                </Grid>

                <Grid item xs={6}>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setEditingUnits(false)}
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                </Grid>
                <Grid item xs={6}>
                    <button
                        className="btn btn-success"
                        onClick={sendUnits}
                        disabled={isLoading}
                    >
                        Сохранить
                    </button>
                </Grid>
            </Grid>
        </Fragment>
    );
};