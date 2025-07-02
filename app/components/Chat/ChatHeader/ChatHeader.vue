<script setup lang="ts">
import type { Thread } from "../types";

interface Props {
  /** Current thread information */
  currentThread?: Thread;
  /** Whether the sidebar is collapsed */
  sidebarCollapsed?: boolean;
  /** Whether to show settings button */
  showSettings?: boolean;
}

interface Emits {
  /** Triggered when user wants to toggle sidebar */
  (e: "toggle-sidebar"): void;
  /** Triggered when user wants to open settings */
  (e: "open-settings"): void;
  /** Triggered when user wants to start new chat */
  (e: "new-chat"): void;
  /** Triggered when user wants to clear current chat */
  (e: "clear-chat"): void;
}

const props = withDefaults(defineProps<Props>(), {
  sidebarCollapsed: false,
  showSettings: true,
});

const emit = defineEmits<Emits>();

// Computed
const threadTitle = computed(() => {
  return props.currentThread?.title || "New Chat";
});

const messageCount = computed(() => {
  return props.currentThread?.messages?.length || 0;
});

// Event handlers
const handleToggleSidebar = () => {
  emit("toggle-sidebar");
};

const handleOpenSettings = () => {
  emit("open-settings");
};

const handleNewChat = () => {
  emit("new-chat");
};

const handleClearChat = () => {
  emit("clear-chat");
};
</script>

<template>
  <div
    class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left side -->
      <div class="flex items-center gap-3">
        <!-- Sidebar toggle -->
        <UiButton
          variant="ghost"
          size="sm"
          class="lg:hidden"
          @click="handleToggleSidebar"
        >
          <Icon
            :name="sidebarCollapsed ? 'lucide:menu' : 'lucide:x'"
            class="w-4 h-4"
          />
        </UiButton>

        <!-- Thread info -->
        <div class="flex items-center gap-2">
          <Icon
            name="lucide:message-square"
            class="w-4 h-4 text-muted-foreground"
          />
          <div>
            <h1 class="font-medium text-sm">{{ threadTitle }}</h1>
            <p v-if="messageCount > 0" class="text-xs text-muted-foreground">
              {{ messageCount }}
              {{ messageCount === 1 ? "message" : "messages" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- New Chat -->
        <UiButton variant="ghost" size="sm" @click="handleNewChat">
          <Icon name="lucide:plus" class="w-4 h-4 mr-1" />
          New
        </UiButton>

        <!-- More actions dropdown -->
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton variant="ghost" size="sm">
              <Icon name="lucide:more-horizontal" class="w-4 h-4" />
            </UiButton>
          </UiDropdownMenuTrigger>

          <UiDropdownMenuContent align="end">
            <UiDropdownMenuItem @click="handleClearChat">
              <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
              Clear Chat
            </UiDropdownMenuItem>

            <UiDropdownMenuSeparator />

            <UiDropdownMenuItem v-if="showSettings" @click="handleOpenSettings">
              <Icon name="lucide:settings" class="w-4 h-4 mr-2" />
              Settings
            </UiDropdownMenuItem>

            <UiDropdownMenuItem>
              <Icon name="lucide:download" class="w-4 h-4 mr-2" />
              Export Chat
            </UiDropdownMenuItem>

            <UiDropdownMenuItem>
              <Icon name="lucide:share" class="w-4 h-4 mr-2" />
              Share
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </div>
  </div>
</template>
