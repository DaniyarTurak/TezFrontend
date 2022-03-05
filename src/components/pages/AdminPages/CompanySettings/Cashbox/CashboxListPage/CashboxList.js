import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../../InactiveList/ShowInactive";
import AddCashboxForm from "./AddCashboxForm";
import AlertBox from "../../../../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../../../../Searching";

function CashboxList({ 
    cashboxes, 
    setCashboxes, 
    isLoading, 
    getCashboxes, 
    companySelect,
    points
}) {
  const state = {
    label: {
      list: "Список активных касс",
      add: "Добавить новую кассу",
      empty: "Список активных касс пуст",
      cashboxName: "Наименование кассы",
      pointName: "Наименование торговой точки",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить кассу?",
      successDelete: "Касса успешно удалена",
      successEdit: "Изменения сохранены",
      raiseError:
        "Возникла ошибка при обработке вашего запроса. Мы уже работает над решением. Попробуйте позже",
      label: {
        ok: "Хорошо",
        sure: "Да, я уверен",
        cancel: "Нет, отменить",
        areyousure: "Вы уверены?",
        success: "Отлично",
        error: "Упс...Ошибка!",
      },
    },
  };

  const [sweetAlert, setSweetAlert] = useState(null);
  const [edit, setEdit] = useState(false);
  const [cashboxData, setCashboxData] = useState(null);

  const hideAlert = () => {
    setSweetAlert(null);
  };

  const handleDelete = (item) => {
    setSweetAlert(
      <SweetAlert
        warning
        showCancel
        confirmBtnText={state.alert.label.sure}
        cancelBtnText={state.alert.label.cancel}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title={state.alert.label.areyousure}
        onConfirm={() => Delete(item)}
        onCancel={() => hideAlert()}
      >
        {state.alert.confirmDelete}
      </SweetAlert>
    );
  };

  const Delete = (item) => {
    const newCashboxesList = cashboxes.filter((cashboxesList) => {
      return cashboxesList !== item;
    });
    Axios.delete(`/api/companysettings/cashbox/delete?id=${item.id}`)
      .then(() => {
        setCashboxes(newCashboxesList);
        Alert.success(state.alert.successDelete, {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        // Alert.error(
        //   err.response.data.code === "internal_error"
        //     ? this.state.alert.raiseError
        //     : err.response.data.text,
        //   {
        //     position: "top-right",
        //     effect: "bouncyflip",
        //     timeout: 2000,
        //   }
        // );
        console.log(err);
      });

    hideAlert();
  };

  const handleEdit = (cashboxData) => {
    setCashboxData(cashboxData);
    setEdit(true);
  };
  const handleRollback = () => {
    getCashboxes(companySelect.value)
  };

  return (
    <div className="cashbox-list">
      {sweetAlert}
      {edit ? (
        <AddCashboxForm
          cashboxData={cashboxData}
          company={companySelect}
          setEdit={setEdit}
          setCashboxData={setCashboxData}
          getCashboxes={getCashboxes}
          points={points}
        />
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-md-6">
              <h6 className="btn-one-line">{state.label.list}</h6>
            </div>

            <div className="col-md-6 text-right">
              <button
                className="btn btn-link btn-sm"
                onClick={() => setEdit(true)}
              >
                {state.label.add}
              </button>
            </div>
          </div>

          {isLoading && <Searching />}

          {!isLoading && <div className="empty-space" />}

          {!isLoading && cashboxes.length === 0 && (
            <AlertBox text={state.label.empty} />
          )}

          {!isLoading && cashboxes.length > 0 && (
            <div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "1%" }} />
                    <th style={{ width: "45%" }}>{state.label.cashboxName}</th>
                    <th style={{ width: "45%" }}>{state.label.pointName}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cashboxes.map((cashbox, idx) => (
                    <tr key={cashbox.id}>
                      <td>{idx + 1}</td>
                      <td>{cashbox.name}</td>
                      <td>{cashbox.point_name}</td>
                      <td className="text-right"></td>

                      <td className="text-right">
                        <button
                          className="btn btn-w-icon edit-item"
                          title={state.label.title.edit}
                          onClick={() => {
                            handleEdit(cashbox);
                          }}
                        />
                        <button
                          className="btn btn-w-icon delete-item"
                          title={state.label.title.delete}
                          onClick={() => {
                            handleDelete(cashbox);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && (
            <ShowInactive callback={handleRollback} mode="cashbox" companySelect={companySelect} />
          )}
        </Fragment>
      )}
    </div>
  );
}

export default CashboxList;
