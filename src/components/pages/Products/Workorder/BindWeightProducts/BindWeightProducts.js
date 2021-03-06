import React, { Fragment, useState, useEffect } from 'react'
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import WarningDelete from "../../../ProductsWeight/Alerts/WarningDelete";
import WeightProductsAdd from './WeightProductsAdd';
import WeightProductsTable from './WeightProductsTable';
import WeightProductsSave from './WeightProductsSave';
import ReactModal from "react-modal";
import EditingProductComponent from "../../../ProductsWeight/Alerts/EditingProductComponent";

function BindWeightProducts() {
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                border: '2px solid #17a2b8',

            }
        }),
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-40%, -50%)",
            width: isEditing ? "60%" : "60rem",
            zIndex: 11,
            height: "40vh",
        },
        overlay: { zIndex: 10 },
    };

    const [points, setPoints] = useState([]);
    const [point, setPoint] = useState("");
    const [scale, setScale] = useState("");
    const [scales, setScales] = useState([]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [isWeightProductAdd, setIsWeightProductAdd] = useState(false)
    const [weightProductsList, setWeightProductsList] = useState([]);
    const [editingProduct, setEditingProduct] = useState("");
    const [editingId, setEditingId] = useState("");
    const [isEditing, setEditing] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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

    const getWeightProductsList = () => {
        if (!scale || !point) {
            return nonSelectedAlerts();
        }
        Axios.get("/api/pluproducts/productsweight", {
            params: { scale: scale.value },
        })
            .then((res) => res.data)
            .then((data) => {
                setWeightProductsList(data)
            })
            .catch((err) => {
                ErrorAlert(err)
            })
    }

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
            return Alert.warning("???????????????? ???????????????? ??????????", {
                position: "top-right",
                effect: "bouncyflip",
                timeout: 2000,
            });
        } else if (!scale) {
            return Alert.warning("???????????????? ????????", {
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
        getWeightProductsList();
    };
    const getFormationInvoice = () => {
        setIsWeightProductAdd(true)
    };

    const updateHotkey = (req) => {
        const info = {
            ...req,
            scale: scale.value,
        };
        Axios.post("/api/pluproducts/update/hotkey", info)
            .then((data) => {
                return data.data;
            })
            .then((resp) => {
                if (resp.code === "success") {
                    Alert.success("???? ?????????????? ???????????????? ?????????? ???? ??????????", {
                        position: "bottom-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                    setModalOpen(false);
                    getWeightProductsList()
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
    const handleEdit = (id, oldProduct) => {
        setEditingId(id);
        setEditingProduct(oldProduct);
        setEditing(true);
        setModalOpen(true);
    };

    const handleDeleteOpen = (id) => {
        setEditingId(id);
        const changedProductList = JSON.parse(JSON.stringify(weightProductsList));
        changedProductList.forEach((el, idx) => {
            if (idx === id) {
                el.stock ? setDeleteModalOpen(true) : handleDelete(id)
            }
        });
    };

    const handleDeleteClose = () => {
        setDeleteModalOpen(false);
        cleanAlerts();
    };

    const handleDelete = (id) => {
        const changedProductList = JSON.parse(JSON.stringify(weightProductsList));
        let idToDelete;
        isDeleteModalOpen ?
            (changedProductList.forEach((el, idx) => {
                if (idx === editingId) {
                    idToDelete = el.id;
                }
            })
            ) :
            (
                changedProductList.forEach((el, idx) => {
                    if (idx === id) {
                        idToDelete = el.id;
                    }
                })
            )
        setWeightProductsList(changedProductList);
        handleDeleteClose();
        const delete_main = "/api/pluproducts/delete/good";
        const delete_main_values = {
            id: idToDelete,
            scale: scale.value,
        };
        setSubmitting(true);
        Axios.post(
            delete_main,
            delete_main_values
        )
            .then((data) => {
                return data.data;
            })
            .then((resp) => {
                setSubmitting(false);
                if (resp.code === "success") {
                    getWeightProductsList();
                    Alert.success("?????????? ???????????? ??????????????.", {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });
                } else
                    return Alert.warning(resp.text, {
                        position: "top-right",
                        effect: "bouncyflip",
                        timeout: 2000,
                    });

            })
            .catch((err) => {
                setSubmitting(false);
                ErrorAlert(err);
            });
    };


    const onScaleChange = (s) => {
        setScale(s);
        console.log(scale)
    };
    const closeModal = () => {
        cleanAlerts();
    };
    const cleanAlerts = () => {
        setEditing(false);
        setModalOpen(false);
    };

    return (
        <Fragment>

            <ReactModal isOpen={isModalOpen} style={customStyles}>
                {isEditing && (
                    <EditingProductComponent
                        productsList={weightProductsList}
                        updateHotkey={updateHotkey}
                        editingProduct={editingProduct}
                        closeModal={closeModal}
                    />
                )}
            </ReactModal>
            <WarningDelete
                handleDelete={handleDelete}
                open={isDeleteModalOpen}
                handleClose={handleDeleteClose}
            />
            {/* <SuccessAdd open={isAddModalOpen} handleClose={handleAddClose} /> */}

            <div className="row">
                <div className="col-md-4 mt-1">
                    <label htmlFor="">???????????????? ??????????</label>
                    <Select
                        options={points}
                        onChange={pointChange}
                        placeholder="???????????????? ??????????"
                    />
                </div>
                <div className="col-md-4 mt-1">
                    <label htmlFor="">????????</label>
                    <Select
                        value={scale}
                        name="scale"
                        onChange={onScaleChange}
                        noOptionsMessage={() => "???????? ???? ??????????????"}
                        options={scales}
                        placeholder="???????????????? ????????"
                    />
                </div>
                <div className="col-md-3 pw-adding-products-btn">
                    <button
                        style={{ flex: "auto" }}
                        className="btn btn-success"
                        disabled={isSubmitting || !scale || !point}
                        onClick={openAddProduct}
                    >
                        ???????????????? ??????????
                    </button>
                </div>
            </div>
            <div className="row">
                {isWeightProductAdd &&
                    <WeightProductsAdd
                        scale={scale}
                        getWeightProductsList={getWeightProductsList}
                    />}
            </div>
            {weightProductsList.length > 0 &&
                <Fragment>
                    <WeightProductsTable
                        weightProductsList={weightProductsList}
                        isSubmitting={isSubmitting}
                        handleEdit={(id, old) => handleEdit(id, old)}
                        handleDelete={(id) => handleDeleteOpen(id)}
                    />
                    <WeightProductsSave
                        weightProductsList={weightProductsList}
                        isSubmitting={isSubmitting}
                    />
                </Fragment>

            }


        </Fragment>
    )
}

export default BindWeightProducts
