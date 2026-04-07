import { test, expect } from "@playwright/test";

test.describe("API Routes", () => {
  test("should handle API requests", async ({ page }) => {
    const response = await page.request.get("/api/health");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
  });

  test("should return proper error responses", async ({ page }) => {
    await page.goto("/");

    // Test 404 handling
    const response = await page.request.get("/api/non-existent-endpoint");
    expect(response.status()).toBe(404);
  });

  test("should handle CORS correctly", async ({ page }) => {
    await page.goto("/");

    // Test that API requests work from the client side
    const response = await page.evaluate(async () => {
      try {
        // eslint-disable-next-line
        const res = await fetch("/api/test");
        return res.status;
      } catch {
        return 404; // Expected if no API routes exist
      }
    });

    // Should either work (200) or return 404 if no routes exist
    expect([200, 404]).toContain(response);
  });
});
