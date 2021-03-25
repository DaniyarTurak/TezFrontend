import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PrintButton from "./PrintButton";
import Barcode from "react-barcode";

export default function FourthType({
  classes,
  attr,
  productSelectValue,
  componentRef4,
  handleRotate2,
  printType3Rotate,
  productBarcode,
  isMultiple,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper} style={{ height: "20rem" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div
                className={`col-md-12 text-center barcode-margin-2 ${
                  !isMultiple && "table-3"
                }`}
              >
                <table
                  className={`${printType3Rotate ? "rotate-90" : ""} `}
                  cellPadding="0"
                  cellSpacing="0"
                >
                  <tbody className="text-center">
                    <tr>
                      <td className="table-4">
                        <p>
                          {productSelectValue.label &&
                            productSelectValue.label.substr(0, 20)}
                        </p>
                        <p>
                          {productSelectValue.label &&
                            productSelectValue.label.substr(20, 20)}
                        </p>
                        <p> {attr ? `| ${attr.substr(0, 20)}` : ""} </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Barcode
                          value={productBarcode}
                          height={60}
                          fontSize={12}
                          width={2}
                          format="CODE128"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="table-3">
                        Цена:
                        <p className="fW-bold tenge">
                          {productSelectValue.price}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Grid>
            {!isMultiple && (
              <PrintButton
                componentRef={componentRef4}
                handleRotate={handleRotate2}
              />
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
