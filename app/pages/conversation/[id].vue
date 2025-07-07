<script setup lang="ts">
/**
 * Conversation page for a specific conversation
 */

// Get the conversation ID from the route
const conversationId = computed(() => parseInt(useRoute().params.id as string));

// Set page metadata
useSeoMeta({
  title: `Conversation ${conversationId.value} - AI Assistant`,
  description: "Chat with your AI assistant",
});
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar -->
    <ConversationSidebar />

    <!-- Chat Interface -->
    <div class="flex-1">
      <ChatInterface :conversation-id="conversationId" />
    </div>
  </div>
</template>
