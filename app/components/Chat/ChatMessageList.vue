<script setup lang="ts">
import type { Message } from "./Chat.vue";

export interface ChatMessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** Whether the chat is currently loading */
  loading?: boolean;
}

export interface ChatMessageListEmits {
  /** Emitted when user wants to regenerate a response */
  regenerateResponse: [];
}

const props = withDefaults(defineProps<ChatMessageListProps>(), {
  loading: false,
});

const emit = defineEmits<ChatMessageListEmits>();

const scrollAreaEl = useTemplateRef("scrollAreaEl");

// Auto-scroll to bottom when new messages arrive
watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (scrollAreaEl.value) {
        const viewport = scrollAreaEl.value.$el?.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    });
  }
);

const handleRegenerateResponse = () => {
  emit("regenerateResponse");
};
</script>

<template>
  <div class="flex-1 min-h-0 overflow-hidden">
    <UiScrollArea ref="scrollAreaEl" class="h-full">
      <div class="space-y-4 max-w-4xl mx-auto p-4">
        <!-- Messages -->
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @regenerate-response="handleRegenerateResponse"
        />

        <!-- Loading State -->
        <ChatMessage
          v-if="loading"
          :message="{
            id: 'loading',
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          }"
          :loading="true"
        />
      </div>
    </UiScrollArea>
  </div>
</template>
