import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("displays the homepage correctly", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads and displays the expected content
    await expect(
      page.getByRole("heading", { name: "Welcome to Our Blog" })
    ).toBeVisible();

    // Check that the page title is set correctly
    await expect(page).toHaveTitle(/home/i);
  });

  test("navigates to playground page", async ({ page }) => {
    await page.goto("/");

    // Navigate to playground if there's a link
    if ((await page.locator('a[href="/playground"]').count()) > 0) {
      await page.click('a[href="/playground"]');
      await expect(page).toHaveURL(/.*playground.*/);
    }
  });

  test("page is responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Welcome to Our Blog" })
    ).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(
      page.getByRole("heading", { name: "Welcome to Our Blog" })
    ).toBeVisible();
  });
});
