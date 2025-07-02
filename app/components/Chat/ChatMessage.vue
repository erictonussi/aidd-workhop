<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import type { Message } from "./Chat.vue";

interface Props {
  /** Message to display */
  message: Message;
  class?: HTMLAttributes["class"];
}

interface Emits {
  /**
   * Message events
   * @param e Event name
   * @param args Event arguments
   */
  (e: "rate" | "regenerate" | "copy", ...args: [("up" | "down")?]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isUser = computed(() => props.message.role === "user");
const isAssistant = computed(() => props.message.role === "assistant");
const isSystem = computed(() => props.message.role === "system");

const formattedTime = computed(() => {
  return props.message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <div
    :class="
      cn(
        'group relative w-full',
        isUser ? 'flex justify-end' : 'flex justify-start',
        isSystem ? 'flex justify-center' : '',
        props.class
      )
    "
  >
    <!-- System Message -->
    <UiBadge
      v-if="isSystem"
      variant="secondary"
      class="px-4 py-2 text-sm max-w-md break-words"
    >
      {{ message.content }}
    </UiBadge>

    <!-- User/Assistant Message -->
    <div
      v-else
      :class="
        cn('max-w-[85%] space-y-2 min-w-0', isUser ? 'order-2' : 'order-1')
      "
    >
      <!-- User Message (Simple Bubble) -->
      <div
        v-if="isUser"
        class="bg-primary text-primary-foreground rounded-2xl px-4 py-2 ml-auto break-words overflow-wrap-anywhere"
      >
        <div class="text-sm">
          {{ message.content }}
        </div>
      </div>

      <!-- Assistant Message (Card Style) -->
      <UiCard
        v-else
        class="bg-card text-card-foreground hover:bg-accent/50 transition-colors overflow-hidden"
      >
        <UiCardContent class="p-3">
          <div class="flex items-start gap-3 min-w-0">
            <UiAvatar class="w-6 h-6 shrink-0">
              <UiAvatarFallback
                class="bg-primary text-primary-foreground text-xs"
              >
                AI
              </UiAvatarFallback>
            </UiAvatar>
            <div class="flex-1 min-w-0 overflow-hidden">
              <!-- Message Content -->
              <div
                :class="
                  cn(
                    'prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 break-words overflow-wrap-anywhere'
                  )
                "
              >
                <div
                  v-if="message.isLoading"
                  class="flex items-center space-x-2"
                >
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
                  />
                  <span>Thinking...</span>
                </div>
                <div v-else v-html="message.content" />
              </div>

              <!-- Code Blocks -->
              <ChatCodeBlock
                v-for="(codeBlock, index) in message.codeBlocks"
                :key="index"
                :code-block="codeBlock"
                class="mt-3"
              />

              <!-- Citations -->
              <ChatCitations
                v-if="message.citations?.length"
                :citations="message.citations"
                class="mt-3"
              />
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Message Actions (Assistant Only) -->
      <div
        v-if="isAssistant"
        :class="
          cn(
            'flex items-center justify-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            'order-2'
          )
        "
      >
        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton variant="ghost" size="sm" @click="emit('copy')">
              <Icon name="lucide:copy" class="w-4 h-4" />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>Copy message</p>
          </UiTooltipContent>
        </UiTooltip>

        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton variant="ghost" size="sm" @click="emit('regenerate')">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>Regenerate response</p>
          </UiTooltipContent>
        </UiTooltip>

        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton variant="ghost" size="sm" @click="emit('rate', 'up')">
              <Icon name="lucide:thumbs-up" class="w-4 h-4" />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>Good response</p>
          </UiTooltipContent>
        </UiTooltip>

        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton variant="ghost" size="sm" @click="emit('rate', 'down')">
              <Icon name="lucide:thumbs-down" class="w-4 h-4" />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>Poor response</p>
          </UiTooltipContent>
        </UiTooltip>
      </div>

      <!-- Timestamp -->
      <div
        :class="
          cn(
            'text-xs text-muted-foreground px-1',
            isUser ? 'text-right' : 'text-left'
          )
        "
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aggressive word breaking to prevent overflow */
.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* Ensure long URLs and code snippets break properly */
.prose code {
  word-break: break-all;
  overflow-wrap: anywhere;
}

.prose pre {
  overflow-x: auto;
  word-break: normal;
}
</style>
