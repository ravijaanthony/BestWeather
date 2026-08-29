import { temperatureScore } from "./temperature";
import { humidityScore } from "./humidity";
import { windScore } from "./wind";
import { cloudinessScore } from "./cloudiness";
import type { ComfortBreakdown } from "@/types";

export async function calculateComfortIndex(
  temperature: number,
  humidity: number,
  windSpeed: number,
  cloudiness: number
): Promise<ComfortBreakdown> {
  "use cache";

  const tempScore = temperatureScore(temperature);
  const humScore = humidityScore(humidity);
  const windSc = windScore(windSpeed);
  const cloudSc = cloudinessScore(cloudiness);

  const total = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        100 *
          (0.45 * tempScore +
            0.25 * humScore +
            0.15 * windSc +
            0.15 * cloudSc)
      )
    )
  );

  return {
    temperatureScore: Math.round(tempScore * 100),
    humidityScore: Math.round(humScore * 100),
    windScore: Math.round(windSc * 100),
    cloudinessScore: Math.round(cloudSc * 100),
    total,
  };
}
