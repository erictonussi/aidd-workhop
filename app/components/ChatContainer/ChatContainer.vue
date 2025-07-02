<script setup lang="ts">
// Main chat container component that orchestrates the entire chat interface
// This component is documented in ./README.md (do not remove this comment)

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  images?: string[];
  isLoading?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  messageCount: number;
}

interface Props {
  /**
   * Whether to show the conversation sidebar
   */
  showSidebar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
});

// Toggle sidebar visibility
const sidebarVisible = ref(props.showSidebar);

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// Mock data for development - will be replaced with real data from composables
const mockMessages = ref<Message[]>([
  {
    id: "1",
    content: "Hello! How can I help you today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 5000),
    images: [],
  },
]);

const mockConversations = ref<Conversation[]>([
  {
    id: "1",
    title: "Getting Started",
    lastMessage: "Hello! How can I help you today?",
    timestamp: new Date(Date.now() - 5000),
    messageCount: 1,
  },
]);

const activeConversationId = ref("1");
const isLoading = ref(false);

// Message handling
const handleSendMessage = async (message: string, files: File[]) => {
  if (!message.trim() && files.length === 0) return;

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    content: message,
    role: "user",
    timestamp: new Date(),
    images: files.map((file) => URL.createObjectURL(file)),
  };

  mockMessages.value.push(userMessage);

  // Add loading state for AI response
  isLoading.value = true;
  const loadingMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: "",
    role: "assistant",
    timestamp: new Date(),
    images: [],
    isLoading: true,
  };

  mockMessages.value.push(loadingMessage);

  // Simulate AI response (will be replaced with real API call)
  setTimeout(() => {
    const responseIndex = mockMessages.value.findIndex(
      (m) => m.id === loadingMessage.id
    );
    if (responseIndex > -1) {
      mockMessages.value[responseIndex] = {
        ...loadingMessage,
        content: `I received your message: "${message}". This is a mock response that will be replaced with real AI responses.`,
        isLoading: false,
      };
    }
    isLoading.value = false;
  }, 1500);
};

const handleStopGeneration = () => {
  isLoading.value = false;
  // Remove loading message
  const loadingIndex = mockMessages.value.findIndex((m) => m.isLoading);
  if (loadingIndex > -1) {
    mockMessages.value.splice(loadingIndex, 1);
  }
};

// Message actions
const handleCopyMessage = (messageId: string) => {
  // Show success toast or feedback
  console.log("Copied message:", messageId);
};

const handleRegenerateMessage = (messageId: string) => {
  console.log("Regenerating message:", messageId);
  // TODO: Implement regeneration
};

const handleMessageReaction = (
  messageId: string,
  reaction: "like" | "dislike"
) => {
  console.log("Message reaction:", messageId, reaction);
  // TODO: Implement reactions
};

// Conversation actions
const handleCreateConversation = () => {
  console.log("Creating new conversation");
  // TODO: Implement new conversation
};

const handleSelectConversation = (conversationId: string) => {
  activeConversationId.value = conversationId;
  console.log("Selected conversation:", conversationId);
  // TODO: Load conversation messages
};

const handleDeleteConversation = (conversationId: string) => {
  console.log("Deleting conversation:", conversationId);
  // TODO: Implement conversation deletion
};

const handleRenameConversation = (conversationId: string, newTitle: string) => {
  console.log("Renaming conversation:", conversationId, newTitle);
  // TODO: Implement conversation renaming
};

// Auto-scroll to bottom when new messages arrive
const messagesContainerEl = useTemplateRef("messagesContainerEl");

const scrollToBottom = () => {
  if (messagesContainerEl.value) {
    messagesContainerEl.value.scrollTop =
      messagesContainerEl.value.scrollHeight;
  }
};

watch(
  mockMessages,
  () => {
    nextTick(scrollToBottom);
  },
  { deep: true }
);
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Conversation Sidebar -->
    <div
      v-show="sidebarVisible"
      class="w-80 border-r border-border bg-card flex flex-col"
    >
      <div class="p-4 border-b border-border">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Conversations</h2>
          <Button variant="ghost" size="sm" @click="toggleSidebar">
            <Icon name="lucide:panel-left-close" class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden">
        <ConversationList
          :conversations="mockConversations"
          :active-conversation-id="activeConversationId"
          :is-loading="false"
          @create="handleCreateConversation"
          @select="handleSelectConversation"
          @delete="handleDeleteConversation"
          @rename="handleRenameConversation"
        />
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Chat Header -->
      <div class="border-b border-border p-4 bg-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              v-if="!sidebarVisible"
              variant="ghost"
              size="sm"
              @click="toggleSidebar"
            >
              <Icon name="lucide:panel-left-open" class="h-4 w-4" />
            </Button>
            <div>
              <h1 class="text-xl font-semibold">AI Assistant</h1>
              <p class="text-sm text-muted-foreground">
                How can I help you today?
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Theme toggle and other controls will go here -->
            <Button variant="ghost" size="sm">
              <Icon name="lucide:settings" class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Message List -->
        <div ref="messagesContainerEl" class="flex-1 overflow-y-auto p-4">
          <div class="max-w-4xl mx-auto space-y-4">
            <!-- Welcome message when no messages -->
            <div v-if="mockMessages.length === 0" class="text-center py-12">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
              >
                <Icon
                  name="lucide:message-circle"
                  class="h-8 w-8 text-primary"
                />
              </div>
              <h3 class="text-lg font-medium mb-2">Start a conversation</h3>
              <p class="text-muted-foreground">
                Send a message to begin chatting with the AI assistant.
              </p>
            </div>

            <!-- Messages -->
            <MessageItem
              v-for="message in mockMessages"
              :key="message.id"
              :message="message"
              :show-actions="true"
              @copy="handleCopyMessage"
              @regenerate="handleRegenerateMessage"
              @react="handleMessageReaction"
            />
          </div>
        </div>

        <!-- Message Input Area -->
        <div class="border-t border-border p-4 bg-card">
          <div class="max-w-4xl mx-auto">
            <MessageInput
              :is-loading="isLoading"
              :placeholder="'Type your message here...'"
              :max-files="5"
              @send="handleSendMessage"
              @stop="handleStopGeneration"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
