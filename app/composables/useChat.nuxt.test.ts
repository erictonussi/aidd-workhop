// @vitest-environment nuxt
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChat } from "./useChat";

describe("useChat", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("$fetch", fetchMock);
  });

  it("loads conversations and first thread", async () => {
    fetchMock
      .mockResolvedValueOnce({
        data: [{ id: 1, title: "Demo", created_at: new Date(), updated_at: new Date() }],
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          title: "Demo",
          created_at: new Date(),
          updated_at: new Date(),
          messages: [
            {
              id: 10,
              conversation_id: 1,
              role: "assistant",
              content: "Hello",
              created_at: new Date(),
            },
          ],
        },
      });

    const chat = useChat();
    await chat.loadConversations();

    expect(chat.conversations.value).toHaveLength(1);
    expect(chat.currentConversation.value?.id).toBe(1);
    expect(chat.messages.value).toHaveLength(1);
  });

  it("sends a message and appends dummy response", async () => {
    fetchMock
      .mockResolvedValueOnce({
        data: { id: 1, title: "Demo", created_at: new Date(), updated_at: new Date() },
      })
      .mockResolvedValueOnce({
        data: {
          conversationId: 1,
          userMessage: {
            id: 1,
            conversation_id: 1,
            role: "user",
            content: "Hi",
            created_at: new Date(),
          },
          assistantMessage: {
            id: 2,
            conversation_id: 1,
            role: "assistant",
            content: "Hello back",
            created_at: new Date(),
          },
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, title: "Demo", created_at: new Date(), updated_at: new Date() }],
      });

    const chat = useChat();
    await chat.createConversation("Demo");
    await chat.sendMessage("Hi");

    expect(chat.messages.value).toHaveLength(2);
    expect(chat.messages.value[0].role).toBe("user");
    expect(chat.messages.value[1].role).toBe("assistant");
  });
});
