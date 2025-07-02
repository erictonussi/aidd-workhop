<script setup lang="ts">
import type { HTMLAttributes } from "vue";

interface Props {
  /** Whether input is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  class?: HTMLAttributes["class"];
}

interface Emits {
  /** When user sends a message */
  (e: "send", message: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Type your message...",
});
const emit = defineEmits<Emits>();

const inputValue = ref("");
const textareaEl = useTemplateRef<HTMLTextAreaElement>("textareaEl");

function handleSend() {
  if (inputValue.value.trim() && !props.disabled) {
    emit("send", inputValue.value.trim());
    inputValue.value = "";
    textareaEl.value?.focus();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function focus() {
  textareaEl.value?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div class="p-4 bg-background">
    <UiCard class="shadow-sm">
      <UiCardContent class="p-3">
        <form class="flex items-end gap-3" @submit.prevent="handleSend">
          <div class="flex-1 space-y-2">
            <UiTextarea
              ref="textareaEl"
              v-model="inputValue"
              :placeholder="props.placeholder"
              :disabled="props.disabled"
              rows="1"
              class="resize-none min-h-[40px] max-h-40 border-0 focus-visible:ring-0 p-0"
              autocomplete="off"
              @keydown="handleKeydown"
            />
            <div
              class="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>{{
                props.disabled
                  ? "AI is typing..."
                  : "Press Enter to send, Shift+Enter for new line"
              }}</span>
              <span v-if="inputValue.length > 0"
                >{{ inputValue.length }} characters</span
              >
            </div>
          </div>

          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiButton
                type="submit"
                :disabled="props.disabled || !inputValue.trim()"
                size="icon"
                class="shrink-0 h-10 w-10"
              >
                <Icon name="lucide:send" class="w-5 h-5" />
              </UiButton>
            </UiTooltipTrigger>
            <UiTooltipContent>
              <p>Send message</p>
            </UiTooltipContent>
          </UiTooltip>
        </form>
      </UiCardContent>
    </UiCard>
  </div>
</template>
