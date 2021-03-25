import React, { useState, useEffect } from "react";
import Axios from "axios";
import Searching from "../../../../Searching";
import "./pos-update-list.sass";

export default function PosUpdateList() {
  const [files, setFiles] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = () => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/info")
      .then((res) => res.data)
      .then((res) => {
        setFiles(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDownload = (file) => {
    file = file.filename;
    const folder = "./public/pos_update";
    setLoading(true);
    Axios.get("/api/files/download", {
      responseType: "blob",
      params: { file, folder },
    })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const HaltUpdate = (id) => {
    setLoading(true);
    Axios.get("/api/cashbox/updates/cancel", {
      params: { id },
    })
      .then((res) => res.data)
      .then((res) => {
        setLoading(false);
        getFiles();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="report-stock-balance">
      {isLoading && <Searching />}

      {!isLoading && files.length === 0 && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <div className="row mt-20">
          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <th>ID</th>
                  <th className="text-center">Наименование файла</th>
                  <th className="text-center">
                    Количество не обновлённых касс
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.id}</td>
                    <td className="text-center">
                      <a
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleDownload(file)}
                      >
                        {file.filename}
                      </a>
                    </td>
                    <td className="text-center">{file.details.count}</td>
                    {file.details.count !== 0 && (
                      <td>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => HaltUpdate(file.id)}
                        >
                          Отменить обновление
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
