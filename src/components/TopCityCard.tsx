"use client";

import { useEffect, useState } from "react";
import type { CityRanking, ForecastData } from "@/types";
import { CityChart } from "./CityChart";

interface TopCityCardProps {
  city: CityRanking;
}

interface RangeInfo {
  label: string;
  value: number;
  unit: string;
  inRange: boolean;
}

function ComfortTag({ inRange }: { inRange: boolean }) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono whitespace-nowrap ${
        inRange
          ? "bg-high-comfort/15 text-high-comfort"
          : "bg-moderate/15 text-moderate"
      }`}
      title={inRange ? "Within comfortable range" : "Outside comfortable range"}
    >
      {inRange ? "Comfortable" : "Less comfortable"}
    </span>
  );
}

function MetricRow({
  label,
  value,
  unit,
  rangeText,
  inRange,
}: {
  label: string;
  value: string;
  unit: string;
  rangeText: string;
  inRange: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 py-1.5 border-b border-secondary/5 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-secondary text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">
            {value}
            <span className="text-secondary">{unit}</span>
          </span>
          <ComfortTag inRange={inRange} />
        </div>
      </div>
      <span className="text-[10px] text-secondary/70 font-mono">{rangeText}</span>
    </div>
  );
}

function inRangeOf(value: number, min: number, max: number | null): boolean {
  return value >= min && (max === null || value <= max);
}

export function TopCityCard({ city }: TopCityCardProps) {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(true);

  const scoreColor =
    city.comfort.total >= 70
      ? "text-high-comfort"
      : city.comfort.total >= 40
        ? "text-moderate"
        : "text-low-comfort";

  useEffect(() => {
    fetch(`/api/forecast?cityId=${city.cityId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setForecast(data?.forecast ?? null);
        setForecastLoading(false);
      })
      .catch(() => setForecastLoading(false));
  }, [city.cityId]);

  const metrics: Array<{
    label: string;
    value: string;
    unit: string;
    rangeText: string;
    inRange: boolean;
  }> = [
    {
      label: "Temperature",
      value: city.temperature.toFixed(1),
      unit: "°C",
      rangeText: "(ideal 8–18°C)",
      inRange: inRangeOf(city.temperature, 8, 18),
    },
    {
      label: "Humidity",
      value: String(city.humidity),
      unit: "%",
      rangeText: "(ideal 30–60%)",
      inRange: inRangeOf(city.humidity, 30, 60),
    },
    {
      label: "Wind",
      value: city.windSpeed.toFixed(1),
      unit: "m/s",
      rangeText: "(ideal 2–5m/s)",
      inRange: inRangeOf(city.windSpeed, 2, 5),
    },
    {
      label: "Cloudiness",
      value: String(city.cloudiness),
      unit: "%",
      rangeText: "(ideal ≥70%)",
      inRange: inRangeOf(city.cloudiness, 70, null),
    },
  ];

  return (
    <div className="border border-secondary/20 rounded-lg bg-white/50 dark:bg-foreground/5 p-6 text-left">
      <h2 className="text-xs font-medium text-secondary uppercase tracking-wide mb-4">
        Most Comfortable City
      </h2>

      <div className={`font-mono font-bold text-5xl sm:text-6xl ${scoreColor}`}>
        {city.comfort.total}%
      </div>
      <div className="text-lg text-foreground font-medium mt-1">
        {city.cityName}
      </div>

      <div className="mt-6">
        {metrics.map((m) => (
          <MetricRow
            key={m.label}
            label={m.label}
            value={m.value}
            unit={m.unit}
            rangeText={m.rangeText}
            inRange={m.inRange}
          />
        ))}
      </div>

      <div className="border-t border-secondary/10 mt-6 pt-6">
        <div className="text-xs font-medium text-secondary uppercase tracking-wide mb-3">
          5-Day Trend
        </div>
        {forecastLoading ? (
          <div className="h-64 flex items-center justify-center text-secondary text-sm">
            Loading forecast...
          </div>
        ) : forecast ? (
          <>
            <CityChart forecast={forecast} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-secondary">
                    <th className="text-left py-1 pr-2 sm:pr-3 font-medium">Day</th>
                    <th className="text-right py-1 px-2 sm:px-3 font-medium">Temp</th>
                    <th className="text-right py-1 px-2 sm:px-3 font-medium hidden lg:table-cell">Humidity</th>
                    <th className="text-right py-1 px-2 sm:px-3 font-medium hidden lg:table-cell">Wind</th>
                    <th className="text-right py-1 px-2 sm:px-3 font-medium hidden lg:table-cell">Clouds</th>
                    <th className="text-right py-1 pl-2 sm:pl-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.points.slice(0, 5).map((p) => (
                    <tr key={p.time} className="border-t border-secondary/5">
                      <td className="py-1.5 pr-2 sm:pr-3 text-secondary">
                        {formatDay(p.time)}
                      </td>
                      <td className="text-right py-1.5 px-2 sm:px-3">
                        {p.temperature}°C
                      </td>
                      <td className="text-right py-1.5 px-2 sm:px-3 hidden lg:table-cell">{p.humidity}%</td>
                      <td className="text-right py-1.5 px-2 sm:px-3 hidden lg:table-cell">{p.windSpeed}m/s</td>
                      <td className="text-right py-1.5 px-2 sm:px-3 hidden lg:table-cell">{p.cloudiness}%</td>
                      <td
                        className={`text-right py-1.5 pl-2 sm:pl-3 font-semibold ${
                          p.score >= 70
                            ? "text-high-comfort"
                            : p.score >= 40
                              ? "text-moderate"
                              : "text-low-comfort"
                        }`}
                      >
                        {p.score}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-secondary text-sm">
            Forecast unavailable
          </div>
        )}
      </div>
    </div>
  );
}

function formatDay(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
