<script setup lang="ts">
interface Props {
  /** Custom message to display */
  message?: string;
  /** Whether to show avatar */
  showAvatar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  message: "AI is thinking...",
  showAvatar: true,
});
</script>

<template>
  <div class="group flex gap-4 p-4 hover:bg-muted/50 transition-colors">
    <!-- AI Avatar -->
    <div v-if="showAvatar" class="flex-shrink-0">
      <UiAvatar class="w-8 h-8">
        <UiAvatarFallback class="bg-primary text-primary-foreground">
          AI
        </UiAvatarFallback>
      </UiAvatar>
    </div>

    <!-- Typing Animation -->
    <div class="flex-1 min-w-0 space-y-2">
      <!-- Message Content -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">{{ message }}</span>

        <!-- Animated Dots -->
        <div class="flex items-center gap-1">
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 0ms"
          />
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 150ms"
          />
          <div
            class="w-2 h-2 bg-primary rounded-full animate-bounce"
            style="animation-delay: 300ms"
          />
        </div>
      </div>

      <!-- Optional: Streaming Effect -->
      <div class="flex items-center gap-2">
        <div class="typing-cursor">▋</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom typing cursor animation */
.typing-cursor {
  @apply text-primary text-sm;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

/* Enhanced bounce animation */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  40% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Subtle pulse effect for the whole component */
.group {
  animation: subtle-pulse 3s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}
</style>
