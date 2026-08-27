"use client";

import { useState } from "react";
import type { CityRanking } from "@/types";

interface CityRowProps {
  ranking: CityRanking;
}

export function CityRow({ ranking }: CityRowProps) {
  const [expanded, setExpanded] = useState(false);

  const scoreColor =
    ranking.comfort.total >= 70
      ? "text-high-comfort"
      : ranking.comfort.total >= 40
        ? "text-moderate"
        : "text-low-comfort";

  return (
    <div
      className="border border-secondary/20 rounded-lg bg-white/50 cursor-pointer transition-colors hover:bg-white/80"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 p-4">
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
      </div>

      {expanded && (
        <div className="border-t border-secondary/10 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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
      )}
    </div>
  );
}
