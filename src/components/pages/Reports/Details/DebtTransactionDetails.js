import React, { Fragment } from "react";
import Moment from "moment";
import "moment/locale/ru";
Moment.locale("ru");

export default function DebtTransactionDetails({
  closeDebtDetail,
  transaction,
}) {
  return (
    <div className="transaction-details">
      <Fragment>
        <div className="row">
          <div className="col-md-8">
            {transaction.system === "POS" && transaction.debttype !== 1
              ? "Погашение долга проведено через кассу"
              : transaction.system === "ERP" && transaction.debttype !== 1
              ? "Погашение долга проведено в портале"
              : transaction.system}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6">ФИО</div>
          <div className="col-md-6 text-right">
            {transaction.username ? transaction.username : "-"}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">Дата:</div>
          <div className="col-md-6 text-right">
            {Moment(transaction.date).format("YYYY-MM-DD hh:mm:ss")}
          </div>
        </div>

        {transaction.debttype !== 1 && (
          <div className="row">
            <div className="col-md-6">Сумма погашения долга:</div>
            <div className="col-md-6 text-right">{transaction.debt}</div>
          </div>
        )}
        {transaction.system !== "ERP" && (
          <div className="row">
            <div className="col-md-6">Торговая точка:</div>
            <div className="col-md-6 text-right">
              {transaction.point ? transaction.point : "-"}
            </div>
          </div>
        )}

        <hr />
        <div className="row">
          <div className="col-md-12 text-right">
            <button className="btn btn-success" onClick={closeDebtDetail}>
              Готово
            </button>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
