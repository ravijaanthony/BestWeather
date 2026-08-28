import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getCacheStatus } from "@/lib/cache/redis";
import citiesData from "@/data/cities.json";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statuses = await Promise.all(
    citiesData.List.map(async (city) => {
      const status = await getCacheStatus(city.CityCode);
      return {
        cityId: city.CityCode,
        cityName: city.CityName,
        ...status,
      };
    })
  );

  return NextResponse.json({ cache: statuses });
}
