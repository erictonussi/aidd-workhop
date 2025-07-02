<script setup lang="ts">
import type { Message } from "~/components/Chat/Chat.vue";

// Dummy data for testing
const messages = ref<Message[]>([
  {
    id: "1",
    role: "user",
    content: "Hello! Can you help me understand how to use Vue composables?",
    timestamp: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "2",
    role: "assistant",
    content: `Sure! Vue composables are reusable functions that encapsulate reactive state and logic. Here's a simple example:

\`\`\`javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const isEven = computed(() => count.value % 2 === 0)
  
  return {
    count,
    increment,
    decrement,
    isEven
  }
}
\`\`\`

This composable can be used in any component to manage counter state.`,
    timestamp: new Date("2024-01-15T10:00:30Z"),
    sources: ["Vue 3 Documentation", "Composables Guide"],
  },
]);

const loading = ref(false);

const handleSendMessage = async (content: string) => {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content,
    timestamp: new Date(),
  };
  messages.value.push(userMessage);

  // Simulate AI response
  loading.value = true;

  setTimeout(() => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Thanks for your question: "${content}". This is a simulated response. In a real implementation, this would be powered by the Vercel AI SDK and your custom documentation.`,
      timestamp: new Date(),
      sources: ["Documentation Example"],
    };
    messages.value.push(assistantMessage);
    loading.value = false;
  }, 2000);
};

const handleRegenerateResponse = () => {
  if (messages.value.length > 0) {
    // Remove last assistant message and regenerate
    const lastMessage = messages.value[messages.value.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      messages.value.pop();
      loading.value = true;

      setTimeout(() => {
        const regeneratedMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "This is a regenerated response with different content. The AI has reconsidered its previous answer.",
          timestamp: new Date(),
          sources: ["Updated Documentation"],
        };
        messages.value.push(regeneratedMessage);
        loading.value = false;
      }, 1500);
    }
  }
};

const handleClearChat = () => {
  messages.value = [];
};
</script>

<template>
  <div class="container mx-auto p-4 h-screen flex flex-col">
    <div class="mb-6 flex-shrink-0">
      <h1 class="text-3xl font-bold mb-2">Chat Component Demo</h1>
      <p class="text-muted-foreground">
        Test the AI chat interface with simulated responses
      </p>
    </div>

    <div class="border rounded-lg flex-1 min-h-0 mb-4">
      <Chat
        :messages="messages"
        :loading="loading"
        placeholder="Ask me anything about Vue, Nuxt, or documentation..."
        @send-message="handleSendMessage"
        @regenerate-response="handleRegenerateResponse"
        @clear-chat="handleClearChat"
      />
    </div>

    <div class="p-4 bg-muted rounded-lg flex-shrink-0">
      <h3 class="font-semibold mb-2">Demo Features:</h3>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>Send messages and receive simulated AI responses</li>
        <li>Messages include source citations</li>
        <li>Regenerate last AI response</li>
        <li>Clear chat history</li>
        <li>Auto-scrolling message list</li>
        <li>Loading states and animations</li>
      </ul>
    </div>
  </div>
</template>
