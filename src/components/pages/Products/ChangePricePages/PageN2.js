import React, { Component } from "react";

class PageN2 extends Component {
  state = {
    products: this.props.productList,
  };

  render() {
    let isWholesale = this.props.isWholesale;
    const { products } = this.state;
    let isSelledByPieces;
    products.forEach((element) => {
      if (element.piece) {
        isSelledByPieces = true;
      }
    });

    return (
      <div className="product-change-price-page-n2">
        <i>Вы установили новые цены на следующие товары/услуги : </i>
        <table className="table table-hover change-price-plt">
          <thead>
            <tr>
              <th style={{ width: isSelledByPieces ? "40%" : "30%" }}>
                Продукт
              </th>
              <th style={{ width: "20%" }}>Штрих код</th>
              <th style={{ width: "15%" }} className="text-center">
                Новая {isWholesale ? "розничная" : ""} цена
              </th>
              {isWholesale &&
                <th style={{ width: "15%" }} className="text-center">
                  Новая оптовая цена
                </th>
              }
              {isSelledByPieces && (
                <th style={{ width: "15%" }} className="text-center">
                  Новая цена за штуку
                </th>
              )}

              <th>Торговая точка</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => {
              return (
                <tr key={idx}>
                  <td>{product.name}</td>
                  <td>{product.code}</td>
                  <td className="text-center">{product.price}</td>
                  {isWholesale &&
                    <td className="text-center">{product.wholesale_price}</td>
                  }
                  {isSelledByPieces && (
                    <td className="text-center">{product.pieceprice}</td>
                  )}
                  <td>
                    <ul>
                      {product.selectedPoints.map((point) => {
                        return <span key={point.id}>{point.name}</span>;
                      })}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PageN2;
