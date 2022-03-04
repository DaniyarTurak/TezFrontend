import React, { useState, useEffect } from "react";
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
      case "cashbox":
        captionHandler = captionType + " список неактивных касс";
        break;
      default:
        break;
    }
    setCaption(captionHandler);
  };
  const setBody = () => {
    return (
      <ClosedList mode={mode} handleRollback={callback} isHidden={isHidden} />
    );
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
