import React, { useState, useEffect } from "react";
import Axios from "axios";
import Select from "react-select";
import Alert from "react-s-alert";
import Searching from "../../Searching";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

export default function CreateInvoicePage() {
  const [isLoading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [selectFromValue, setSelectFromValue] = useState("");
  const [selectToValue, setSelectToValue] = useState("");
  const [productDetails, setProductDetails] = useState({});
  const [toPointOptions, setPointOptions] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    getCompaniesList();
  }, []);

  const getCompaniesList = () => {
    Axios.get("/api/adminpage/companies")
      .then((res) => res.data)
      .then((res) => {
        const options = res.map((point) => {
          return {
            value: point.id,
            label: point.name,
          };
        });
        setPoints(options);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const getPointsByCompany = (companyId) => {
    Axios.get("/api/adminpage/points", { params: { companyId } })
      .then((res) => res.data)
      .then((res) => {
        const options = res.map((point) => {
          return { value: point.id, label: point.name };
        });
        setPointOptions(options);
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  const handleFromPointChange = (val) => {
    setSelectFromValue(val);
    setSelectToValue("");
    getPointsByCompany(val.value);
  };

  const handleToPointChange = (val) => {
    setSelectToValue(val);
  };

  const onBarcodeChange = (e) => {
    let barcodeChanged = e.target.value.toUpperCase();
    if (barcodeChanged) {
      setBarcode(barcodeChanged);
    } else {
      setBarcode("");
    }
  };
  const handleSearch = () => {
    if (!barcode || !selectFromValue || !selectToValue) {
      return Alert.warning("Заполните все поля", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 3000,
      });
    }
    getProduct(barcode, selectFromValue.value);
  };

  const getProduct = (brcd, company) => {
    setLoading(true);
    Axios.get("/api/adminpage/barcode", {
      params: {
        barcode: brcd,
        company,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setProductDetails(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const sendInfo = () => {
    const update = {
      code: barcode,
      point: selectToValue.value,
    };
    Axios.post("/api/adminpage/updateposstock", { update })

      .then((res) => {
        Alert.success("Данные обновлены успешно!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        ErrorAlert(err);
      });
  };

  return (
    <div className="brand-list">
      <div className="row">
        <div className="col-md-6">
          <h6 className="btn-one-line">Создание Инвойсов</h6>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 pb-2">
          <Select
            name="company"
            value={selectFromValue}
            onChange={handleFromPointChange}
            options={points}
            placeholder="Выберите компанию"
            noOptionsMessage={() => "Компания не найдена"}
          />
        </div>

        <div className="col-md-4 pb-2">
          <Select
            name="point"
            value={selectToValue}
            onChange={handleToPointChange}
            options={toPointOptions}
            placeholder="Выберите кассу"
            noOptionsMessage={() => "Торговая точка не найдена"}
          />
        </div>
        <div className="col-md-4 pb-2">
          <input
            name="barcode"
            placeholder="Введите или отсканируйте штрих код"
            onChange={onBarcodeChange}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row pt-10 pb-20">
        <div className="col-md-1 text-right search-btn">
          <button className="btn btn-success mt-10" onClick={handleSearch}>
            Поиск
          </button>
        </div>
      </div>

      {isLoading && <Searching />}

      {!isLoading && !productDetails.code && (
        <div className="row mt-10 text-center">
          <div className="col-md-12 not-found-text">
            С выбранными фильтрами ничего не найдено
          </div>
        </div>
      )}

      {!isLoading && productDetails.code && (
        <div>
          <table className="table table-hover ">
            <thead>
              <tr>
                <th style={{ width: "3%" }}>№</th>
                <th style={{ width: "57%" }}>Товар</th>
                <th style={{ width: "20%" }} />
                <th style={{ width: "20%" }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{productDetails.name}</td>
                <td />
                <td className="text-right">
                  <button
                    className={"btn btn-success btn-sm btn-block"}
                    onClick={sendInfo}
                  >
                    Создать инвойс
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
