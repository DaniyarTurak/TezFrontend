import React, { Component, Fragment } from "react";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

export default class PromotionHelpDetails extends Component {
  state = {
    modalIsOpen: false
  };

  closeModal = () => {
    this.props.closeDetail(true);
  };

  render() {
    return (
      <div className="transaction-details">
        <Fragment>
          <div className="cashboxes">
            <button
              style={{ width: "30%" }}
              className="btn btn-outline-dark"
              onClick={this.closeModal}
            >
              Назад
            </button>
          </div>

          <hr />

          <div className="row mt-10">
            <div className="col-md-12">
              <p style={{ color: "#414042" }}>
                В каждой точке акции выстраиваются по приоритетам. Чем выше
                акция в списке, тем выше ее приоритет. Все акции "за разовый
                объем продаж" (т.е. на общую сумму чека) обрабатываются после
                акций по комплектации. Для изменения приоритета акции Вы можете
                поменять акции местами, перетаскивая их вверх-вниз, удерживая
                иконку:<span className="btn btn-w-icon priority-item"></span>
              </p>
              <p style={{ color: "#414042" }}>
                После того, как Вы поменяли акции местами, не забудьте нажать
                кнопку "Изменить приоритет".
              </p>
            </div>
          </div>
        </Fragment>
      </div>
    );
  }
}
