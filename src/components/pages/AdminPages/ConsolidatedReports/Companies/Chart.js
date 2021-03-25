import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Moment from "moment";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Area,
  Tooltip,
} from "recharts";
import Title from "./Title";

export default function Chart({ company, companyData, handleClick }) {
  const [data, setData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    let dataNew = [];
    companyData.forEach((e) => {
      dataNew.push({
        time: Moment(e.date).format("YYYY-MM-DD"),
        amount: parseFloat(e[company.name]),
      });
    });
    setData(dataNew);
  }, [companyData]);

  return (
    <React.Fragment>
      <Title>{company.title}</Title>
      <ResponsiveContainer>
        <LineChart
          onClick={(e) => (e ? handleClick(company, e.activeLabel) : "")}
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Количество
            </Label>
          </YAxis>
          <Line
            type="monotone"
            style={{ cursor: "pointer" }}
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={true}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
