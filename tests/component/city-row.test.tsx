// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CityRow } from "@/components/CityRow";
import type { CityRanking } from "@/types";

const mockRanking: CityRanking = {
  rank: 1,
  cityId: "2643743",
  cityName: "London",
  country: "GB",
  temperature: 9.5,
  humidity: 72,
  windSpeed: 4.2,
  cloudiness: 80,
  description: "overcast clouds",
  comfort: {
    temperatureScore: 85,
    humidityScore: 72,
    windScore: 68,
    cloudinessScore: 90,
    total: 80,
  },
};

describe("CityRow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders city name and rank", () => {
    render(<CityRow ranking={mockRanking} />);
    expect(screen.getByText("London")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("renders temperature and comfort score", () => {
    render(<CityRow ranking={mockRanking} />);
    expect(screen.getByText("9.5°C")).toBeTruthy();
    expect(screen.getByText("80")).toBeTruthy();
  });

  it("expands to show breakdown on click", () => {
    render(<CityRow ranking={mockRanking} />);
    fireEvent.click(screen.getByText("London"));
    expect(screen.getByText("Temperature Score")).toBeTruthy();
    expect(screen.getByText("Humidity Score")).toBeTruthy();
    expect(screen.getByText("Wind Score")).toBeTruthy();
    expect(screen.getByText("Cloudiness Score")).toBeTruthy();
  });

  it("shows forecast toggle button when expanded", () => {
    render(<CityRow ranking={mockRanking} />);
    fireEvent.click(screen.getByText("London"));
    expect(screen.getByText("Show 5-Day Trend")).toBeTruthy();
  });

  it("applies high-comfort color for scores >= 70", () => {
    render(<CityRow ranking={mockRanking} />);
    const score = screen.getByText("80");
    expect(score.className).toContain("text-high-comfort");
  });

  it("applies moderate color for scores 40-69", () => {
    const moderateRanking = {
      ...mockRanking,
      comfort: { ...mockRanking.comfort, total: 55 },
    };
    render(<CityRow ranking={moderateRanking} />);
    const score = screen.getByText("55");
    expect(score.className).toContain("text-moderate");
  });

  it("applies low-comfort color for scores < 40", () => {
    const lowRanking = {
      ...mockRanking,
      comfort: { ...mockRanking.comfort, total: 25 },
    };
    render(<CityRow ranking={lowRanking} />);
    const score = screen.getByText("25");
    expect(score.className).toContain("text-low-comfort");
  });
});
