import React, { Fragment } from "react";

export default function ClosedStockTable({ result }) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>Наименование</th>
          <th>Адрес</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {result.map((res, idx) => (
          <tr key={res.id}>
            <td>{idx + 1}</td>
            <td>{res.name}</td>
            <td>{res.address}</td>
            <td className="text-danger">Удалён</td>
          </tr>
        ))}
      </tbody>
    </Fragment>
  );
}
