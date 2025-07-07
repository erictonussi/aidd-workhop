<script setup lang="ts">
/**
 * Component to display the list of messages in a conversation
 */

interface Props {
  /** The conversation ID to fetch messages for */
  conversationId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Emitted when a new message is received */
  messageReceived: [];
}>();

// State for streaming message
const streamingMessage = ref<string>("");
const isStreaming = ref(false);

// Fetch messages for this conversation with reactive key
const {
  data: messagesResponse,
  pending,
  error,
  refresh,
} = useFetch(() => `/api/conversations/${props.conversationId}/messages`, {
  key: `messages-${props.conversationId}`,
});

// Extract messages from response and ensure it's an array
const messages = computed(() => {
  const data = messagesResponse.value?.data;
  return Array.isArray(data) ? data : [];
});

// Ref for the scrollable container
const messagesContainerRef = ref<HTMLDivElement>();

/**
 * Scrolls to the bottom of the messages list
 */
function scrollToBottom() {
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop =
      messagesContainerRef.value.scrollHeight;
  }
}

/**
 * Refreshes the messages list
 */
function refreshMessages() {
  refresh();
  emit("messageReceived");
}

/**
 * Starts streaming a new message
 */
function startStreaming() {
  streamingMessage.value = "";
  isStreaming.value = true;
}

/**
 * Adds text to the streaming message
 */
function addToStream(text: string) {
  streamingMessage.value += text;
  nextTick(() => {
    scrollToBottom();
  });
}

/**
 * Ends streaming and refreshes messages
 */
function endStreaming() {
  isStreaming.value = false;
  streamingMessage.value = "";
  refreshMessages();
}

// Expose methods to parent components
defineExpose({
  scrollToBottom,
  refresh: refreshMessages,
  startStreaming,
  addToStream,
  endStreaming,
});

// Auto-scroll when messages change
watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// Auto-scroll on mount
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template>
  <div ref="messagesContainerRef" class="h-full overflow-y-auto p-4 space-y-4">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-8">
      <Icon
        name="lucide:loader-2"
        class="w-6 h-6 animate-spin text-muted-foreground"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center py-8 text-muted-foreground"
    >
      <Icon name="lucide:alert-circle" class="w-8 h-8 mb-2" />
      <p class="text-sm">Failed to load messages</p>
      <UiButton variant="ghost" size="sm" class="mt-2" @click="refreshMessages">
        <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
        Retry
      </UiButton>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="messages.length === 0"
      class="flex flex-col items-center py-12 text-muted-foreground"
    >
      <Icon name="lucide:message-circle" class="w-12 h-12 mb-4" />
      <h3 class="text-lg font-medium mb-2">No messages yet</h3>
      <p class="text-sm text-center">
        Start the conversation by sending a message below.
      </p>
    </div>

    <!-- Messages List -->
    <div v-else class="space-y-4">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />

      <!-- Streaming Message -->
      <div v-if="isStreaming" class="flex gap-3">
        <!-- Avatar -->
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground"
        >
          <Icon name="lucide:bot" class="w-4 h-4" />
        </div>

        <!-- Message Content -->
        <div class="flex-1 max-w-[80%]">
          <div class="rounded-lg p-3 text-sm bg-muted">
            <div class="whitespace-pre-wrap">
              {{ streamingMessage }}
              <span
                class="inline-block w-2 h-4 bg-current animate-pulse ml-1"
              />
            </div>
          </div>

          <!-- Timestamp -->
          <div class="text-xs text-muted-foreground mt-1 text-left">
            Streaming...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
