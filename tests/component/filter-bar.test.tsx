/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FilterBar } from "@/components/FilterBar";

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = MockResizeObserver;

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

  it("renders the sort listbox button with current selection label", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("Comfort Score")).toBeTruthy();
  });

  it("renders all comfort tier buttons", () => {
    render(<FilterBar {...defaultProps} />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const labels = buttons.map((b) => b.textContent?.trim());
    expect(labels).toContain("All");
    expect(labels).toContain("High");
    expect(labels).toContain("Moderate");
    expect(labels).toContain("Low");
  });

  it("opens the listbox and selects a new sort field", () => {
    const onSort = vi.fn();
    render(<FilterBar {...defaultProps} onSortFieldChange={onSort} />);

    const btn = screen.getByText("Comfort Score");
    fireEvent.click(btn);

    const options = screen.getAllByRole("option");
    const tempOption = options.find((o) => o.textContent === "Temperature")!;
    fireEvent.click(tempOption);

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

  it("renders the threshold legend", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText(/High: 70\+/)).toBeTruthy();
    expect(screen.getByText(/Moderate: 40/)).toBeTruthy();
    expect(screen.getByText(/Low:/)).toBeTruthy();
  });
});
