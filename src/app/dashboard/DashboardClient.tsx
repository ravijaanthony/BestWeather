"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CityRanking } from "@/types";
import { ComfortGauge } from "@/components/ComfortGauge";
import { WeightLegend } from "@/components/WeightLegend";
import { CityRankingList } from "@/components/CityRankingList";

interface DashboardClientProps {
  userName: string;
  userEmail: string;
  userPicture: string;
}

export default function DashboardClient({
  userName,
  userEmail,
  userPicture,
}: DashboardClientProps) {
  const [rankings, setRankings] = useState<CityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const topCity = rankings[0];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-secondary/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Weather Comfort Index
            </h1>
            <p className="text-secondary mt-1 text-sm sm:text-base">
              Rewards cool, calm, overcast — not just low temperatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="text-sm font-medium text-foreground">
                {userName}
              </div>
              <div className="text-xs text-secondary">{userEmail}</div>
            </div>
            {userPicture && (
              <Image
                src={userPicture}
                alt={userName}
                width={36}
                height={36}
                className="rounded-full border border-secondary/20"
              />
            )}
            <a
              href="/auth/logout"
              className="text-xs text-secondary border border-secondary/30 rounded px-3 py-1.5 hover:bg-secondary/10 transition-colors"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <WeightLegend />

          {topCity && (
            <div className="mb-8 mt-8">
              <h2 className="text-sm font-medium text-secondary uppercase tracking-wide mb-4">
                Most Comfortable City
              </h2>
              <ComfortGauge
                score={topCity.comfort.total}
                cityName={topCity.cityName}
              />
            </div>
          )}

          <h2 className="text-sm font-medium text-secondary uppercase tracking-wide mb-4">
            City Rankings
          </h2>
          <CityRankingList rankings={rankings} />
        </div>
      </main>

      <footer className="border-t border-secondary/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center text-xs text-secondary">
          Comfort Index: 45% Temperature, 25% Humidity, 15% Wind, 15%
          Cloudiness
        </div>
      </footer>
    </div>
  );
}
