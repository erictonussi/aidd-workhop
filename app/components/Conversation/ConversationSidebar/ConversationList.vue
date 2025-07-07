<script setup lang="ts">
/**
 * List component that displays all conversations
 */

// Fetch conversations from the API
const {
  data: conversationsResponse,
  pending,
  error,
  refresh,
} = useFetch("/api/conversations");

// Extract conversations array from the response
const conversations = computed(() => conversationsResponse.value?.data || []);

// Watch for conversation updates from other components
const { refreshTrigger } = useConversationUpdates();
watch(refreshTrigger, () => {
  refresh();
});

/**
 * Refreshes the conversation list
 */
function refreshConversations() {
  refresh();
}

// Expose refresh function to parent components
defineExpose({
  refresh: refreshConversations,
});
</script>

<template>
  <div class="p-2">
    <!-- Loading State -->
    <div v-if="pending" class="space-y-2">
      <div
        v-for="i in 3"
        :key="i"
        class="h-12 bg-muted rounded animate-pulse"
      />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 text-center text-muted-foreground">
      <Icon name="lucide:alert-circle" class="w-6 h-6 mx-auto mb-2" />
      <p class="text-sm">Failed to load conversations</p>
      <UiButton
        variant="ghost"
        size="sm"
        class="mt-2"
        @click="refreshConversations"
      >
        <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
        Retry
      </UiButton>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="conversations.length === 0"
      class="p-4 text-center text-muted-foreground"
    >
      <Icon name="lucide:message-square" class="w-8 h-8 mx-auto mb-2" />
      <p class="text-sm">No conversations yet</p>
      <p class="text-xs">Create your first chat to get started</p>
    </div>

    <!-- Conversation List -->
    <div v-else class="space-y-1">
      <ConversationListItem
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        @delete="refreshConversations"
      />
    </div>
  </div>
</template>
