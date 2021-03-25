import React from "react";
import Barcode from "react-barcode";

export default class ComponentWithNoPrice30x20 extends React.Component {
  render() {
    const { attr, productName, printTypeRotate, productBarcode } = this.props;
    return (
      <div className="text-center">
        <table>
          <tbody>
            <tr>
              <td>
                <div className={` ${printTypeRotate ? "rotate-90" : ""}`}>
                  <div className="text-center zero-padding-margin">
                    <p
                      style={{ fontSize: "24px" }}
                      className="text-center zero-padding-margin"
                    >
                      {productName && productName.substr(0, 16)}
                    </p>
                    <p
                      style={{ fontSize: "24px" }}
                      className="text-center zero-padding-margin"
                    >
                      {productName && productName.substr(16, 16)}
                    </p>

                    <p
                      style={{ fontSize: "24px" }}
                      className="text-center zero-padding-margin"
                    >
                      {attr && attr.substr(0, 16)}
                    </p>
                    <Barcode
                      value={productBarcode}
                      height={40}
                      renderer="canvas"
                    />
                    <p
                      style={{ fontSize: "24px" }}
                      className="text-center zero-padding-margin"
                    ></p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
