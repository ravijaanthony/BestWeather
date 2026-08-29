import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { fetchWeatherForCity } from "@/lib/weather/fetcher";
import citiesData from "@/data/cities.json";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cityIds = citiesData.List.map((c) => c.CityCode);

  const results = await Promise.all(
    cityIds.map((id) => fetchWeatherForCity(id))
  );

  const weatherData = results.filter(
    (w): w is NonNullable<typeof w> => w !== null
  );

  return NextResponse.json({ weather: weatherData });
}
