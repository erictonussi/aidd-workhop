<script setup lang="ts">
import { marked } from "marked";
import hljs from "highlight.js";
// Import a dark theme for syntax highlighting
import "highlight.js/styles/github-dark.css";

const route = useRoute();
const postId = route.params.id as string;

// Fetch individual post
const { data: post, error } = await useFetch(`/api/posts/${postId}`);

// Handle 404 error
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

// Handle other errors
if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    statusMessage: error.value.statusMessage || "Failed to load post",
  });
}

// Ensure we have post data
if (!post.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

const postData = post.value.data;

// Only show published posts (unless in development)
if (postData.status !== "published" && process.env.NODE_ENV === "production") {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Parse markdown content to HTML
const formattedContent = computed(() => {
  return marked(postData.content);
});

// Apply syntax highlighting after content is rendered
onMounted(() => {
  nextTick(() => {
    const codeBlocks = document.querySelectorAll(".post-content pre code");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  });
});

// SEO
useHead({
  title: postData.title,
  meta: [
    {
      name: "description",
      content:
        postData.description ||
        `Read "${postData.title}" by ${postData.author}`,
    },
    { name: "author", content: postData.author },
    { property: "article:author", content: postData.author },
    {
      property: "article:published_time",
      content: postData.published_at || postData.created_at,
    },
    { property: "article:modified_time", content: postData.updated_at },
  ],
});

// Breadcrumb data
const breadcrumbs = [
  { label: "Home", to: "/" },
  { label: "Posts", to: "/posts" },
  { label: postData.title, to: null },
];
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    <UiBreadcrumb class="mb-6">
      <UiBreadcrumbList>
        <UiBreadcrumbItem v-for="(item, index) in breadcrumbs" :key="index">
          <UiBreadcrumbLink v-if="item.to" :to="item.to">
            {{ item.label }}
          </UiBreadcrumbLink>
          <UiBreadcrumbPage v-else>
            {{ item.label }}
          </UiBreadcrumbPage>
          <UiBreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
        </UiBreadcrumbItem>
      </UiBreadcrumbList>
    </UiBreadcrumb>

    <!-- Post Header -->
    <header class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <UiBadge
          :variant="postData.status === 'published' ? 'default' : 'secondary'"
        >
          {{ postData.status }}
        </UiBadge>
        <span
          v-if="postData.status === 'draft'"
          class="text-sm text-muted-foreground"
        >
          (Preview mode)
        </span>
      </div>

      <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        {{ postData.title }}
      </h1>

      <p v-if="postData.description" class="text-xl text-muted-foreground mb-6">
        {{ postData.description }}
      </p>

      <div
        class="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:user" class="w-4 h-4" />
          <span class="font-medium">{{ postData.author }}</span>
        </div>

        <div v-if="postData.published_at" class="flex items-center gap-2">
          <Icon name="lucide:calendar" class="w-4 h-4" />
          <span>Published {{ formatDate(postData.published_at) }}</span>
        </div>

        <div
          v-if="postData.updated_at !== postData.created_at"
          class="flex items-center gap-2"
        >
          <Icon name="lucide:edit" class="w-4 h-4" />
          <span>Updated {{ formatDate(postData.updated_at) }}</span>
        </div>
      </div>
    </header>

    <!-- Post Content -->
    <article class="prose prose-lg max-w-none">
      <div class="bg-card rounded-lg p-8 shadow-sm border">
        <div
          class="post-content prose prose-lg prose-headings:font-bold prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto max-w-none"
          v-html="formattedContent"
        />
      </div>
    </article>

    <!-- Post Footer -->
    <footer class="mt-12 pt-8 border-t">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div class="text-sm text-muted-foreground">
          <p>
            Written by <span class="font-medium">{{ postData.author }}</span>
          </p>
          <p v-if="postData.published_at">
            Published on {{ formatDate(postData.published_at) }}
          </p>
        </div>

        <NuxtLink to="/posts">
          <UiButton variant="outline">
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Back to Posts
          </UiButton>
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style>
/* Override Tailwind prose styles to allow highlight.js dark theme */
.post-content pre {
  background: #0d1117 !important; /* GitHub dark background */
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  margin: 1rem 0 !important;
  overflow-x: auto !important;
}

.post-content pre code {
  background: transparent !important;
  padding: 0 !important;
  color: #e6edf3 !important; /* GitHub dark text color */
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  border-radius: 0 !important;
}

/* Ensure proper styling for inline code vs code blocks */
.post-content code:not(pre code) {
  background: hsl(var(--muted)) !important;
  padding: 0.125rem 0.375rem !important;
  border-radius: 0.25rem !important;
  font-size: 0.875rem !important;
  color: hsl(var(--foreground)) !important;
}

/* Ensure syntax highlighting colors show up */
.post-content .hljs {
  background: #0d1117 !important;
  color: #e6edf3 !important;
}

.post-content .hljs-keyword {
  color: #ff7b72 !important;
}

.post-content .hljs-string {
  color: #a5d6ff !important;
}

.post-content .hljs-comment {
  color: #8b949e !important;
}

.post-content .hljs-variable {
  color: #79c0ff !important;
}

.post-content .hljs-type {
  color: #ffa657 !important;
}

.post-content .hljs-function {
  color: #d2a8ff !important;
}

.post-content .hljs-number {
  color: #79c0ff !important;
}

.post-content .hljs-attr {
  color: #79c0ff !important;
}

.post-content .hljs-tag {
  color: #7ee787 !important;
}
</style>
