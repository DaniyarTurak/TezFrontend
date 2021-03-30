import React, { useState, useEffect, Fragment } from "react";
import Moment from "moment";
import Axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function FizProductDetails({
  closeFizProductDetail,
  holding,
  company,
  customer,
}) {
  const [dateFrom, setDateFrom] = useState(
    Moment().startOf("month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(Moment().format("YYYY-MM-DD"));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getCustomersProducts();
  }, []);

  const changeDate = (dateStr) => {
    let dF, dT;
    if (dateStr === "today") {
      dF = Moment().format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    } else if (dateStr === "month") {
      dF = Moment().startOf("month").format("YYYY-MM-DD");
      dT = Moment().format("YYYY-MM-DD");
    }
    setDateFrom(dF);
    setDateTo(dT);
  };

  const dateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const dateToChange = (e) => {
    setDateTo(e.target.value);
  };

  const getCustomersProducts = () => {
    if (!holding) {
      holding = false;
    }
    Axios.get("/api/report/fizcustomers/products", {
      params: {
        holding,
        company: company.value,
        customer: customer.customer_id,
        dateTo,
        dateFrom,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="transaction-details">
      <Fragment>
        <div style={{ opacity: "80%" }} className="row">
          <div className="col-md-12">
            Информация по покупкам клиента: {customer.fio}
          </div>
        </div>

        <div style={{ opacity: "80%" }} className="row">
          <div className="col-md-6">Номер телефона:</div>
          <div className="col-md-6 text-right">{customer.telephone}</div>
        </div>

        <div style={{ opacity: "80%" }} className="row">
          <div className="col-md-6">Остаток бонусов:</div>
          <div className="col-md-6 text-right tenge">
            {customer.details.currbonuses}
          </div>
        </div>

        <div style={{ opacity: "80%" }} className="row">
          <div className="col-md-6">Сумма долга:</div>
          <div className="col-md-6 text-right">{customer.debtSumById}</div>
        </div>

        <hr />
        <div className="row">
          <div className="col-md-2 today-btn">
            <button
              className="btn btn-block btn-outline-success mt-30"
              onClick={() => changeDate("today")}
            >
              Сегодня
            </button>
          </div>
          <div className="col-md-2 month-btn">
            <button
              className="btn btn-block btn-outline-success mt-30"
              onClick={() => changeDate("month")}
            >
              Текущий месяц
            </button>
          </div>
          <div style={{ marginTop: "1.5rem" }} className="col-md-3 date-block">
            <label htmlFor="">Дата с</label>
            <input
              type="date"
              value={dateFrom}
              className="form-control"
              name="datefrom"
              onChange={dateFromChange}
            />
          </div>
          <div style={{ marginTop: "1.5rem" }} className="col-md-3 date-block">
            <label htmlFor="">Дата по</label>
            <input
              type="date"
              value={dateTo}
              className="form-control"
              name="dateto"
              onChange={dateToChange}
            />
          </div>
          <div className="col-md-1 text-right search-btn">
            <button
              className="btn btn-success mt-30"
              onClick={getCustomersProducts}
            >
              Поиск
            </button>
          </div>
        </div>

        {products.length === 0 && (
          <div className="col-md-12 not-found-text  text-center">
            За указанный период товары не найдены
          </div>
        )}

        {products.length > 0 && (
          <div className="col-md-12">
            <div>
              <table
                className="table table-hover"
                id="table-fizproducts-details"
              >
                <thead>
                  <tr>
                    <th style={{ width: "5%" }} />
                    <th style={{ width: "55%" }} className="text-center">
                      Наименование
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Количество
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Сумма
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Потраченные бонусы
                    </th>
                    <th style={{ width: "10%" }} className="text-center">
                      Полученные бонусы
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{product.name}</td>
                      <td className="text-center">{product.units}</td>
                      <td className="text-center tenge">
                        {product.totalprice}
                      </td>
                      <td className="text-center tenge">{product.bonuspay}</td>
                      <td className="text-center tenge">{product.bonusadd}</td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-info text-white">
                  <tr>
                    <td colSpan="2">Итого</td>
                    <td className="text-center">
                      {products.reduce((prev, cur) => {
                        return prev + cur.units;
                      }, 0)}
                    </td>
                    <td className="text-center tenge">
                      {products
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.totalprice);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-center tenge">
                      {products
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.bonuspay);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="text-center tenge">
                      {products
                        .reduce((prev, cur) => {
                          return prev + parseFloat(cur.bonusadd);
                        }, 0)
                        .toLocaleString("ru", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="col-md-12">
              <ReactHTMLTableToExcel
                className="btn btn-sm btn-outline-success"
                table="table-fizproducts-details"
                filename={`Товары покупателя ${customer.name} за период с ${dateFrom} по ${dateTo}`}
                sheet="tablexls"
                buttonText="Выгрузить в excel"
              />
            </div>
          </div>
        )}

        <div className="row mt-5">
          <div className="col-md-12 text-right">
            <button
              className="btn btn-secondary"
              onClick={closeFizProductDetail}
            >
              Назад
            </button>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
