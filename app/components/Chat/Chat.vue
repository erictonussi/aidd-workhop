<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  citations?: DocumentCitation[];
  codeBlocks?: CodeBlock[];
  isLoading?: boolean;
}

export interface DocumentCitation {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  relevance: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  isPinned?: boolean;
}

interface Props {
  /** Current conversation ID */
  conversationId?: string;
  /** List of messages in current conversation */
  messages?: Message[];
  /** List of all conversations */
  conversations?: Conversation[];
  /** Whether the sidebar is open */
  sidebarOpen?: boolean;
  /** Whether AI is currently responding */
  isResponding?: boolean;
  /** Available documentation */
  documents?: Array<{
    id: string;
    title: string;
    category: string;
    lastUpdated: Date;
  }>;
  class?: HTMLAttributes["class"];
}

interface Emits {
  (e: "send-message", message: string): void;
  (
    e: "select-conversation" | "delete-conversation" | "toggle-pin",
    id: string
  ): void;
  (e: "new-conversation"): void;
  (e: "upload-document", file: File): void;
  (e: "rate-message", messageId: string, rating: "up" | "down"): void;
  (e: "regenerate-message" | "copy-message", messageId: string): void;
  (e: "update:sidebarOpen", open: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  conversations: () => [],
  documents: () => [],
  sidebarOpen: true,
  isResponding: false,
});

const emit = defineEmits<Emits>();

const messageListEl = useTemplateRef<HTMLDivElement>("messageListEl");
const inputEl = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>(
  "inputEl"
);

// Auto-scroll to bottom when new messages arrive
watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (messageListEl.value) {
        messageListEl.value.scrollTop = messageListEl.value.scrollHeight;
      }
    });
  }
);

// Focus input when component mounts
onMounted(() => {
  inputEl.value?.focus();
});
</script>

<template>
  <div :class="cn('flex h-full bg-background', props.class)">
    <!-- Sidebar -->
    <ChatSidebar
      :conversations="conversations"
      :current-conversation-id="conversationId"
      :open="sidebarOpen"
      @select-conversation="emit('select-conversation', $event as string)"
      @new-conversation="emit('new-conversation')"
      @delete-conversation="emit('delete-conversation', $event as string)"
      @toggle-pin="emit('toggle-pin', $event as string)"
      @update:open="emit('update:sidebarOpen', $event as boolean)"
    />

    <!-- Main Chat Area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Messages Display -->
      <div
        ref="messageListEl"
        class="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden"
      >
        <div class="space-y-4 min-h-0 w-full">
          <!-- Empty State -->
          <div
            v-if="messages.length === 0"
            class="flex items-center justify-center h-full min-h-[400px]"
          >
            <div class="text-center space-y-4 max-w-md">
              <div class="relative">
                <Icon
                  name="lucide:message-circle"
                  class="w-16 h-16 mx-auto text-muted-foreground/50"
                />
                <UiBadge class="absolute -top-1 -right-1 animate-pulse">
                  AI
                </UiBadge>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-foreground">
                  Start a conversation
                </h3>
                <p class="text-sm text-muted-foreground">
                  Ask me anything about your documentation, code, or get help
                  with development questions.
                </p>
              </div>
              <div class="flex flex-wrap gap-2 justify-center">
                <UiBadge variant="secondary" class="text-xs"
                  >Documentation</UiBadge
                >
                <UiBadge variant="secondary" class="text-xs">Code Help</UiBadge>
                <UiBadge variant="secondary" class="text-xs"
                  >Explanations</UiBadge
                >
              </div>
            </div>
          </div>

          <!-- Messages -->
          <template v-else>
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              @rate="emit('rate-message', message.id, $event as 'up' | 'down')"
              @regenerate="emit('regenerate-message', message.id)"
              @copy="emit('copy-message', message.id)"
            />
          </template>

          <!-- Typing Indicator -->
          <div v-if="isResponding" class="flex justify-start w-full">
            <UiCard class="bg-card text-card-foreground max-w-[85%]">
              <UiCardContent class="p-3">
                <div class="flex items-start gap-3">
                  <UiAvatar class="w-6 h-6 shrink-0">
                    <UiAvatarFallback
                      class="bg-primary text-primary-foreground text-xs"
                    >
                      AI
                    </UiAvatarFallback>
                  </UiAvatar>
                  <ChatTypingIndicator />
                </div>
              </UiCardContent>
            </UiCard>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <UiSeparator />
      <ChatInput
        ref="inputEl"
        :disabled="isResponding"
        @send="emit('send-message', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling is now handled by UiScrollArea */
</style>
