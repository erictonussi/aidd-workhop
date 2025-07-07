<script setup lang="ts">
/**
 * Button component for creating new conversations
 */

const emit = defineEmits<{
  /** Emitted when a new conversation is created */
  conversationCreated: [conversationId: number];
}>();

const isCreating = ref(false);

/**
 * Creates a new conversation
 */
async function createNewConversation() {
  if (isCreating.value) return;

  try {
    isCreating.value = true;

    const response = await $fetch("/api/conversations", {
      method: "POST",
      body: {
        title: `New Conversation ${new Date().toLocaleString()}`,
      },
    });

    if (!response?.data) {
      throw new Error("Failed to create conversation");
    }

    // Emit the new conversation ID to parent components
    emit("conversationCreated", response.data.id);

    // Navigate to the new conversation
    await navigateTo(`/conversation/${response.data.id}`);
  } catch (error) {
    console.error("Failed to create conversation:", error);
  } finally {
    isCreating.value = false;
  }
}
</script>

<template>
  <UiButton
    :disabled="isCreating"
    class="w-full"
    variant="default"
    @click="createNewConversation"
  >
    <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
    {{ isCreating ? "Creating..." : "New Chat" }}
  </UiButton>
</template>
