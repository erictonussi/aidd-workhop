<script setup lang="ts">
/**
 * Main conversation sidebar component that displays the list of conversations
 * and provides actions to create new conversations
 */

// Ref to the conversation list component
const conversationListRef = ref();

/**
 * Handles when a new conversation is created
 */
function onConversationCreated() {
  // Refresh the conversation list to show the new conversation
  conversationListRef.value?.refresh();
}
</script>

<template>
  <aside class="w-64 h-screen border-r bg-muted/50 flex flex-col">
    <!-- Header with New Conversation Button -->
    <div class="p-4 border-b">
      <ConversationNewButton @conversation-created="onConversationCreated" />
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto">
      <ConversationList ref="conversationListRef" />
    </div>
  </aside>
</template>

<style scoped>
/* Any specific styles if needed */
</style>
