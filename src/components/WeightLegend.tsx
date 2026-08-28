export function WeightLegend() {
  const weights = [
    { label: "Temperature", weight: 45 },
    { label: "Humidity", weight: 25 },
    { label: "Wind", weight: 15 },
    { label: "Cloudiness", weight: 15 },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
      {weights.map((w) => (
        <div
          key={w.label}
          className="flex items-center gap-1.5 font-mono"
        >
          <span className="font-semibold text-foreground">{w.weight}%</span>
          <span className="text-secondary">{w.label}</span>
        </div>
      ))}
    </div>
  );
}
