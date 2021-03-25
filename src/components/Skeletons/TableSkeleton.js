import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

export default function SkeletonTable() {
  return (
    <Fragment>
      <Skeleton className="mt-4" width="100%">
        <Typography>.</Typography>
      </Skeleton>
      <Skeleton variant="rect" width="100%">
        <div style={{ paddingTop: "16%" }}></div>
      </Skeleton>
    </Fragment>
  );
}
