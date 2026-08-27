export function windScore(speed: number): number {
  const idealMin = 2;
  const idealMax = 5;
  const acceptableMax = 15;

  if (speed >= idealMin && speed <= idealMax) {
    return 1.0;
  }

  if (speed < idealMin) {
    if (speed === 0) return 0.3;
    return 0.3 + (speed / idealMin) * 0.7;
  }

  if (speed > idealMax) {
    if (speed >= acceptableMax) return 0;
    const range = acceptableMax - idealMax;
    const distance = speed - idealMax;
    return 1 - (distance / range) * 1.0;
  }

  return 0;
}
