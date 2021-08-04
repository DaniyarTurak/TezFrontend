import React, { Fragment, useState, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import TextField from '@material-ui/core/TextField';
import Alert from "react-s-alert";

export default function EditUnits({
    product,
    revNumber,
    setEditingUnits,
    getRevisionProducts
}) {

    const [tempUnits, setTempUnits] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (product !== {}) {
            setTempUnits(product.units)
        }
    }, [])

    const sendUnits = () => {
        console.log({ revnumber: revNumber, units: tempUnits, product: product.product });
        if (tempUnits !== "" && parseInt(tempUnits) > 0) {
            setLoading(true);
            Axios.post("/api/revision/revisiontemp/edit", { revnumber: revNumber, units: tempUnits, product: product.product })
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
                    {product.code} - {product.name}
                </Grid>
                <Grid item xs={12}>
                    <TextField
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