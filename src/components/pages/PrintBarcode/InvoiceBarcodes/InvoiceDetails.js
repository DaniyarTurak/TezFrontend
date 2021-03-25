import React, { useRef, useState } from "react";
import Moment from "moment";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";

import PrintButton from "../BarcodeComponents/PrintButton";
import FirstType from "../BarcodeComponents/FirstType";
import ThirdType from "../BarcodeComponents/ThirdType";
import FourthType from "../BarcodeComponents/FourthType";

import ComponentToPrintWithSVG from "../PrintsFromInvoice/ComponentToPrintWithSVG";
import ComponentToPrintWithPrice from "../PrintsFromInvoice/ComponentToPrintWithPrice";
import ComponentToPrintWith30x20 from "../PrintsFromInvoice/ComponentToPrintWith30x20";
import ComponentToPrintWith60x30 from "../PrintsFromInvoice/ComponentToPrintWith60x30";

export default function InvoiceDetails({
  markedInvoice,
  details,
  selectedPrintType,
  classes,
  useBrand,
}) {
  const [printType1Rotate, setPrintType1Rotate] = useState(false);
  const [printType3Rotate, setPrintType3Rotate] = useState(false);
  const [printType4Rotate, setPrintType4Rotate] = useState(false);
  const [printType5Rotate, setPrintType5Rotate] = useState(false);

  const componentRef1 = useRef();
  const componentRef3 = useRef();
  const componentRef4 = useRef();
  const componentRef5 = useRef();

  const handleRotate = () => {
    setPrintType1Rotate(!printType1Rotate);
    setPrintType3Rotate(!printType3Rotate);
    setPrintType4Rotate(!printType4Rotate);
    setPrintType5Rotate(!printType5Rotate);
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <b className="btn-one-line">
            Накладная от{" "}
            {Moment(markedInvoice.invoicedate).format("DD.MM.YYYY")}
          </b>

          <p className="product-transfer-stocks">
            {markedInvoice.invoicetype} <br />
            Куда: {markedInvoice.stockto} <br />
            Контрагент:{" "}
            {markedInvoice.counterparty &&
              `${markedInvoice.bin} | ${markedInvoice.counterparty}`}
            <br />
          </p>
        </Grid>

        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" />
                <TableCell align="center">Наименование товара</TableCell>
                <TableCell align="center">Штрих код</TableCell>
                <TableCell align="center">Превью</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map((detail, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">
                    {detail.name +
                      (detail.attributescaption
                        ? ", " + detail.attributescaption
                        : "")}
                  </TableCell>
                  <TableCell align="center">{detail.code}</TableCell>
                  <TableCell align="center">
                    {selectedPrintType === "1" && (
                      <FirstType
                        classes={classes}
                        isMultiple={true}
                        useBrand={useBrand}
                        brandName={detail.brand}
                        productBarcode={detail.code}
                        printTypeRotate={printType1Rotate}
                        productSelectValue={{
                          label: detail.name,
                          price: detail.newprice,
                        }}
                      />
                    )}

                    {selectedPrintType === "3" && (
                      <ThirdType
                        classes={classes}
                        attr={detail.attributescaption}
                        isMultiple={true}
                        productSelectValue={{
                          label: detail.name,
                          price: detail.newprice,
                        }}
                        useBrand={useBrand}
                        brandName={detail.brand}
                        printType3Rotate={printType3Rotate}
                        productBarcode={detail.code}
                      />
                    )}
                    {(selectedPrintType === "4" ||
                      selectedPrintType === "5") && (
                      <FourthType
                        classes={classes}
                        attr={detail.attributescaption}
                        isMultiple={true}
                        productSelectValue={{
                          label: detail.name,
                          price: detail.newprice,
                        }}
                        printType3Rotate={printType3Rotate}
                        productBarcode={detail.code}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12}>
          <PrintButton
            componentRef={
              selectedPrintType === "1"
                ? componentRef1
                : selectedPrintType === "3"
                ? componentRef3
                : selectedPrintType === "4"
                ? componentRef4
                : componentRef5
            }
            handleRotate={handleRotate}
          />
        </Grid>

        <div style={{ display: "none" }}>
          <ComponentToPrintWithSVG
            useBrand={useBrand}
            details={details}
            ref={componentRef1}
            printType1Rotate={printType1Rotate}
          />

          <ComponentToPrintWithPrice
            useBrand={useBrand}
            details={details}
            printType3Rotate={printType3Rotate}
            ref={componentRef3}
          />
          {selectedPrintType === "4" && (
            <ComponentToPrintWith30x20
              details={details}
              printType4Rotate={printType4Rotate}
              ref={componentRef4}
            />
          )}
          <ComponentToPrintWith60x30
            details={details}
            printType5Rotate={printType5Rotate}
            ref={componentRef5}
          />
        </div>
      </Grid>
    </Paper>
  );
}
