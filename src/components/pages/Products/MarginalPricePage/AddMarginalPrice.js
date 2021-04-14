import React, { Fragment, useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Grid from '@material-ui/core/Grid';
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Alert from "react-s-alert";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function AddMarginalPrice() {

    const [products, setProducts] = useState([]);
    const [productNameForSelect, setProductNameForSelect] = useState("");
    const [isLoading, setLoading] = useState("");
    const [listForSelect, setListForSelect] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [barcode, setBarcode] = useState("");
    const [staticPrice, setStaticPrice] = useState();
    const [marginalPrice, setMarginalPrice] = useState();
    const [prodName, setProdName] = useState();

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = (productName) => {
        setLoading(true);
        Axios.get("/api/products/withprice", { params: { productName } })
            .then((res) => res.data)
            .then((list) => {
                let opts = [];
                list.map((product) => {
                    opts.push({ label: product.name, value: product.id })
                })
                setListForSelect(opts)
                setProducts(list);
                setLoading(false);

            })
            .catch((err) => {
                ErrorAlert(err);
                setLoading(false);
            });
    };

    const barcodeChange = (value) => {
        setBarcode(value);
        products.forEach(element => {
            if (value.toString() === element.code) {
                setProductNameForSelect({ label: element.name, value: element.id });
                setProdName(element.name);
            }
        });
    };

    const productOnChange = (e, data) => {
        console.log(data.value);
        products.forEach(product => {
            if (product.id === data.value) {
                setBarcode(product.code);
                setProdName(product.name);
            }
        });

    };

    const productOnInputChange = (e, name) => {
        console.log(name);
    };

    const addProduct = () => {
        if (!barcode) {
            Alert.error("Введите штрих-код", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        }
        else {
            if (!prodName) {
                Alert.error("Введите наименование товара", {
                    position: "top-right",
                    effect: "bouncyflip",
                    timeout: 2000,
                });
            }
            else {
                if (!marginalPrice) {
                    Alert.error("Введите предельную цену", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                }
                else {
                    console.log(prodName);
                    console.log(barcode);
                    console.log(marginalPrice);
                }
            }

        }
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-12">
                    <h6 className="btn-one-line" style={{ fontWeight: "bold" }}>
                        Добавление предельной цены
                    </h6>
                </div>
            </div>
            <div className="row pt-10">
                <div className="col-md-3">
                <label>Введите штрих-код:</label>
                    <TextField
                        variant="outlined"
                        type="text"
                        label="Штрих-код"
                        name="barcode"
                        value={barcode}
                        className="form-control"
                        onChange={(e) => barcodeChange(e.target.value)}
                    // onKeyDown={barcodeChange}
                    />
                </div>
                <div className="col-md-9">
                    <label>Выберите товар из списка: </label>
                    <Autocomplete
                        id="outlined-basic"
                        options={listForSelect}
                        value={productNameForSelect}
                        onChange={productOnChange}
                        noOptionsText="Товар не найден"
                        onInputChange={productOnInputChange}
                        filterOptions={(options) =>
                            options.filter((option) => option !== "")
                        }
                        getOptionLabel={(option) => (option ? option.label : "")}
                        getOptionSelected={(option, value) =>
                            option.label === value.value
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Наименование товара"
                                variant="outlined"
                            />
                        )}
                    />
                </div>
            </div>
            {products.length === 0 && (
                <div className="row mt-10 text-center">
                    <div className="col-md-12 not-found-text loading-dots">
                        Товар не найден
                  </div>
                </div>
            )}
            <div className="mt-20 mb-20">
                <div className="row">
                    <div className="col-md-4">Введите предельную цену товара</div>
                </div>
                <div className="row">
                    <div className="col-md-4 percentage-block">
                        <input
                            name="price"
                            type="number"
                            value={marginalPrice}
                            onChange={(e) => { setMarginalPrice(e.target.value) }}
                            className="form-control"
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-md-4 percentage-block">
                        <button
                            className="btn btn-outline-primary"
                            onClick={addProduct}
                        >
                            Добавить товар в справочник
                    </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );

};