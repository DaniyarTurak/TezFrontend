import React from "react";
import ReactTooltip from "react-tooltip";

export default function Tooltip({ name }) {
  const text = `В выпадающем списке отображаются только первые 50 ${name}. Рекомендуется вводить текст для поиска в списке.`;
  return (
    <div>
      <button
        style={{ marginTop: "2rem" }}
        data-tip={text}
        className="btn btn-w-big-icon info-item"
      ></button>
      <ReactTooltip />
    </div>
  );
}
