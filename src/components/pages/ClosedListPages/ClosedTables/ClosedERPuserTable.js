import React, { Fragment } from "react";
import CustomPopover from "../../ListPages/Popover";

export default function ClosedERPuserTable({ result, handleRollbackFunction }) {
  return (
    <Fragment>
      <thead>
        <tr>
          <th />
          <th>ИИН</th>
          <th>ФИО</th>
          <th>Доступы пользователя</th>
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
              {res.accesses.length > 0 &&
                <Fragment>
                  <p style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "25em"
                  }}>
                    {res.accesses.map((access) => (
                      <Fragment

                        key={res.id + access.id}
                      >
                        {access.name + " , "}
                      </Fragment>
                    ))}
                  </p>
                  <CustomPopover erpuser={res} />
                </Fragment>
              }

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
