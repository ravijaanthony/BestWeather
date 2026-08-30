import type { ForecastData, ForecastPoint } from "@/types";
import { calculateComfortIndex } from "@/lib/comfort";

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
    const points: ForecastPoint[] = await Promise.all(
      data.list.map(
        async (item: Record<string, unknown>) => {
          const main = item.main as Record<string, number>;
          const wind = item.wind as Record<string, number>;
          const clouds = item.clouds as Record<string, number>;
          const weather = (item.weather as Array<Record<string, string>>)[0];

          const temp = Number(main.temp.toFixed(1));
          const humidity = main.humidity;
          const windSpeed = Number(wind.speed.toFixed(1));
          const cloudiness = clouds.all;

          const comfort = await calculateComfortIndex(
            temp,
            humidity,
            windSpeed,
            cloudiness
          );

          return {
            time: item.dt_txt as string,
            temperature: temp,
            humidity,
            windSpeed,
            cloudiness,
            description: weather.description,
            score: comfort.total,
          };
        }
      )
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
