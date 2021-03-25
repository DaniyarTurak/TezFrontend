import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PrintButton from "./PrintButton";
import Barcode from "react-barcode";

export default function FifthType({
  classes,
  attr,
  productSelectValue,
  componentRef5,
  handleRotate2,
  printType3Rotate,
  productBarcode,
  fontSize,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className="col-md-12 text-center table-3 barcode-margin-3">
                <table
                  className={`${printType3Rotate ? "rotate-90" : ""}`}
                  cellPadding="0"
                  cellSpacing="0"
                >
                  <tbody className="text-center">
                    <tr>
                      <td className="table-4">
                        <p
                          style={{
                            fontSize: fontSize.value === "0" ? "12px" : "24px",
                          }}
                          className=" fW-bold"
                        >
                          {productSelectValue.label.substr(0, 20)}
                        </p>
                        <p
                          style={{
                            fontSize: fontSize.value === "0" ? "12px" : "24px",
                          }}
                          className=" fW-bold"
                        >
                          {productSelectValue.label.substr(20, 20)}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Barcode
                          value={productBarcode}
                          height={60}
                          fontSize={18}
                          width={2.4}
                          format="CODE128"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="table-3 fZ-30">
                        Цена:
                        <p className="fZ-30 fW-bold">
                          {productSelectValue.price}
                          {attr ? `| ${attr}` : ""}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Grid>
            <PrintButton
              componentRef={componentRef5}
              handleRotate={handleRotate2}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
