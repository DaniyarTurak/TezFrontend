import React, { Component, Fragment } from "react";
import Axios from "axios";
import AlertBox from "../../AlertBox";
import Searching from "../../Searching";
import Moment from "moment";
import Alert from "react-s-alert";

export default class ClosedDiscountsList extends Component {
  state = {
    isLoading: true,
    options: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (!this.props.isHidden) this.getDiscountsInfoClosed();
    }
  }

  getDiscountsInfoClosed = () => {
    let active = 0;
    Axios.get("/api/discount", { params: { active } })
      .then((res) => res.data)
      .then((discounts) => {
        //заглушка по скидкам у которых срок действия уже прошёл
        // const discountWithoutExpirationDate = discounts.filter(
        //   disc =>
        //     Moment(disc.expirationdate).format("YYYY-MM-DD") >=
        //     Moment().format("YYYY-MM-DD")
        // );

        const discountPoints = discounts.filter((disc) => disc.id === 1);
        const discountCategories = discounts.filter((disc) => disc.id === 2);
        const discountBrands = discounts.filter((disc) => disc.id === 3);
        this.setState({
          discountCategories,
          discountBrands,
          discountPoints,
          discounts,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  handleDelete = (id) => {
    Axios.post("/api/discount/del", { id })
      .then((res) => {
        Alert.success("Скидка успешно удалена", {
          position: "top-right",
          effect: "bouncyflip",
          timeout: 2000,
        });
      })
      .catch((err) => {
        Alert.error(
          err.response.data.code === "internal_error"
            ? "Возникла ошибка при удалении"
            : err.response.data.text,
          {
            position: "top-right",
            effect: "bouncyflip",
            timeout: 2000,
          }
        );
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { isLoading, discounts } = this.state;
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
                      onClick={() => this.handleDelete(disc.discountid)}
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
}
