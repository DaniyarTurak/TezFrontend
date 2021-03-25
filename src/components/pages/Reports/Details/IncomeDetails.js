import React, { Fragment } from "react";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

export default function IncomeDetails({ closeDetail }) {
  const closeModal = () => {
    closeDetail(true);
  };

  return (
    <div className="transaction-details">
      <Fragment>
        <div className="cashboxes">
          <button
            style={{ width: "30%" }}
            className="btn btn-outline-dark"
            onClick={closeModal}
          >
            Назад
          </button>
        </div>

        <hr />

        <div className="row mt-10">
          <div style={{ color: "#414042" }} className="col-md-12">
            - с помощью фильтров Вы можете посмотреть валовую прибыль в
            различных разрезах, например, по всем продажам в определенной
            торговой точке, по всем продажам товаров от определенного
            поставщика, по всем продажам в конкретной категории, по всем
            продажам конкретного бренда, по всем продажам с определенными
            атрибутами (цветом, размером, объемом и т.д.), по определенным
            товарам с поиском по штрихкоду или по названию;
            <br />
            <br />- валовая прибыль за период считается по фактическим ценам
            реализации с учетом оформленных скидок и себестоимости товаров,
            рассчитанной по методу FIFO;
            <br />
            <br /> - отрицательные значения означают возвраты товаров, т.е.
            корректировку ранее оформленных продаж;
            <br />
            <br />- соответственно, отрицательная валовая прибыль для таких
            возвратов означает корректировку к ранее полученной валовой прибыли
            по таким ранее оформленным продажам.
          </div>
        </div>
      </Fragment>
    </div>
  );
}
