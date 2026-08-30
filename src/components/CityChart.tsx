"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ForecastData } from "@/types";

interface CityChartProps {
  forecast: ForecastData;
}

export function CityChart({ forecast }: CityChartProps) {
  const data = forecast.points.map((p) => ({
    time: formatTime(p.time),
    temp: p.temperature,
    humidity: p.humidity,
    wind: p.windSpeed,
    clouds: p.cloudiness,
    desc: p.description,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" opacity={0.2} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "var(--secondary)" }}
            interval={3}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--secondary)" }}
            domain={["dataMin - 2", "dataMax + 2"]}
            label={{
              value: "°C",
              position: "insideTopLeft",
              offset: 10,
              style: { fontSize: 10, fill: "var(--secondary)" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--secondary)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value, name) => {
              if (name === "temp") return [`${value}°C`, "Temperature"];
              return [String(value), String(name)];
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="var(--high-comfort)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const hour = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${hour}`;
}
