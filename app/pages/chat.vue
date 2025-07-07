<script setup lang="ts">
/**
 * Main chat page that displays the conversation sidebar and chat interface
 */

// Set page metadata
useSeoMeta({
  title: "Chat - AI Assistant",
  description: "Chat with your AI assistant",
});
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar -->
    <ConversationSidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center p-8 max-w-md">
        <Icon
          name="lucide:message-square"
          class="w-16 h-16 mx-auto mb-4 text-muted-foreground"
        />
        <h2 class="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
        <p class="text-muted-foreground mb-6">
          Select a conversation from the sidebar or create a new chat to get
          started.
        </p>
        <ConversationNewButton />
      </div>
    </div>
  </div>
</template>
