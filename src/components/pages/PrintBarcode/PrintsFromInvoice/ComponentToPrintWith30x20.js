import React, { Fragment } from "react";
import Barcode from "react-barcode";

export default class ComponentToPrintWith30x20 extends React.Component {
  render() {
    const { printType4Rotate, details } = this.props;
    return (
      <Fragment>
        <div className="text-center">
          <table>
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>
                    <div className={` ${printType4Rotate ? "rotate-90" : ""}`}>
                      <div className="text-center zero-padding-margin">
                        <p
                          style={{ fontSize: "24px" }}
                          className="text-center zero-padding-margin"
                        >
                          {detail.name && detail.name.substr(0, 16)}
                        </p>
                        <p
                          style={{ fontSize: "24px" }}
                          className="text-center zero-padding-margin"
                        >
                          {detail.name && detail.name.substr(16, 16)}
                        </p>

                        <p
                          style={{ fontSize: "24px" }}
                          className="text-center zero-padding-margin"
                        >
                          {detail.attributescaption &&
                            detail.attributescaption.substr(0, 16)}
                        </p>
                        <Barcode
                          value={detail.code}
                          height={40}
                          renderer="canvas"
                        />
                        <p
                          style={{ fontSize: "24px" }}
                          className="text-center zero-padding-margin"
                        >
                          Цена: {detail.newprice} тг.
                        </p>
                      </div>
                    </div>
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
