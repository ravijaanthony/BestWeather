import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth/auth0", () => ({
  auth0: {
    getSession: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@/lib/weather/fetcher", () => ({
  fetchWeatherForCity: vi.fn().mockResolvedValue(null),
  fetchAllWeather: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/comfort", () => ({
  calculateComfortIndex: vi.fn().mockResolvedValue({
    temperatureScore: 50,
    humidityScore: 50,
    windScore: 50,
    cloudinessScore: 50,
    total: 50,
  }),
}));

import { GET as getRankings } from "@/app/api/rankings/route";
import { GET as getWeather } from "@/app/api/weather/route";

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
});
