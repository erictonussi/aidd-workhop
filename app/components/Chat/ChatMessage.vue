<script setup lang="ts">
import type { Message } from "./Chat.vue";

export interface ChatMessageProps {
  /** The message object to display */
  message: Message;
  /** Whether this message is in a loading state */
  loading?: boolean;
}

export interface ChatMessageEmits {
  /** Emitted when user wants to regenerate this response */
  regenerateResponse: [];
}

const props = withDefaults(defineProps<ChatMessageProps>(), {
  loading: false,
});

const emit = defineEmits<ChatMessageEmits>();

const isUser = computed(() => props.message.role === "user");
const isAssistant = computed(() => props.message.role === "assistant");

const handleRegenerateResponse = () => {
  emit("regenerateResponse");
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    // Could add a toast notification here
  } catch (error) {
    console.error("Failed to copy message:", error);
  }
};
</script>

<template>
  <div class="group flex gap-3" :class="{ 'flex-row-reverse': isUser }">
    <!-- Avatar -->
    <UiAvatar class="w-8 h-8 flex-shrink-0">
      <UiAvatarFallback>
        <Icon :name="isUser ? 'lucide:user' : 'lucide:bot'" class="w-4 h-4" />
      </UiAvatarFallback>
    </UiAvatar>

    <!-- Message Content -->
    <div class="flex-1 min-w-0">
      <div
        class="rounded-lg p-3 prose prose-sm max-w-none overflow-hidden"
        :class="{
          'bg-primary text-primary-foreground ml-auto max-w-[80%]': isUser,
          'bg-muted text-muted-foreground': isAssistant,
        }"
      >
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center gap-2">
          <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <span>Thinking...</span>
        </div>

        <!-- Message Content -->
        <div
          v-else
          class="break-words overflow-hidden"
          v-html="message.content"
        />

        <!-- Sources -->
        <div v-if="message.sources?.length" class="mt-2 pt-2 border-t">
          <p class="text-xs font-medium mb-1">Sources:</p>
          <div class="flex flex-wrap gap-1">
            <UiBadge
              v-for="source in message.sources"
              :key="source"
              variant="outline"
              class="text-xs"
            >
              {{ source }}
            </UiBadge>
          </div>
        </div>
      </div>

      <!-- Message Actions -->
      <div
        v-if="!loading"
        class="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <UiButton
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs"
          @click="copyToClipboard"
        >
          <Icon name="lucide:copy" class="w-3 h-3" />
        </UiButton>

        <UiButton
          v-if="isAssistant"
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs"
          @click="handleRegenerateResponse"
        >
          <Icon name="lucide:refresh-cw" class="w-3 h-3" />
        </UiButton>
      </div>
    </div>
  </div>
</template>
