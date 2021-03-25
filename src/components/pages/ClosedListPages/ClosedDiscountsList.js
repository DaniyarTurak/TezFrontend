import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import AlertBox from "../../AlertBox";
import Searching from "../../Searching";
import Moment from "moment";
import Alert from "react-s-alert";
import ErrorAlert from "../../ReusableComponents/ErrorAlert";

export default function ClosedDiscountsList({ isHidden }) {
  const [isLoading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    getDiscountsInfoClosed();
  }, [isHidden]);

  const getDiscountsInfoClosed = () => {
    let active = 0;
    setLoading(true);
    Axios.get("/api/discount", { params: { active } })
      .then((res) => res.data)
      .then((res) => {
        setDiscounts(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        ErrorAlert(err);
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    Axios.post("/api/discount/del", { id }).then(() => {
      Alert.success("Скидка успешно удалена", {
        position: "top-right",
        effect: "bouncyflip",
        timeout: 2000,
      });
    });
    setLoading(false).catch((err) => {
      setLoading(false);
      ErrorAlert(err);
    });
  };

  return (
    <Fragment>
      {isLoading && <Searching />}

      {!isLoading && discounts.length === 0 && (
        <AlertBox text="Список неактивных скидок" />
      )}

      {!isLoading && discounts.length > 0 && (
        <table className=" table table-hover">
          <thead>
            <tr className="table-discounts">
              <th className="text-center" style={{ width: "20%" }}>
                Торговая точка
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Тип скидки
              </th>
              <th className="text-center" style={{ width: "20%" }}>
                Наименование
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Скидка
              </th>
              <th className="text-center" style={{ width: "10%" }}>
                Удалить
              </th>
              <th className="text-center" style={{ width: "30%" }}>
                Период действия
              </th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((disc, idx) => (
              <tr key={idx}>
                <td className="text-center">{disc.pointname}</td>
                <td className="text-center">
                  {disc.id === 1
                    ? "Торговая точка"
                    : disc.id === 2
                    ? "Категория"
                    : disc.id === 3
                    ? "Бренд"
                    : ""}
                </td>
                <td className="text-center">{disc.name}</td>
                <td className="text-center">{disc.discount} %</td>
                <td>
                  <button
                    className="btn btn-outline-danger cancel-disc"
                    onClick={() => handleDelete(disc.discountid)}
                  >
                    отменить скидку
                  </button>
                </td>
                <td className="text-center">
                  {!!disc.object ? (
                    <td className="text-center">
                      {Moment(disc.startdate).format("DD.MM.YYYY")} -{" "}
                      {Moment(disc.expirationdate).format("DD.MM.YYYY")}
                    </td>
                  ) : (
                    <td />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  );
}
