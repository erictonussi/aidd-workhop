<script setup lang="ts"></script>
<template>
  <div class="flex items-center space-x-1 h-6">
    <span
      class="block w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
      style="animation-delay: 0ms"
    />
    <span
      class="block w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
      style="animation-delay: 150ms"
    />
    <span
      class="block w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
      style="animation-delay: 300ms"
    />
  </div>
</template>
<style scoped>
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.4);
  }
}
.animate-bounce {
  animation: bounce 1.2s infinite both;
}
</style>
