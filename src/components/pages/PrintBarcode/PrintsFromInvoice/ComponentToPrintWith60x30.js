import React, { Fragment } from "react";

import Barcode from "react-barcode";
export default class ComponentToPrintWith60x30 extends React.Component {
  render() {
    const { printType5Rotate, details } = this.props;
    return (
      <Fragment>
        <div className="text-center">
          <table>
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>
                    <table
                      style={{ marginBottom: "12rem" }}
                      className={`${
                        printType5Rotate ? "rotate-90-print-price" : ""
                      } `}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{ fontSize: "30px" }}
                            className="barcode-length text-center zero-padding-margin"
                          >
                            {detail.name && detail.name.substr(0, 20)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ fontSize: "30px" }}
                            className="barcode-length text-center zero-padding-margin"
                          >
                            {detail.name && detail.name.substr(20, 20)}
                          </td>
                        </tr>
                        {detail.attributescaption && (
                          <tr>
                            <td
                              style={{ fontSize: "12px" }}
                              className="barcode-length text-center zero-padding-margin"
                            >
                              {detail.attributescaption}
                            </td>
                          </tr>
                        )}
                        <tr className="top-bottom-border">
                          <td className="without-padding text-center">
                            <Barcode
                              value={detail.code}
                              height={60}
                              width={3.8}
                              format="CODE128"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ fontSize: "30px" }}
                            className="tenge text-center"
                          >
                            Цена:{" "}
                            {parseFloat(detail.newprice).toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}
