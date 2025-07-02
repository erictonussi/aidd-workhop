<script setup lang="ts">
import type { Message, MessageSource } from "../types";

interface Props {
  /** The message data to display */
  message: Message;
  /** Whether to show message actions (copy, edit, etc.) */
  showActions?: boolean;
  /** Whether the message is currently being edited */
  isEditing?: boolean;
  /** Whether to show typing indicator for streaming responses */
  isStreaming?: boolean;
}

interface Emits {
  /** Triggered when user wants to copy message content or interact with message */
  (e: "copy", content: string): void;
  (e: "edit" | "delete" | "regenerate", messageId: string): void;
  (e: "source-click", source: MessageSource): void;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  isEditing: false,
  isStreaming: false,
});

const emit = defineEmits<Emits>();

const isUserMessage = computed(() => props.message.role === "user");
const isAssistantMessage = computed(() => props.message.role === "assistant");
</script>

<template>
  <div
    class="group flex gap-4 p-4 hover:bg-muted/50 transition-colors"
    :class="{
      'bg-muted/30': isUserMessage,
    }"
  >
    <!-- Message Avatar -->
    <ChatMessageAvatar :role="message.role" :avatar-url="message.avatarUrl" />

    <!-- Message Content Area -->
    <div class="flex-1 min-w-0 space-y-2">
      <!-- Message Content -->
      <ChatMessageContent
        :content="message.content"
        :is-streaming="isStreaming"
        :is-editing="isEditing"
      />

      <!-- Message Metadata -->
      <ChatMessageMeta
        :timestamp="message.timestamp"
        :sources="message.sources"
        :tokens-used="message.tokensUsed"
        :model="message.model"
        @source-click="emit('source-click', $event)"
      />

      <!-- Message Actions -->
      <ChatMessageActions
        v-if="showActions && !isEditing"
        :message-id="message.id"
        :content="message.content"
        :can-regenerate="isAssistantMessage"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @copy="emit('copy', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @regenerate="emit('regenerate', $event)"
      />
    </div>
  </div>
</template>
