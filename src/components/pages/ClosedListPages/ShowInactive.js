import React, { useState, useEffect } from "react";
import ClosedDiscountsList from "./ClosedDiscountsList";
import ClosedCouponsList from "./ClosedCouponsList";
import ClosedList from "./ClosedList";

export default function ShowInactive({ callback, mode }) {
  const [caption, setCaption] = useState("");
  const [isHidden, setHidden] = useState(true);

  const handleHide = () => {
    let captionType = !isHidden ? "Показать" : "Скрыть";
    switches(captionType);
    setHidden(!isHidden);
  };

  useEffect(() => {
    switches("Показать");
  }, []);

  const switches = (captionType) => {
    let captionHandler = "";
    switch (mode) {
      case "point":
        captionHandler = captionType + " список неактивных торговых точек";
        break;
      case "attribute":
        captionHandler = captionType + " список неактивных атрибутов";
        break;
      case "stock":
        captionHandler = captionType + " список неактивных складов";
        break;
      case "cashboxuser":
        captionHandler = captionType + " список неактивных пользователей";
        break;
      case "erpuser":
        captionHandler = captionType + " список неактивных ERP пользователей";
        break;
      case "cashbox":
        captionHandler = captionType + " список неактивных касс";
        break;
      case "counterparties":
        captionHandler = captionType + " список неактивных контрагентов";
        break;
      case "buyers":
        captionHandler = captionType + " список неактивных покупателей";
        break;
      case "brand":
        captionHandler = captionType + " список неактивных брендов";
        break;
      case "attributeupdate":
        captionHandler = captionType + " список неактивных атрибутов";
        break;
      case "discount":
        captionHandler = captionType + " список неактивных скидок";
        break;
      case "coupons":
        captionHandler = captionType + " список неактивных купонов";
        break;
      default:
        break;
    }
    setCaption(captionHandler);
  };
  const setBody = () => {
    switch (mode) {
      case "discount":
        return <ClosedDiscountsList isHidden={isHidden} />;

      case "coupons":
        return <ClosedCouponsList isHidden={isHidden} />;
      default:
        return (
          <ClosedList
            mode={mode}
            handleRollback={callback}
            isHidden={isHidden}
          />
        );
    }
  };

  return (
    <div>
      <div className="empty-space" />

      <div className="inactive-items">
        <span className="btn-show" onClick={handleHide}>
          {caption}
        </span>
      </div>

      <div className={`inactive-items-list ${isHidden ? "d-none" : ""}`}>
        {setBody()}
      </div>
    </div>
  );
}
