import React, { Fragment } from "react";
import Barcode from "react-barcode";

export default class ComponentToPrintWithSVG extends React.Component {
  render() {
    const { details, printType1Rotate, useBrand } = this.props;
    return (
      <Fragment>
        <div>
          <table>
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>
                    <div
                      className={`${
                        printType1Rotate
                          ? "rotate-90-svg-print text-center"
                          : "print-content-win-svg text-center"
                      }`}
                    >
                      <div>
                        <Barcode value={detail.code} /*format="EAN13"*/ />
                        <br />
                        {detail.name && detail.name.substr(0, 42)}
                        <br />
                        {detail.attributescaption &&
                          detail.attributescaption.substr(0, 42)}
                        <br />
                        {detail.brand && useBrand && detail.brand.substr(0, 42)}
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
