"use client";

export type SortField =
  | "name"
  | "temperature"
  | "comfort"
  | "humidity"
  | "wind"
  | "cloudiness";
export type SortDir = "asc" | "desc";
export type ComfortTier = "all" | "high" | "moderate" | "low";

interface FilterBarProps {
  sortField: SortField;
  sortDir: SortDir;
  comfortTier: ComfortTier;
  onSortFieldChange: (field: SortField) => void;
  onSortDirChange: (dir: SortDir) => void;
  onComfortTierChange: (tier: ComfortTier) => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "comfort", label: "Comfort Score" },
  { value: "temperature", label: "Temperature" },
  { value: "name", label: "City Name" },
  { value: "humidity", label: "Humidity" },
  { value: "wind", label: "Wind" },
  { value: "cloudiness", label: "Cloudiness" },
];

const COMFORT_TIERS: { value: ComfortTier; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-secondary/10 text-secondary" },
  {
    value: "high",
    label: "High",
    color: "bg-high-comfort/15 text-high-comfort border border-high-comfort/30",
  },
  {
    value: "moderate",
    label: "Moderate",
    color: "bg-moderate/15 text-moderate border border-moderate/30",
  },
  {
    value: "low",
    label: "Low",
    color: "bg-low-comfort/15 text-low-comfort border border-low-comfort/30",
  },
];

export function FilterBar({
  sortField,
  sortDir,
  comfortTier,
  onSortFieldChange,
  onSortDirChange,
  onComfortTierChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs text-secondary uppercase tracking-wide">
          Sort
        </label>
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="text-xs bg-transparent border border-secondary/20 rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-secondary/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            onSortDirChange(sortDir === "asc" ? "desc" : "asc")
          }
          className="p-1 border border-secondary/20 rounded hover:bg-secondary/10 transition-colors"
          aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
        >
          <svg
            className={`w-3 h-3 text-secondary transition-transform ${
              sortDir === "desc" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      </div>

      <div className="h-4 w-px bg-secondary/20" />

      <div className="flex items-center gap-1.5">
        {COMFORT_TIERS.map((tier) => (
          <button
            key={tier.value}
            onClick={() => onComfortTierChange(tier.value)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              comfortTier === tier.value
                ? tier.value === "all"
                  ? "bg-secondary/20 text-foreground font-medium"
                  : `${tier.color} font-medium`
                : "text-secondary hover:bg-secondary/10"
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>
    </div>
  );
}
