import React, { Fragment } from "react";

export default function ClosedCashboxTable({ result, handleRollbackFunction }) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>Наименование</th>
          <th>Торговая точка</th>
          <th>Статус</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {result.map((res, idx) => (
          <tr key={res.id}>
            <td>{idx + 1}</td>
            <td>{res.name}</td>
            <td>{res.point_name}</td>
            <td className="text-danger">Удалён</td>
            <td className="text-right">
              <button
                className="btn btn-w-icon rollback-item"
                title="Вернуть в список"
                onClick={() => {
                  handleRollbackFunction(res);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Fragment>
  );
}
