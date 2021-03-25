import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PrintButton from "./PrintButton";
import Barcode from "react-barcode";

export default function ThirdType({
  classes,
  attr,
  productSelectValue,
  componentRef3,
  handleRotate2,
  printType3Rotate,
  brand,
  productBarcode,
  isMultiple,
  brandName,
  useBrand,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper} style={{ height: "22rem" }}>
          <Grid container spacing={1}>
            <div className="col-md-12 text-center table-3">
              <table
                className={`${
                  printType3Rotate ? "rotate-90" : ""
                } table-barcode-print-preview`}
              >
                <tbody className="text-center">
                  <tr>
                    <td className="barcode-length">{brand}</td>
                  </tr>
                  <tr>
                    <td className="barcode-length">
                      {productSelectValue.label &&
                        productSelectValue.label.substr(0, 40)}
                    </td>
                  </tr>
                  <tr>
                    <td className="barcode-length">
                      {productSelectValue.label &&
                        productSelectValue.label.substr(40, 40)}
                    </td>
                  </tr>
                  {brandName
                    ? brandName !== "Бренд не указан" &&
                      useBrand && (
                        <tr>
                          <td className="barcode-length">
                            {" [" + brandName.substr(0, 40) + "]"}
                          </td>
                        </tr>
                      )
                    : ""}
                  <tr className="top-bottom-border">
                    <td className="without-padding">
                      <Barcode value={productBarcode} />
                    </td>
                  </tr>
                  <tr className="table-3">
                    <td className="width-margin">
                      Цена:
                      {productSelectValue.price}
                    </td>
                  </tr>
                  <tr className="table-3">
                    <td className="width-margin">{attr}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {!isMultiple && (
              <PrintButton
                componentRef={componentRef3}
                handleRotate={handleRotate2}
              />
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
