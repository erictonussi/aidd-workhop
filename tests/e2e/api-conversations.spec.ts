import { test, expect } from "@nuxt/test-utils/playwright";
import { $fetch } from "ofetch";

test.describe("/conversations API endpoints", () => {
  let createdConversationId: number;

  test("POST /conversations - should create a new conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.post("/api/conversations", {
      data: {
        title: "Test Conversation",
      },
    });

    expect(response.status()).toBe(201);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.title).toBe("Test Conversation");
    expect(responseData.data.id).toBeDefined();

    // Store the created conversation ID for other tests
    createdConversationId = responseData.data.id;
  });

  test("GET /conversations - should list conversations", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get("/api/conversations");
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(Array.isArray(responseData.data)).toBe(true);
    expect(responseData.pagination).toBeDefined();
    expect(responseData.pagination.page).toBe(1);
    expect(responseData.pagination.limit).toBe(20);
  });

  test("GET /conversations with search", async ({ page, goto }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get("/api/conversations?search=Test");
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(Array.isArray(responseData.data)).toBe(true);

    // Check if search results contain our test conversation
    const hasTestConversation = responseData.data.some((conv: any) =>
      conv.title.includes("Test")
    );
    expect(hasTestConversation).toBe(true);
  });

  test("GET /conversations/:id - should get a specific conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get(
      `/api/conversations/${createdConversationId}`
    );
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.id).toBe(createdConversationId);
    expect(responseData.data.title).toBe("Test Conversation");
  });

  test("GET /conversations/:id - should return 404 for non-existent conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get("/api/conversations/99999");
    expect(response.status()).toBe(404);
  });

  test("PUT /conversations/:id - should update a conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.put(
      `/api/conversations/${createdConversationId}`,
      {
        data: {
          title: "Updated Test Conversation",
        },
      }
    );

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.id).toBe(createdConversationId);
    expect(responseData.data.title).toBe("Updated Test Conversation");
  });

  test("PUT /conversations/:id - should return 404 for non-existent conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.put("/api/conversations/99999", {
      data: {
        title: "Should Not Work",
      },
    });

    expect(response.status()).toBe(404);
  });

  test("POST /conversations - should validate required fields", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.post("/api/conversations", {
      data: {},
    });

    expect(response.status()).toBe(422);
  });

  test("POST /conversations - should validate title length", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const longTitle = "a".repeat(300); // Exceeds 255 character limit
    const response = await page.request.post("/api/conversations", {
      data: {
        title: longTitle,
      },
    });

    expect(response.status()).toBe(422);
  });

  test("GET /conversations/:id/messages - should get messages for a conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get(
      `/api/conversations/${createdConversationId}/messages`
    );
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(Array.isArray(responseData.data)).toBe(true);
    expect(responseData.pagination).toBeDefined();
  });

  test("GET /conversations/:id/messages - should return 404 for non-existent conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.get(
      "/api/conversations/99999/messages"
    );
    expect(response.status()).toBe(404);
  });

  test("DELETE /conversations/:id - should delete a conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.delete(
      `/api/conversations/${createdConversationId}`
    );
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData.error).toBe(false);
    expect(responseData.data).toBeDefined();
    expect(responseData.data.deleted).toBe(true);
    expect(responseData.data.id).toBe(createdConversationId);
  });

  test("DELETE /conversations/:id - should return 404 for already deleted conversation", async ({
    page,
    goto,
  }) => {
    await goto("/", { waitUntil: "hydration" });

    const response = await page.request.delete(
      `/api/conversations/${createdConversationId}`
    );
    expect(response.status()).toBe(404);
  });
});
