import React, { Fragment, useState, useEffect } from 'react'
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import SweetAlert from "react-bootstrap-sweetalert";
import WeightProductsAdd from './WeightProductsAdd';

function BindWeightProducts() {
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                border: '2px solid #17a2b8',

            }
        })
    };


    const [stock, setStock] = useState("");
    const [points, setPoints] = useState([]);
    const [point, setPoint] = useState("");
    const [scale, setScale] = useState("");
    const [scales, setScales] = useState([]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [sweetalert, setSweetAlert] = useState("");
    const [isWeightProductAdd, setIsWeightProductAdd] = useState(false)

    useEffect(() => {
        getPoints();
    }, []);

    useEffect(() => {
        if (point) {
            setScale("");
            getScales();
        }
    }, [point]);

    const getPoints = () => {
        Axios.get("/api/revision/points")
            .then((res) => res.data)
            .then((points) => {
                let temp = [];
                points.forEach(pnt => {
                    temp.push({ label: pnt.name, value: pnt.stockid })
                });
                setPoints(temp);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    const pointChange = (e) => {
        setPoint(e.value);
    };
    const getScales = () => {
        Axios.get("/api/productsweight/scales/search", {
            params: { point: point },
        })
            .then((res) => res.data)
            .then((res) => {
                const scales = res.map((s) => {
                    return {
                        label: s.name,
                        value: s.id,
                    };
                });
                setScales(scales);
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };

    
    const nonSelectedAlerts = () => {
        if (!point) {
            return Alert.warning("Выберите торговую точку", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        } else if (!scale) {
            return Alert.warning("Выберите весы", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
    };
    const openAddProduct = () => {
        if (!scale || !point) {
            return nonSelectedAlerts();
        }
        getFormationInvoice();
    };
    const getFormationInvoice = () => {
        setIsWeightProductAdd(true)
    };
    const openAlert = (invoiceInformation) => {
        scales.forEach((e) => {
            if (e.value === invoiceInformation.scale) {
                setScale(e);
            }
        });
        setSweetAlert(false);
    };
    const deleteInvoice = (inv) => {
        Axios.post("/api/invoice/delete", {
            invoice: inv,
        })
            .then((data) => {
                return data.data;
            })
            .then((resp) => {
                if (resp.code === "success") {
                    Alert.success("Накладная удалена успешно", {
                        position: "bottom-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    //https://github.com/Microsoft/TypeScript/issues/28898   - deprecated
                    window.location.reload(false);
                } else
                    return Alert.warning(resp.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };
    const clear = () => {
        setScale("");
        setPoint(""); setSubmitting(false);
    };

    const onScaleChange = (s) => {
        setScale(s);
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-4 mt-1">
                    <label htmlFor="">Торговая точка</label>
                    <Select
                        styles={customStyles}
                        options={points}
                        onChange={pointChange}
                        placeholder="Торговая точка"
                    />
                </div>
                <div className="col-md-4 mt-1">
                    <label htmlFor="">Весы</label>
                    <Select
                        value={scale}
                        name="scale"
                        onChange={onScaleChange}
                        noOptionsMessage={() => "Весы не найдены"}
                        options={scales}
                        placeholder="Выберите весы"
                    />
                </div>
                <div className="col-md-3 pw-adding-products-btn">
                    <button
                        style={{ flex: "auto" }}
                        className="btn btn-success"
                        disabled={isSubmitting || !scale || !point}
                        onClick={openAddProduct}
                    >
                        Добавить товар
                    </button>
                </div>
            </div>
            <div className="row">
                {isWeightProductAdd && <WeightProductsAdd />}
            </div>
        </Fragment>
    )
}

export default BindWeightProducts
