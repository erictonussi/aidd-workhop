import { test, expect } from "@nuxt/test-utils/playwright";

test.describe("/conversations API endpoints", () => {
  let createdConversationId: number;

  test("CRUD + chat flow", async ({ page, goto }) => {
    await goto("/", { waitUntil: "hydration" });

    const createRes = await page.request.post("/api/conversations", {
      data: { title: "E2E Conversation" },
    });
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    expect(createBody.data.title).toBe("E2E Conversation");
    createdConversationId = createBody.data.id;

    const listRes = await page.request.get("/api/conversations");
    expect(listRes.status()).toBe(200);
    const listBody = await listRes.json();
    expect(Array.isArray(listBody.data)).toBeTruthy();

    const updateRes = await page.request.put(
      `/api/conversations/${createdConversationId}`,
      {
        data: { title: "Renamed Conversation" },
      }
    );
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.data.title).toBe("Renamed Conversation");

    const chatRes = await page.request.post("/api/chat/messages", {
      data: {
        conversationId: createdConversationId,
        content: "Hello from E2E",
      },
    });
    expect(chatRes.status()).toBe(200);
    const chatBody = await chatRes.json();
    expect(chatBody.data.userMessage.content).toBe("Hello from E2E");
    expect(chatBody.data.assistantMessage.role).toBe("assistant");

    const getRes = await page.request.get(`/api/conversations/${createdConversationId}`);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.data.messages.length).toBeGreaterThanOrEqual(2);

    const deleteRes = await page.request.delete(
      `/api/conversations/${createdConversationId}`
    );
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.data.deleted).toBeTruthy();
  });
});