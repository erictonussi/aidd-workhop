<script setup lang="ts">
/**
 * Chat input component for sending messages
 */

interface Props {
  /** The conversation ID to send messages to */
  conversationId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Emitted when a message is sent */
  messageSent: [];
  /** Emitted when streaming starts */
  streamingStarted: [];
  /** Emitted when a streaming chunk is received */
  streamingChunk: [text: string];
  /** Emitted when streaming ends */
  streamingEnded: [];
}>();

const messageContent = ref("");
const isLoading = ref(false);
const textareaEl = ref<HTMLTextAreaElement>();

/**
 * Sends a message to the conversation
 */
async function sendMessage() {
  if (!messageContent.value.trim() || isLoading.value) {
    return;
  }

  const content = messageContent.value.trim();

  try {
    isLoading.value = true;

    // Clear the input immediately for better UX
    messageContent.value = "";

    // Emit that a message was sent
    emit("messageSent");

    // Start streaming indicator
    emit("streamingStarted");

    // Send the message to the streaming endpoint
    // ESLint disable needed for streaming response handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (global as any).fetch(
      `/api/conversations/${props.conversationId}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    // Handle the streaming response
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        if (value) {
          // Check for title updates in the stream
          if (value.includes("__TITLE_UPDATE__:")) {
            const titleMatch = value.match(
              /__TITLE_UPDATE__:(.+?)__END_TITLE__/
            );
            if (titleMatch) {
              const _newTitle = titleMatch[1];
              // Trigger conversation refresh immediately when title is received
              const { triggerConversationRefresh } = useConversationUpdates();
              triggerConversationRefresh();

              // Remove the title update from the stream content
              const cleanedValue = value.replace(
                /__TITLE_UPDATE__:.+?__END_TITLE__/g,
                ""
              );
              if (cleanedValue) {
                emit("streamingChunk", cleanedValue);
              }
            }
          } else {
            // Regular streaming chunk
            emit("streamingChunk", value);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Emit that streaming has ended
    emit("streamingEnded");
  } catch (error) {
    console.error("Error sending message:", error);
    // Restore the message content if there was an error
    messageContent.value = content;

    // End streaming on error
    emit("streamingEnded");
  } finally {
    isLoading.value = false;

    // Focus back to the textarea
    nextTick(() => {
      textareaEl.value?.focus();
    });
  }
}

/**
 * Handles key press events in the textarea
 */
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// Auto-resize textarea as content changes
function adjustTextareaHeight() {
  if (textareaEl.value) {
    textareaEl.value.style.height = "auto";
    textareaEl.value.style.height = `${textareaEl.value.scrollHeight}px`;
  }
}

// Watch for content changes to adjust height
watch(messageContent, () => {
  nextTick(() => {
    adjustTextareaHeight();
  });
});

// Set initial focus
onMounted(() => {
  nextTick(() => {
    textareaEl.value?.focus();
  });
});
</script>

<template>
  <div class="flex gap-2">
    <!-- Message Input -->
    <div class="flex-1 relative">
      <textarea
        ref="textareaEl"
        v-model="messageContent"
        placeholder="Type your message..."
        :disabled="isLoading"
        rows="1"
        class="flex min-h-[44px] max-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none pr-12"
        @keydown="handleKeyPress"
      />

      <!-- Character count or status -->
      <div
        v-if="messageContent.length > 0"
        class="absolute bottom-2 right-2 text-xs text-muted-foreground"
      >
        {{ messageContent.length }}
      </div>
    </div>

    <!-- Send Button -->
    <UiButton
      :disabled="!messageContent.trim() || isLoading"
      size="default"
      class="h-auto px-4"
      @click="sendMessage"
    >
      <Icon
        :name="isLoading ? 'lucide:loader-2' : 'lucide:send'"
        :class="{ 'animate-spin': isLoading }"
        class="w-4 h-4"
      />
    </UiButton>
  </div>
</template>
