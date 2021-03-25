import React, { Component, Fragment, useState } from "react";
import Axios from "axios";
import Alert from "react-s-alert";
import { read, utils } from "xlsx";
import Select from "react-select";
import ReactModal from "react-modal";

const folder = "./public/imp_log";

class ImpNomenclature extends Component {
  state = {
    loaded: 0,
    selectedFile: null,
    companySelect: "",
    companies: [],
    stockSelect: "",
    stocks: [],
    companyNDS: "",
    filesList: [],
    counterparties: [],
    contrSelect: "",
    message: "",
    open: false,
  };


  componentDidMount() {
    this.getCompaniesInfo();
    this.getFiles(folder);
  }

  getFiles = (folder) => {
    Axios.get("/api/files", { params: { folder } })
      .then((res) => res.data)
      .then((filesList) => {
        console.log(filesList);
        /*filesList.sort(function (a, b) {
					var textA = a.toUpperCase();
					var textB = b.toUpperCase();
					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});*/
        this.setState({ filesList });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDownload = (file) => {
    Axios.get("/api/files/download", {
      responseType: "blob",
      params: { file: file, folder: folder },
    })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
      });
  };

  handleDelete = (file) => {
    Axios.get("/api/files/delete", { params: { file: file, folder: folder } })
      .then((res) => res.data)
      .then(() => {
        Alert.success("Файл успешно удален", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });

        let filesList = this.state.filesList.filter((files) => files !== file);

        this.setState({ filesList });
      });
  };

  handleSelectedFile = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };



  handleUpload = () => {
    if (
      !this.state.companySelect.value ||
      !this.state.stockSelect.value ||
      !this.state.companyNDS.value
    ) {
      Alert.info("Заполните все поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }

    if (!this.state.selectedFile) {
      Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
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
        if (product.Code.toString().toLowerCase().search(/[а-яё]/i) >= 0) {
          pwk.push(i + 1);
        }
      });

      if (pwk && pwk.length !== 0) {
        if (pwk.length > 1) {
          pwk.forEach((number, i) => {
            if (i !== pwk.length - 1) {
              errMsg += number.toString() + ', ';
            }
            else {
              errMsg += number.toString() + ' ';
            }
          });
          errMsg = "В строках " + errMsg + "имеются символы кириллицы";
        }
        else {
          errMsg = "В строке " + pwk[0].toString() + " имеются символы кириллицы";
        }
        this.setState({message: errMsg, open: true})

      }
      else {
      /* Update state */

      var params = new URLSearchParams();
      params.append("data", data);
      params.append("companyId", this.state.companySelect.value);
      params.append("stockId", this.state.stockSelect.value);
      params.append("taxId", this.state.companyNDS.value);
      params.append("counterparty", this.state.contrSelect.value);

      Axios.post("/api/utils/import_nomenclature_xls", params)
        .then((res) => res.data)
        .then((res) => {
          Alert.success("Данные успешно импортированы", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          this.setState({
            companyNDS: null,
            contrSelect: null,
          });
          this.getFiles(folder);
        })
        .catch((err) => {
          Alert.success("Ошибка загрузки данных", {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          });
          console.log(err);
        });
    };
  };
    reader.readAsBinaryString(this.state.selectedFile);
  };

  getStocksByCompany = (companyId) => {
    Axios.get("/api/stock", { params: { companyId } })
      .then((res) => res.data)
      .then((result) => {
        const stocks = result.map((result) => {
          return { value: result.id, label: result.name };
        });
        stocks.push({ value: "0", label: "Все склады" });
        this.setState({ stocks });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCounterparties = (companyId) => {
    Axios.get("/api/counterparties", { params: { companyId } })
      .then((res) => res.data)
      .then((result) => {
        const counterparties = result.map((result) => {
          return { value: result.id, label: result.name };
        });
        counterparties.push({ value: "0", label: "Не указан" });
        this.setState({ counterparties });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onContrChange = (value) => {
    this.setState({
      contrSelect: value,
    });
  };

  onCompanyChange = (value) => {
    this.setState({
      companySelect: value,
      stockSelect: "Касса не найдена",
    });
    this.getStocksByCompany(value.value);
    this.getCounterparties(value.value);
  };

  getCompaniesInfo = () => {
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((list) => {
        const companies = list.map((result) => {
          return {
            label: result.name,
            value: result.id,
          };
        });
        this.setState({
          companies: companies,
          isUpdating: false,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isUpdating: false,
          isLoading: false,
        });
      });
  };

  onStockChange = (value) => {
    this.setState({
      stockSelect: value,
    });
  };

  onNDSChange = (value) => {
    this.setState({
      companyNDS: value,
    });
  };

  render() {
    const {
      companySelect,
      companies,
      stockSelect,
      stocks,
      companyNDS,
      filesList,
      contrSelect,
      counterparties,
      open,
      message,
    } = this.state;
    return (
      <Fragment>
              <ReactModal isOpen={open}
        style={{
          content: {
            textAlign: "center",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
          }
        }}
        onRequestClose={() => { this.setState({open: false}) }}
      >
        <p style={{ color: 'red' }}>Символы кириллицы в штрих-коде недопустимы.</p>
        <p>
          {message}.
          </p>
        <p />
        <button className="btn btn-success btn-sm" style={{ minWidth: "40px" }} onClick={() => { this.setState({open:false}) }}> Ок </button>
      </ReactModal>
        <div className="upload-file">
          <div className="row">
            <div className="col-md-12">
              <label htmlFor="">Компания :</label>
              <div className="col-md-8">
                <Select
                  name="companySelect"
                  value={companySelect}
                  onChange={this.onCompanyChange}
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
                  onChange={this.onStockChange}
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
                  onChange={this.onNDSChange}
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
                  onChange={this.onContrChange}
                  options={counterparties}
                  placeholder="Выберите поставщика"
                />
              </div>
            </div>
          </div>
          <div className="row">&nbsp;</div>
          <div className="col-md-12">
            <div>
              <input type="file" onChange={this.handleSelectedFile} />
            </div>
          </div>
          <div className="row">&nbsp;</div>
          <div className="col-md-12">
            <div className=" mb-10">
              <button
                className="btn btn-sm btn-success"
                onClick={this.handleUpload}
              >
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
                            onClick={() => this.handleDownload(file)}
                          >
                            Скачать
                          </button>
                        </td>
                        <td className="text-right">
                          <button
                            className="btn btn-block btn-sm btn-outline-danger"
                            onClick={() => this.handleDelete(file)}
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
}

export default ImpNomenclature;
