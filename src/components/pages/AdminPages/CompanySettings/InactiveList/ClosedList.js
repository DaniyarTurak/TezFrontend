import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";

import SweetAlert from "react-bootstrap-sweetalert";
import AlertBox from "../../../../AlertBox";
import Alert from "react-s-alert";
import Searching from "../../../../Searching";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import ClosedPointTable from "./ClosedTables/ClosedPointTable";
import ClosedCashboxTable from "./ClosedTables/ClosedCashboxTable";

export default function ClosedList({ mode, isHidden, handleRollback, companySelect }) {
  const [result, setResult] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sweetalert, setSweetalert] = useState(null);

  useEffect(() => {
    if (!isHidden && companySelect) {
      getClosedInfo()
    };
      
  }, [isHidden]);

  const hideAlert = () => {
    setSweetalert(null);
  };


  const getClosedInfo = (info) => {
    setLoading(true);
    const api =
      mode === "point" ? 
        `/api/companysettings/storepoint/inactive?company=${companySelect.value}`
        : mode === "cashbox" ? 
        `/api/companysettings/cashbox/inactive?company=${companySelect.value}`
        : null

    Axios.get(api)
      .then((res) => res.data)
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRollbackFunction = (item) => {
    setSweetalert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Да, я уверен"
        cancelBtnText="Нет, отменить"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Вы уверены?"
        onConfirm={() => rollback(item)}
        onCancel={() => hideAlert()}
      >
        Вы действительно хотите восстановить элемент?
      </SweetAlert>
    );
  };

  const rollback = (item) => {
    const newResultsList = result.filter((res) => {
      return res !== item;
    });
    const api =
      mode === "point" ? 
        `/api/companysettings/storepoint/active?id=${item.id}`
        : mode === "cashbox" ? 
        `/api/companysettings/cashbox/active?id=${item.id}`
        : null

    Axios.put(api)
      .then(() => {
        handleRollback();
        setResult(newResultsList);
        hideAlert();

        Alert.success("Вы успешно восстановили элемент!", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert(err);
      });
  };

  return (
    <Fragment>
      {sweetalert}

      {isLoading && <Searching />}

      {!isLoading && result.length === 0 && <AlertBox text="Список пуст" />}

      {!isLoading && result.length > 0 && (
        <table className="table table-hover" style={{marginBottom: "120px"}}>
          {mode === "point" && (
            <ClosedPointTable
              result={result}
              handleRollbackFunction={handleRollbackFunction}
            />
          )}
          {mode === "cashbox" && (
            <ClosedCashboxTable
              result={result}
              handleRollbackFunction={handleRollbackFunction}
            />
          )}
        </table>
      )}
    </Fragment>
  );
}
