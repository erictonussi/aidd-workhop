<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "vue-sonner";
import ChatMessage, {
  type ChatMessage as ChatMessageType,
} from "../ChatMessage/ChatMessage.vue";
import ChatInput from "../ChatInput/ChatInput.vue";
import { MessageSquare, Download, Trash2, Settings } from "lucide-vue-next";

interface Props {
  title?: string;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "AI Chat Assistant",
  showHeader: true,
});

// Chat state
const messages = ref<ChatMessageType[]>([]);
const isLoading = ref(false);
const scrollAreaEl = ref();

// Demo message for initial state
const initializeChat = () => {
  if (messages.value.length === 0) {
    messages.value.push({
      id: "1",
      content:
        "Hello! I'm your AI assistant. I can help you with questions, coding, writing, analysis, and much more. You can also upload images for me to analyze!\n\n**What I can do:**\n- Answer questions on any topic\n- Help with code and programming\n- Analyze images and documents\n- Write and edit content\n- Solve problems step by step\n\nHow can I help you today?",
      role: "assistant",
      timestamp: new Date(),
      reactions: [],
    });
  }
};

// Scroll to bottom
const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (scrollAreaEl.value?.$el) {
      const scrollContainer = scrollAreaEl.value.$el.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: smooth ? "smooth" : "instant",
        });
      }
    }
  });
};

// Handle sending message
const handleSend = async (content: string, files?: File[]) => {
  console.log("handleSend called with content:", content);
  if (!content.trim() && !files?.length) return;

  // Add user message
  const userMessage: ChatMessageType = {
    id: Date.now().toString(),
    content: content,
    role: "user",
    timestamp: new Date(),
  };
  messages.value.push(userMessage);
  console.log("Added user message, total messages:", messages.value.length);
  scrollToBottom();

  // Show loading state
  isLoading.value = true;
  console.log("Set loading state to true");

  // Add streaming AI message placeholder
  const aiMessage: ChatMessageType = {
    id: (Date.now() + 1).toString(),
    content: "",
    role: "assistant",
    timestamp: new Date(),
    isStreaming: true,
    reactions: [],
  };
  messages.value.push(aiMessage);
  console.log(
    "Added AI message placeholder, total messages:",
    messages.value.length
  );
  scrollToBottom();

  try {
    // TODO: Replace with actual AI API call
    // Simulate streaming response
    console.log("About to call simulateStreamingResponse");
    await simulateStreamingResponse(aiMessage.id);
    console.log("simulateStreamingResponse completed");
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message. Please try again.");
    // Remove the failed message
    messages.value = messages.value.filter((m) => m.id !== aiMessage.id);
  } finally {
    isLoading.value = false;
    console.log("Set loading state to false");
    scrollToBottom();
  }
};

// Simulate streaming response (replace with actual AI SDK implementation)
const simulateStreamingResponse = async (messageId: string) => {
  console.log("Starting streaming response for message:", messageId);

  const responses = [
    "I'd be happy to help you with that! Let me think about this step by step.",
    "That's a great question! Here's what I can tell you about that topic:",
    "I understand what you're asking. Let me provide you with a comprehensive answer:",
    "Thanks for sharing that with me. Here's my response:",
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];
  console.log("Selected response:", response);

  if (!response) {
    console.error("No response selected");
    return;
  }

  try {
    // Find the message in the array and update it reactively
    const messageIndex = messages.value.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const message = messages.value[messageIndex];
    if (!message) return;

    // Simulate character-by-character streaming
    for (let i = 0; i <= response.length; i++) {
      // Update the message content reactively
      message.content = response.slice(0, i);
      await new Promise((resolve) => setTimeout(resolve, 30));
      scrollToBottom(false);
    }

    // Mark as complete reactively
    console.log("Streaming complete, setting isStreaming to false");
    message.isStreaming = false;
  } catch (error) {
    console.error("Error in streaming simulation:", error);
    const messageIndex = messages.value.findIndex((m) => m.id === messageId);
    if (messageIndex !== -1) {
      const message = messages.value[messageIndex];
      if (message) {
        message.content =
          "Sorry, I encountered an error generating a response.";
        message.isStreaming = false;
      }
    }
  }
};

