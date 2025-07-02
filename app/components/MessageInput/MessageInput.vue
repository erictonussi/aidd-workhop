<script setup lang="ts">
// Component for message input with file upload and send functionality
// This component is documented in ./README.md (do not remove this comment)

interface Props {
  /**
   * Whether the AI is currently generating a response
   */
  isLoading?: boolean;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Maximum number of files that can be uploaded
   */
  maxFiles?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  placeholder: "Type your message here...",
  maxFiles: 5,
});

// Emits for message actions
const emit = defineEmits<{
  send: [message: string, files: File[]];
  stop: [];
}>();

// Message input state
const message = ref("");
const uploadedFiles = ref<File[]>([]);
const isDragOver = ref(false);

// Template refs
const textareaEl = useTemplateRef("textareaEl");
const fileInputEl = useTemplateRef("fileInputEl");

// Auto-resize textarea
const adjustTextareaHeight = () => {
  if (textareaEl.value) {
    const element = textareaEl.value.$el || textareaEl.value;
    if (element && element.style && element.scrollHeight) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    }
  }
};

watch(message, () => {
  nextTick(adjustTextareaHeight);
});

// Handle send message
const sendMessage = () => {
  if (
    (!message.value.trim() && uploadedFiles.value.length === 0) ||
    props.isLoading
  )
    return;

  emit("send", message.value.trim(), [...uploadedFiles.value]);
  message.value = "";
  uploadedFiles.value = [];
  adjustTextareaHeight();
};

// Handle file upload
const handleFileSelect = (files: FileList | null) => {
  if (!files) return;

  const newFiles = Array.from(files).filter((file) => {
    // Only allow images for now
    return file.type.startsWith("image/");
  });

  // Limit total files
  const totalFiles = uploadedFiles.value.length + newFiles.length;
  if (totalFiles > props.maxFiles) {
    // Take only what fits
    const availableSlots = props.maxFiles - uploadedFiles.value.length;
    uploadedFiles.value.push(...newFiles.slice(0, availableSlots));
  } else {
    uploadedFiles.value.push(...newFiles);
  }
};

// Remove uploaded file
const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1);
};

// Drag and drop handlers
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  handleFileSelect(e.dataTransfer?.files || null);
};

// Keyboard shortcuts
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// File preview URLs
const filePreviewUrls = computed(() => {
  return uploadedFiles.value.map((file) => URL.createObjectURL(file));
});

// Cleanup URLs when component unmounts
onUnmounted(() => {
  filePreviewUrls.value.forEach((url) => URL.revokeObjectURL(url));
});
</script>

<template>
  <div
    class="border border-border rounded-lg bg-background transition-colors"
    :class="{ 'border-primary': isDragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- File Previews -->
    <div v-if="uploadedFiles.length > 0" class="p-3 border-b border-border">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="relative group"
        >
          <div
            class="relative w-16 h-16 rounded-lg overflow-hidden border border-border"
          >
            <img
              :src="filePreviewUrls[index]"
              :alt="file.name"
              class="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="sm"
              class="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeFile(index)"
            >
              <Icon name="lucide:x" class="h-3 w-3" />
            </Button>
          </div>
          <span
            class="text-xs text-muted-foreground mt-1 block truncate max-w-16"
          >
            {{ file.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-3">
      <div class="flex items-end gap-3">
        <!-- Text Input -->
        <div class="flex-1">
          <Textarea
            ref="textareaEl"
            v-model="message"
            :placeholder="placeholder"
            :disabled="isLoading"
            class="min-h-[44px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            rows="1"
            @keydown="onKeyDown"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pb-2">
          <!-- File Upload Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="isLoading || uploadedFiles.length >= maxFiles"
            @click="fileInputEl?.click()"
          >
            <Icon name="lucide:paperclip" class="h-4 w-4" />
          </Button>

          <!-- Send/Stop Button -->
          <Button
            size="sm"
            :disabled="!message.trim() && uploadedFiles.length === 0"
            @click="isLoading ? emit('stop') : sendMessage()"
          >
            <Icon
              :name="isLoading ? 'lucide:square' : 'lucide:send'"
              class="h-4 w-4"
            />
          </Button>
        </div>
      </div>

      <!-- Helper Text -->
      <div
        class="flex items-center justify-between mt-2 text-xs text-muted-foreground"
      >
        <span>Press Shift + Enter for new line</span>
        <span>{{ uploadedFiles.length }}/{{ maxFiles }} files</span>
      </div>
    </div>

    <!-- Drag Overlay -->
    <div
      v-if="isDragOver"
      class="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none"
    >
      <div class="text-center">
        <Icon name="lucide:upload" class="h-8 w-8 text-primary mx-auto mb-2" />
        <p class="text-sm font-medium text-primary">Drop images here</p>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInputEl"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect(($event.target as HTMLInputElement).files)"
    />
  </div>
</template>
