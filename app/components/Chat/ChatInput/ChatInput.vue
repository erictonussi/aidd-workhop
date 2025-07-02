<script setup lang="ts">
import type { FileAttachment } from "../types";

interface Props {
  /** Input placeholder text */
  placeholder?: string;
  /** Whether the AI is currently responding */
  isLoading?: boolean;
  /** Whether to show file upload area */
  allowFileUpload?: boolean;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Whether to show send button */
  showSendButton?: boolean;
}

interface Emits {
  /** Triggered when user submits message */
  (e: "submit", message: string, attachments?: FileAttachment[]): void;
  /** Triggered when user starts typing */
  (e: "typing-start"): void;
  /** Triggered when user stops typing */
  (e: "typing-stop"): void;
  /** Triggered when files are attached */
  (e: "files-attached", files: FileAttachment[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Type your message...",
  isLoading: false,
  allowFileUpload: true,
  maxLength: 4000,
  showSendButton: true,
});

const emit = defineEmits<Emits>();

const inputValue = ref("");
const textareaEl = ref<HTMLTextAreaElement>();
const attachments = ref<FileAttachment[]>([]);
const isComposing = ref(false);
const typingTimer = ref<NodeJS.Timeout>();

const canSend = computed(() => {
  return (
    (inputValue.value.trim().length > 0 || attachments.value.length > 0) &&
    !props.isLoading
  );
});

const characterCount = computed(() => inputValue.value.length);
const isNearLimit = computed(
  () => characterCount.value > props.maxLength * 0.8
);
const isOverLimit = computed(() => characterCount.value > props.maxLength);

// Auto-resize textarea
const adjustTextareaHeight = () => {
  const textarea = textareaEl.value;
  if (!textarea) return;

  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
};

// Handle input changes
const handleInput = () => {
  adjustTextareaHeight();

  // Emit typing events
  if (!isComposing.value) {
    emit("typing-start");

    // Clear previous timer
    if (typingTimer.value) {
      clearTimeout(typingTimer.value);
    }

    // Set new timer for typing stop
    typingTimer.value = setTimeout(() => {
      emit("typing-stop");
    }, 1000);
  }
};

// Handle form submission
const handleSubmit = () => {
  if (!canSend.value || isOverLimit.value) return;

  const message = inputValue.value.trim();
  const currentAttachments = [...attachments.value];

  emit("submit", message, currentAttachments);

  // Clear input and attachments
  inputValue.value = "";
  attachments.value = [];
  adjustTextareaHeight();

  // Clear typing timer
  if (typingTimer.value) {
    clearTimeout(typingTimer.value);
  }
  emit("typing-stop");
};

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Submit on Enter (but not Shift+Enter)
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }

  // Clear input on Escape
  if (event.key === "Escape") {
    inputValue.value = "";
    adjustTextareaHeight();
  }
};

// Handle file drop
const handleFileDrop = (files: FileAttachment[]) => {
  attachments.value.push(...files);
  emit("files-attached", files);
};

// Remove attachment
const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1);
};

// Focus input on mount
onMounted(() => {
  textareaEl.value?.focus();
  adjustTextareaHeight();
});
</script>

<template>
  <div class="border-t bg-background p-4">
    <!-- File Attachments -->
    <div v-if="attachments.length > 0" class="mb-3">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(attachment, index) in attachments"
          :key="attachment.id"
          class="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
        >
          <Icon name="lucide:paperclip" class="w-4 h-4" />
          <span>{{ attachment.name }}</span>
          <UiButton
            variant="ghost"
            size="sm"
            class="h-5 w-5 p-0 hover:bg-destructive/10"
            @click="removeAttachment(index)"
          >
            <Icon name="lucide:x" class="w-3 h-3" />
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex items-end gap-3">
      <!-- File Upload -->
      <ChatFileUpload
        v-if="allowFileUpload"
        class="flex-shrink-0"
        @files-selected="handleFileDrop"
      />

      <!-- Text Input -->
      <div class="flex-1 relative">
        <UiTextarea
          ref="textareaEl"
          v-model="inputValue"
          :placeholder="placeholder"
          :disabled="isLoading"
          :class="[
            'min-h-[44px] max-h-[200px] resize-none pr-16',
            isOverLimit && 'border-destructive focus-visible:ring-destructive',
          ]"
          @input="handleInput"
          @keydown="handleKeydown"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />

        <!-- Character Count -->
        <div
          v-if="isNearLimit"
          class="absolute bottom-2 right-2 text-xs"
          :class="[isOverLimit ? 'text-destructive' : 'text-muted-foreground']"
        >
          {{ characterCount }}/{{ maxLength }}
        </div>
      </div>

      <!-- Send Button -->
      <UiButton
        v-if="showSendButton"
        :disabled="!canSend || isOverLimit"
        class="flex-shrink-0"
        @click="handleSubmit"
      >
        <Icon
          v-if="isLoading"
          name="lucide:loader-2"
          class="w-4 h-4 animate-spin"
        />
        <Icon v-else name="lucide:send" class="w-4 h-4" />
      </UiButton>
    </div>

    <!-- Helper Text -->
    <div class="mt-2 text-xs text-muted-foreground">
      Press Enter to send, Shift+Enter for new line
    </div>
  </div>
</template>
