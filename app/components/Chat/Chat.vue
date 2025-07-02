<script setup lang="ts">
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatProps {
  /** Array of messages to display */
  messages?: Message[];
  /** Whether the chat is currently loading/thinking */
  loading?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the chat input is disabled */
  disabled?: boolean;
}

export interface ChatEmits {
  /** Emitted when user sends a message */
  sendMessage: [content: string];
  /** Emitted when user wants to regenerate last response */
  regenerateResponse: [];
  /** Emitted when user clears the chat */
  clearChat: [];
}

const props = withDefaults(defineProps<ChatProps>(), {
  messages: () => [],
  loading: false,
  placeholder: "Ask me anything about your documentation...",
  disabled: false,
});

const emit = defineEmits<ChatEmits>();

const handleSendMessage = (content: string) => {
  emit("sendMessage", content);
};

const handleRegenerateResponse = () => {
  emit("regenerateResponse");
};

const handleClearChat = () => {
  emit("clearChat");
};
</script>

<template>
  <div class="flex flex-col h-full bg-background overflow-hidden">
    <!-- Chat Header -->
    <ChatHeader
      :message-count="messages.length"
      @clear-chat="handleClearChat"
    />

    <!-- Message List -->
    <ChatMessageList
      :messages="messages"
      :loading="loading"
      class="flex-1 min-h-0"
      @regenerate-response="handleRegenerateResponse"
    />

    <!-- Chat Input -->
    <div class="flex-shrink-0">
      <ChatInput
        :placeholder="placeholder"
        :disabled="disabled || loading"
        @send-message="handleSendMessage"
      />
    </div>
  </div>
</template>
