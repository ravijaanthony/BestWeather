"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

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

const TIER_LABELS: Record<ComfortTier, string> = {
  all: "All",
  high: "High 70+",
  moderate: "Mod 40–69",
  low: "Low <40",
};

export function FilterBar({
  sortField,
  sortDir,
  comfortTier,
  onSortFieldChange,
  onSortDirChange,
  onComfortTierChange,
}: FilterBarProps) {
  const selected = SORT_OPTIONS.find((o) => o.value === sortField)!;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary uppercase tracking-wide">
            Sort by
          </label>
          <Listbox value={sortField} onChange={onSortFieldChange}>
            <div className="relative">
              <ListboxButton className="text-xs bg-transparent border border-secondary/20 rounded px-2 py-1 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-secondary/40 text-left min-w-0 sm:min-w-[130px]">
                {selected.label}
              </ListboxButton>
              <ListboxOptions className="absolute z-50 mt-1 w-full bg-background border border-secondary/20 rounded shadow-lg text-xs font-mono">
                {SORT_OPTIONS.map((opt) => (
                  <ListboxOption
                    key={opt.value}
                    value={opt.value}
                    className={({ active }) =>
                      `cursor-pointer px-2 py-1.5 ${
                        active ? "bg-secondary/10 text-foreground" : "text-secondary"
                      }`
                    }
                  >
                    {opt.label}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          <button
            onClick={() =>
              onSortDirChange(sortDir === "asc" ? "desc" : "asc")
            }
            className={`text-xs font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
              sortDir === "asc"
                ? "text-high-comfort border-high-comfort/30 bg-high-comfort/10"
                : "text-secondary border-secondary/20 hover:bg-secondary/10"
            }`}
            aria-label={
              sortDir === "asc"
                ? "Ascending order (lowest to highest)"
                : "Descending order (highest to lowest)"
            }
            title={
              sortDir === "asc"
                ? "Ascending — lowest to highest"
                : "Descending — highest to lowest"
            }
          >
            {sortDir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>

        <div className="h-4 w-px bg-secondary/20" />

        <div className="flex items-center gap-1.5">
          {COMFORT_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => onComfortTierChange(tier.value)}
              title={
                tier.value === "all"
                  ? "Show all cities"
                  : tier.value === "high"
                    ? "Comfort score 70 or higher"
                    : tier.value === "moderate"
                      ? "Comfort score 40 to 69"
                      : "Comfort score below 40"
              }
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                comfortTier === tier.value
                  ? tier.value === "all"
                    ? "bg-secondary/20 text-foreground font-medium"
                    : `${tier.color} font-medium`
                  : "text-secondary hover:bg-secondary/10"
              }`}
            >
              {TIER_LABELS[tier.value]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
