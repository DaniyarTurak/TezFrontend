import React, { Fragment } from "react";

export default function ClosedCashboxuserTable({
  result,
  handleRollbackFunction,
}) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>ИИН</th>
          <th>ФИО</th>
          <th>Роль пользователя</th>
          <th>Наименование торговой точки</th>
          <th>Статус</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {result.map((res, idx) => (
          <tr key={res.id}>
            <td>{idx + 1}</td>
            <td>{res.iin}</td>
            <td>{res.name}</td>
            <td>{res.roleName}</td>
            <td>{res.pointName}</td>
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
