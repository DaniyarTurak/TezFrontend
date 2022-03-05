import React, { Fragment } from "react";

export default function ClosedPointTable({ result, handleRollbackFunction }) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>Наименование</th>
          <th>Адрес</th>
          <th>Отрицательный учёт</th>
          <th>Статус</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {result.map((res, idx) => (
          <tr key={res.id}>
            <td>{idx + 1}</td>
            <td>{res.name}</td>
            <td>{res.address}</td>
            <td>{res.is_minus ? "Да" : "Нет"}</td>
            <td className="text-danger">Удалён</td>
          </tr>
        ))}
      </tbody>
    </Fragment>
  );
}
