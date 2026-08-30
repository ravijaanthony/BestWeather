import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { fetchForecast } from "@/lib/weather/forecast";

export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cityId = request.nextUrl.searchParams.get("cityId");
  if (!cityId) {
    return NextResponse.json({ error: "Missing cityId" }, { status: 400 });
  }

  const forecast = await fetchForecast(cityId);
  return NextResponse.json({ forecast });
}
