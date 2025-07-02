<script setup lang="ts">
import type { FileAttachment } from "../types";

interface Props {
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed file types */
  allowedTypes?: string[];
  /** Maximum number of files */
  maxFiles?: number;
}

interface Emits {
  /** Triggered when files are selected */
  (e: "files-selected", files: FileAttachment[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: () => [
    "text/plain",
    "text/markdown",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
  maxFiles: 5,
});

const emit = defineEmits<Emits>();

const fileInputEl = ref<HTMLInputElement>();
const isDragging = ref(false);
const dragCounter = ref(0);

const generateFileId = () =>
  `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > props.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(props.maxFileSize)} limit`,
    };
  }

  // Check file type
  if (!props.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`,
    };
  }

  return { valid: true };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const processFiles = async (
  fileList: FileList | File[]
): Promise<FileAttachment[]> => {
  const files = Array.from(fileList);
  const attachments: FileAttachment[] = [];

  for (const file of files.slice(0, props.maxFiles)) {
    const validation = validateFile(file);

    if (!validation.valid) {
      console.warn(`File ${file.name} rejected: ${validation.error}`);
      continue;
    }

    const attachment: FileAttachment = {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      content: file,
      status: "completed",
    };

    attachments.push(attachment);
  }

  return attachments;
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const attachments = await processFiles(target.files);
  if (attachments.length > 0) {
    emit("files-selected", attachments);
  }

  // Reset input
  target.value = "";
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  dragCounter.value++;
  isDragging.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  dragCounter.value--;
  if (dragCounter.value === 0) {
    isDragging.value = false;
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  dragCounter.value = 0;
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const attachments = await processFiles(files);
  if (attachments.length > 0) {
    emit("files-selected", attachments);
  }
};

const openFileDialog = () => {
  fileInputEl.value?.click();
};
</script>

<template>
  <div class="relative">
    <!-- Hidden file input -->
    <input
      ref="fileInputEl"
      type="file"
      :accept="allowedTypes.join(',')"
      :multiple="maxFiles > 1"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Upload button/drop zone -->
    <UiButton
      variant="ghost"
      size="sm"
      class="relative overflow-hidden"
      :class="[isDragging && 'bg-primary/10 border-primary border-dashed']"
      @click="openFileDialog"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <Icon
        name="lucide:paperclip"
        class="w-4 h-4"
        :class="[isDragging && 'text-primary']"
      />

      <!-- Drag overlay -->
      <div
        v-if="isDragging"
        class="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none"
      >
        <Icon name="lucide:upload" class="w-4 h-4 text-primary" />
      </div>
    </UiButton>
  </div>
</template>
