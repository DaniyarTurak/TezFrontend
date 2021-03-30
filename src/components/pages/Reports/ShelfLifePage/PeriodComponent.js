import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeriodTable from "./PeriodTable";
import Skeleton from '@material-ui/lab/Skeleton';

export default function PeridoComponent({ label, background, gradient, products, isLoading }) {
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

  return (
    <div className={classes.root}>
      { isLoading ? <Skeleton animation="wave" /> :
        <Accordion style={{ margin: "0px" }} defaultExpanded>
          <AccordionSummary
            expandIcon={products.length > 0 && <ExpandMoreIcon />}
            style={{ backgroundColor: background }}
          >
            <Typography className={classes.heading}><strong>{label} &emsp;
           {products.length <= 0 && <Fragment>НЕТ ТОВАРОВ</Fragment>}
            </strong></Typography>
          </AccordionSummary>
          {products.length > 0 &&
            <AccordionDetails style={{ backgroundImage: gradient }}>
              <PeriodTable products={products} background={background} />
            </AccordionDetails>}
        </Accordion>
      }
    </div >
  );
}
