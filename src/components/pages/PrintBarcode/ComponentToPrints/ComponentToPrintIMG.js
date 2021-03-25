import React, { Fragment } from "react";

export default class ComponentToPrintIMG extends React.Component {
  render() {
    const {
      productName,
      /*productBarcode,*/ OS,
      src,
      filterValue,
      printTypeRotate,
    } = this.props;
    return (
      <Fragment>
        {OS === "Linux" && (
          <div
            className={`print-content-linux-${filterValue.value} ${
              printTypeRotate ? "rotate-90" : ""
            } min-width`}
          >
            <div>
              <img
                src={src}
                alt=""
                className={`print-img-${filterValue.value}`}
                style={{ padding: "10px" }}
              />
              <br />
              <span className="print-content-linux-text">
                {productName && productName.substr(0, 60)}
              </span>
            </div>
          </div>
        )}

        {OS === "Win" && (
          <div
            className={`print-content-win-${filterValue.value} ${
              printTypeRotate ? "rotate-90" : ""
            } min-width`}
          >
            <div>
              <img
                src={src}
                alt=""
                className={`print-img-${filterValue.value}`}
                style={{ padding: "10px" }}
              />
              {/* <Barcode value={productBarcode}  /> */}
              <br />
              {productName && productName.substr(0, 60)}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
