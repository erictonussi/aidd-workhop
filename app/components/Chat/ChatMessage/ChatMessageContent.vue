<script setup lang="ts">
interface Props {
  /** Message content (supports markdown) */
  content: string;
  /** Whether the message is currently streaming */
  isStreaming?: boolean;
  /** Whether the message is in edit mode */
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false,
  isEditing: false,
});

// Simple markdown-to-HTML conversion for basic formatting
const renderMarkdown = (text: string): string => {
  let html = text;

  // Code blocks (```code```)
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || "text";
    return `<pre class="code-block"><code class="language-${language}">${escapeHtml(
      code.trim()
    )}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic (*text*)
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="link">$1</a>'
  );

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
};

const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const displayContent = computed(() => {
  if (props.isEditing) {
    return props.content;
  }

  let content = renderMarkdown(props.content);

  // Add typing cursor for streaming
  if (props.isStreaming) {
    content += '<span class="typing-cursor">▋</span>';
  }

  return content;
});
</script>

<template>
  <div class="message-content">
    <!-- Edit Mode -->
    <UiTextarea
      v-if="isEditing"
      :model-value="content"
      class="min-h-[100px] resize-none"
      placeholder="Edit your message..."
      auto-resize
    />

    <!-- Display Mode -->
    <div
      v-else
      class="prose prose-sm dark:prose-invert max-w-none"
      v-html="displayContent"
    />
  </div>
</template>

<style scoped>
.message-content {
  @apply w-full;
}

/* Code block styling */
:deep(.code-block) {
  @apply bg-muted p-4 rounded-lg my-3 overflow-x-auto;
}

:deep(.code-block code) {
  @apply text-sm font-mono;
}

/* Inline code styling */
:deep(.inline-code) {
  @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;
}

/* Link styling */
:deep(.link) {
  @apply text-primary hover:text-primary/80 underline;
}

/* Typing indicator animation */
:deep(.typing-cursor) {
  @apply animate-pulse text-primary;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Prose adjustments for chat */
:deep(.prose) {
  @apply text-foreground;
}

:deep(.prose p) {
  @apply my-2 last:mb-0;
}

:deep(.prose ul, .prose ol) {
  @apply my-2;
}

:deep(.prose li) {
  @apply my-1;
}

:deep(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
  @apply mt-4 mb-2 first:mt-0;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-muted-foreground/30 pl-4 my-4 italic;
}
</style>
