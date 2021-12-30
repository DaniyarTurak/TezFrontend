import React, { useState } from "react";
import Moment from "moment";
import Axios from "axios";
import ErrorAlert from "../../../ReusableComponents/ErrorAlert";
import Select from "react-select";

export default function PickPrefixType({ productsList, closeModal, isWeight }) {
  const [prefixType, setPrefixType] = useState({ label: "RLS1000", value: 0 });
  const prefixTypes = [
    { label: "RLS1000", value: 0 },
    { label: "Штрих-принт", value: 1 },
  ];

  const onPrefixTypeChange = (s) => {
    setPrefixType(s);
  };

  const getText = () => {
    let arr = [];
    const date = `PLU_${Moment().format("L").split(".").join("")}.txt`;
    prefixType.value === 0
      ? productsList.map((e, idx) =>
        arr.push(
          Object.values({
            a: e.hotkey,
            b: e.name,
            c: e.hotkey,
            d: parseInt(e.barcode.substring(2), 0),
            e: 7,
            f: parseFloat(e.price),
            g: 4,
          })
        )
      )
      : productsList.map((e, idx) =>
        arr.push(
          Object.values({
            a: e.hotkey,
            b: e.name,
            c: "",
            d: parseFloat(e.price),
            e: 0,
            f: 0,
            g: 0,
            h: parseInt(e.barcode.substring(2), 0),
            i: 0,
            j: 0,
            k: "",
            l: "30.12.99",
            m: 0,
          })
        )
      );
    // сервис для выгрузки файла для китайских весов
    Axios({
      method: "POST",
      url: "/api/productsweight/to-text",
      data: {
        arr,
        date,
        type: prefixType.value,
      },
      responseType: "blob",
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        closeModal();
        return Axios.get("/api/productsweight/download", {
          responseType: "blob",
          params: { date, type: prefixType.value },
        })
          .then((res) => res.data)
          .then((response) => {
            const url = window.URL.createObjectURL(
              new Blob(
                [
                  prefixType.value === 0
                    ? new Uint8Array([0xef, 0xbb, 0xbf])
                    : "", // UTF-8 BOM
                  response,
                ],
                {
                  type:
                    prefixType.value === 0
                      ? "text/plain;charset=utf-8"
                      : "text/plain;charset=windows-1251",
                }
              )
            );
            //console.log(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", date);
            document.body.appendChild(link);
            link.click();
          });
      })
      .catch((err) => {
        ErrorAlert(err);
      })
  };

  const getWeightText = () => {
    let arr = [];
    const date = `PLU_${Moment().format("L").split(".").join("")}.txt`;
    prefixType.value === 0
      ? productsList.map((e, idx) =>
        arr.push(
          Object.values({
            a: e.hotkey,
            b: e.name,
            c: e.hotkey,
            d: parseInt(e.code.substring(2), 0),
            e: 7,
            f: parseFloat(e.sellprice),
            g: 4,
          })
        )
      )
      : productsList.map((e, idx) =>
        arr.push(
          Object.values({
            a: e.hotkey,
            b: e.name,
            c: "",
            d: parseFloat(e.sellprice),
            e: 0,
            f: 0,
            g: 0,
            h: parseInt(e.code.substring(2), 0),
            i: 0,
            j: 0,
            k: "",
            l: "30.12.99",
            m: 0,
          })
        )
      );
    Axios({
      method: "POST",
      url: "/api/pluproducts/to-text",
      data: {
        arr,
        date,
        type: prefixType.value,
      },
      responseType: "blob",
    })
      .then((data) => {
        return data.data;
      })
      .then((resp) => {
        closeModal();
        return Axios.get("/api/pluproducts/download", {
          responseType: "blob",
          params: { date, type: prefixType.value },
        })
          .then((res) => res.data)
          .then((response) => {
            const url = window.URL.createObjectURL(
              new Blob(
                [
                  prefixType.value === 0
                    ? new Uint8Array([0xef, 0xbb, 0xbf])
                    : "", // UTF-8 BOM
                  response,
                ],
                {
                  type:
                    prefixType.value === 0
                      ? "text/plain;charset=utf-8"
                      : "text/plain;charset=windows-1251",
                }
              )
            );
            //console.log(url);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", date);
            document.body.appendChild(link);
            link.click();
          });
      })
      .catch((err) => {
        ErrorAlert(err);
      })

  }


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 mt-1">
          <label htmlFor="">Выберите модель весов</label>
          <Select
            value={prefixType}
            name="prefixType"
            onChange={onPrefixTypeChange}
            noOptionsMessage={() => "Весы не найдены"}
            options={prefixTypes}
            placeholder="Выберите тип весов"
          />
        </div>

        <div
          className="col-md-4"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            style={{ flex: "auto", marginTop: "1rem" }}
            className="btn btn-success"
            onClick={isWeight? getWeightText : getText}
          >
            Выгрузить
          </button>
        </div>
        <div
          className="col-md-4"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <button
            style={{ flex: "auto", marginTop: "1rem" }}
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
