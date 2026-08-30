/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FilterBar } from "@/components/FilterBar";

describe("FilterBar", () => {
  const defaultProps = {
    sortField: "comfort" as const,
    sortDir: "desc" as const,
    comfortTier: "all" as const,
    onSortFieldChange: vi.fn(),
    onSortDirChange: vi.fn(),
    onComfortTierChange: vi.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it("renders sort dropdown with all options", () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    const selects = container.querySelectorAll("select");
    expect(selects.length).toBe(1);
    expect(selects[0].children.length).toBe(6);
  });

  it("renders comfort tier buttons", () => {
    render(<FilterBar {...defaultProps} />);
    const buttons = document.querySelectorAll("button");
    const labels = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(labels).toContain("All");
    expect(labels).toContain("High");
    expect(labels).toContain("Moderate");
    expect(labels).toContain("Low");
  });

  it("calls onSortFieldChange when sort selection changes", () => {
    const onSort = vi.fn();
    const { container } = render(
      <FilterBar {...defaultProps} onSortFieldChange={onSort} />
    );
    fireEvent.change(container.querySelector("select")!, {
      target: { value: "temperature" },
    });
    expect(onSort).toHaveBeenCalledWith("temperature");
  });

  it("calls onSortDirChange when direction button clicked", () => {
    const onDir = vi.fn();
    const { container } = render(
      <FilterBar {...defaultProps} onSortDirChange={onDir} />
    );
    const btn = container.querySelector('button[aria-label]')!;
    fireEvent.click(btn);
    expect(onDir).toHaveBeenCalledWith("asc");
  });

  it("calls onComfortTierChange when tier button clicked", () => {
    const onTier = vi.fn();
    render(<FilterBar {...defaultProps} onComfortTierChange={onTier} />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const highBtn = buttons.find((b) => b.textContent?.trim() === "High")!;
    fireEvent.click(highBtn);
    expect(onTier).toHaveBeenCalledWith("high");
  });

  it("highlights active comfort tier", () => {
    render(<FilterBar {...defaultProps} comfortTier="high" />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const highBtn = buttons.find((b) => b.textContent?.trim() === "High")!;
    expect(highBtn.className).toContain("font-medium");
  });
});
