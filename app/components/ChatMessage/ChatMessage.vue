<script setup lang="ts">
import { marked } from "marked";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Heart,
  User,
  Bot,
} from "lucide-vue-next";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  reactions?: string[];
}

interface Props {
  message: ChatMessage;
  canRegenerate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canRegenerate: false,
});

const emit = defineEmits<{
  copy: [content: string];
  regenerate: [messageId: string];
  react: [messageId: string, reaction: string];
}>();

// Simple markdown configuration
const renderMarkdown = (content: string) => {
  return marked(content, {
    breaks: true,
    gfm: true,
  });
};

const renderedContent = computed(() => {
  if (props.message.role === "user") {
    return props.message.content.replace(/\n/g, "<br>");
  }
  return renderMarkdown(props.message.content);
});

const timeAgo = computed(() => {
  const now = new Date();
  const diff = now.getTime() - props.message.timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    emit("copy", props.message.content);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const handleReaction = (reaction: string) => {
  emit("react", props.message.id, reaction);
};

const handleRegenerate = () => {
  emit("regenerate", props.message.id);
};
</script>

<template>
  <div class="group flex gap-3 p-4 hover:bg-muted/50 transition-colors">
    <!-- Avatar -->
    <Avatar class="w-8 h-8 mt-1 flex-shrink-0">
      <AvatarFallback>
        <User v-if="message.role === 'user'" class="w-4 h-4" />
        <Bot v-else class="w-4 h-4" />
      </AvatarFallback>
    </Avatar>

    <!-- Message Content -->
    <div class="flex-1 min-w-0">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-2">
        <Badge variant="outline" class="text-xs">
          {{ message.role === "user" ? "You" : "AI Assistant" }}
        </Badge>
        <span class="text-xs text-muted-foreground">{{ timeAgo }}</span>

        <!-- Streaming indicator -->
        <div v-if="message.isStreaming" class="flex items-center gap-1">
          <div class="w-1 h-1 bg-primary rounded-full animate-pulse" />
          <div
            class="w-1 h-1 bg-primary rounded-full animate-pulse delay-100"
          />
          <div
            class="w-1 h-1 bg-primary rounded-full animate-pulse delay-200"
          />
        </div>
      </div>

      <!-- Message Content -->
      <div
        class="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted prose-pre:border prose-code:bg-muted prose-code:px-1 prose-code:rounded"
        v-html="renderedContent"
      />

      <!-- Actions -->
      <div
        class="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <!-- Copy button -->
        <Button
          variant="ghost"
          size="sm"
          class="h-7 px-2"
          @click="copyToClipboard"
        >
          <Copy class="w-3 h-3" />
        </Button>

        <!-- Regenerate button (only for AI messages) -->
        <Button
          v-if="message.role === 'assistant' && canRegenerate"
          variant="ghost"
          size="sm"
          class="h-7 px-2"
          @click="handleRegenerate"
        >
          <RotateCcw class="w-3 h-3" />
        </Button>

        <!-- Reaction buttons (only for AI messages) -->
        <template v-if="message.role === 'assistant'">
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2"
            @click="handleReaction('👍')"
          >
            <ThumbsUp class="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2"
            @click="handleReaction('👎')"
          >
            <ThumbsDown class="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2"
            @click="handleReaction('❤️')"
          >
            <Heart class="w-3 h-3" />
          </Button>
        </template>

        <!-- Reactions display -->
        <div v-if="message.reactions?.length" class="flex gap-1 ml-2">
          <Badge
            v-for="reaction in message.reactions"
            :key="reaction"
            variant="secondary"
            class="text-xs h-6"
          >
            {{ reaction }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>
