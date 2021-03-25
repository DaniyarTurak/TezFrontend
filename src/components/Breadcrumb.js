import React from "react";

function Breadcrumb({ content }) {
  return (
    <div className="row">
      <div className="col-md-12">
        <ol className="breadcrumb breadcrumb-st">
          {content.map(item => (
            <li
              key={item.caption}
              className={`breadcrumb-item ${item.active ? `active` : ""}`}
            >
              {item.caption}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Breadcrumb;
