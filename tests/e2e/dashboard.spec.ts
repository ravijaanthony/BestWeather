import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("loads and displays the app title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Weather Comfort Analytics/);
  });

  test("displays the login heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Weather Comfort Analytics")).toBeVisible();
  });

  test("displays sign in button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sign in with Auth0")).toBeVisible();
  });

  test("displays the model explanation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Rewards cool, calm, overcast")
    ).toBeVisible();
  });

  test("displays weight legend", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("45%")).toBeVisible();
    await expect(page.getByText("Temp", { exact: true })).toBeVisible();
    await expect(page.getByText("25%")).toBeVisible();
    await expect(page.getByText("Humidity")).toBeVisible();
  });

  test("sign in link points to auth0 login", async ({ page }) => {
    await page.goto("/");
    const link = page.getByText("Sign in with Auth0");
    await expect(link).toHaveAttribute("href", "/auth/login");
  });

  test("responsive layout works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByText("Weather Comfort Analytics")).toBeVisible();
    await expect(page.getByText("Sign in with Auth0")).toBeVisible();
  });

  test("responsive layout works on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByText("Weather Comfort Analytics")).toBeVisible();
    await expect(page.getByText("Sign in with Auth0")).toBeVisible();
  });
});
