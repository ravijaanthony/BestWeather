export function temperatureScore(temp: number): number {
  const idealMin = 8;
  const idealMax = 18;
  const comfortableMin = 0;
  const comfortableMax = 30;

  if (temp >= idealMin && temp <= idealMax) {
    return 1.0;
  }

  if (temp < idealMin) {
    if (temp <= comfortableMin) return 0;
    const range = idealMin - comfortableMin;
    const distance = idealMin - temp;
    return 1 - (distance / range) * 0.6;
  }

  if (temp > idealMax) {
    if (temp >= comfortableMax) return 0;
    const range = comfortableMax - idealMax;
    const distance = temp - idealMax;
    return 1 - (distance / range) * 0.8;
  }

  return 0;
}
