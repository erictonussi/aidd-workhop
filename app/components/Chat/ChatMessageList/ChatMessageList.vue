<script setup lang="ts">
import type { Message, MessageSource } from "../types";

interface Props {
  /** Array of messages to display */
  messages: Message[];
  /** Whether AI is currently loading/responding */
  isLoading?: boolean;
  /** Whether to auto-scroll to bottom on new messages */
  autoScroll?: boolean;
}

interface Emits {
  /** Triggered when user wants to copy message */
  (e: "message-copy", content: string): void;
  /** Triggered when user wants to edit message */
  (e: "message-edit", messageId: string): void;
  /** Triggered when user wants to delete message */
  (e: "message-delete", messageId: string): void;
  /** Triggered when user wants to regenerate AI response */
  (e: "message-regenerate", messageId: string): void;
  /** Triggered when user clicks on source citation */
  (e: "source-click", source: MessageSource): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  autoScroll: true,
});

const emit = defineEmits<Emits>();

// Template refs
const scrollContainerEl = ref<HTMLElement>();
const messagesEndEl = ref<HTMLElement>();

// State
const userHasScrolled = ref(false);
const isNearBottom = ref(true);

// Auto-scroll functionality
const scrollToBottom = (smooth = true) => {
  if (!messagesEndEl.value) return;

  messagesEndEl.value.scrollIntoView({
    behavior: smooth ? "smooth" : "instant",
    block: "end",
  });
};

// Check if user is near bottom of scroll
const checkScrollPosition = () => {
  if (!scrollContainerEl.value) return;

  const element = scrollContainerEl.value;
  const threshold = 100; // pixels from bottom

  isNearBottom.value =
    element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
};

// Handle scroll events
const handleScroll = () => {
  userHasScrolled.value = true;
  checkScrollPosition();
};

// Watch for new messages and auto-scroll if needed
watch(
  () => props.messages.length,
  (newLength, oldLength) => {
    if (
      newLength > oldLength &&
      props.autoScroll &&
      (isNearBottom.value || !userHasScrolled.value)
    ) {
      nextTick(() => {
        scrollToBottom(true);
      });
    }
  }
);

// Watch for loading state changes
watch(
  () => props.isLoading,
  (isLoading) => {
    if (!isLoading && props.autoScroll && isNearBottom.value) {
      nextTick(() => {
        scrollToBottom(true);
      });
    }
  }
);

// Event handlers
const handleMessageCopy = (content: string) => {
  emit("message-copy", content);
};

const handleMessageEdit = (messageId: string) => {
  emit("message-edit", messageId);
};

const handleMessageDelete = (messageId: string) => {
  emit("message-delete", messageId);
};

const handleMessageRegenerate = (messageId: string) => {
  emit("message-regenerate", messageId);
};

const handleSourceClick = (source: MessageSource) => {
  emit("source-click", source);
};

// Initialize scroll position
onMounted(() => {
  if (props.messages.length > 0) {
    nextTick(() => {
      scrollToBottom(false);
    });
  }
});
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Messages Container -->
    <div
      ref="scrollContainerEl"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-0"
      @scroll="handleScroll"
    >
      <!-- Empty State -->
      <div
        v-if="messages.length === 0 && !isLoading"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center space-y-4 max-w-md">
          <Icon
            name="lucide:message-circle"
            class="w-12 h-12 mx-auto text-muted-foreground"
          />
          <div>
            <h3 class="text-lg font-medium">Start a conversation</h3>
            <p class="text-sm text-muted-foreground">
              Ask a question or upload documents to begin chatting with your AI
              assistant.
            </p>
          </div>
        </div>
      </div>

      <!-- Message List -->
      <div v-else class="space-y-0">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @copy="handleMessageCopy"
          @edit="handleMessageEdit"
          @delete="handleMessageDelete"
          @regenerate="handleMessageRegenerate"
          @source-click="handleSourceClick"
        />

        <!-- Typing Indicator -->
        <ChatTypingIndicator v-if="isLoading" />
      </div>

      <!-- Scroll anchor -->
      <div ref="messagesEndEl" class="h-0" />
    </div>

    <!-- Scroll to Bottom Button -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="!isNearBottom && messages.length > 0"
        class="absolute bottom-20 right-6 z-10"
      >
        <UiButton
          size="sm"
          variant="outline"
          class="rounded-full shadow-lg bg-background/95 backdrop-blur"
          @click="scrollToBottom(true)"
        >
          <Icon name="lucide:arrow-down" class="w-4 h-4" />
        </UiButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
