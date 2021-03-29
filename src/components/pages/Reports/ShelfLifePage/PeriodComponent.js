import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeriodTable from "./PeriodTable";
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from "@material-ui/core/Grid";

export default function PeridoComponent({ label, background, gradient, products, isLoading, code }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));
  const classes = useStyles();
  console.log(products);
  console.log(code);
  return (
    <Grid item xs={12}>
      { isLoading && <Typography variant="h3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Typography>}
      {!isLoading && <Accordion style={{ margin: "0px" }} defaultExpanded>
        <AccordionSummary
          expandIcon={products && products.length > 0 && <ExpandMoreIcon />}
          style={{ backgroundColor: background }}
        >
          {products && products.length > 0 && code !== "no_data_found" &&
            <Typography className={classes.heading}>
              <strong>
                {label} &emsp;
              </strong>
            </Typography>}
          {!products && code === "no_data_found" &&
            <Typography className={classes.heading}>
              <strong>
                {label} &emsp; НЕТ ТОВАРОВ
              </strong>
            </Typography>}
        </AccordionSummary>
        {products && products.length > 0 &&
          <AccordionDetails style={{ backgroundImage: gradient }}>
            <PeriodTable products={products} background={background} />
          </AccordionDetails>}
      </Accordion>
      }
    </Grid>
  );
}
