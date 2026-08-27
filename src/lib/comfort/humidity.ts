export function humidityScore(humidity: number): number {
  const idealMin = 30;
  const idealMax = 60;
  const acceptableMin = 10;
  const acceptableMax = 90;

  if (humidity >= idealMin && humidity <= idealMax) {
    return 1.0;
  }

  if (humidity < idealMin) {
    if (humidity <= acceptableMin) return 0.2;
    const range = idealMin - acceptableMin;
    const distance = idealMin - humidity;
    return 1 - (distance / range) * 0.8;
  }

  if (humidity > idealMax) {
    if (humidity >= acceptableMax) return 0;
    const range = acceptableMax - idealMax;
    const distance = humidity - idealMax;
    return 1 - (distance / range) * 1.0;
  }

  return 0;
}
