import { posts } from "../../db/drizzle-schema";

export default defineTask({
  meta: {
    name: "seed:posts",
    description: "Seed dummy blog posts",
  },
  async run() {
    const db = useDb();

    // Clear existing posts first
    await db.delete(posts);

    const dummyPosts = [
      {
        title: "Getting Started with Nuxt 4: A Complete Guide",
        slug: "getting-started-nuxt-4-complete-guide",
        content: `# Getting Started with Nuxt 4

Nuxt 4 brings exciting new features and improvements to the Vue.js ecosystem. In this comprehensive guide, we'll explore everything you need to know to get started with Nuxt 4.

## What's New in Nuxt 4?

- Enhanced TypeScript support
- Better performance optimizations
- Improved developer experience
- New server-side rendering capabilities

## Installation

Getting started is simple:

\`\`\`bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
npm run dev
\`\`\`

## Key Features

Nuxt 4 introduces several groundbreaking features that make it easier than ever to build modern web applications...`,
        description:
          "Learn how to get started with Nuxt 4, exploring its new features and capabilities for modern web development.",
        author: "Alex Johnson",
        status: "published" as const,
        published_at: new Date("2024-01-15"),
        created_at: new Date("2024-01-14"),
        updated_at: new Date("2024-01-15"),
      } as const,
      {
        title: "Building Responsive Components with Tailwind CSS",
        slug: "building-responsive-components-tailwind-css",
        content: `# Building Responsive Components with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web applications. Let's dive into creating responsive components that look great on all devices.

## The Mobile-First Approach

Tailwind CSS follows a mobile-first approach, which means:

1. Start with mobile styles
2. Add larger screen modifications
3. Use breakpoint prefixes like \`md:\`, \`lg:\`, \`xl:\`

## Example: Responsive Card Component

\`\`\`vue
<template>
  <div class="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
    <h2 class="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
      Card Title
    </h2>
    <p class="text-gray-600 text-sm md:text-base">
      Card content goes here...
    </p>
  </div>
</template>
\`\`\`

This approach ensures your components work beautifully across all screen sizes.`,
        description:
          "Master the art of creating responsive components using Tailwind CSS utility classes and mobile-first design principles.",
        author: "Sarah Chen",
        status: "published" as const,
        published_at: new Date("2024-01-20"),
        created_at: new Date("2024-01-19"),
        updated_at: new Date("2024-01-20"),
      } as const,
      {
        title: "State Management in Vue 3: Composables vs Pinia",
        slug: "state-management-vue3-composables-vs-pinia",
        content: `# State Management in Vue 3: Composables vs Pinia

When building Vue 3 applications, choosing the right state management solution is crucial. Let's compare two popular approaches: composables and Pinia.

## Using Composables for State Management

Composables offer a lightweight solution for managing state:

\`\`\`typescript
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  return { count, doubled, increment }
}
\`\`\`

## When to Use Pinia

Pinia shines when you need:
- Complex state logic
- Time-travel debugging
- SSR support
- Plugin ecosystem

## Making the Right Choice

The decision depends on your application's complexity and requirements...`,
        description:
          "Compare composables and Pinia for state management in Vue 3 applications, with practical examples and guidance.",
        author: "Michael Rodriguez",
        status: "published" as const,
        published_at: new Date("2024-01-25"),
        created_at: new Date("2024-01-24"),
        updated_at: new Date("2024-01-25"),
      },
      {
        title: "Advanced TypeScript Patterns for Vue Developers",
        slug: "advanced-typescript-patterns-vue-developers",
        content: `# Advanced TypeScript Patterns for Vue Developers

TypeScript and Vue make a powerful combination. Let's explore advanced patterns that will make your Vue applications more type-safe and maintainable.

## Generic Components

Creating reusable components with proper typing:

\`\`\`vue
<script setup lang="ts" generic="T">
interface Props<T> {
  items: T[]
  keyField: keyof T
}

const props = defineProps<Props<T>>()
</script>
\`\`\`

## Type-Safe Event Handling

Ensure your events are properly typed:

\`\`\`typescript
interface ComponentEvents {
  update: [value: string]
  delete: [id: number]
}

const emit = defineEmits<ComponentEvents>()
\`\`\`

## Advanced Composition API Patterns

Learn how to create type-safe composables with proper inference...`,
        description:
          "Explore advanced TypeScript patterns specifically tailored for Vue.js development, including generics and type safety.",
        author: "Emily Watson",
        status: "draft" as const,
        published_at: null,
        created_at: new Date("2024-01-28"),
        updated_at: new Date("2024-01-29"),
      } as const,
      {
        title: "Performance Optimization in Modern Web Apps",
        slug: "performance-optimization-modern-web-apps",
        content: `# Performance Optimization in Modern Web Apps

Performance is crucial for user experience and SEO. Let's explore proven techniques to optimize your web applications.

## Core Web Vitals

Focus on the metrics that matter:

1. **Largest Contentful Paint (LCP)** - Loading performance
2. **First Input Delay (FID)** - Interactivity
3. **Cumulative Layout Shift (CLS)** - Visual stability

## Code Splitting Strategies

Implement effective code splitting:

\`\`\`javascript
// Route-based splitting
const HomePage = () => import('./pages/Home.vue')
const AboutPage = () => import('./pages/About.vue')

// Component-based splitting
const HeavyComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)
\`\`\`

## Image Optimization

Modern image optimization techniques:
- WebP format usage
- Lazy loading implementation
- Responsive images with srcset
- Image compression strategies

## Measuring Performance

Tools and techniques for monitoring performance...`,
        description:
          "Comprehensive guide to optimizing web application performance, covering Core Web Vitals, code splitting, and modern optimization techniques.",
        author: "David Kim",
        status: "published",
        published_at: new Date("2024-02-01"),
        created_at: new Date("2024-01-31"),
        updated_at: new Date("2024-02-01"),
      } as const,
      {
        title: "Building Accessible Components from Scratch",
        slug: "building-accessible-components-from-scratch",
        content: `# Building Accessible Components from Scratch

Accessibility isn't an afterthought—it's a fundamental part of good web development. Let's learn how to build truly accessible components.

## ARIA Patterns and Roles

Understanding ARIA is essential:

\`\`\`vue
<template>
  <button
    :aria-expanded="isOpen"
    aria-haspopup="true"
    @click="toggle"
  >
    Menu
  </button>
  <ul
    v-if="isOpen"
    role="menu"
    aria-label="Main navigation"
  >
    <li role="menuitem">
      <a href="/home">Home</a>
    </li>
  </ul>
</template>
\`\`\`

## Keyboard Navigation

Implement proper keyboard support:
- Tab order management
- Arrow key navigation
- Escape key handling
- Enter/Space activation

## Screen Reader Considerations

Make your content accessible to screen readers:
- Semantic HTML usage
- Proper heading hierarchy
- Alternative text for images
- Live regions for dynamic content

## Testing for Accessibility

Tools and techniques for accessibility testing...`,
        description:
          "Learn to build web components that are accessible to all users, covering ARIA patterns, keyboard navigation, and testing strategies.",
        author: "Lisa Thompson",
        status: "published",
        published_at: new Date("2024-02-05"),
        created_at: new Date("2024-02-04"),
        updated_at: new Date("2024-02-05"),
      } as const,
    ];

    // Insert dummy posts
    await db.insert(posts).values(dummyPosts);

    console.log(`Successfully seeded ${dummyPosts.length} blog posts`);

    return {
      result: "Success",
      message: `Seeded ${dummyPosts.length} blog posts`,
    };
  },
});
