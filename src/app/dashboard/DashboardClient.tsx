"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { CityRanking } from "@/types";
import { TopCityCard } from "@/components/TopCityCard";
import { CityRankingList } from "@/components/CityRankingList";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FilterBar,
  type SortField,
  type SortDir,
  type ComfortTier,
} from "@/components/FilterBar";

interface DashboardClientProps {
  userEmail: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}..@${domain}`;
}

export default function DashboardClient({
  userEmail,
}: DashboardClientProps) {
  const [rankings, setRankings] = useState<CityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("comfort");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [comfortTier, setComfortTier] = useState<ComfortTier>("all");

  useEffect(() => {
    fetch("/api/rankings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rankings");
        return res.json();
      })
      .then((data) => {
        setRankings(data.rankings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredRankings = useMemo(() => {
    let result = [...rankings];

    if (comfortTier !== "all") {
      result = result.filter((r) => {
        const score = r.comfort.total;
        if (comfortTier === "high") return score >= 70;
        if (comfortTier === "moderate") return score >= 40 && score < 70;
        if (comfortTier === "low") return score < 40;
        return true;
      });
    }

    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case "name":
          aVal = a.cityName.toLowerCase();
          bVal = b.cityName.toLowerCase();
          return sortDir === "asc"
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string);
        case "temperature":
          aVal = a.temperature;
          bVal = b.temperature;
          break;
        case "humidity":
          aVal = a.comfort.humidityScore;
          bVal = b.comfort.humidityScore;
          break;
        case "wind":
          aVal = a.comfort.windScore;
          bVal = b.comfort.windScore;
          break;
        case "cloudiness":
          aVal = a.comfort.cloudinessScore;
          bVal = b.comfort.cloudinessScore;
          break;
        case "comfort":
        default:
          aVal = a.comfort.total;
          bVal = b.comfort.total;
          break;
      }

      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [rankings, sortField, sortDir, comfortTier]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-secondary text-lg">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-low-comfort text-lg">Error: {error}</div>
        <Link href="/" className="text-secondary underline mt-2 text-sm">
          Back to login
        </Link>
      </div>
    );
  }

  const topCity = filteredRankings[0];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-secondary/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Weather Comfort Index
            </h1>
            <p className="text-secondary mt-1 text-sm sm:text-base">
              Rewards cool, calm, overcast — not just low temperatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {userEmail && (
              <div className="hidden sm:flex flex-col items-end text-right">
                <div className="text-xs text-secondary">
                  {maskEmail(userEmail)}
                </div>
              </div>
            )}
            <a
              href="/auth/logout"
              aria-label="Sign out"
              className="flex items-center gap-1.5 text-xs text-secondary border border-secondary/20 rounded px-3 py-1.5 hover:bg-secondary/10 transition-colors whitespace-nowrap"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {topCity && (
            <div className="mb-8">
              <TopCityCard city={topCity} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 mt-8">
            <h2 className="text-sm font-medium text-secondary uppercase tracking-wide">
              City Rankings
            </h2>
            <FilterBar
              sortField={sortField}
              sortDir={sortDir}
              comfortTier={comfortTier}
              onSortFieldChange={setSortField}
              onSortDirChange={setSortDir}
              onComfortTierChange={setComfortTier}
            />
          </div>

          {filteredRankings.length === 0 ? (
            <div className="text-center text-secondary py-8">
              No cities match the selected filters.
            </div>
          ) : (
            <CityRankingList rankings={filteredRankings} />
          )}
        </div>
      </main>
    </div>
  );
}
