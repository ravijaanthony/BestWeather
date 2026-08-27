import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("loads and displays the comfort index title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Weather Comfort Analytics/);
  });

  test("redirects to dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("displays weight legend with correct percentages", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("45%")).toBeVisible();
    await expect(page.getByText("Temperature")).toBeVisible();
    await expect(page.getByText("25%")).toBeVisible();
    await expect(page.getByText("Humidity")).toBeVisible();
    await expect(page.getByText("15% Wind")).toBeVisible();
    await expect(page.getByText("15% Cloudiness")).toBeVisible();
  });

  test("displays the model explanation", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByText("Rewards cool, calm, overcast")
    ).toBeVisible();
  });

  test("responsive layout works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard");
    await expect(page.getByText("Weather Comfort Index")).toBeVisible();
  });

  test("responsive layout works on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard");
    await expect(page.getByText("Weather Comfort Index")).toBeVisible();
  });
});
