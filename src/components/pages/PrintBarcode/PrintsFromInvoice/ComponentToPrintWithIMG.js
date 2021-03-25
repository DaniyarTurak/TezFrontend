import React, { Fragment } from "react";

export default class ComponentToPrintWithIMG extends React.Component {
  render() {
    const { details, imgSrc, printType2Rotate, filterValue } = this.props;
    return (
      <Fragment>
        <div>
          <table>
            <tbody>
              {details.map((detail, idx) => (
                <tr key={idx}>
                  <td>
                    <div
                      className={`print-content-win-${filterValue.value} ${
                        printType2Rotate ? "rotate-90-img-print" : ""
                      } min-width`}
                    >
                      <div>
                        <img
                          src={imgSrc}
                          alt=""
                          className={`print-img-${filterValue.value}`}
                          style={{ padding: "10px" }}
                        />
                        <br />
                        {detail.name && detail.name.substr(0, 60)}
                        <br />
                        {detail.attributescaption &&
                          detail.attributescaption.substr(0, 60)}
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
