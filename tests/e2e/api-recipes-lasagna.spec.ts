import { test, expect } from "@playwright/test";

test.describe("Lasagna Recipe API", () => {
  test("should generate a classic lasagna recipe", async ({ request }) => {
    const response = await request.post("/api/recipes/lasagna", {
      data: {
        style: "classic",
        difficulty: "intermediate",
      },
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toBeDefined();
    expect(contentType!).toContain("application/json");

    // Since it's a streaming response, we need to handle it differently
    const responseText = await response.text();
    const lines = responseText
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    // Should have at least one JSON response
    expect(lines.length).toBeGreaterThan(0);

    // Parse the final complete response (last line)
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toBeDefined();
    const finalResponse = JSON.parse(lastLine!);

    // Verify the structure
    expect(finalResponse).toHaveProperty("recipe");
    expect(finalResponse.recipe).toHaveProperty("name");
    expect(finalResponse.recipe).toHaveProperty("ingredients");
    expect(finalResponse.recipe).toHaveProperty("steps");

    // Verify types
    expect(typeof finalResponse.recipe.name).toBe("string");
    expect(Array.isArray(finalResponse.recipe.ingredients)).toBe(true);
    expect(Array.isArray(finalResponse.recipe.steps)).toBe(true);

    // Verify content is not empty
    expect(finalResponse.recipe.name.length).toBeGreaterThan(0);
    expect(finalResponse.recipe.ingredients.length).toBeGreaterThan(0);
    expect(finalResponse.recipe.steps.length).toBeGreaterThan(0);
  });

  test("should generate a vegetarian lasagna recipe", async ({ request }) => {
    const response = await request.post("/api/recipes/lasagna", {
      data: {
        style: "vegetarian",
        difficulty: "beginner",
      },
    });

    expect(response.status()).toBe(200);

    const responseText = await response.text();
    const lines = responseText
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toBeDefined();
    const finalResponse = JSON.parse(lastLine!);

    // Should be a valid recipe with vegetarian content
    const recipeName = finalResponse.recipe.name.toLowerCase();
    expect(recipeName).toContain("vegetarian");
  });

  test("should handle default parameters", async ({ request }) => {
    const response = await request.post("/api/recipes/lasagna", {
      data: {},
    });

    expect(response.status()).toBe(200);

    const responseText = await response.text();
    const lines = responseText
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toBeDefined();
    const finalResponse = JSON.parse(lastLine!);

    // Should still generate a valid recipe with defaults
    expect(finalResponse).toHaveProperty("recipe");
    expect(finalResponse.recipe).toHaveProperty("name");
  });

  test("should reject invalid difficulty levels", async ({ request }) => {
    const response = await request.post("/api/recipes/lasagna", {
      data: {
        difficulty: "expert", // Invalid enum value
      },
    });

    expect(response.status()).toBe(422); // Validation error
  });
});
