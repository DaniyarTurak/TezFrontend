import React from "react";
import Grid from "@material-ui/core/Grid";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import marked from "marked";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const text = `Разбивка по категориям АВС зависит от доли товара нарастающим итогом в соответствующем критерии, в продажах в штуках или валовой прибыли.
<br>
Категория A - самые важные товары, приносящие 80% от всех продаж в штуках или валовой прибыли.
Категория B - товары средней важности, приносящие 15% от всех продаж в штуках или валовой прибыли. 
Категория C - менее ценные товары, приносящие 5% от всех продаж в штуках или валовой прибыли.
<br>
Разбивка по категориям XYZ зависит от того, насколько стабильны продажи товара или, другими словами, насколько стабильным спросом пользуется товар, что определяется размером коэффициента вариации продаж за анализируемый период.
<br>
Категория X - товары с устойчивым спросом (коэффициент от 0% до 10%) 
Категория Y - товары с изменчивым спросом (коэффициент от 10% до 25%)
Категория Z - товары со случайным спросом (коэффициент выше 25%)
<br>
Значение Н/Д для коэффициента вариации продаж значит, что продаж по данному товару за весь анализируемый период не было.
<br>
Внимание:
<br>
Отчёт ABC/XYZ строится на основе данных по продажам и наличию товара на складе. Если по товару не было продаж и он отсутствовал на складе каждый день за ВЕСЬ анализируемый период, такой товар не попадет в отчёт. Если же по товару не было продаж, но он был на складе хотя бы ОДИН день из всего анализируемого периода, то он будет включен в отчёт с нулевыми продажами и, соответственно, попадет в категорию С.
<br>
В выгрузке в формате Excel, доступной в самом низу отчёта, Вы можете увидеть разбивку данных, на основании которых был подготовлен данный отчёт. 
<br>
Пустые ячейки в таблице Excel означают, что товар отсутствовал на складе и по нему не было продаж за соответствующий период - для ежемесячных данных за весь конкретный месяц, для еженедельных данных за всю конкретную неделю, для ежедневных данных - за весь конкретный день. 
<br>
Нулевые ячейки в таблице Excel означают, что товар присутствовал на складе, однако продаж по нему за конкретный период не было.`;

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}</a>`;
};

export default function ReportAlert({ classes }) {
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
            <Typography className={classes.heading}>
              <InfoOutlinedIcon className={classes.icon} />
              <Typography className={classes.secondaryHeading}>
                Пояснение к отчёту
              </Typography>
            </Typography>
            <Typography className={classes.thirdHeading}>развернуть</Typography>
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
