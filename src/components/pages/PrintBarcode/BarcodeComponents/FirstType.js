import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Barcode from "react-barcode";
import PrintButton from "./PrintButton";

export default function FirstType({
  classes,
  productBarcode,
  printTypeRotate,
  productSelectValue,
  componentRef2,
  handleRotate0,
  isMultiple,
  brandName,
  useBrand,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper} style={{ height: "20rem" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div
                style={{ paddingBottom: "3rem" }}
                className={`content-center ${
                  printTypeRotate ? "rotate-90 " : ""
                } min-width`}
              >
                <Barcode value={productBarcode} />
                <br />
                {productSelectValue.label.substr(0, 42)}
                <br />
                {brandName
                  ? brandName !== "Бренд не указан" &&
                    useBrand &&
                    " [" + brandName.substr(0, 42) + "]"
                  : ""}
              </div>
            </Grid>
            {!isMultiple && (
              <PrintButton
                componentRef={componentRef2}
                handleRotate={handleRotate0}
              />
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
