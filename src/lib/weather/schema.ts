import { z } from "zod";
import type { RawWeatherResponse, WeatherData } from "@/types";

export const RawWeatherSchema = z.object({
  coord: z.object({ lon: z.number(), lat: z.number() }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  base: z.string().optional(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  visibility: z.number().optional().default(10000),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  clouds: z.object({ all: z.number() }),
  dt: z.number(),
  sys: z.object({
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number(),
});

export function validateWeatherResponse(
  data: unknown
): RawWeatherResponse | null {
  const result = RawWeatherSchema.safeParse(data);
  if (!result.success) return null;
  return result.data;
}

export function normalizeWeatherData(
  raw: RawWeatherResponse,
  cityId: string
): WeatherData {
  return {
    cityId,
    cityName: raw.name,
    country: raw.sys.country,
    temperature: raw.main.temp,
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    cloudiness: raw.clouds.all,
    visibility: raw.visibility ?? 10000,
    description: raw.weather[0]?.description ?? "N/A",
    icon: raw.weather[0]?.icon ?? "01d",
    dt: raw.dt,
  };
}
