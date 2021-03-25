import React, { useState, Fragment } from "react";
import News from "../../News";
import CreateNews from "./CreateNews";
import newspages from "../../../../data/newspages";

export default function AdminNews() {
  const [mode, setMode] = useState("createnews");

  const changeMode = (e) => {
    setMode(e.target.name);
  };
  return (
    <div>
      <div className={`row ${mode ? "pb-10" : ""}`}>
        {newspages.map((mode) => (
          <div className="col-md-3 report-btn-block" key={mode.id}>
            <button
              className={`btn btn-sm btn-block btn-report ${
                mode === mode.route ? "btn-info" : "btn-outline-info"
              }`}
              name={mode.route}
              onClick={changeMode}
            >
              {mode.caption}
            </button>
          </div>
        ))}
      </div>

      {mode && (
        <Fragment>
          <div className="empty-space" />

          <div className="row mt-10">
            <div className="col-md-12">
              {mode === "createnews" && <CreateNews />}
              {mode === "changenews" && <News isAdmin={true} />}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
