import { describe, it, expect } from "vitest";

describe("Comfort Index ranking correctness", () => {
  it("Dublin-like weather scores higher than Phoenix-like weather", async () => {
    const { calculateComfortIndex } = await import("@/lib/comfort");
    const dublin = await calculateComfortIndex(9, 75, 5, 90);
    const phoenix = await calculateComfortIndex(35, 15, 2, 5);
    expect(dublin.total).toBeGreaterThan(phoenix.total);
  });

  it("Bergen-like weather scores higher than Dubai-like weather", async () => {
    const { calculateComfortIndex } = await import("@/lib/comfort");
    const bergen = await calculateComfortIndex(6, 80, 6, 95);
    const dubai = await calculateComfortIndex(38, 20, 3, 5);
    expect(bergen.total).toBeGreaterThan(dubai.total);
  });

  it("ranking order is determined by comfort score, not hardcoded", async () => {
    const { calculateComfortIndex } = await import("@/lib/comfort");

    const cities = [
      { name: "Colombo", temp: 33, humidity: 80, wind: 3, clouds: 60 },
      { name: "Tokyo", temp: 8.6, humidity: 50, wind: 4, clouds: 20 },
      { name: "Liverpool", temp: 16.5, humidity: 75, wind: 6, clouds: 85 },
      { name: "Paris", temp: 22.4, humidity: 45, wind: 3, clouds: 10 },
      { name: "Sydney", temp: 27.3, humidity: 70, wind: 5, clouds: 65 },
      { name: "Boston", temp: 4.2, humidity: 65, wind: 7, clouds: 80 },
      { name: "Shanghai", temp: 10.1, humidity: 60, wind: 4, clouds: 70 },
      { name: "Oslo", temp: -3.9, humidity: 55, wind: 3, clouds: 30 },
      { name: "Dublin", temp: 9, humidity: 75, wind: 5, clouds: 90 },
      { name: "Bergen", temp: 6, humidity: 80, wind: 6, clouds: 95 },
    ];

    const ranked = await Promise.all(
      cities.map(async (c) => ({
        ...c,
        comfort: await calculateComfortIndex(c.temp, c.humidity, c.wind, c.clouds),
      }))
    );
    ranked.sort((a, b) => b.comfort.total - a.comfort.total);

    expect(ranked[0].name).not.toBe("Colombo");
    expect(ranked[ranked.length - 1].name).not.toBe("Dublin");

    const scores = ranked.map((c) => c.comfort.total);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
    }
  });
});
