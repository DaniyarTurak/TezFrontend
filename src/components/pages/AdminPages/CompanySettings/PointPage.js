import React, { useState, Fragment } from "react";
import Axios from "axios";

import ShowInactive from "../../ClosedListPages/ShowInactive";
import AddPointForm from "../../../forms/AddPointForm";
import AlertBox from "../../../AlertBox";
import SweetAlert from "react-bootstrap-sweetalert";
import Alert from "react-s-alert";
import Searching from "../../../Searching";

function PointPage() {
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
      console.log(pointsList);
      console.log(item.status);
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

    this.hideAlert();
  }

  return <div>PointPage</div>;
}

export default PointPage;
