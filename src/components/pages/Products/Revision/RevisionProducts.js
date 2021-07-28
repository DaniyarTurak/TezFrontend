import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import TextField from '@material-ui/core/TextField';
import Scanner from "./Scanner";
import useDebounce from "../../../ReusableComponents/useDebounce";
import Alert from "react-s-alert";

export default function RevisonProducts({
    barcode,
    setBarcode,
    hardware,
    point
}) {

    const debouncedBarcode = useDebounce(barcode, 200);


    useEffect(() => {
        if (barcode !== "") {
            console.log(barcode);
            searchByBarcode();
        }
    }, [debouncedBarcode]);

    const barcodeChange = (e) => {
        setBarcode(e.target.value);

    }

    const searchByBarcode = () => {
        const params = {
            barcode,
            point
        }
        Axios.get("/api/revision/unitsbybarcode", {
            params,
        })
            .then((data) => {
                return data.data;
            })
            .then((products) => {
                if (products.length > 0) {
                    console.log(products[0]);
                }
                else {
                    Alert.error("Возникла непредвиденная ошибка", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                setBarcode("");

            })
            .catch((err) => {
                console.log(err);
                setBarcode("");
            });
    }
    return (
        <Fragment>
            {hardware === "camera" &&
                <Scanner
                    barcode={barcode}
                    setBarcode={setBarcode}
                />
            }
            {hardware === "scanner" &&
                <TextField
                    variant="outlined"
                    label={"Штрих-код"}
                    value={barcode}
                    autoFocus={true}
                    onChange={barcodeChange}
                />
            }
        </Fragment>
    );
};