// Handle copy message
const handleCopy = (_content: string) => {
  toast.success("Message copied to clipboard");
};

// Handle regenerate message
const handleRegenerate = async (messageId: string) => {
  const messageIndex = messages.value.findIndex((m) => m.id === messageId);
  if (messageIndex === -1) return;

  // Find the user message that preceded this AI message
  const userMessageIndex = messageIndex - 1;
  if (userMessageIndex < 0) return;

  const userMessage = messages.value[userMessageIndex];
  if (!userMessage || userMessage.role !== "user") return;

  // Remove the old AI message
  messages.value.splice(messageIndex, 1);

  // Regenerate response
  await handleSend(userMessage.content);
};

// Handle message reactions
const handleReaction = (messageId: string, reaction: string) => {
  const message = messages.value.find((m) => m.id === messageId);
  if (!message) return;

  if (!message.reactions) message.reactions = [];

  const existingIndex = message.reactions.indexOf(reaction);
  if (existingIndex > -1) {
    message.reactions.splice(existingIndex, 1);
  } else {
    message.reactions.push(reaction);
  }
};

// Clear chat
const clearChat = () => {
  messages.value = [];
  initializeChat();
  toast.success("Chat cleared");
};

// Export chat
const exportChat = () => {
  const chatData = {
    title: props.title,
    exportDate: new Date().toISOString(),
    messages: messages.value.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
      reactions: m.reactions,
    })),
  };

  const blob = new Blob([JSON.stringify(chatData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast.success("Chat history downloaded");
};

// Message count
const messageCount = computed(() => messages.value.length);
const aiMessageCount = computed(
  () => messages.value.filter((m) => m.role === "assistant").length
);

// Initialize chat on mount
onMounted(() => {
  initializeChat();
  scrollToBottom(false);
});
</script>

<template>
  <div class="flex flex-col h-screen bg-background">
    <!-- Header -->
    <header
      v-if="showHeader"
      class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <MessageSquare class="w-6 h-6 text-primary" />
            <h1 class="text-xl font-semibold">{{ title }}</h1>
          </div>
          <Badge variant="outline" class="text-xs">
            {{ messageCount }} messages
          </Badge>
        </div>

        <div class="flex items-center gap-2">
          <!-- Export Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="messageCount === 0"
            @click="exportChat"
          >
            <Download class="w-4 h-4" />
          </Button>

          <!-- Clear Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="messageCount === 0"
            @click="clearChat"
          >
            <Trash2 class="w-4 h-4" />
          </Button>

          <!-- Settings Button -->
          <Button variant="outline" size="sm">
            <Settings class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>

    <!-- Messages -->
    <ScrollArea ref="scrollAreaEl" class="flex-1 px-0">
      <div class="max-w-4xl mx-auto">
        <div
          v-if="messages.length === 0"
          class="flex items-center justify-center h-full text-muted-foreground"
        >
          <div class="text-center">
            <MessageSquare class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p class="text-lg font-medium mb-2">Start a conversation</p>
            <p class="text-sm">
              Send a message to begin chatting with the AI assistant
            </p>
          </div>
        </div>

        <div v-else>
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :can-regenerate="
              message.role === 'assistant' && !message.isStreaming
            "
            @copy="handleCopy"
            @regenerate="handleRegenerate"
            @react="handleReaction"
          />
        </div>
      </div>
    </ScrollArea>

    <!-- Input -->
    <div class="max-w-4xl mx-auto w-full">
      <ChatInput :disabled="false" :is-loading="isLoading" @send="handleSend" />
    </div>

    <!-- Status Bar -->
    <div class="border-t bg-muted/30 px-4 py-2">
      <div
        class="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground"
      >
        <div class="flex items-center gap-4">
          <span>{{ aiMessageCount }} AI responses</span>
          <Separator orientation="vertical" class="h-3" />
          <span>Ready to chat</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full" />
          <span>Online</span>
        </div>
      </div>
    </div>
  </div>
</template>
