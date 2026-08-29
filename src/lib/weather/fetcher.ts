import { validateWeatherResponse, normalizeWeatherData } from "./schema";
import type { WeatherData } from "@/types";

const OWM_BASE = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeatherForCity(
  cityId: string
): Promise<WeatherData | null> {
  "use cache";

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("OPENWEATHER_API_KEY is not set");
    return null;
  }

  try {
    const url = `${OWM_BASE}?id=${cityId}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `OWM API error for city ${cityId}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    const validated = validateWeatherResponse(data);

    if (!validated) {
      console.error(`Invalid OWM response for city ${cityId}`);
      return null;
    }

    return normalizeWeatherData(validated, cityId);
  } catch (error) {
    console.error(`Network error fetching city ${cityId}:`, error);
    return null;
  }
}

export async function fetchAllWeather(
  cityIds: string[]
): Promise<WeatherData[]> {
  const results = await Promise.allSettled(
    cityIds.map((id) => fetchWeatherForCity(id))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WeatherData> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}
