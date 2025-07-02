<script setup lang="ts">
interface Props {
  /** Message ID */
  messageId: string;
  /** Message content for copying */
  content: string;
  /** Whether the regenerate action is available */
  canRegenerate?: boolean;
}

interface Emits {
  /** Triggered when user wants to copy message content */
  (e: "copy", content: string): void;
  /** Triggered when user wants to edit message */
  (e: "edit", messageId: string): void;
  /** Triggered when user wants to delete message */
  (e: "delete", messageId: string): void;
  /** Triggered when user wants to regenerate AI response */
  (e: "regenerate", messageId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  canRegenerate: false,
});

const emit = defineEmits<Emits>();

const isCopied = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
    emit("copy", props.content);
    isCopied.value = true;

    // Reset after 2 seconds
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
  }
};

const handleEdit = () => {
  emit("edit", props.messageId);
};

const handleDelete = () => {
  emit("delete", props.messageId);
};

const handleRegenerate = () => {
  emit("regenerate", props.messageId);
};
</script>

<template>
  <div class="flex items-center gap-1 mt-2">
    <!-- Copy Button -->
    <UiButton
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs"
      @click="handleCopy"
    >
      <Icon
        :name="isCopied ? 'lucide:check' : 'lucide:copy'"
        class="w-3 h-3 mr-1"
      />
      {{ isCopied ? "Copied!" : "Copy" }}
    </UiButton>

    <!-- Edit Button -->
    <UiButton
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs"
      @click="handleEdit"
    >
      <Icon name="lucide:edit-3" class="w-3 h-3 mr-1" />
      Edit
    </UiButton>

    <!-- Regenerate Button (AI messages only) -->
    <UiButton
      v-if="canRegenerate"
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs"
      @click="handleRegenerate"
    >
      <Icon name="lucide:refresh-cw" class="w-3 h-3 mr-1" />
      Regenerate
    </UiButton>

    <!-- Delete Button -->
    <UiButton
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
      @click="handleDelete"
    >
      <Icon name="lucide:trash-2" class="w-3 h-3 mr-1" />
      Delete
    </UiButton>
  </div>
</template>
