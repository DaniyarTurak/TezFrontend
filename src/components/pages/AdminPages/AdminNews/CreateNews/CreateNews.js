import React, { useState } from "react";
import Select from "react-select";
import Axios from "axios";
import Moment from "moment";
import Alert from "react-s-alert";
import Marked from "./Marked";
import Searching from "../../../../Searching";

export default function CreateNews() {
  const [category, setCategory] = useState({ value: "0", label: "баг" });
  const [header, setHeader] = useState("");
  const [markedText, setMarked] = useState("");
  const [selectedFile, setFile] = useState("");
  const [isFileLoading, setFileLoading] = useState(false);
  const [filePath, setFilePath] = useState("");

  const categories = [
    { value: "0", label: "баг" },
    { value: "1", label: "уведомление" },
    { value: "2", label: "фича" },
  ];

  const onCategoryChange = (category) => {
    setCategory(category);
  };

  const onHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const onMarkedChange = (e) => {
    setMarked(e.target.value);
  };

  const sendNews = () => {
    const date = Moment(new Date()).format("MM.DD.YYYY HH:mm:ss");
    const data = {
      category: category.value,
      header,
      content: markedText,
      date,
    };
    Axios.post("/api/news", data)
      .then((res) => res.data)
      .then((res) => {
        Alert.success("Новость успешно добавлена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        clear();
        console.log(res);
      })
      .catch((err) => {
        Alert.error(`Возникла ошибка при обрабоке вашего запроса: ${err}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        console.log(err);
      });
  };

  const clear = () => {
    setHeader("");
    setMarked("");
    setFile("");
    setFilePath("");
    setFileLoading(false);
  };

  const onImageChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImageUpload = () => {
    if (!selectedFile) {
      Alert.info("Выберите файл", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
      return;
    }
    setFileLoading(true);
    const data = new FormData();

    data.append("file", selectedFile, selectedFile.name);
    data.append("type", "news");
    Axios.post("/api/files/upload", data)
      .then((res) => {
        Alert.success("Файл успешно выгружен", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        //this.getFiles();
        setFilePath(res.data.file.substr(1));
        setFileLoading(false);
      })
      .catch((err) => {
        console.log(err);
        Alert.error(`Ошибка при выгрузке файла ${err}`, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
        setFileLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="col-md-3 point-block">
        <label htmlFor="">Категория</label>
        <Select
          name="category"
          value={category}
          onChange={onCategoryChange}
          options={categories}
          placeholder="Выберите категорию"
          noOptionsMessage={() => "Категория не найдена"}
        />
      </div>
      <div style={{ marginTop: "1rem" }} className="col-md-12">
        <label>Заголовок</label>
        <input
          type="text"
          value={header}
          className="form-control"
          name="header"
          placeholder="Введите заголовок новости"
          onChange={onHeaderChange}
        />
      </div>
      {isFileLoading ? (
        <Searching />
      ) : (
        <div style={{ marginTop: "1rem" }} className="col-md-12">
          <label>Изображения</label>
          <div>
            <input
              style={{ color: "#2ea591" }}
              type="file"
              name="file"
              onChange={onImageChange}
            />
            <button
              className="btn btn-sm btn-success"
              onClick={handleImageUpload}
            >
              Выгрузить
            </button>
          </div>
          {filePath ? (
            <p>Путь к изображению: http://tezportal.ddns.net{filePath}</p>
          ) : (
            ""
          )}
        </div>
      )}

      <Marked
        markedText={markedText}
        setMarked={setMarked}
        onMarkedChange={onMarkedChange}
      />

      <div className="col-md-1 text-right search-btn">
        <button
          style={{ marginTop: "1rem" }}
          className="btn btn-success"
          onClick={sendNews}
        >
          Создать
        </button>
      </div>
    </div>
  );
}
