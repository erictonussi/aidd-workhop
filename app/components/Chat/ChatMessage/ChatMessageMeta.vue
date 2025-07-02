<script setup lang="ts">
import type { MessageSource } from "../types";

interface Props {
  /** Message timestamp */
  timestamp: Date;
  /** Source citations */
  sources?: MessageSource[];
  /** Number of tokens used */
  tokensUsed?: number;
  /** AI model used */
  model?: string;
}

interface Emits {
  /** Triggered when user clicks on a source citation */
  (e: "source-click", source: MessageSource): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formattedTime = computed(() => {
  const now = new Date();
  const diff = now.getTime() - props.timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return props.timestamp.toLocaleDateString();
});

const hasMetadata = computed(() => {
  return props.sources?.length || props.tokensUsed || props.model;
});
</script>

<template>
  <div v-if="hasMetadata" class="text-xs text-muted-foreground space-y-2">
    <!-- Timestamp and Model Info -->
    <div class="flex items-center gap-2 flex-wrap">
      <span>{{ formattedTime }}</span>

      <template v-if="model">
        <span>•</span>
        <span class="flex items-center gap-1">
          <Icon name="lucide:cpu" class="w-3 h-3" />
          {{ model }}
        </span>
      </template>

      <template v-if="tokensUsed">
        <span>•</span>
        <span class="flex items-center gap-1">
          <Icon name="lucide:zap" class="w-3 h-3" />
          {{ tokensUsed.toLocaleString() }} tokens
        </span>
      </template>
    </div>

    <!-- Source Citations -->
    <div v-if="sources?.length" class="space-y-1">
      <div class="text-xs font-medium text-muted-foreground">Sources:</div>
      <div class="flex flex-wrap gap-2">
        <UiButton
          v-for="source in sources"
          :key="source.id"
          variant="outline"
          size="sm"
          class="h-6 px-2 text-xs hover:bg-primary/10"
          @click="emit('source-click', source)"
        >
          <Icon name="lucide:external-link" class="w-3 h-3 mr-1" />
          {{ source.title }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
