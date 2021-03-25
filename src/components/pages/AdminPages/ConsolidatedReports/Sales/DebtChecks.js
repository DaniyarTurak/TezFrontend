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

export default function DebtChecks({
  sales,
  currentDebtInterval,
  updateDebtInterval,
  setDebtAggregated,
  debtAggregated,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Chart
          id="debt"
          dataSource={sales}
          defaultPane="bottomPane"
          title={`Транзакции  "Долг"`}
        >
          <Size height={1000} />
          <CommonSeriesSettings argumentField="date" />
          <Series
            pane="topPane"
            axis="countdebtpay"
            color="#03a9f4"
            valueField="countdebtpay"
            name="Количество"
          >
            <Aggregation enabled={true} method="sum" />
          </Series>

          <Series
            pane="topPane"
            axis="debtpay"
            color="#e91e63"
            valueField="debtpay"
            name="Долг"
          >
            <Aggregation enabled={true} method="sum" />
          </Series>

          <Series
            pane="bottomPane"
            axis="avgdebtpay"
            color="#00a152"
            valueField="avgdebtpay"
            name="СрдЧек"
          >
            <Aggregation enabled={true} calculate={calcAvg} method="custom" />
          </Series>

          <Pane name="topPane" />
          <Pane name="bottomPane" />

          <ArgumentAxis
            aggregationInterval={currentDebtInterval}
            valueMarginsEnabled={false}
            argumentType="datetime"
          />

          <ValueAxis pane="bottomPane" name="avgdebtpay">
            <Title text="Тенге">
              <Font color="#00a152" />
            </Title>
            <Label>
              <Font color="#00a152" />
            </Label>
          </ValueAxis>

          <ValueAxis pane="topPane" name="countdebtpay" position="right">
            <Title text="Шт.">
              <Font color="#03a9f4" />
            </Title>
            <Label>
              <Font color="#03a9f4" />
            </Label>
          </ValueAxis>

          <ValueAxis pane="topPane" name="debtpay">
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
            value={currentDebtInterval}
            onChange={updateDebtInterval.bind(this)}
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
    let debtpaySUM, countDebtpaySum;
    //soldsumSUM, soldcountSum - для расчёта суммы продаж и количества за период(неделя,месяц).
    //нужны для расчёта среднего значения за период.
    if (aggregationInfo.data.length > 1) {
      debtpaySUM = aggregationInfo.data.reduce((prev, next) => {
        return prev + next.debtpay;
      }, 0);
      countDebtpaySum = aggregationInfo.data.reduce((prev, next) => {
        return prev + next.countdebtpay;
      }, 0);
    }

    //Среднее значение за период равно сумме продаж за период делённой на количество за период.
    const aggregatedAVG = debtpaySUM / countDebtpaySum;

    //ниже, agg и setSalesAggregated нужны для агрегированной таблицы, которая ниже графиков.
    //возможно есть вариант вытащить уже сгенерированные данные после агрегации из графика, но я не нашёл.
    let agg = {};
    if (aggregationInfo.aggregationInterval !== "day") {
      agg = {
        date:
          Moment(aggregationInfo.intervalStart).format("DD.MM.YYYY") +
          " - " +
          Moment(aggregationInfo.intervalEnd).format("DD.MM.YYYY"),
        avgdebtpay:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].avgdebtpay.toFixed(2)
            : aggregatedAVG
            ? aggregatedAVG.toFixed(2)
            : "-",
        debtpay:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].debtpay.toFixed(2)
            : debtpaySUM
            ? debtpaySUM.toFixed(2)
            : "-",
        countdebtpay:
          aggregationInfo.data.length === 1
            ? aggregationInfo.data[0].countdebtpay.toFixed(2)
            : countDebtpaySum
            ? countDebtpaySum.toFixed(2)
            : "-",
      };
      debtAggregated.push(agg);
      setDebtAggregated(debtAggregated);
    }

    //здесь возвращаются сагрегированные средние значения за период, если выбрана неделя или месяц.
    //если же выбран день, то возвращает средние значения из бэка.
    if (aggregationInfo.data.length > 1) {
      return {
        date: aggregationInfo.intervalStart,
        avgdebtpay: aggregatedAVG,
      };
    } else if (aggregationInfo.data.length === 1) {
      return {
        date: aggregationInfo.intervalStart,
        avgdebtpay:
          aggregationInfo.data[aggregationInfo.data.length - 1].avgdebtpay,
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
