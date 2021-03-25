import React, { Fragment } from "react";
import Barcode from "react-barcode";

export default class ComponentToPrintWithPrice extends React.Component {
  render() {
    const { details, printType3Rotate, useBrand } = this.props;
    return (
      <Fragment>
        <div>
          <table>
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>
                    <table
                      className={`${
                        printType3Rotate
                          ? "rotate-90-print-price table-barcode-print-invoice"
                          : "table-barcode-print-invoice"
                      }`}
                    >
                      <tbody>
                        <tr>
                          <td className="barcode-length">{detail.name}</td>
                        </tr>
                        {detail.attributescaption && (
                          <tr>
                            <td className="barcode-length">
                              {detail.attributescaption}
                            </td>
                          </tr>
                        )}
                        <tr className="top-bottom-border">
                          <td className="without-padding">
                            <Barcode
                              value={detail.code}
                              format="CODE128"
                              width={2}
                              height={50}
                              fontSize={14}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Цена:{" "}
                            {parseFloat(detail.newprice).toLocaleString("ru", {
                              minimumFractionDigits: 2,
                            })}
                            <br />
                            {detail.brand &&
                              useBrand &&
                              detail.brand.substr(0, 42)}
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
