import React from "react";

export default function PageN2({ productListProps }) {
  return (
    <div className="product-write-off-page-n2 mt-10">
      <div className="row">
        <div className="col-md-12">
          <i>Вы установили следующие товары для списания: </i>
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Продукт</th>
                <th style={{ width: "20%" }}>Штрих код</th>
                <th style={{ width: "10%" }} className="text-center">
                  Количество
                </th>
                <th style={{ width: "40%" }}>Причина</th>
              </tr>
            </thead>
            <tbody>
              {productListProps.map((product, idx) => {
                return (
                  <tr key={idx}>
                    <td>{product.name}</td>
                    <td>{product.code}</td>
                    <td className="text-center">{product.amount}</td>
                    <td>{product.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
