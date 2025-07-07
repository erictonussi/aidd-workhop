<script setup lang="ts">
/**
 * Individual conversation list item component
 */

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  /** The conversation object to display */
  conversation: Conversation;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** Emitted when the conversation is deleted */
  delete: [];
}>();

const route = useRoute();
const isDeleting = ref(false);

// Check if this conversation is currently active
const isActive = computed(() => {
  return route.params.id === props.conversation.id.toString();
});

/**
 * Deletes the conversation
 */
async function deleteConversation() {
  if (isDeleting.value) return;

  try {
    isDeleting.value = true;

    await $fetch(`/api/conversations/${props.conversation.id}`, {
      method: "DELETE",
    });

    // If we're currently viewing this conversation, navigate to home
    if (isActive.value) {
      await navigateTo("/chat");
    }

    // Emit delete event to refresh the list
    emit("delete");
  } catch (error) {
    console.error("Failed to delete conversation:", error);
  } finally {
    isDeleting.value = false;
  }
}

/**
 * Formats the conversation's updated time for display
 */
function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
}
</script>

<template>
  <div
    class="group flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
    :class="{ 'bg-primary/10 border border-primary/20': isActive }"
  >
    <!-- Conversation Link -->
    <NuxtLink :to="`/conversation/${conversation.id}`" class="flex-1 min-w-0">
      <div class="flex flex-col">
        <h3 class="font-medium text-sm truncate">
          {{ conversation.title }}
        </h3>
        <p class="text-xs text-muted-foreground">
          {{ formatTime(conversation.updated_at) }}
        </p>
      </div>
    </NuxtLink>

    <!-- Delete Button -->
    <UiButton
      variant="ghost"
      size="sm"
      :disabled="isDeleting"
      class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-8 w-8 p-0"
      @click="deleteConversation"
    >
      <Icon
        :name="isDeleting ? 'lucide:loader-2' : 'lucide:trash-2'"
        :class="{ 'animate-spin': isDeleting }"
        class="w-4 h-4"
      />
    </UiButton>
  </div>
</template>
