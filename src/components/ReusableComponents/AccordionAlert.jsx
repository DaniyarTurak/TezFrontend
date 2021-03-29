import React from "react";
import Grid from "@material-ui/core/Grid";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import marked from "marked";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}</a>`;
};

export default function AccordionAlert({ classes, text, title }) {
  return (
    <Grid container spacing={3} style={{ marginTop: "1rem" }}>
      <Grid item xs={12}>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            className={classes.root}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography component={"span"} className={classes.heading}>
              <InfoOutlinedIcon className={classes.icon} />
              <Typography
                component={"span"}
                className={classes.secondaryHeading}
              >
                {title}
              </Typography>
            </Typography>
            <Typography component={"span"} className={classes.thirdHeading}>
              развернуть
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className="preview"
              style={{ fontSize: "0.875rem" }}
              dangerouslySetInnerHTML={{
                __html: marked(text, {
                  renderer: renderer,
                }),
              }}
            ></div>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}
