<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, Paperclip, Image, Loader2 } from "lucide-vue-next";

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isLoading: false,
  placeholder: "Type your message... (Ctrl+Enter to send)",
});

const emit = defineEmits<{
  send: [message: string, files?: File[]];
  "file-upload": [files: File[]];
}>();

const message = ref("");
const textareaEl = useTemplateRef("textareaEl");
const fileInputEl = ref<HTMLInputElement>();
const uploadedFiles = ref<File[]>([]);

// Auto-resize textarea
const adjustTextareaHeight = () => {
  if (textareaEl.value?.$el) {
    const textarea = textareaEl.value.$el as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  }
};

// Watch for content changes to auto-resize
watch(message, () => {
  nextTick(adjustTextareaHeight);
});

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      handleSend();
    } else if (!event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }
};

// Handle sending message
const handleSend = () => {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage && uploadedFiles.value.length === 0) return;
  if (props.disabled || props.isLoading) return;

  emit(
    "send",
    trimmedMessage,
    uploadedFiles.value.length > 0 ? uploadedFiles.value : undefined
  );

  // Reset form
  message.value = "";
  uploadedFiles.value = [];
  nextTick(adjustTextareaHeight);
};

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  if (files.length > 0) {
    uploadedFiles.value = [...uploadedFiles.value, ...files];
    emit("file-upload", files);
  }

  // Reset file input
  if (fileInputEl.value) {
    fileInputEl.value.value = "";
  }
};

// Remove uploaded file
const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1);
};

// Trigger file input
const triggerFileUpload = () => {
  fileInputEl.value?.click();
};

// Focus textarea on mount
onMounted(() => {
  if (textareaEl.value?.$el) {
    const textarea = textareaEl.value.$el as HTMLTextAreaElement;
    textarea.focus();
  }
  adjustTextareaHeight();
});

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Check if file is image
const isImage = (file: File) => {
  return file.type.startsWith("image/");
};
</script>

<template>
  <div class="border-t bg-background p-4">
    <!-- File Upload Preview -->
    <div v-if="uploadedFiles.length > 0" class="mb-4">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
        >
          <Image v-if="isImage(file)" class="w-4 h-4 text-muted-foreground" />
          <Paperclip v-else class="w-4 h-4 text-muted-foreground" />
          <span class="truncate max-w-32">{{ file.name }}</span>
          <span class="text-xs text-muted-foreground"
            >({{ formatFileSize(file.size) }})</span
          >
          <Button
            variant="ghost"
            size="sm"
            class="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            @click="removeFile(index)"
          >
            ×
          </Button>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex gap-2 items-end">
      <!-- File Upload Button -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="outline"
              size="sm"
              class="h-10 px-3"
              :disabled="disabled || isLoading"
              @click="triggerFileUpload"
            >
              <Paperclip class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload files</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Hidden file input -->
      <input
        ref="fileInputEl"
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.md"
        class="hidden"
        @change="handleFileUpload"
      />

      <!-- Message Input -->
      <div class="flex-1">
        <Textarea
          ref="textareaEl"
          v-model="message"
          :placeholder="placeholder"
          :disabled="disabled || isLoading"
          class="min-h-[2.5rem] max-h-[200px] resize-none"
          @keydown="handleKeydown"
        />
      </div>

      <!-- Send Button -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              :disabled="
                (!message.trim() && uploadedFiles.length === 0) ||
                disabled ||
                isLoading
              "
              class="h-10 px-4"
              @click="handleSend"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send message (Ctrl+Enter)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Keyboard Shortcuts Help -->
    <div class="text-xs text-muted-foreground mt-2 text-center">
      Press
      <kbd class="bg-muted px-1 py-0.5 rounded text-xs">Ctrl+Enter</kbd> to
      send,
      <kbd class="bg-muted px-1 py-0.5 rounded text-xs">Shift+Enter</kbd> for
      new line
    </div>
  </div>
</template>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", "Cascadia Code",
    "Roboto Mono", Consolas, "Courier New", monospace;
}
</style>
