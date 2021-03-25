import React, { useState } from "react";
import Chart, {
  CommonSeriesSettings,
  Series,
  Aggregation,
  Point,
  ArgumentAxis,
  ValueAxis,
  Title,
  Font,
  Legend,
  Label,
  Tooltip,
} from "devextreme-react/chart";
import { aggregationIntervals } from "./data.js";

import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function Check({ sales }) {
  const [currentInterval, setCurrentInterval] = useState(
    aggregationIntervals[0].interval
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Chart id="Check" dataSource={sales}>
          <CommonSeriesSettings argumentField="date" />

          <Series
            axis="soldavg"
            color="#03a9f4"
            valueField="avgcashpay"
            name="СрЧекНал"
          >
            <Point size={7} />
            <Aggregation enabled={true} />
          </Series>

          <Series
            axis="soldavg"
            color="#91ff35"
            valueField="avgcardpay"
            name="СрЧекКарт"
          >
            <Point size={7} />
            <Aggregation enabled={true} />
          </Series>

          <Series
            axis="soldavg"
            color="#ff5722"
            valueField="avgdebitpay"
            name="СрЧекПеревод"
          >
            <Point size={7} />
            <Aggregation enabled={true} />
          </Series>

          <Series
            axis="soldavg"
            color="#e91e63"
            valueField="soldavg"
            name="ОбщСрЧек"
          >
            <Point size={7} />
            <Aggregation enabled={true} />
          </Series>

          <ArgumentAxis
            aggregationInterval={currentInterval}
            valueMarginsEnabled={false}
            argumentType="datetime"
          />

          <ValueAxis name="soldavg">
            <Title text="Тенге">
              <Font color="#e91e63" />
            </Title>
            <Label>
              <Font color="#e91e63" />
            </Label>
          </ValueAxis>

          <Legend visible={false} />
          <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
          <Title text="Чеки" />
        </Chart>
      </Grid>
      <Grid item xs={12}>
        <FormControl style={{ width: "10rem" }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentInterval}
            onChange={updateInterval.bind(this)}
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

  function updateInterval(value) {
    setCurrentInterval(value.target.value);
  }
}

function customizeTooltip(pointInfo) {
  const options = {
    year: "numeric",
    week: "long",
    month: "long",
    day: "numeric",
  };
  const handlers = {
    ОбщСрЧек: (arg) => {
      return {
        text: `Дата: ${arg.argument.toLocaleDateString("ru-RU", options)}
        <br/>Общий Средний Чек: ${arg.point.aggregationInfo.data[0].soldavg}`,
      };
    },
    СрЧекНал: (arg) => {
      return {
        text: `Дата: ${arg.argument.toLocaleDateString("ru-RU", options)}
        <br/>Средний Чек Налом: ${
          arg.point.aggregationInfo.data[0].avgcashpay
        }`,
      };
    },
    СрЧекКарт: (arg) => {
      return {
        text: `Дата: ${arg.argument.toLocaleDateString("ru-RU", options)}
        <br/>Средний Чек Картой: ${
          arg.point.aggregationInfo.data[0].avgcardpay
        }`,
      };
    },
    СрЧекПеревод: (arg) => {
      return {
        text: `Дата: ${arg.argument.toLocaleDateString("ru-RU", options)}
        <br/>Средний Чек Переводов: ${
          arg.point.aggregationInfo.data[0].avgdebitpay
        }`,
      };
    },
  };
  return handlers[pointInfo.seriesName](pointInfo);
}
