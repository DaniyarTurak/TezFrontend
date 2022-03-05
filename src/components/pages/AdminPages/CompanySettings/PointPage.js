import React, { useState, Fragment, useEffect } from "react";
import Axios from "axios";

import ShowInactive from "./InactiveList/ShowInactive";
import AddPointForm from "../../../forms/AddPointForm";
import AlertBox from "../../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../../Searching";

function PointPage({points, companySelect, isLoading, setPoints, getPoints}) {
  const state = {
    label: {
      list: "Список активных торговых точек",
      add: "Добавить новую торговую точку",
      empty: "Cписок торговых точек пуст",
      name: "Наименование",
      address: "Адрес",
      is_minus: "Отрицательный учет",
      title: {
        edit: "Редактировать",
        delete: "Удалить",
        detail: "Детали",
      },
    },
    alert: {
      confirmDelete: "Вы действительно хотите удалить торговую точку?",
      successDelete: "Торговая точка успешно удалена",
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

  const [sweetalert, setSweetalert] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [edit, setEdit] = useState(false)

  const hideAlert = () => {
    setSweetalert(null);
  };

  const handleDelete = (item) => {
    setSweetalert(
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
    const newPointsList = points.filter((pointsList) => {
      return pointsList !== item;
    });
    Axios.delete(`/api/companysettings/storepoint/delete?id=${item.id}`)
      .then(() => {
        setPoints(newPointsList)
        Alert.success(this.state.alert.successDelete, {
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
  }

  const handleEdit = (pointData) => {
    setPointData(pointData);
    setEdit(true);
  }

  const handleRollback = (newPoint) => {
    let list = points;
    list.push(newPoint);
    setPoints(list);
    getPoints(companySelect.value)
  }

  return (
    <div className="point-list">
      {sweetalert}
      {edit ? (
        <AddPointForm
          pointData={pointData}
          company={companySelect}
          setEdit={setEdit}
          setPointData={setPointData}
          getPoints={getPoints}
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

          {!isLoading && points.length === 0 && (
            <AlertBox text={state.label.empty} />
          )}

          {!isLoading && points.length > 0 && (
            <div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "1%" }} />
                    <th style={{ width: "30%" }}>{state.label.name}</th>
                    <th style={{ width: "30%" }}>{state.label.address}</th>
                    <th style={{ width: "18%" }}>{state.label.is_minus}</th>
                    <th style={{ width: "15%" }} />
                  </tr>
                </thead>
                <tbody>
                  {points.map((point, idx) => (
                    <tr key={point.id}>
                      <td>{idx + 1}</td>
                      <td>{point.name}</td>
                      <td>{point.address}</td>
                      <td>{point.is_minus ? "Да" : "Нет"}</td>
                      <td className="text-right"></td>
                      <td className="text-right">
                        {point.point_type !== 0 ? (
                          <button
                            className="btn btn-w-icon edit-item"
                            title={state.label.title.edit}
                            onClick={() => {
                              handleEdit(point);
                            }}
                          />
                        ) : null}
                      </td>
                      <td>
                        {point.point_type !== 0 ? (
                          <button
                            className="btn btn-w-icon delete-item"
                            title={state.label.title.delete}
                            onClick={() => {
                              handleDelete(point);
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && (
            <ShowInactive callback={handleRollback} mode="point" companySelect={companySelect}/>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default PointPage;
