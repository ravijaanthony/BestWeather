import { describe, it, expect } from "vitest";
import { calculateComfortIndex } from "@/lib/comfort";

describe("calculateComfortIndex", () => {
  it("returns a score between 0 and 100", async () => {
    const result = await calculateComfortIndex(15, 50, 3, 70);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("returns high score for comfortable weather (cool, moderate humidity, light wind, cloudy)", async () => {
    const result = await calculateComfortIndex(12, 45, 3, 80);
    expect(result.total).toBeGreaterThanOrEqual(70);
  });

  it("returns low score for very hot weather", async () => {
    const result = await calculateComfortIndex(35, 30, 2, 10);
    expect(result.total).toBeLessThanOrEqual(50);
  });

  it("returns low score for very cold weather", async () => {
    const result = await calculateComfortIndex(-10, 50, 5, 50);
    expect(result.total).toBeLessThanOrEqual(55);
  });

  it("returns lower score for high humidity", async () => {
    const comfortable = await calculateComfortIndex(12, 45, 3, 70);
    const humid = await calculateComfortIndex(12, 85, 3, 70);
    expect(comfortable.total).toBeGreaterThan(humid.total);
  });

  it("returns lower score for strong wind", async () => {
    const calm = await calculateComfortIndex(12, 45, 3, 70);
    const windy = await calculateComfortIndex(12, 45, 15, 70);
    expect(calm.total).toBeGreaterThan(windy.total);
  });

  it("returns higher score for cloudy vs clear sky", async () => {
    const cloudy = await calculateComfortIndex(12, 45, 3, 80);
    const clear = await calculateComfortIndex(12, 45, 3, 5);
    expect(cloudy.total).toBeGreaterThan(clear.total);
  });

  it("includes all breakdown components", async () => {
    const result = await calculateComfortIndex(15, 50, 3, 70);
    expect(result).toHaveProperty("temperatureScore");
    expect(result).toHaveProperty("humidityScore");
    expect(result).toHaveProperty("windScore");
    expect(result).toHaveProperty("cloudinessScore");
    expect(result).toHaveProperty("total");
  });

  it("breakdown scores are between 0 and 100", async () => {
    const result = await calculateComfortIndex(15, 50, 3, 70);
    expect(result.temperatureScore).toBeGreaterThanOrEqual(0);
    expect(result.temperatureScore).toBeLessThanOrEqual(100);
    expect(result.humidityScore).toBeGreaterThanOrEqual(0);
    expect(result.humidityScore).toBeLessThanOrEqual(100);
    expect(result.windScore).toBeGreaterThanOrEqual(0);
    expect(result.windScore).toBeLessThanOrEqual(100);
    expect(result.cloudinessScore).toBeGreaterThanOrEqual(0);
    expect(result.cloudinessScore).toBeLessThanOrEqual(100);
  });

  it("final score is an integer", async () => {
    const result = await calculateComfortIndex(15, 50, 3, 70);
    expect(Number.isInteger(result.total)).toBe(true);
  });

  it("scores Dublin-like weather higher than Phoenix-like weather", async () => {
    const dublin = await calculateComfortIndex(9, 75, 5, 90);
    const phoenix = await calculateComfortIndex(35, 15, 2, 5);
    expect(dublin.total).toBeGreaterThan(phoenix.total);
  });

  it("clamps total to 100 maximum", async () => {
    const result = await calculateComfortIndex(12, 45, 3, 95);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("clamps total to 0 minimum", async () => {
    const result = await calculateComfortIndex(50, 100, 30, 0);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("handles zero wind speed", async () => {
    const result = await calculateComfortIndex(12, 45, 0, 70);
    expect(result.windScore).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("handles 100% humidity", async () => {
    const result = await calculateComfortIndex(12, 100, 3, 70);
    expect(result.humidityScore).toBeLessThanOrEqual(50);
  });

  it("handles 0% cloudiness", async () => {
    const result = await calculateComfortIndex(12, 45, 3, 0);
    expect(result.cloudinessScore).toBeLessThanOrEqual(50);
  });

  it("handles extreme cold with high wind", async () => {
    const result = await calculateComfortIndex(-20, 40, 20, 50);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("handles extreme heat with high humidity", async () => {
    const result = await calculateComfortIndex(45, 95, 1, 0);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("breakdown scores are integers", async () => {
    const result = await calculateComfortIndex(15, 50, 3, 70);
    expect(Number.isInteger(result.temperatureScore)).toBe(true);
    expect(Number.isInteger(result.humidityScore)).toBe(true);
    expect(Number.isInteger(result.windScore)).toBe(true);
    expect(Number.isInteger(result.cloudinessScore)).toBe(true);
  });

  it("weighting: temperature has highest impact", async () => {
    const good = await calculateComfortIndex(12, 50, 3, 50);
    const bad = await calculateComfortIndex(30, 50, 3, 50);
    const diff = good.total - bad.total;
    expect(diff).toBeGreaterThan(10);
  });
});
