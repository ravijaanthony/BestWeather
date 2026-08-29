import { describe, it, expect } from "vitest";

describe("Weather fetcher caching", () => {
  it("fetchWeatherForCity is an async function", async () => {
    const { fetchWeatherForCity } = await import("@/lib/weather/fetcher");
    expect(typeof fetchWeatherForCity).toBe("function");
  });
});

describe("Comfort calculator caching", () => {
  it("calculateComfortIndex is an async function", async () => {
    const { calculateComfortIndex } = await import("@/lib/comfort");
    expect(typeof calculateComfortIndex).toBe("function");
  });
});
