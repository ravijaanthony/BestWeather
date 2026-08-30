"use client";

import { useState, useEffect } from "react";
import type { CityRanking, ForecastData } from "@/types";
import { CityChart } from "./CityChart";

interface CityRowProps {
  ranking: CityRanking;
}

export function CityRow({ ranking }: CityRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const scoreColor =
    ranking.comfort.total >= 70
      ? "text-high-comfort"
      : ranking.comfort.total >= 40
        ? "text-moderate"
        : "text-low-comfort";

  useEffect(() => {
    if (showForecast && !forecast && !forecastLoading) {
      setForecastLoading(true);
      fetch(`/api/forecast?cityId=${ranking.cityId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setForecast(data?.forecast ?? null);
          setForecastLoading(false);
        })
        .catch(() => setForecastLoading(false));
    }
  }, [showForecast, forecast, forecastLoading, ranking.cityId]);

  return (
    <div className="border border-secondary/20 rounded-lg bg-white/50 dark:bg-foreground/5 transition-colors">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-lg font-mono font-bold text-secondary w-8 text-right">
          {ranking.rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground truncate">
            {ranking.cityName}
          </div>
          <div className="text-sm text-secondary capitalize">
            {ranking.description}
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm text-secondary">
            {ranking.temperature.toFixed(1)}°C
          </div>
        </div>

        <div className="text-right min-w-[3rem]">
          <div className={`font-mono text-lg font-bold ${scoreColor}`}>
            {ranking.comfort.total}
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-secondary transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-secondary/10 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <div className="text-secondary text-xs uppercase tracking-wide">
                Temperature
              </div>
              <div className="font-mono font-medium mt-1">
                {ranking.comfort.temperatureScore}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs uppercase tracking-wide">
                Humidity
              </div>
              <div className="font-mono font-medium mt-1">
                {ranking.comfort.humidityScore}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs uppercase tracking-wide">
                Wind
              </div>
              <div className="font-mono font-medium mt-1">
                {ranking.comfort.windScore}
              </div>
            </div>
            <div>
              <div className="text-secondary text-xs uppercase tracking-wide">
                Cloudiness
              </div>
              <div className="font-mono font-medium mt-1">
                {ranking.comfort.cloudinessScore}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowForecast(!showForecast);
            }}
            className="text-xs text-secondary border border-secondary/20 rounded px-3 py-1.5 hover:bg-secondary/10 transition-colors"
          >
            {showForecast ? "Hide 5-Day Trend" : "Show 5-Day Trend"}
          </button>

          {showForecast && (
            <div className="mt-4">
              {forecastLoading ? (
                <div className="h-64 flex items-center justify-center text-secondary text-sm">
                  Loading forecast...
                </div>
              ) : forecast ? (
                <CityChart forecast={forecast} />
              ) : (
                <div className="h-64 flex items-center justify-center text-secondary text-sm">
                  Forecast unavailable
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
