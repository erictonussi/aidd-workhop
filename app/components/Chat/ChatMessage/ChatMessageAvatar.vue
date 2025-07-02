<script setup lang="ts">
import type { MessageRole } from "../types";

interface Props {
  /** Role of the message sender */
  role: MessageRole;
  /** Custom avatar URL */
  avatarUrl?: string;
}

const props = defineProps<Props>();

const avatarSrc = computed(() => {
  if (props.avatarUrl) return props.avatarUrl;

  // Default avatars based on role
  switch (props.role) {
    case "assistant":
      return "/avatars/ai-assistant.svg";
    case "user":
      return "/avatars/user-default.svg";
    case "system":
      return "/avatars/system.svg";
    default:
      return "/avatars/user-default.svg";
  }
});

const avatarFallback = computed(() => {
  switch (props.role) {
    case "assistant":
      return "AI";
    case "user":
      return "U";
    case "system":
      return "S";
    default:
      return "?";
  }
});

const avatarClass = computed(() => {
  const baseClass =
    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium";

  switch (props.role) {
    case "assistant":
      return `${baseClass} bg-primary text-primary-foreground`;
    case "user":
      return `${baseClass} bg-muted text-muted-foreground`;
    case "system":
      return `${baseClass} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100`;
    default:
      return `${baseClass} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`;
  }
});
</script>

<template>
  <div class="flex-shrink-0">
    <UiAvatar class="w-8 h-8">
      <UiAvatarImage :src="avatarSrc" :alt="`${role} avatar`" />
      <UiAvatarFallback :class="avatarClass">
        {{ avatarFallback }}
      </UiAvatarFallback>
    </UiAvatar>
  </div>
</template>
