<script setup lang="ts">
// Component for displaying and managing conversation threads
// This component is documented in ./README.md (do not remove this comment)

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  messageCount: number;
}

interface Props {
  /**
   * List of conversations to display
   */
  conversations?: Conversation[];
  /**
   * Currently active conversation ID
   */
  activeConversationId?: string;
  /**
   * Whether the component is in loading state
   */
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  conversations: () => [],
  isLoading: false,
});

// Emits for conversation actions
const emit = defineEmits<{
  create: [];
  select: [conversationId: string];
  delete: [conversationId: string];
  rename: [conversationId: string, newTitle: string];
}>();

// Search functionality
const searchQuery = ref("");
const searchInputEl = useTemplateRef("searchInputEl");

// Filter conversations based on search
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.conversations;
  }

  const query = searchQuery.value.toLowerCase();
  return props.conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(query) ||
      conv.lastMessage?.toLowerCase().includes(query)
  );
});

// Format conversation timestamp
const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return timestamp.toLocaleDateString();
};

// Conversation management
const showContextMenu = ref<string | null>(null);
const editingConversation = ref<string | null>(null);
const editTitle = ref("");

const startRename = (conversation: Conversation) => {
  editingConversation.value = conversation.id;
  editTitle.value = conversation.title;
  showContextMenu.value = null;
};

const saveRename = () => {
  if (editingConversation.value && editTitle.value.trim()) {
    emit("rename", editingConversation.value, editTitle.value.trim());
  }
  editingConversation.value = null;
  editTitle.value = "";
};

const cancelRename = () => {
  editingConversation.value = null;
  editTitle.value = "";
};

const deleteConversation = (conversationId: string) => {
  emit("delete", conversationId);
  showContextMenu.value = null;
};

// Close context menu when clicking outside
const closeContextMenu = () => {
  showContextMenu.value = null;
};

onMounted(() => {
  document.addEventListener("click", closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeContextMenu);
});
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header with search -->
    <div class="p-4 border-b border-border">
      <div class="space-y-3">
        <!-- New Chat Button -->
        <Button
          variant="outline"
          class="w-full justify-start"
          @click="emit('create')"
        >
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <!-- Search Input -->
        <div class="relative">
          <Icon
            name="lucide:search"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            ref="searchInputEl"
            v-model="searchQuery"
            placeholder="Search conversations..."
            class="pl-10"
          />
        </div>
      </div>
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="p-4 space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
          <Skeleton class="h-8 w-8 rounded-full" />
          <div class="space-y-2 flex-1">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-3 w-3/4" />
          </div>
        </div>
      </div>

      <div
        v-else-if="filteredConversations.length === 0"
        class="p-4 text-center"
      >
        <div class="py-8">
          <Icon
            name="lucide:message-circle"
            class="h-12 w-12 text-muted-foreground mx-auto mb-4"
          />
          <p class="text-sm text-muted-foreground">
            {{
              searchQuery ? "No conversations found" : "No conversations yet"
            }}
          </p>
        </div>
      </div>

      <div v-else class="p-2">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="relative group"
        >
          <!-- Conversation Item -->
          <div
            class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
            :class="{
              'bg-muted': conversation.id === activeConversationId,
            }"
            @click="emit('select', conversation.id)"
          >
            <div class="flex-shrink-0 mt-1">
              <div class="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div class="flex-1 min-w-0">
              <!-- Title (editable) -->
              <div v-if="editingConversation === conversation.id" class="mb-1">
                <Input
                  v-model="editTitle"
                  class="h-auto p-1 text-sm font-medium"
                  @keydown.enter="saveRename"
                  @keydown.escape="cancelRename"
                  @blur="saveRename"
                />
              </div>
              <h3 v-else class="font-medium text-sm truncate mb-1">
                {{ conversation.title }}
              </h3>

              <!-- Last message preview -->
              <p
                v-if="conversation.lastMessage"
                class="text-xs text-muted-foreground truncate mb-1"
              >
                {{ conversation.lastMessage }}
              </p>

              <!-- Metadata -->
              <div
                class="flex items-center justify-between text-xs text-muted-foreground"
              >
                <span>{{ conversation.messageCount }} messages</span>
                <span>{{ formatTimestamp(conversation.timestamp) }}</span>
              </div>
            </div>

            <!-- Context Menu Button -->
            <Button
              variant="ghost"
              size="sm"
              class="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              @click.stop="
                showContextMenu =
                  showContextMenu === conversation.id ? null : conversation.id
              "
            >
              <Icon name="lucide:more-horizontal" class="h-3 w-3" />
            </Button>
          </div>

          <!-- Context Menu -->
          <div
            v-if="showContextMenu === conversation.id"
            class="absolute right-2 top-2 bg-popover border border-border rounded-md shadow-md z-10 py-1 min-w-32"
            @click.stop
          >
            <button
              class="w-full px-3 py-1.5 text-sm text-left hover:bg-muted flex items-center gap-2"
              @click="startRename(conversation)"
            >
              <Icon name="lucide:edit-2" class="h-3 w-3" />
              Rename
            </button>
            <button
              class="w-full px-3 py-1.5 text-sm text-left hover:bg-muted text-destructive flex items-center gap-2"
              @click="deleteConversation(conversation.id)"
            >
              <Icon name="lucide:trash-2" class="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
