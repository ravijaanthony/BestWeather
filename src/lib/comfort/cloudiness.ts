export function cloudinessScore(clouds: number): number {
  if (clouds >= 70) return 1.0;
  if (clouds >= 40) return 0.7 + ((clouds - 40) / 30) * 0.3;
  if (clouds >= 10) return 0.3 + ((clouds - 10) / 30) * 0.4;
  return (clouds / 10) * 0.3;
}
