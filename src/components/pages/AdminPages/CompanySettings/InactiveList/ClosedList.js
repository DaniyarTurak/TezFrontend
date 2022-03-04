import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";

import SweetAlert from "react-bootstrap-sweetalert";
import AlertBox from "../../../../AlertBox";
import Alert from "react-s-alert";
import Searching from "../../../../Searching";
import ErrorAlert from "../../../../ReusableComponents/ErrorAlert";
import ClosedPointTable from "./ClosedTables/ClosedPointTable";
import ClosedCashboxTable from "./ClosedTables/ClosedCashboxTable";

export default function ClosedList({ mode, isHidden, handleRollback }) {
  const [result, setResult] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sweetalert, setSweetalert] = useState(null);

  useEffect(() => {
    if (!isHidden) getClosedInfo();
  }, [isHidden]);

  const hideAlert = () => {
    setSweetalert(null);
  };

  const getClosedInfo = (info) => {
    setLoading(true);
    const api =
      mode === "point"
        ? "/api/companysettings/storepoint/inactive"
        : "/api/companysettings/cashbox/inactive"

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

    if (
      mode === "brand" ||
      mode === "counterparties" ||
      mode === "buyers" ||
      mode === "attributeupdate"
    ) {
      item.deleted = false;
    } else if (mode === "cashboxuser" || mode === "cashbox") {
      item.deleted = 0;
    } else if (mode === "erpuser") {
      item.deleted = 0;
      item.status = "ACTIVE";
    } else {
      item.status = "ACTIVE";
    }

    const req =
      mode === "brand"
        ? { brand: item }
        : mode === "cashboxuser"
        ? { cashboxusr: item }
        : mode === "erpuser"
        ? { erpusr: item }
        : mode === "cashbox"
        ? { cashbox: item }
        : mode === "counterparties"
        ? { counterparties: item }
        : mode === "buyers"
        ? { customers: item }
        : mode === "attributeupdate"
        ? {
            attributes: {
              id: item.id,
              name: item.values,
              deleted: item.deleted,
              format: item.format,
            },
          }
        : { point: item };

    const api =
      mode === "brand"
        ? "/api/brand/manage"
        : mode === "cashboxuser"
        ? "/api/cashboxuser/manage"
        : mode === "erpuser"
        ? "/api/erpuser/new-manage"
        : mode === "cashbox"
        ? "/api/cashbox/manage"
        : mode === "counterparties"
        ? "/api/counterparties/manage"
        : mode === "buyers"
        ? "/api/buyers/manage"
        : mode === "attributeupdate"
        ? "/api/adminpage/updateattributeslist"
        : "/api/point/change";

    Axios.post(api, req)
      .then(() => {
        handleRollback(item);
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
        <table className="table table-hover">
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
