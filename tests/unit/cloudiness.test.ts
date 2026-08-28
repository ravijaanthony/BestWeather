import { describe, it, expect } from "vitest";
import { cloudinessScore } from "@/lib/comfort/cloudiness";

describe("cloudinessScore", () => {
  it("returns 1.0 for high cloudiness (>=70%)", () => {
    expect(cloudinessScore(70)).toBe(1.0);
    expect(cloudinessScore(85)).toBe(1.0);
    expect(cloudinessScore(100)).toBe(1.0);
  });

  it("returns higher scores for more cloudiness", () => {
    const score20 = cloudinessScore(20);
    const score50 = cloudinessScore(50);
    const score80 = cloudinessScore(80);
    expect(score20).toBeLessThan(score50);
    expect(score50).toBeLessThan(score80);
  });

  it("returns 0 for 0% cloudiness", () => {
    expect(cloudinessScore(0)).toBe(0);
  });

  it("returns values between 0 and 1", () => {
    for (const clouds of [0, 10, 20, 40, 60, 70, 80, 100]) {
      const score = cloudinessScore(clouds);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});
