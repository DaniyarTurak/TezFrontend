import React, { useState } from "react";
import Axios from "axios";
import ReactModal from "react-modal";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";
import PickPrefixType from "./Alerts/PickPrefixType";

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

export default function SaveProducts({ productsList, isSubmitting }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const getExcel = () => {
    const productsListChanged = productsList.map((e) => {
      return (e = {
        ...e,
        total_purchaseprice: parseFloat(e.amount) * e.lastpurchaseprice,
        total_price: parseFloat(e.amount) * e.price,
      });
    });
    Axios({
      method: "POST",
      url: "/api/productsweight/excel",
      data: { productsListChanged },
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
          productsList={productsList}
          closeModal={() => setModalOpen(false)}
          isWeight={false}
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
  );
}
