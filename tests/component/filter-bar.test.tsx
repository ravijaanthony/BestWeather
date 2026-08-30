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
Object.defineProperty(globalThis, "ResizeObserver", {
  value: MockResizeObserver,
  writable: true,
});

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

  it("renders the sort by label and current selection", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("Sort by")).toBeTruthy();
    expect(screen.getByText("Comfort Score")).toBeTruthy();
  });

  it("renders all comfort tier buttons with score ranges", () => {
    render(<FilterBar {...defaultProps} />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const labels = buttons.map((b) => b.textContent?.trim());
    expect(labels).toContain("All");
    expect(labels).toContain("High 70+");
    expect(labels).toContain("Mod 40–69");
    expect(labels).toContain("Low <40");
  });

  it("opens the listbox and selects a new sort field", () => {
    const onSort = vi.fn();
    render(<FilterBar {...defaultProps} onSortFieldChange={onSort} />);

    fireEvent.click(screen.getByText("Comfort Score"));

    const options = screen.getAllByRole("option");
    const tempOption = options.find((o) => o.textContent === "Temperature")!;
    fireEvent.click(tempOption);

    expect(onSort).toHaveBeenCalledWith("temperature");
  });

  it("shows DESC by default and calls onSortDirChange to flip to ASC", () => {
    const onDir = vi.fn();
    const { container } = render(
      <FilterBar {...defaultProps} onSortDirChange={onDir} />
    );
    expect(screen.getByText("DESC")).toBeTruthy();
    const btn = container.querySelector('button[aria-label]')!;
    fireEvent.click(btn);
    expect(onDir).toHaveBeenCalledWith("asc");
  });

  it("calls onComfortTierChange when tier button clicked", () => {
    const onTier = vi.fn();
    render(<FilterBar {...defaultProps} onComfortTierChange={onTier} />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const highBtn = buttons.find((b) => b.textContent?.trim() === "High 70+")!;
    fireEvent.click(highBtn);
    expect(onTier).toHaveBeenCalledWith("high");
  });

  it("highlights active comfort tier", () => {
    render(<FilterBar {...defaultProps} comfortTier="high" />);
    const buttons = Array.from(document.querySelectorAll("button"));
    const highBtn = buttons.find((b) => b.textContent?.trim() === "High 70+")!;
    expect(highBtn.className).toContain("font-medium");
  });
});
