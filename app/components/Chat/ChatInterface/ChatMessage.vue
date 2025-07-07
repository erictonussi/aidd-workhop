<script setup lang="ts">
/**
 * Component to display an individual chat message
 */

interface Message {
  id: number;
  conversation_id: number;
  content: string;
  role: "user" | "assistant" | "system";
  created_at: string;
}

interface Props {
  /** The message object to display */
  message: Message;
}

defineProps<Props>();

/**
 * Formats the message timestamp for display
 */
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div
    class="flex gap-3"
    :class="{
      'flex-row-reverse': message.role === 'user',
    }"
  >
    <!-- Avatar -->
    <div
      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
      :class="{
        'bg-primary text-primary-foreground': message.role === 'user',
        'bg-muted text-muted-foreground': message.role === 'assistant',
        'bg-secondary text-secondary-foreground': message.role === 'system',
      }"
    >
      <Icon
        :name="
          message.role === 'user'
            ? 'lucide:user'
            : message.role === 'assistant'
            ? 'lucide:bot'
            : 'lucide:settings'
        "
        class="w-4 h-4"
      />
    </div>

    <!-- Message Content -->
    <div class="flex-1 max-w-[80%]">
      <div
        class="rounded-lg p-3 text-sm"
        :class="{
          'bg-primary text-primary-foreground': message.role === 'user',
          'bg-muted': message.role === 'assistant',
          'bg-secondary': message.role === 'system',
        }"
      >
        <div class="whitespace-pre-wrap">{{ message.content }}</div>
      </div>

      <!-- Timestamp -->
      <div
        class="text-xs text-muted-foreground mt-1"
        :class="{
          'text-right': message.role === 'user',
          'text-left': message.role !== 'user',
        }"
      >
        {{ formatTime(message.created_at) }}
      </div>
    </div>
  </div>
</template>
