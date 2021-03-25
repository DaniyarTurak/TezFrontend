import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import { read, utils } from "xlsx";
import Select from "react-select";
import ReactModal from "react-modal";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

const folder = "./public/imp_log";

export default function ImpNomenclature() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [companySelect, setCompanySelect] = useState("");
  const [companies, setCompanies] = useState([]);
  const [stockSelect, setStockSelect] = useState("");
  const [stocks, setStocks] = useState([]);
  const [companyNDS, setCompanyNDS] = useState("");
  const [filesList, setFilesList] = useState([]);
  const [counterparties, setCounterparties] = useState([]);
  const [contrSelect, setContrSelect] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCompaniesInfo();
    getFiles();
  }, []);

  const getFiles = () => {
    Axios.get("/api/files", { params: { folder } })
      .then((res) => res.data)
      .then((res) => {
        setFilesList(res);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleDownload = (file) => {
    Axios.get("/api/files/download", {
      responseType: "blob",
      params: { file, folder },
    })
      .then((res) => res.data)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
      });
  };

  const handleDelete = (file) => {
    Axios.get("/api/files/delete", { params: { file, folder } })
      .then((res) => res.data)
      .then(() => {
        Alert.success("Файл успешно удален", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        const filesListChanged = filesList.filter((files) => files !== file);
        setFilesList(filesListChanged);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!companySelect.value || !stockSelect.value || !companyNDS.value) {
      return Alert.info("Заполните все поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    if (!selectedFile) {
      return Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = read(bstr, { type: "binary" });
      let errMsg = "";
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = JSON.stringify(
        utils.sheet_to_json(
          ws,
          { raw: true },
          { skipUndfendVale: false, defaultValue: null }
        )
      );

      const pwk = [];

      const prods = utils.sheet_to_json(
        ws,
        { raw: true },
        { skipUndfendVale: false, defaultValue: null }
      );

      prods.forEach((product, i) => {
        if (
          product.Code.toString()
            .toLowerCase()
            .search(/[а-яё]/i) >= 0
        ) {
          pwk.push(i + 1);
        }
      });

      if (pwk && pwk.length !== 0) {
        if (pwk.length > 1) {
          pwk.forEach((number, i) => {
            if (i !== pwk.length - 1) {
              errMsg += number.toString() + ", ";
            } else {
              errMsg += number.toString() + " ";
            }
          });
          errMsg = "В строках " + errMsg + "имеются символы кириллицы";
        } else {
          errMsg =
            "В строке " + pwk[0].toString() + "имеются символы кириллицы";
        }
        setMessage(errMsg);
        setOpen(true);
      } else {
        var params = new URLSearchParams();
        params.append("data", data);
        params.append("companyId", companySelect.value);
        params.append("stockId", stockSelect.value);
        params.append("taxId", companyNDS.value);
        params.append("counterparty", contrSelect.value);

        Axios.post("/api/utils/import_nomenclature_xls", params)
          .then((res) => res.data)
          .then((res) => {
            Alert.success("Данные успешно импортированы", {
              position: "top-right",
              effect: "bouncyflip",
              timeout: 2000,
            });
            setCompanyNDS(null);
            setContrSelect(null);
            getFiles(folder);
          })
          .catch((err) => {
            ErrorAlert(err);
          });
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const getStocksByCompany = (companyId) => {
    Axios.get("/api/stock", { params: { companyId } })
      .then((res) => res.data)
      .then((res) => {
        const stocksChanged = res.map((r) => {
          return { value: r.id, label: r.name };
        });
        stocksChanged.push({ value: "0", label: "Все склады" });
        setStocks(stocksChanged);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getCounterparties = (companyId) => {
    Axios.get("/api/counterparties", { params: { companyId } })
      .then((res) => res.data)
      .then((res) => {
        const counterpartiesChanged = res.map((r) => {
          return { value: r.id, label: r.name };
        });
        counterpartiesChanged.push({ value: "0", label: "Не указан" });
        setCounterparties(counterpartiesChanged);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onContrChange = (val) => {
    setContrSelect(val);
  };

  const onCompanyChange = (val) => {
    setCompanySelect(val);
    setStockSelect("Касса не найдена");
    getStocksByCompany(val.value);
    getCounterparties(val.value);
  };

  const getCompaniesInfo = () => {
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((list) => {
        const companiesChanged = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        setCompanies(companiesChanged);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const onStockChange = (val) => {
    setStockSelect(val);
  };

  const onNDSChange = (val) => {
    setCompanyNDS(val);
  };

  return (
    <Fragment>
      <ReactModal
        isOpen={open}
        style={{
          content: {
            textAlign: "center",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
          },
        }}
        onRequestClose={() => {
          setOpen(false);
        }}
      >
        <p style={{ color: "red" }}>
          Символы кириллицы в штрих-коде недопустимы.
        </p>
        <p>{message}.</p>
        <p />
        <button
          className="btn btn-success btn-sm"
          style={{ minWidth: "40px" }}
          onClick={() => {
            setOpen(false);
          }}
        >
          {" "}
          Ок{" "}
        </button>
      </ReactModal>
      <div className="upload-file">
        <div className="row">
          <div className="col-md-12">
            <label htmlFor="">Компания :</label>
            <div className="col-md-8">
              <Select
                name="companySelect"
                value={companySelect}
                onChange={onCompanyChange}
                options={companies}
                autosize={true}
                placeholder="Выберите компанию"
                noOptionsMessage={() => "Компания не найдена"}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label htmlFor="">Склад :</label>
            <div className="col-md-8">
              <Select
                name="stock"
                value={stockSelect}
                onChange={onStockChange}
                options={stocks}
                placeholder="Выберите кассу"
                noOptionsMessage={() => "Склад не найден"}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label htmlFor="">Компания является плательщиком НДС ?</label>
            <div className="col-md-8">
              <Select
                name="companyNDS"
                value={companyNDS}
                onChange={onNDSChange}
                options={[
                  { value: "0", label: "Нет" },
                  { value: "1", label: "Да" },
                ]}
                placeholder="Выберите да/нет"
                autosize={true}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label htmlFor="">Выберите поставщика :</label>
            <div className="col-md-8">
              <Select
                name="counterparties"
                value={contrSelect}
                onChange={onContrChange}
                options={counterparties}
                placeholder="Выберите поставщика"
              />
            </div>
          </div>
        </div>
        <div className="row">&nbsp;</div>
        <div className="col-md-12">
          <div>
            <input type="file" onChange={handleSelectedFile} />
          </div>
        </div>
        <div className="row">&nbsp;</div>
        <div className="col-md-12">
          <div className=" mb-10">
            <button className="btn btn-sm btn-success" onClick={handleUpload}>
              Выгрузить
            </button>
          </div>
        </div>
      </div>

      {filesList.length > 0 && (
        <Fragment>
          <div className="empty-space"></div>

          <div className="row mt-10">
            <div className="col-md-12">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <td style={{ width: "2%" }}></td>
                    <td>Наименование файла</td>
                    <td></td>
                    <td></td>
                  </tr>
                </thead>

                <tbody>
                  {filesList.map((file, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{file}</td>
                      <td className="text-right">
                        <button
                          className="btn btn-block btn-sm btn-outline-success"
                          onClick={() => handleDownload(file)}
                        >
                          Скачать
                        </button>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-block btn-sm btn-outline-danger"
                          onClick={() => handleDelete(file)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
