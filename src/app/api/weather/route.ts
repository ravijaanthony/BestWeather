import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { fetchAllWeather } from "@/lib/weather/fetcher";
import { getCachedWeather, setCachedWeather } from "@/lib/cache/redis";
import citiesData from "@/data/cities.json";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cityIds = citiesData.List.map((c) => c.CityCode);

  const results = await Promise.all(
    cityIds.map(async (cityId) => {
      let weather = await getCachedWeather(cityId);

      if (!weather) {
        const fetched = await fetchAllWeather([cityId]);
        weather = fetched[0] ?? null;

        if (weather) {
          await setCachedWeather(cityId, weather);
        }
      }

      return weather;
    })
  );

  const weatherData = results.filter(
    (w): w is NonNullable<typeof w> => w !== null
  );

  return NextResponse.json({ weather: weatherData });
}
