import type { ForecastData, ForecastPoint } from "@/types";

const OWM_FORECAST_BASE = "https://api.openweathermap.org/data/2.5/forecast";

export async function fetchForecast(
  cityId: string
): Promise<ForecastData | null> {
  "use cache";

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${OWM_FORECAST_BASE}?id=${cityId}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    const points: ForecastPoint[] = data.list.map(
      (item: Record<string, unknown>) => {
        const main = item.main as Record<string, number>;
        const wind = item.wind as Record<string, number>;
        const clouds = item.clouds as Record<string, number>;
        const weather = (item.weather as Array<Record<string, string>>)[0];

        return {
          time: item.dt_txt as string,
          temperature: Math.round(main.temp * 10) / 10,
          humidity: main.humidity,
          windSpeed: wind.speed,
          cloudiness: clouds.all,
          description: weather.description,
        };
      }
    );

    return {
      cityId,
      cityName: data.city.name,
      points,
    };
  } catch {
    return null;
  }
}
