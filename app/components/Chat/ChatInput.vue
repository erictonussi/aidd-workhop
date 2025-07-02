<script setup lang="ts">
export interface ChatInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

export interface ChatInputEmits {
  /** Emitted when user sends a message */
  sendMessage: [content: string];
}

const props = withDefaults(defineProps<ChatInputProps>(), {
  placeholder: "Type your message...",
  disabled: false,
});

const emit = defineEmits<ChatInputEmits>();

const message = ref("");

const handleSubmit = () => {
  const content = message.value.trim();
  if (!content || props.disabled) return;

  emit("sendMessage", content);
  message.value = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
};
</script>

<template>
  <div class="p-4 border-t bg-background">
    <div class="max-w-4xl mx-auto">
      <div class="flex gap-2 items-end">
        <div class="flex-1 relative">
          <UiTextarea
            v-model="message"
            :placeholder="placeholder"
            :disabled="disabled"
            class="min-h-[44px] max-h-32 resize-none pr-12"
            rows="1"
            @keydown="handleKeydown"
          />

          <!-- Send Button (inside textarea) -->
          <UiButton
            :disabled="!message.trim() || disabled"
            size="sm"
            class="absolute right-2 bottom-2 h-8 w-8 p-0"
            @click="handleSubmit"
          >
            <Icon name="lucide:send" class="w-4 h-4" />
          </UiButton>
        </div>
      </div>

      <p class="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  </div>
</template>
