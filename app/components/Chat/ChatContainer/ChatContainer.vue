<script setup lang="ts">
import type { Message, Thread, Workspace, FileAttachment } from "../types";

interface Props {
  /** Current messages in the conversation */
  messages?: Message[];
  /** Whether AI is currently responding */
  isLoading?: boolean;
  /** Current thread information */
  currentThread?: Thread;
  /** Available workspaces */
  workspaces?: Workspace[];
  /** Whether to show sidebar */
  showSidebar?: boolean;
  /** Whether to show header */
  showHeader?: boolean;
}

interface Emits {
  /** Triggered when user submits a new message */
  (e: "message-submit", content: string, attachments?: FileAttachment[]): void;
  /** Triggered when user wants to copy message */
  (e: "message-copy", content: string): void;
  /** Triggered when user wants to edit message */
  (e: "message-edit", messageId: string): void;
  /** Triggered when user wants to delete message */
  (e: "message-delete", messageId: string): void;
  /** Triggered when user wants to regenerate AI response */
  (e: "message-regenerate", messageId: string): void;
  /** Triggered when user clicks on source citation */
  (e: "source-click", source: any): void;
  /** Triggered when user selects a thread */
  (e: "thread-select", threadId: string): void;
  /** Triggered when user selects a workspace */
  (e: "workspace-select", workspaceId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  isLoading: false,
  showSidebar: true,
  showHeader: true,
});

const emit = defineEmits<Emits>();

// Internal state
const sidebarCollapsed = ref(false);

// Computed properties
const containerClasses = computed(() => {
  return [
    "flex h-screen bg-background",
    sidebarCollapsed.value && "sidebar-collapsed",
  ];
});

// Event handlers - forward all events to parent
const handleMessageSubmit = (
  content: string,
  attachments?: FileAttachment[]
) => {
  emit("message-submit", content, attachments);
};

const handleMessageCopy = (content: string) => {
  emit("message-copy", content);
};

const handleMessageEdit = (messageId: string) => {
  emit("message-edit", messageId);
};

const handleMessageDelete = (messageId: string) => {
  emit("message-delete", messageId);
};

const handleMessageRegenerate = (messageId: string) => {
  emit("message-regenerate", messageId);
};

const handleSourceClick = (source: any) => {
  emit("source-click", source);
};

const handleThreadSelect = (threadId: string) => {
  emit("thread-select", threadId);
};

const handleWorkspaceSelect = (workspaceId: string) => {
  emit("workspace-select", workspaceId);
};

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<template>
  <div :class="containerClasses">
    <!-- Sidebar -->
    <ChatSidebar
      v-if="showSidebar"
      :collapsed="sidebarCollapsed"
      :workspaces="workspaces"
      :current-thread="currentThread"
      @thread-select="handleThreadSelect"
      @workspace-select="handleWorkspaceSelect"
      @toggle="toggleSidebar"
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <ChatHeader
        v-if="showHeader"
        :current-thread="currentThread"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Messages Area -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Message List -->
        <ChatMessageList
          :messages="messages"
          :is-loading="isLoading"
          class="flex-1"
          @message-copy="handleMessageCopy"
          @message-edit="handleMessageEdit"
          @message-delete="handleMessageDelete"
          @message-regenerate="handleMessageRegenerate"
          @source-click="handleSourceClick"
        />

        <!-- Input Area -->
        <ChatInput :is-loading="isLoading" @submit="handleMessageSubmit" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-collapsed {
  /* Add any specific styles for collapsed sidebar state */
}
</style>
