import { describe, it, expect } from "vitest";
import { humidityScore } from "@/lib/comfort/humidity";

describe("humidityScore", () => {
  it("returns 1.0 for ideal humidity range (30-60%)", () => {
    expect(humidityScore(30)).toBe(1.0);
    expect(humidityScore(45)).toBe(1.0);
    expect(humidityScore(60)).toBe(1.0);
  });

  it("returns lower scores for very high humidity", () => {
    const score60 = humidityScore(60);
    const score80 = humidityScore(80);
    expect(score60).toBeGreaterThan(score80);
  });

  it("returns lower scores for very low humidity", () => {
    const score30 = humidityScore(30);
    const score15 = humidityScore(15);
    expect(score30).toBeGreaterThan(score15);
  });

  it("returns 0 for extremely high humidity (>=90%)", () => {
    expect(humidityScore(90)).toBe(0);
    expect(humidityScore(100)).toBe(0);
  });

  it("returns low score for extremely low humidity (<=10%)", () => {
    expect(humidityScore(10)).toBe(0.2);
    expect(humidityScore(0)).toBe(0.2);
  });

  it("returns values between 0 and 1", () => {
    for (const humidity of [0, 10, 20, 30, 45, 60, 70, 80, 90, 100]) {
      const score = humidityScore(humidity);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});
