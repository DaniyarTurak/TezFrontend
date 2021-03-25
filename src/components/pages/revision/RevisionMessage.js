import React from "react";
import "../../../sass/revision.sass";

export default function RevisionMessage(props) {
  const { goToReport, goToRevision } = props;
  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>Вы успешно провели ревизию!</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-sm btn-outline-success"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={goToReport}
        >
          Посмотреть отчёт
        </button>

        <button
          className="btn btn-sm btn-outline-primary"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={goToRevision}
        >
          Провести ещё одну ревизию
        </button>
      </div>
    </div>
  );
}
