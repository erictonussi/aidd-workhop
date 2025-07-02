<script setup lang="ts">
// Component for displaying individual chat messages
// This component is documented in ./README.md (do not remove this comment)

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  images?: string[];
  isLoading?: boolean;
}

interface Props {
  /**
   * The message object to display
   */
  message: Message;
  /**
   * Whether to show message actions (copy, regenerate, etc.)
   */
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

// Emits for message actions
const emit = defineEmits<{
  copy: [messageId: string];
  regenerate: [messageId: string];
  react: [messageId: string, reaction: "like" | "dislike"];
}>();

// Format timestamp
const formattedTime = computed(() => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(props.message.timestamp);
});

// Copy message content
const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    emit("copy", props.message.id);
  } catch (error) {
    console.error("Failed to copy message:", error);
  }
};

// Show actions on hover
const messageEl = useTemplateRef("messageEl");
const showActionsOnHover = ref(false);
</script>

<template>
  <div
    ref="messageEl"
    class="group relative"
    @mouseenter="showActionsOnHover = true"
    @mouseleave="showActionsOnHover = false"
  >
    <div
      class="flex gap-4 p-4 rounded-lg transition-colors"
      :class="{
        'bg-muted/50': message.role === 'assistant',
        'bg-background': message.role === 'user',
      }"
    >
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <Avatar class="h-8 w-8">
          <AvatarFallback
            :class="{
              'bg-primary text-primary-foreground':
                message.role === 'assistant',
              'bg-secondary text-secondary-foreground': message.role === 'user',
            }"
          >
            <Icon
              :name="
                message.role === 'assistant' ? 'lucide:bot' : 'lucide:user'
              "
              class="h-4 w-4"
            />
          </AvatarFallback>
        </Avatar>
      </div>

      <!-- Message Content -->
      <div class="flex-1 min-w-0">
        <!-- Header with role and timestamp -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">
            {{ message.role === "assistant" ? "AI Assistant" : "You" }}
          </span>
          <span class="text-xs text-muted-foreground">
            {{ formattedTime }}
          </span>
        </div>

        <!-- Images (if any) -->
        <div v-if="message.images?.length" class="mb-3">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="image in message.images"
              :key="image"
              class="relative rounded-lg overflow-hidden border border-border"
            >
              <img
                :src="image"
                alt="Uploaded image"
                class="max-w-xs max-h-48 object-contain"
              />
            </div>
          </div>
        </div>

        <!-- Message text content -->
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <div v-if="message.isLoading" class="flex items-center gap-2">
            <div class="flex space-x-1">
              <div
                class="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"
              />
              <div
                class="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"
              />
              <div class="w-2 h-2 bg-current rounded-full animate-bounce" />
            </div>
            <span class="text-sm text-muted-foreground">Thinking...</span>
          </div>
          <div v-else class="whitespace-pre-wrap">{{ message.content }}</div>
        </div>

        <!-- Message Actions -->
        <div
          v-if="
            showActions &&
            !message.isLoading &&
            (showActionsOnHover || message.role === 'assistant')
          "
          class="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Button variant="ghost" size="sm" @click="copyMessage">
            <Icon name="lucide:copy" class="h-3 w-3" />
          </Button>

          <Button
            v-if="message.role === 'assistant'"
            variant="ghost"
            size="sm"
            @click="emit('regenerate', message.id)"
          >
            <Icon name="lucide:refresh-cw" class="h-3 w-3" />
          </Button>

          <div class="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              @click="emit('react', message.id, 'like')"
            >
              <Icon name="lucide:thumbs-up" class="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="emit('react', message.id, 'dislike')"
            >
              <Icon name="lucide:thumbs-down" class="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
