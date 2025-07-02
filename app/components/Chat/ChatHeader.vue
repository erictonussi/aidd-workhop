<script setup lang="ts">
export interface ChatHeaderProps {
  /** Number of messages in the chat */
  messageCount?: number;
}

export interface ChatHeaderEmits {
  /** Emitted when user wants to clear the chat */
  clearChat: [];
}

const props = withDefaults(defineProps<ChatHeaderProps>(), {
  messageCount: 0,
});

const emit = defineEmits<ChatHeaderEmits>();

const handleClearChat = () => {
  emit("clearChat");
};
</script>

<template>
  <div class="flex items-center justify-between p-4 border-b bg-muted/50">
    <div class="flex items-center gap-2">
      <Icon name="lucide:bot" class="w-5 h-5 text-primary" />
      <h2 class="font-semibold text-foreground">AI Assistant</h2>
      <UiBadge v-if="messageCount > 0" variant="secondary">
        {{ messageCount }} messages
      </UiBadge>
    </div>

    <UiButton
      variant="ghost"
      size="sm"
      :disabled="messageCount === 0"
      @click="handleClearChat"
    >
      <Icon name="lucide:trash-2" class="w-4 h-4" />
      Clear
    </UiButton>
  </div>
</template>
