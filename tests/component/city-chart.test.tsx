/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi, beforeAll } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CityChart } from "@/components/CityChart";
import type { ForecastData } from "@/types";

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = MockResizeObserver;

const mockForecast: ForecastData = {
  cityId: "2643743",
  cityName: "London",
  points: [
    {
      time: "2025-01-15 09:00:00",
      temperature: 8.5,
      humidity: 72,
      windSpeed: 4.2,
      cloudiness: 80,
      description: "overcast clouds",
    },
    {
      time: "2025-01-15 12:00:00",
      temperature: 10.2,
      humidity: 65,
      windSpeed: 3.8,
      cloudiness: 70,
      description: "broken clouds",
    },
    {
      time: "2025-01-15 15:00:00",
      temperature: 11.0,
      humidity: 60,
      windSpeed: 3.5,
      cloudiness: 60,
      description: "scattered clouds",
    },
  ],
};

describe("CityChart", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    const { container } = render(<CityChart forecast={mockForecast} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders the chart container with correct dimensions", () => {
    const { container } = render(<CityChart forecast={mockForecast} />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeTruthy();
    expect(wrapper!.className).toContain("w-full");
    expect(wrapper!.className).toContain("h-64");
  });

  it("renders empty forecast gracefully", () => {
    const emptyForecast: ForecastData = {
      ...mockForecast,
      points: [],
    };
    const { container } = render(<CityChart forecast={emptyForecast} />);
    expect(container.firstChild).toBeTruthy();
  });
});
