import React, { Fragment } from "react";
import Barcode from "react-barcode";

export default class ComponentToPrintPrice extends React.Component {
  render() {
    const {
      productName,
      brand,
      attr,
      productBarcode,
      price,
      printTypeRotate,
    } = this.props;
    return (
      <Fragment>
        <div className="print-content-win text-center">
          <table
            className={`table-barcode-print-svg ${
              printTypeRotate ? "rotate-90" : ""
            }`}
          >
            <tbody className="text-center">
              <tr style={{ fontSize: "20px" }}>
                <td className="barcode-length">{brand}</td>
              </tr>
              <tr style={{ fontSize: "20px" }}>
                <td className="barcode-length">{productName}</td>
              </tr>
              <tr className="top-bottom-border">
                <td className="without-padding-svg">
                  <Barcode
                    value={productBarcode}
                    width={2.8}
                    height={100}
                    fontSize={20}
                  />
                </td>
              </tr>
              <tr style={{ fontSize: "25px" }}>
                <td style={{ fontSize: "30px", fontWeight: "bold" }}>
                  Цена: {price}
                </td>
              </tr>
              <tr style={{ fontSize: "25px" }}>
                <td>{attr}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}
