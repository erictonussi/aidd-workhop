<script setup lang="ts">
import type { Thread, Workspace } from "../types";

interface Props {
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Available workspaces */
  workspaces?: Workspace[];
  /** Current active thread */
  currentThread?: Thread;
  /** List of conversation threads */
  threads?: Thread[];
}

interface Emits {
  /** Triggered when user selects a thread */
  (e: "thread-select", threadId: string): void;
  /** Triggered when user selects a workspace */
  (e: "workspace-select", workspaceId: string): void;
  /** Triggered when user wants to toggle sidebar */
  (e: "toggle"): void;
  /** Triggered when user wants to create new thread */
  (e: "new-thread"): void;
  /** Triggered when user wants to delete thread */
  (e: "delete-thread", threadId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  workspaces: () => [],
  threads: () => [],
});

const emit = defineEmits<Emits>();

// Mock data for demonstration
const mockThreads = computed(() => {
  if (props.threads && props.threads.length > 0) {
    return props.threads;
  }

  // Return mock threads for demo
  return [
    {
      id: "1",
      title: "Getting Started with Nuxt 3",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messages: [],
      isArchived: false,
    },
    {
      id: "2",
      title: "Vue Composition API Best Practices",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      messages: [],
      isArchived: false,
    },
    {
      id: "3",
      title: "TypeScript Configuration Help",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      messages: [],
      isArchived: false,
    },
  ] as Thread[];
});

// Event handlers
const handleThreadSelect = (threadId: string) => {
  emit("thread-select", threadId);
};

const handleWorkspaceSelect = (workspaceId: string) => {
  emit("workspace-select", workspaceId);
};

const handleNewThread = () => {
  emit("new-thread");
};

const handleDeleteThread = (threadId: string) => {
  emit("delete-thread", threadId);
};

const handleToggle = () => {
  emit("toggle");
};

// Utility functions
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

const truncateTitle = (title: string, maxLength: number = 25) => {
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
};
</script>

<template>
  <div
    :class="[
      'bg-muted/30 border-r transition-all duration-300 flex flex-col',
      collapsed ? 'w-0 overflow-hidden' : 'w-80',
    ]"
  >
    <!-- Sidebar Header -->
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">Conversations</h2>
        <div class="flex items-center gap-1">
          <!-- New Thread Button -->
          <UiButton size="sm" variant="ghost" @click="handleNewThread">
            <Icon name="lucide:plus" class="w-4 h-4" />
          </UiButton>

          <!-- Close/Toggle Button -->
          <UiButton
            size="sm"
            variant="ghost"
            class="lg:hidden"
            @click="handleToggle"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </UiButton>
        </div>
      </div>

      <!-- Workspace Selector -->
      <div v-if="workspaces && workspaces.length > 0" class="mt-3">
        <UiSelect @value-change="handleWorkspaceSelect">
          <UiSelectTrigger class="w-full">
            <UiSelectValue placeholder="Select workspace" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="workspace in workspaces"
              :key="workspace.id"
              :value="workspace.id"
            >
              {{ workspace.name }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
    </div>

    <!-- Search -->
    <div class="p-4 border-b">
      <div class="relative">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />
        <UiInput placeholder="Search conversations..." class="pl-10" />
      </div>
    </div>

    <!-- Thread List -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-2 space-y-1">
        <div
          v-for="thread in mockThreads"
          :key="thread.id"
          :class="[
            'group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50',
            currentThread?.id === thread.id && 'bg-accent',
          ]"
          @click="handleThreadSelect(thread.id)"
        >
          <!-- Thread Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <Icon
                name="lucide:message-square"
                class="w-4 h-4 text-muted-foreground flex-shrink-0"
              />
              <p class="font-medium text-sm truncate">
                {{ truncateTitle(thread.title) }}
              </p>
            </div>

            <p class="text-xs text-muted-foreground mt-1">
              {{ formatRelativeTime(thread.updatedAt) }}
            </p>
          </div>

          <!-- Thread Actions -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <UiDropdownMenu>
              <UiDropdownMenuTrigger as-child>
                <UiButton
                  variant="ghost"
                  size="sm"
                  class="h-6 w-6 p-0"
                  @click.stop
                >
                  <Icon name="lucide:more-horizontal" class="w-3 h-3" />
                </UiButton>
              </UiDropdownMenuTrigger>

              <UiDropdownMenuContent align="end">
                <UiDropdownMenuItem>
                  <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
                  Rename
                </UiDropdownMenuItem>

                <UiDropdownMenuItem>
                  <Icon name="lucide:archive" class="w-4 h-4 mr-2" />
                  Archive
                </UiDropdownMenuItem>

                <UiDropdownMenuSeparator />

                <UiDropdownMenuItem
                  class="text-destructive"
                  @click="handleDeleteThread(thread.id)"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
                  Delete
                </UiDropdownMenuItem>
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon name="lucide:zap" class="w-4 h-4" />
        <span>AI Assistant</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
