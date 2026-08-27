import { describe, it, expect } from "vitest";
import { temperatureScore } from "@/lib/comfort/temperature";

describe("temperatureScore", () => {
  it("returns 1.0 for ideal temperature range (8-18°C)", () => {
    expect(temperatureScore(8)).toBe(1.0);
    expect(temperatureScore(12)).toBe(1.0);
    expect(temperatureScore(18)).toBe(1.0);
  });

  it("returns higher scores for temperatures closer to ideal", () => {
    const score5 = temperatureScore(5);
    const score2 = temperatureScore(2);
    expect(score5).toBeGreaterThan(score2);
  });

  it("returns lower scores for very hot temperatures", () => {
    const score25 = temperatureScore(25);
    const score35 = temperatureScore(35);
    expect(score25).toBeGreaterThan(score35);
  });

  it("returns 0 for extremely cold temperatures (<=0°C)", () => {
    expect(temperatureScore(0)).toBe(0);
    expect(temperatureScore(-10)).toBe(0);
  });

  it("returns 0 for extremely hot temperatures (>=30°C)", () => {
    expect(temperatureScore(30)).toBe(0);
    expect(temperatureScore(40)).toBe(0);
  });

  it("returns values between 0 and 1", () => {
    for (const temp of [-20, -10, 0, 5, 10, 15, 20, 25, 30, 40]) {
      const score = temperatureScore(temp);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});
