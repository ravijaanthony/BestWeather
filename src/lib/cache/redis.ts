import Redis from "ioredis";
import type { WeatherData, ComfortBreakdown } from "@/types";

const CACHE_TTL = 300;

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      connectTimeout: 2000,
    });

    redis.on("error", () => {
      redis = null;
    });

    return redis;
  } catch {
    return null;
  }
}

export async function getCachedWeather(
  cityId: string
): Promise<WeatherData | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(`weather:${cityId}`);
    if (!data) return null;
    return JSON.parse(data) as WeatherData;
  } catch {
    return null;
  }
}

export async function setCachedWeather(
  cityId: string,
  data: WeatherData
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(`weather:${cityId}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    // Silently fail if Redis is unavailable
  }
}

export async function getCachedComfort(
  cityId: string
): Promise<ComfortBreakdown | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(`comfort:${cityId}`);
    if (!data) return null;
    return JSON.parse(data) as ComfortBreakdown;
  } catch {
    return null;
  }
}

export async function setCachedComfort(
  cityId: string,
  data: ComfortBreakdown
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(`comfort:${cityId}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    // Silently fail if Redis is unavailable
  }
}

export interface CacheStatus {
  weather: "HIT" | "MISS" | "UNAVAILABLE";
  comfort: "HIT" | "MISS" | "UNAVAILABLE";
  weatherTTL: number | null;
  comfortTTL: number | null;
}

export async function getCacheStatus(cityId: string): Promise<CacheStatus> {
  const client = getRedisClient();
  if (!client) {
    return {
      weather: "UNAVAILABLE",
      comfort: "UNAVAILABLE",
      weatherTTL: null,
      comfortTTL: null,
    };
  }

  try {
    const weatherTTL = await client.ttl(`weather:${cityId}`);
    const comfortTTL = await client.ttl(`comfort:${cityId}`);

    return {
      weather: weatherTTL > 0 ? "HIT" : "MISS",
      comfort: comfortTTL > 0 ? "HIT" : "MISS",
      weatherTTL: weatherTTL > 0 ? weatherTTL : null,
      comfortTTL: comfortTTL > 0 ? comfortTTL : null,
    };
  } catch {
    return {
      weather: "UNAVAILABLE",
      comfort: "UNAVAILABLE",
      weatherTTL: null,
      comfortTTL: null,
    };
  }
}
