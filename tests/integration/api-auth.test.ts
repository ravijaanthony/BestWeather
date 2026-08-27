import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth/auth0", () => ({
  auth0: {
    getSession: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@/lib/weather/fetcher", () => ({
  fetchAllWeather: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/cache/redis", () => ({
  getCachedWeather: vi.fn().mockResolvedValue(null),
  setCachedWeather: vi.fn().mockResolvedValue(undefined),
  getCachedComfort: vi.fn().mockResolvedValue(null),
  setCachedComfort: vi.fn().mockResolvedValue(undefined),
  getCacheStatus: vi.fn().mockResolvedValue({
    weather: "UNAVAILABLE",
    comfort: "UNAVAILABLE",
    weatherTTL: null,
    comfortTTL: null,
  }),
}));

import { GET as getRankings } from "@/app/api/rankings/route";
import { GET as getWeather } from "@/app/api/weather/route";
import { GET as getCacheStatus } from "@/app/api/cache/status/route";

describe("API Routes - Authentication", () => {
  it("rankings endpoint returns 401 when not authenticated", async () => {
    const response = await getRankings();
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("weather endpoint returns 401 when not authenticated", async () => {
    const response = await getWeather();
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("cache status endpoint returns 401 when not authenticated", async () => {
    const response = await getCacheStatus();
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
