import React, { Component, Fragment } from "react";
import Axios from "axios";
import Alert from "react-s-alert";

class UploadFile extends Component {
  state = {
    loaded: 0,
    filesList: [],
    isLoading: true,
    selectedFile: null
  };

  componentDidMount() {
    this.getFiles();
  }
  getFiles = () => {
    Axios.get("/api/files")
      .then(res => res.data)
      .then(filesList => {
        filesList.sort(function(a, b) {
          var textA = a.toUpperCase();
          var textB = b.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        this.setState({ filesList, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  handleSelectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  handleUpload = () => {
    if (!this.state.selectedFile) {
      Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000
      });
      return;
    }

    let data = new FormData();
    data.append("file", this.state.selectedFile, this.state.selectedFile.name);
    Axios.post("/api/files/upload", data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          isLoading: true
        });
      }
    })
      .then(() => {
        Alert.success("Файл успешно выгружен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000
        });
        this.getFiles();
        this.setState({ loaded: 0, isLoading: true });
      })
      .catch(err => {
        console.log(err);

        Alert.error(`Ошибка при выгрузке файла ${err}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000
        });

        this.setState({ loaded: 0 });
      });
  };

  handleDownload = file => {
    this.setState({ isLoading: true }); // Set true flag here
    Axios.get("/api/files/download", { responseType: "blob", params: { file } })
      .then(res => res.data)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        this.setState({ isLoading: false }); // Set false flag here
      });
  };

  handleDelete = file => {
    Axios.get("/api/files/delete", { params: { file } })
      .then(res => res.data)
      .then(() => {
        Alert.success("Файл успешно удален", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000
        });

        let filesList = this.state.filesList.filter(files => files !== file);

        this.setState({ filesList, isLoading: true });
      });
  };

  render() {
    const { loaded, filesList, isLoading } = this.state;

    return (
      <Fragment>
        <div className={`upload-file ${isLoading ? "is-loading-upload" : ""}`}>
          <div className="loader">
            <div className="icon" />
          </div>

          <div className="row">
            <div className="col-md-12">
              <h6>Выгрузить файл на сервер</h6>
            </div>
          </div>

          <div className="empty-space"></div>

          <div className={`row mt-10 ${filesList.length > 0 ? "pb-10" : ""}`}>
            <div className="col-md-8">
              <input type="file" onChange={this.handleSelectedFile} />
            </div>
            <div className="col-md-4 text-right">
              <button
                className="btn btn-sm btn-success"
                onClick={this.handleUpload}
              >
                Выгрузить
              </button>
            </div>

            {loaded > 0 && (
              <div className="col-md-12 mt-20">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    // eslint-disable-next-line
                    style={{ width: `${Math.round(loaded, 2)}` + "%" }}
                  ></div>
                </div>
              </div>
            )}
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

export default UploadFile;
