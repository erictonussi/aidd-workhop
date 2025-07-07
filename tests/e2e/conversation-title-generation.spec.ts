import { test, expect } from "@playwright/test";

test.describe("Conversation Title Generation", () => {
  test("should automatically generate title from first message", async ({
    request,
  }) => {
    // Create a new conversation without specifying a title
    const createResponse = await request.post("/api/conversations", {
      data: {},
    });

    expect(createResponse.status()).toBe(201);
    const { data: conversation } = await createResponse.json();
    expect(conversation.title).toBe("New Conversation");

    // Send the first message to the conversation
    const firstMessage =
      "I need help with setting up a Nuxt.js project with TypeScript";
    const chatResponse = await request.post(
      `/api/conversations/${conversation.id}/chat`,
      {
        data: { content: firstMessage },
      }
    );

    expect(chatResponse.status()).toBe(200);

    // Wait a moment for the title generation to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check that the conversation title has been updated
    const getResponse = await request.get(
      `/api/conversations/${conversation.id}`
    );
    expect(getResponse.status()).toBe(200);

    const { data: updatedConversation } = await getResponse.json();
    expect(updatedConversation.title).not.toBe("New Conversation");
    expect(updatedConversation.title.length).toBeGreaterThan(0);
    expect(updatedConversation.title.length).toBeLessThanOrEqual(50);

    // Clean up
    await request.delete(`/api/conversations/${conversation.id}`);
  });

  test("should not regenerate title for subsequent messages", async ({
    request,
  }) => {
    // Create a new conversation
    const createResponse = await request.post("/api/conversations", {
      data: {},
    });

    const { data: conversation } = await createResponse.json();

    // Send the first message
    await request.post(`/api/conversations/${conversation.id}/chat`, {
      data: { content: "How do I set up authentication?" },
    });

    // Wait for title generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get the generated title
    const firstGetResponse = await request.get(
      `/api/conversations/${conversation.id}`
    );
    const { data: conversationAfterFirst } = await firstGetResponse.json();
    const generatedTitle = conversationAfterFirst.title;

    // Send a second message
    await request.post(`/api/conversations/${conversation.id}/chat`, {
      data: { content: "What about authorization?" },
    });

    // Wait a moment and check title hasn't changed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const secondGetResponse = await request.get(
      `/api/conversations/${conversation.id}`
    );
    const { data: conversationAfterSecond } = await secondGetResponse.json();

    expect(conversationAfterSecond.title).toBe(generatedTitle);

    // Clean up
    await request.delete(`/api/conversations/${conversation.id}`);
  });

  test("should handle title generation failure gracefully", async ({
    request,
  }) => {
    // This test would need to simulate an API failure scenario
    // For now, we just verify the conversation still works even if title generation fails

    const createResponse = await request.post("/api/conversations", {
      data: {},
    });

    const { data: conversation } = await createResponse.json();

    // Send a message with very long content that might cause issues
    const longMessage = "A".repeat(1000);
    const chatResponse = await request.post(
      `/api/conversations/${conversation.id}/chat`,
      {
        data: { content: longMessage },
      }
    );

    // Chat should still work even if title generation fails
    expect(chatResponse.status()).toBe(200);

    // Clean up
    await request.delete(`/api/conversations/${conversation.id}`);
  });
});
