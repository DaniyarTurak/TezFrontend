import React, { Component } from "react";

export default class AddPromotionAlert extends Component {
  state = {
    disableButton: false,
    pleaseWait: "Пожалуйста подождите...",
  };

  componentDidMount() {}

  closeAlert = (isSubmit) => {
    if (isSubmit === 1) {
      this.props.closeAlert(true);
    } else {
      this.props.closeAlert(false);
    }
  };

  submit = () => {
    this.setState({ disableButton: true });
    this.closeAlert(1);
  };

  render() {
    const { finalResult, point, setItems, positionItems } = this.props;
    const { disableButton } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ margin: "2rem" }} className="row">
          <button className="btn btn-warning-icon warn-item" />
        </div>
        <div style={{ fontSize: "2rem" }} className="row">
          <p>Вы уверены?</p>
        </div>
        <div className="row">
          <p style={{ opacity: "50%" }} className="col-md-12">
            Вы действительно хотите создать акцию "{finalResult.promotionName}"?
          </p>
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="col-md-12"
          >
            <p style={{ opacity: "50%" }}>Дата начала акции: </p>{" "}
            <p>{finalResult.startdate}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="col-md-12"
          >
            <p style={{ opacity: "50%" }}>Дата окончания акции: </p>{" "}
            <p> {finalResult.expirationdate}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="col-md-12"
          >
            <p style={{ opacity: "50%" }}>Торговая точка: </p>
            <p> {point.label}</p>
          </div>

          <div style={{ opacity: "50%" }} className="col-md-12">
            Условия акции:
          </div>

          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>№</td>
                  {finalResult.if.id === 1 && (
                    <td className="text-center">Название товара</td>
                  )}
                  <td className="text-center">Акционная сумма</td>
                </tr>
              </thead>
              <tbody>
                {setItems.map((set, idx) => (
                  <tr key={set.id}>
                    <td>{idx + 1}</td>
                    {finalResult.if.id === 1 && (
                      <td className="text-center">{set.product.label}</td>
                    )}
                    <td className="text-center">
                      {finalResult.if.values[0].value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ opacity: "50%" }} className="col-md-12">
            {finalResult.then.id === 1
              ? "Скидка будет действовать на следующие товары:"
              : finalResult.then.id === 2
              ? "Общая скидка:"
              : "Подарочные товары: "}
          </div>

          <div className="col-md-12">
            <table className="table table-striped " id="table-to-xls">
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td>№</td>
                  {(finalResult.then.id === 1 || finalResult.then.id === 3) && (
                    <td className="text-center">Название товара</td>
                  )}
                  {(finalResult.then.id === 1 || finalResult.then.id === 2) && (
                    <td className="text-center">Акционная скидка</td>
                  )}
                  {finalResult.then.id === 3 && (
                    <td className="text-center">Количество</td>
                  )}
                </tr>
              </thead>
              <tbody>
                {positionItems.map((position, idx) => (
                  <tr key={position.id}>
                    <td>{idx + 1}</td>
                    {(finalResult.then.id === 1 ||
                      finalResult.then.id === 3) && (
                      <td className="text-center">{position.product.label}</td>
                    )}
                    <td className="text-center">
                      {finalResult.then.values[0].value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ width: "-webkit-fill-available" }} className="row">
          <div className="col-md-6">
            <button
              className="btn btn-block btn-outline-secondary"
              onClick={this.closeAlert}
            >
              Нет, отменить
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-block btn-outline-success"
              onClick={this.submit}
              disabled={disableButton}
            >
              Да, я уверен
            </button>
          </div>
        </div>
      </div>
    );
  }
}
