import type {
  ApiEnvelope,
  ChatMessage,
  Conversation,
  ConversationWithMessages,
} from "~/shared/chat/types";

interface PaginatedConversations {
  data: Conversation[];
}

export function useChat() {
  const conversations = useState<Conversation[]>("chat:conversations", () => []);
  const currentConversation = useState<Conversation | null>(
    "chat:currentConversation",
    () => null
  );
  const messages = useState<ChatMessage[]>("chat:messages", () => []);
  const isLoading = useState<boolean>("chat:isLoading", () => false);
  const error = useState<string | null>("chat:error", () => null);

  async function loadConversations() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<ApiEnvelope<Conversation[]> & PaginatedConversations>(
        "/api/conversations"
      );
      conversations.value = response.data;

      if (!currentConversation.value && conversations.value.length > 0) {
        await loadConversation(conversations.value[0].id);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load conversations";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadConversation(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<ApiEnvelope<ConversationWithMessages>>(
        `/api/conversations/${id}`
      );
      currentConversation.value = {
        id: response.data.id,
        title: response.data.title,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };
      messages.value = response.data.messages;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load conversation";
    } finally {
      isLoading.value = false;
    }
  }

  async function createConversation(title?: string) {
    error.value = null;
    try {
      const response = await $fetch<ApiEnvelope<Conversation>>("/api/conversations", {
        method: "POST",
        body: { title },
      });
      conversations.value = [response.data, ...conversations.value];
      currentConversation.value = response.data;
      messages.value = [];
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create conversation";
      throw err;
    }
  }

  async function updateConversation(id: number, title: string) {
    error.value = null;
    try {
      const response = await $fetch<ApiEnvelope<Conversation>>(`/api/conversations/${id}`, {
        method: "PUT",
        body: { title },
      });

      conversations.value = conversations.value.map((conversation) =>
        conversation.id === id ? response.data : conversation
      );
      if (currentConversation.value?.id === id) {
        currentConversation.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update conversation";
      throw err;
    }
  }

  async function deleteConversation(id: number) {
    error.value = null;
    try {
      await $fetch<ApiEnvelope<{ id: number; deleted: boolean }>>(
        `/api/conversations/${id}`,
        { method: "DELETE" }
      );
      conversations.value = conversations.value.filter(
        (conversation) => conversation.id !== id
      );

      if (currentConversation.value?.id === id) {
        currentConversation.value = null;
        messages.value = [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete conversation";
      throw err;
    }
  }

  async function sendMessage(content: string) {
    if (!currentConversation.value) {
      await createConversation("New conversation");
    }

    if (!currentConversation.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<
        ApiEnvelope<{
          conversationId: number;
          userMessage: ChatMessage;
          assistantMessage: ChatMessage;
        }>
      >("/api/chat/messages", {
        method: "POST",
        body: {
          conversationId: currentConversation.value.id,
          content,
        },
      });

      messages.value = [
        ...messages.value,
        response.data.userMessage,
        response.data.assistantMessage,
      ];
      await loadConversations();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to send message";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function resetConversation() {
    currentConversation.value = null;
    messages.value = [];
    error.value = null;
  }

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    loadConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    sendMessage,
    resetConversation,
  };
}
