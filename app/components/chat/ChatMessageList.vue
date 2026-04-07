<script setup lang="ts">
import type { ChatMessage } from "~/shared/chat/types";

defineProps<{
  messages: ChatMessage[];
}>();
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="message in messages"
      :key="message.id"
      class="rounded-lg px-4 py-3 text-sm leading-relaxed"
      :class="
        message.role === 'user'
          ? 'ml-auto max-w-[85%] bg-primary text-primary-foreground'
          : 'max-w-[85%] bg-muted text-foreground'
      "
    >
      <p class="mb-1 text-xs opacity-70">
        {{ message.role === "user" ? "You" : "Assistant" }}
      </p>
      <p>{{ message.content }}</p>
    </div>
  </div>
</template>
