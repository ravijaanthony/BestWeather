import { describe, it, expect } from "vitest";
import { windScore } from "@/lib/comfort/wind";

describe("windScore", () => {
  it("returns 1.0 for ideal wind speed range (2-5 m/s)", () => {
    expect(windScore(2)).toBe(1.0);
    expect(windScore(3.5)).toBe(1.0);
    expect(windScore(5)).toBe(1.0);
  });

  it("returns lower scores for very strong wind", () => {
    const score5 = windScore(5);
    const score10 = windScore(10);
    expect(score5).toBeGreaterThan(score10);
  });

  it("returns lower scores for no wind", () => {
    const score2 = windScore(2);
    const score0 = windScore(0);
    expect(score2).toBeGreaterThan(score0);
  });

  it("returns 0.3 for zero wind speed", () => {
    expect(windScore(0)).toBe(0.3);
  });

  it("returns 0 for extremely strong wind (>=15 m/s)", () => {
    expect(windScore(15)).toBe(0);
    expect(windScore(20)).toBe(0);
  });

  it("returns values between 0 and 1", () => {
    for (const speed of [0, 1, 2, 3, 5, 8, 10, 15, 20]) {
      const score = windScore(speed);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});
