import React, { Fragment } from "react";
import Barcode from "react-barcode";

export default class ComponentToPrintSVG extends React.Component {
  render() {
    const { productName, productBarcode, OS, printTypeRotate } = this.props;
    console.log(productName, productBarcode, OS, printTypeRotate);
    return (
      <Fragment>
        {OS === "Linux" && (
          <div
            className={`print-content-linux-old    ${
              printTypeRotate ? "rotate-90" : "text-center"
            } min-width`}
          >
            <div>
              <Barcode
                width={7}
                height={350}
                fontSize={50}
                value={productBarcode} /*format="EAN13"*/
              />
              <br />
              <span className="print-content-linux-text">
                {productName && productName.substr(0, 42)}
              </span>
            </div>
          </div>
        )}

        {OS === "Win" && (
          <div
            style={{ marginBottom: "2rem" }}
            className={` ${
              printTypeRotate
                ? "rotate-90"
                : "print-content-win-old text-center"
            } min-width`}
          >
            <div>
              <Barcode value={productBarcode} /*format="EAN13"*/ />
              <br />
              {productName && productName.substr(0, 42)}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
