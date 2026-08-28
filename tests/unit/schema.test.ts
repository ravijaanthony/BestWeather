import { describe, it, expect } from "vitest";
import { validateWeatherResponse } from "@/lib/weather/schema";

describe("validateWeatherResponse", () => {
  const validResponse = {
    coord: { lon: -0.1257, lat: 51.5085 },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04d",
      },
    ],
    main: {
      temp: 12.3,
      feels_like: 10.8,
      temp_min: 10.5,
      temp_max: 13.7,
      pressure: 1015,
      humidity: 81,
    },
    visibility: 10000,
    wind: {
      speed: 5.2,
      deg: 230,
    },
    clouds: {
      all: 90,
    },
    dt: 1715270400,
    sys: {
      country: "GB",
      sunrise: 1715230800,
      sunset: 1715284800,
    },
    timezone: 3600,
    id: 2643743,
    name: "London",
    cod: 200,
  };

  it("returns validated data for a valid response", () => {
    const result = validateWeatherResponse(validResponse);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("London");
    expect(result?.main.temp).toBe(12.3);
  });

  it("returns null for missing required fields", () => {
    const invalid = { ...validResponse, main: undefined };
    const result = validateWeatherResponse(invalid);
    expect(result).toBeNull();
  });

  it("returns null for invalid data types", () => {
    const invalid = { ...validResponse, main: { ...validResponse.main, temp: "not a number" } };
    const result = validateWeatherResponse(invalid);
    expect(result).toBeNull();
  });

  it("returns null for null input", () => {
    expect(validateWeatherResponse(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(validateWeatherResponse(undefined)).toBeNull();
  });

  it("handles missing optional visibility field", () => {
    const noVisibility = { ...validResponse };
    delete (noVisibility as Record<string, unknown>).visibility;
    const result = validateWeatherResponse(noVisibility);
    expect(result).not.toBeNull();
    expect(result?.visibility).toBe(10000);
  });
});
