import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { fetchAllWeather } from "@/lib/weather/fetcher";
import {
  getCachedWeather,
  setCachedWeather,
  getCachedComfort,
  setCachedComfort,
} from "@/lib/cache/redis";
import { calculateComfortIndex } from "@/lib/comfort";
import citiesData from "@/data/cities.json";
import type { CityRanking } from "@/types";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cityIds = citiesData.List.map((c) => c.CityCode);
  const cityMap = new Map(
    citiesData.List.map((c) => [c.CityCode, c.CityName])
  );

  const rankings: CityRanking[] = [];

  for (const cityId of cityIds) {
    let weather = await getCachedWeather(cityId);

    if (!weather) {
      const fetched = await fetchAllWeather([cityId]);
      weather = fetched[0] ?? null;

      if (weather) {
        await setCachedWeather(cityId, weather);
      }
    }

    if (!weather) continue;

    let comfort = await getCachedComfort(cityId);

    if (!comfort) {
      comfort = calculateComfortIndex(
        weather.temperature,
        weather.humidity,
        weather.windSpeed,
        weather.cloudiness
      );
      await setCachedComfort(cityId, comfort);
    }

    rankings.push({
      rank: 0,
      cityId,
      cityName: cityMap.get(cityId) ?? weather.cityName,
      country: weather.country,
      temperature: weather.temperature,
      description: weather.description,
      comfort,
    });
  }

  rankings.sort((a, b) => b.comfort.total - a.comfort.total);
  rankings.forEach((r, i) => {
    r.rank = i + 1;
  });

  return NextResponse.json({ rankings });
}
