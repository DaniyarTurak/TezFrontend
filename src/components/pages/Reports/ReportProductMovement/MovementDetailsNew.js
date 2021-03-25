import React, { Fragment } from "react";

import Moment from "moment";

export default function MovementDetailsNew({
  unchangedMovementDetails,
  movementDetails,
  dateFrom,
  dateTo,
}) {
  return (
    <table id="table-to-xls" className="table table-striped mt-10">
      <tbody>
        <tr className="bg-info text-white">
          <td> Остаток на начало дня, {Moment(dateFrom).format("LL")}, шт.</td>
          <td>{unchangedMovementDetails[0].unitsfrom}</td>
        </tr>
        <Fragment>
          {movementDetails
            .sort(function (a, b) {
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            })
            .reduce((total, detail) => {
              if (total.length === 0) {
                total.push({
                  name: detail.name,
                  sum: parseFloat(detail.sum),
                });
              } else if (total[total.length - 1].name === detail.name) {
                total[total.length - 1].sum += parseFloat(detail.sum);
              } else {
                total.push({
                  name: detail.name,
                  sum: parseFloat(detail.sum),
                });
              }
              return total;
            }, [])
            .map((detail, idx) => {
              return (
                !(
                  detail.name.includes("Продажа") && detail.name.length > 7
                ) && (
                  <tr key={idx}>
                    <td>{detail.name}, шт.</td>
                    <td>
                      {Math.sign(parseInt(detail.sum, 0)) === 1
                        ? "+" + detail.sum
                        : detail.sum}
                    </td>
                  </tr>
                )
              );
            })}
        </Fragment>
        <tr className="bg-info text-white">
          <td>
            Остаток на конец дня, исключая товары находящиеся на консигнации на
            дату: {Moment(dateTo).format("LL")}, [шт.]
          </td>
          <td>{unchangedMovementDetails[0].unitsto}</td>
        </tr>
        <tr className="bg-info text-white">
          <td>
            Остаток на конец дня, включая товары находящиеся на консигнации на
            дату: {Moment(dateTo).format("LL")}, [шт.]
          </td>
          <td>{unchangedMovementDetails[0].unitstowith}</td>
        </tr>
      </tbody>
    </table>
  );
}
