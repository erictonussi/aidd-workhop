<script setup lang="ts">
/**
 * Main chat interface component that displays messages and provides input
 */

interface Props {
  /** The conversation ID to display messages for */
  conversationId: number;
}

defineProps<Props>();

// Refs for scrolling and input interaction
const messageListRef = ref();
const chatInputRef = ref();

/**
 * Handles when a new message is sent
 */
function onMessageSent() {
  // Refresh the message list to show new messages
  messageListRef.value?.refresh();
  // Scroll to bottom when a new message is sent
  nextTick(() => {
    messageListRef.value?.scrollToBottom();
  });
}

/**
 * Handles when the conversation receives a new message
 */
function onMessageReceived() {
  // Scroll to bottom when a new message is received
  nextTick(() => {
    messageListRef.value?.scrollToBottom();
  });
}

/**
 * Handles when streaming starts
 */
function onStreamingStarted() {
  messageListRef.value?.startStreaming();
}

/**
 * Handles streaming chunks
 */
function onStreamingChunk(text: string) {
  messageListRef.value?.addToStream(text);
}

/**
 * Handles when streaming ends
 */
function onStreamingEnded() {
  messageListRef.value?.endStreaming();
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-100px)] bg-background">
    <!-- Chat Messages Area -->
    <div class="flex-1 overflow-hidden">
      <ChatMessageList
        ref="messageListRef"
        :conversation-id="conversationId"
        @message-received="onMessageReceived"
      />
    </div>

    <!-- Chat Input Area -->
    <div class="border-t bg-background p-4">
      <ChatInput
        ref="chatInputRef"
        :conversation-id="conversationId"
        @message-sent="onMessageSent"
        @streaming-started="onStreamingStarted"
        @streaming-chunk="onStreamingChunk"
        @streaming-ended="onStreamingEnded"
      />
    </div>
  </div>
</template>
