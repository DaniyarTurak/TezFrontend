import React, { useState } from "react";
import Axios from "axios";
import ReactModal from "react-modal";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import PickPrefixType from "../../../ProductsWeight/Alerts/PickPrefixType";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-40%, -50%)",
        width: "60%",
        zIndex: 11,
        height: "30vh",
    },
    overlay: { zIndex: 10 },
};

function WeightProductsSave({ weightProductsList, isSubmitting }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const getExcel = () => {
        const plu_products = weightProductsList.map((e) => {
            return (e = {
                ...e,
                barcode: e.code,
                lastpurchaseprice: e.purchaseprice,
                taxid: e.tax,
                price: e.sellprice,
            });
        });
        Axios({
            method: "POST",
            url: "/api/pluproducts/excel",
            data: { plu_products },
            responseType: "blob",
        })
            .then((res) => res.data)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Весовые товары.xlsx`);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                ErrorAlert(err);
            });
    };
    return (
        <div className="row">
            <ReactModal isOpen={isModalOpen} style={customStyles}>
                <PickPrefixType
                    productsList={weightProductsList}
                    closeModal={() => setModalOpen(false)}
                    isWeight={true}
                />
            </ReactModal>
            <div className="col-md-6 pw-adding-products-btn mt-4">
                <button
                    className="pw-save-buttons btn btn-outline-info"
                    disabled={isSubmitting}
                    onClick={() => setModalOpen(true)}
                >
                    Выгрузить PLU
                </button>
            </div>
            <div className="col-md-6 pw-adding-products-btn mt-4">
                <button
                    className="pw-save-buttons btn btn-outline-info"
                    disabled={isSubmitting}
                    onClick={getExcel}
                >
                    Выгрузить в Excel
                </button>
            </div>
        </div>
    )
}

export default WeightProductsSave
