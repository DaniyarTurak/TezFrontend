import React, { Fragment } from "react";
import bwipjs from "bwip-js";

export default class ComponentToPrint60x30 extends React.Component {
  componentDidUpdate(prevProps) {
    try {
      // The return value is the canvas element
      bwipjs.toCanvas("mycanvas2", {
        bcid: "code128", // Barcode type
        text: this.props.productBarcode, // Text to encode
        scale: 5,
        //width: 100,
        height: 5, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Always good to set this
      });
    } catch (e) {
      // `e` may be a string or Error object
    }
  }

  render() {
    const { attr, productName, price, printTypeRotate, fontSize } = this.props;
    return (
      <Fragment>
        <div className="text-center">
          <table
            className={`${
              printTypeRotate ? "rotate-90" : ""
            } zero-padding-margin text-center`}
          >
            <tbody className="text-center zero-padding-margin">
              <tr className="zero-padding-margin">
                <td
                  className="zero-padding-margin"
                  style={{
                    fontSize: fontSize.value === "0" ? "34px" : "54px",
                    fontWeight: "bold",
                    display: "flex",
                    margin: "0px",
                    padding: "0px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p className="zero-padding-margin">
                    {productName &&
                      productName.substr(0, fontSize.value === "0" ? 20 : 24)}
                  </p>
                  <p className="zero-padding-margin">
                    {productName &&
                      productName.substr(
                        fontSize.value === "0" ? 20 : 24,
                        fontSize.value === "0" ? 20 : 24
                      )}
                  </p>
                  <p className="zero-padding-margin">
                    {productName &&
                      productName.substr(
                        fontSize.value === "0" ? 40 : 48,
                        fontSize.value === "0" ? 20 : 24
                      )}
                  </p>
                </td>
              </tr>
              <tr className="zero-padding-margin">
                <td className="zero-padding-margin">
                  <canvas id="mycanvas2"></canvas>
                </td>
              </tr>
              <tr className="zero-padding-margin">
                <td
                  className="zero-padding-margin"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    fontSize: "50px",
                  }}
                >
                  Цена:
                  <p
                    className="zero-padding-margin"
                    style={{ fontSize: "50px", fontWeight: "bold" }}
                  >
                    {price}
                    {attr ? `| ${attr}` : ""}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}
