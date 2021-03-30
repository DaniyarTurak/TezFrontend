import React from "react";
export default function WriteOffDetails({
  customerInfo,
  handleWriteOff,
  onWriteOffChange,
  closeWriteOffDetail,
  inputWriteOff,
  companyID,
}) {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">Погашение долга</div>
      </div>
      <hr />
      <div style={{ opacity: "80%" }} className="row">
        <div className="col-md-6">Клиент:</div>
        <div className="col-md-6 text-right">{customerInfo.fio}</div>
      </div>
      <div style={{ opacity: "80%" }} className="row">
        <div className="col-md-6">Номер телефона:</div>
        <div className="col-md-6 text-right">{customerInfo.telephone}</div>
      </div>
      <div style={{ opacity: "80%" }} className="row"></div>
      <hr />
      <table className="transaction-details">
        <thead>
          <tr>
            <td className="text-center" style={{ width: "25%" }}>
              Компания
            </td>
            <td className="text-center" style={{ width: "25%" }}>
              Долг
            </td>
            <td className="text-center" style={{ width: "25%" }}>
              Сумма списания
            </td>
            <td className="text-center" style={{ width: "25%" }}>
              Погасить
            </td>
          </tr>
        </thead>
        <tbody>
          {customerInfo.details.debt.map((e, idx) => {
            return (
              <tr key={idx}>
                <td className="text-center">{e.name}</td>
                <td className="text-center">{e.debt}</td>
                <td
                  colSpan={parseFloat(companyID.id) === e.company ? 1 : 2}
                  className="col-md-10 text-center"
                >
                  {parseFloat(companyID.id) === e.company ? (
                    <input
                      type="text"
                      pattern="\d+"
                      maxLength="7,"
                      value={inputWriteOff[idx]}
                      name="writeOff"
                      className="form-control ml-6 m-1"
                      placeholder="Сумма"
                      onChange={(e) => onWriteOffChange(idx, e)}
                    />
                  ) : (
                    <label style={{ opacity: "60%" }}>
                      Гашение долга только доступно на аккаунте: "{e.name}"
                    </label>
                  )}
                </td>
                {parseFloat(companyID.id) === e.company && (
                  <td className="text-center">
                    <button
                      className="btn btn-success"
                      onClick={() => handleWriteOff(e)}
                    >
                      Погасить долг
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot className="text-center"></tfoot>
      </table>
      <div className="col-md-12 text-right">
        <button className="btn btn-secondary" onClick={closeWriteOffDetail}>
          Назад
        </button>
      </div>
    </div>
  );
}
