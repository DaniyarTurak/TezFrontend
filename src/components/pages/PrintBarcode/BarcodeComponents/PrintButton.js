import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import IconButton from "@material-ui/core/IconButton";
import ReplayIcon from "@material-ui/icons/Replay";

export default function PrintButton({ componentRef, handleRotate }) {
  return (
    <Grid item xs={12}>
      <ReactToPrint
        trigger={() => <Button color="primary">Печать</Button>}
        content={() => componentRef.current}
        bodyClass={"print-content"}
      />
      <IconButton aria-label="rotate" size="small" onClick={handleRotate}>
        <ReplayIcon color="primary" />
      </IconButton>
    </Grid>
  );
}
