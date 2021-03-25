import React from "react";
import Chart, {
  CommonSeriesSettings,
  Series,
  Pane,
  ValueAxis,
  Aggregation,
  Tooltip,
  Export,
  Font,
  Legend,
  ArgumentAxis,
  Size,
  Label,
  Title,
  Format,
} from "devextreme-react/chart";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Moment from "moment";
import { aggregationIntervals } from "./data.js";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function OnlySales({
  sales,
  currentSalesInterval,
  updateSalesInterval,
  setSalesAggregated,
  salesAggregated,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Chart
          id="sales"
          dataSource={sales}
          defaultPane="bottomPane"
          title="Продажи/Количество/Ср.Чек"
        >
          <Size height={1000} />
          <CommonSeriesSettings argumentField="date" />
          <Series
            pane="topPane"
            axis="soldcount"
            color="#03a9f4"
            valueField="soldcount"
            name="Количество"
          >
            <Aggregation enabled={true} method="sum" />
          </Series>

          <Series
            pane="topPane"
            axis="soldsum"
            color="#e91e63"
            valueField="soldsum"
            name="Продажи"
          >
            <Aggregation enabled={true} method="sum" />
          </Series>

          <Series
            pane="bottomPane"
            axis="soldavg"
            color="#00a152"
            valueField="soldavg"
            name="СрдЧек"
          >
            <Aggregation enabled={true} calculate={calcAvg} method="custom" />
          </Series>

          <Pane name="topPane" />
          <Pane name="bottomPane" />

          <ArgumentAxis
            aggregationInterval={currentSalesInterval}
            valueMarginsEnabled={false}
            argumentType="datetime"
          />

          <ValueAxis pane="bottomPane" name="soldavg">
            <Title text="Тенге">
              <Font color="#00a152" />
            </Title>
            <Label>
              <Font color="#00a152" />
            </Label>
          </ValueAxis>

          <ValueAxis pane="topPane" name="soldcount" position="right">
            <Title text="Шт.">
              <Font color="#03a9f4" />
            </Title>
            <Label>
              <Font color="#03a9f4" />
            </Label>
          </ValueAxis>

          <ValueAxis pane="topPane" name="soldsum">
            {/* <Grid visible={true} /> */}
            <Title text="Тенге">
              <Font color="#e91e63" />
            </Title>
            <Label>
              <Font color="#e91e63" />
            </Label>
          </ValueAxis>
          <Tooltip
            enabled={true}
            shared={true}
            customizeTooltip={customizeTooltip}
          >
            <Format precision={2} />
          </Tooltip>
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          <Export enabled={true} />
        </Chart>
      </Grid>
      <Grid item xs={12}>
        <FormControl style={{ width: "10rem" }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentSalesInterval}
            onChange={updateSalesInterval.bind(this)}
          >
            {aggregationIntervals.map((option) => (
              <MenuItem key={option.interval} value={option.interval}>
                {option.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  //библиотека считает ср.значение от ср. значения  при агрегации - так не правильно,
  //вот и используем кастомную calcAvg().
  function calcAvg(aggregationInfo) {
    let soldsumSUM, soldcountSum;
    //soldsumSUM, soldcountSum - для расчёта суммы продаж и количества за период(неделя,месяц).
    //нужны для расчёта среднего значения за период.
    if (aggregationInfo.data.length > 1) {
      soldsumSUM = aggregationInfo.data.reduce((prev, next) => {
        return prev + next.soldsum;
      }, 0);
      soldcountSum = aggregationInfo.data.reduce((prev, next) => {
        return prev + next.soldcount;
      }, 0);
    }

    //Среднее значение за период равно сумме продаж за период делённой на количество за период.
    const aggregatedAVG = soldsumSUM / soldcountSum;

    //ниже, agg и setSalesAggregated нужны для агрегированной таблицы, которая ниже графиков.
    //возможно есть вариант вытащить уже сгенерированные данные после агрегации из графика, но я не нашёл.
    let agg = {};
    if (aggregationInfo.aggregationInterval !== "day") {
      agg = {
        date:
          Moment(aggregationInfo.intervalStart).format("DD.MM.YYYY") +
          " - " +
          Moment(aggregationInfo.intervalEnd).format("DD.MM.YYYY"),
        soldavg:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].soldavg.toFixed(2)
            : aggregatedAVG
            ? aggregatedAVG.toFixed(2)
            : "-",
        soldsum:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].soldsum.toFixed(2)
            : soldsumSUM
            ? soldsumSUM.toFixed(2)
            : "-",
        soldcount:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].soldcount.toFixed(2)
            : soldcountSum
            ? soldcountSum.toFixed(2)
            : "-",
      };
      salesAggregated.push(agg);
      setSalesAggregated(salesAggregated);
    }

    //здесь возвращаются сагрегированные средние значения за период, если выбрана неделя или месяц.
    //если же выбран день, то возвращает средние значения из бэка.
    if (aggregationInfo.data.length > 1) {
      return {
        date: aggregationInfo.intervalStart,
        soldavg: aggregatedAVG,
      };
    } else if (aggregationInfo.data.length === 1) {
      return {
        date: aggregationInfo.intervalStart,
        soldavg: aggregationInfo.data[aggregationInfo.data.length - 1].soldavg,
      };
    }
  }

  function customizeTooltip(pointInfo) {
    const items = pointInfo.valueText.split("\n");
    const color = pointInfo.point.getColor();
    items.forEach((item, index) => {
      if (item.indexOf(pointInfo.seriesName) === 0) {
        const element = document.createElement("span");

        element.textContent = item;
        element.style.color = color;
        element.className = "active";

        items[index] = element.outerHTML;
      }
    });

    return { text: items.join("\n") };
  }
}
