import React, { useState } from "react";
import Alert from "react-s-alert";

export default function EditingProductComponent({
  editingProduct,
  updateHotkey,
  closeModal,
  productsList,
}) {
  const [hotkey, setHotKey] = useState(parseFloat(editingProduct.hotkey));
  const onHotKeyChange = (e) => {
    let h = isNaN(e.target.value) ? 0 : e.target.value;
    setHotKey(h);
  };

  const handleEdit = () => {
    let reserved = false;

    productsList.forEach((e) => {
      if (e.hotkey === hotkey) {
        reserved = true;
      }
    });
    if (reserved === true) {
      return Alert.warning("Данный номер на весах уже занят", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    let newProductList = {
      id: editingProduct.id,
      hotkey,
      stockcurrentid: editingProduct.stockcurrentid,
    };
    updateHotkey(newProductList);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 mt-20">
          <label style={{ color: "orange" }}>Номер на весах</label>
          <input
            style={{ color: "orange" }}
            value={hotkey}
            placeholder="Введите горячую клавишу"
            className="form-control"
            name="hotkey"
            onChange={onHotKeyChange}
          />
        </div>

        <div
          className="col-md-4"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            style={{ flex: "auto", marginTop: "1rem" }}
            className="btn btn-success"
            onClick={handleEdit}
          >
            Изменить
          </button>
        </div>
        <div
          className="col-md-4"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            style={{ flex: "auto", marginTop: "1rem" }}
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
