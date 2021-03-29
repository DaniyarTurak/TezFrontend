import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeriodTable from "./PeriodTable";

export default function PeridoComponent({ label, background, gradient, products }) {
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

  const [exp, setExp] = useState(true)

  useEffect(() => {
    if (products.length <=1 ) {
      setExp(false);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Accordion style={{ margin: "0px" }} defaultExpanded>
        <AccordionSummary
          expandIcon={ products.length > 1 && <ExpandMoreIcon />}
          style={{ backgroundColor: background }}
        // style={{backgroundImage: "linear-gradient(#ff5252 80%, white)"}}
        >
          <Typography className={classes.heading}>{label} &emsp;
           {products.length <= 1 && <Fragment>нет товаров</Fragment>} 
           </Typography>
        </AccordionSummary>
        {products.length > 1 && 
        <AccordionDetails style={{ backgroundImage: gradient }}>
          <PeriodTable products={products} background={background} />
        </AccordionDetails>}
      </Accordion>
    </div >
  );
}
