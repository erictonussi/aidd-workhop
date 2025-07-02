<script setup lang="ts">
import { ref } from "vue";
import Chat, {
  type Message,
  type Conversation,
} from "~/components/Chat/Chat.vue";

const dummyConversations = ref<Conversation[]>([
  {
    id: "1",
    title: "Getting Started",
    lastMessage: "How do I set up the project?",
    timestamp: new Date(),
    messageCount: 2,
    isPinned: true,
  },
  {
    id: "2",
    title: "API Reference",
    lastMessage: "Show me the API docs.",
    timestamp: new Date(),
    messageCount: 1,
  },
]);

const dummyMessages = ref<Message[]>([
  {
    id: "m1",
    content:
      "How do I set up the project? I'm having trouble understanding the documentation and need some guidance on the best practices for getting started. This is a really long message to test word wrapping and overflow behavior with very long sentences that might otherwise cause horizontal scrolling or overflow issues in the chat interface.",
    role: "user",
    timestamp: new Date(),
  },
  {
    id: "m2",
    content:
      "To set up the project, clone the repo and run <code>ni</code> to install dependencies.",
    role: "assistant",
    timestamp: new Date(),
    codeBlocks: [
      {
        language: "bash",
        code: "git clone https://github.com/your/repo.git\ncd repo\nni",
      },
    ],
    citations: [
      {
        id: "doc1",
        title: "Setup Guide",
        url: "https://docs.example.com/setup",
        excerpt: "Follow these steps to set up the project...",
        relevance: 0.95,
      },
    ],
  },
]);

const sidebarOpen = ref(true);
const isResponding = ref(false);
const currentConversationId = ref("1");

function handleSendMessage(message: string) {
  dummyMessages.value.push({
    id: `m${dummyMessages.value.length + 1}`,
    content: message,
    role: "user",
    timestamp: new Date(),
  });
  isResponding.value = true;
  setTimeout(() => {
    dummyMessages.value.push({
      id: `m${dummyMessages.value.length + 1}`,
      content: "This is a dummy AI response.",
      role: "assistant",
      timestamp: new Date(),
    });
    isResponding.value = false;
  }, 1200);
}

function handleSelectConversation(conversationId: string) {
  currentConversationId.value = conversationId;
  // For demo, just reset messages
  dummyMessages.value = [
    {
      id: "m1",
      content: "How do I set up the project?",
      role: "user",
      timestamp: new Date(),
    },
  ];
}

function handleNewConversation() {
  const newId = `${dummyConversations.value.length + 1}`;
  dummyConversations.value.push({
    id: newId,
    title: `New Conversation ${newId}`,
    lastMessage: "",
    timestamp: new Date(),
    messageCount: 0,
  });
  currentConversationId.value = newId;
  dummyMessages.value = [];
}

function handleDeleteConversation(conversationId: string) {
  dummyConversations.value = dummyConversations.value.filter(
    (c) => c.id !== conversationId
  );
  if (currentConversationId.value === conversationId) {
    currentConversationId.value = dummyConversations.value[0]?.id || "";
    dummyMessages.value = [];
  }
}

function handleTogglePin(conversationId: string) {
  const conv = dummyConversations.value.find((c) => c.id === conversationId);
  if (conv) conv.isPinned = !conv.isPinned;
}

function handleUploadDocument(file: File) {
  alert(`Uploaded: ${file.name}`);
}

function handleRateMessage(messageId: string, rating: "up" | "down") {
  alert(`Rated message ${messageId}: ${rating}`);
}

function handleRegenerateMessage(messageId: string) {
  alert(`Regenerate message: ${messageId}`);
}

function handleCopyMessage(messageId: string) {
  alert(`Copied message: ${messageId}`);
}
</script>

<template>
  <div
    class="h-[80vh] max-w-4xl mx-auto my-8 border rounded-lg shadow bg-background"
  >
    <Chat
      :conversation-id="currentConversationId"
      :messages="dummyMessages"
      :conversations="dummyConversations"
      :sidebar-open="sidebarOpen"
      :is-responding="isResponding"
      :documents="[]"
      @send-message="(args_0) => handleSendMessage(args_0 as string)"
      @select-conversation="(args_0) => handleSelectConversation(args_0 as string)"
      @new-conversation="() => handleNewConversation()"
      @delete-conversation="(args_0) => handleDeleteConversation(args_0 as string)"
      @toggle-pin="(args_0) => handleTogglePin(args_0 as string)"
      @upload-document="handleUploadDocument"
      @rate-message="handleRateMessage"
      @regenerate-message="(args_0) => handleRegenerateMessage(args_0 as string)"
      @copy-message="(args_0) => handleCopyMessage(args_0 as string)"
      @update:sidebar-open="
        (args_0) => {
          sidebarOpen = !!args_0;
        }
      "
    />
  </div>
</template>

<style scoped></style>
