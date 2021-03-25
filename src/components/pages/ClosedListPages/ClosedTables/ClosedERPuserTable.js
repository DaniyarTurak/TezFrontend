import React, { Fragment } from "react";

export default function ClosedERPuserTable({ result, handleRollbackFunction }) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>ИИН</th>
          <th>ФИО</th>
          <th>Роли пользователя</th>
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
            <td>
              {res.roles.map((role) => (
                <Fragment key={res.id + role.id}>
                  {role.name}
                  <br />
                </Fragment>
              ))}
            </td>
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
