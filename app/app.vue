<script setup lang="ts">
// Demo showcasing Shadcn Vue with Tailwind CSS v4
useHead({
  title: "Shadcn Vue + Nuxt 4 + Tailwind v4",
  meta: [
    {
      name: "description",
      content:
        "A demo showcasing Shadcn Vue components with Nuxt 4 and Tailwind CSS v4",
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header class="bg-card border-b border-border">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-primary">
          🎉 Shadcn Vue + Nuxt 4 + Tailwind v4
        </h1>
        <p class="text-muted-foreground mt-2">
          A modern setup showcasing beautiful UI components with the latest
          technologies
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 space-y-8">
      <!-- Success Message -->
      <div
        class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
      >
        <h2 class="font-semibold mb-2">✅ Installation Successful!</h2>
        <p>
          Shadcn Vue has been successfully installed with Tailwind CSS v4 and
          Nuxt 4. Here's what's included:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Tailwind CSS v4 with new @theme directive</li>
          <li>OKLCH color space for better color accuracy</li>
          <li>Dark mode support with @custom-variant</li>
          <li>Shadcn Vue components ready to use</li>
          <li>TypeScript support</li>
        </ul>
      </div>

      <!-- Button Examples -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Button Components</h2>
        <div class="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        <div class="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">⚙️</Button>
        </div>
      </section>

      <!-- Color System Demo -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Tailwind v4 Color System (OKLCH)</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="bg-primary text-primary-foreground p-4 rounded-lg text-center"
          >
            <div class="font-semibold">Primary</div>
            <div class="text-sm opacity-90">OKLCH colors</div>
          </div>
          <div
            class="bg-secondary text-secondary-foreground p-4 rounded-lg text-center"
          >
            <div class="font-semibold">Secondary</div>
            <div class="text-sm opacity-90">Better accuracy</div>
          </div>
          <div
            class="bg-accent text-accent-foreground p-4 rounded-lg text-center"
          >
            <div class="font-semibold">Accent</div>
            <div class="text-sm opacity-90">Future-proof</div>
          </div>
          <div
            class="bg-muted text-muted-foreground p-4 rounded-lg text-center"
          >
            <div class="font-semibold">Muted</div>
            <div class="text-sm opacity-90">Consistent</div>
          </div>
        </div>
      </section>

      <!-- Dark Mode Demo -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Dark Mode Support</h2>
        <div class="bg-card border border-border rounded-lg p-6">
          <p class="text-card-foreground mb-4">
            Dark mode is automatically supported through CSS custom properties.
            The setup uses the new @custom-variant syntax from Tailwind v4.
          </p>
          <div class="bg-popover border border-border rounded p-4">
            <p class="text-popover-foreground text-sm">
              This card adapts to both light and dark themes seamlessly.
            </p>
          </div>
        </div>
      </section>

      <!-- Features List -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">What's Included</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-card border border-border rounded-lg p-6">
            <h3 class="font-semibold text-lg mb-3">🎨 Tailwind CSS v4</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• New @theme directive for better organization</li>
              <li>• OKLCH color space for accurate colors</li>
              <li>• Improved performance and smaller bundles</li>
              <li>• No config file needed</li>
            </ul>
          </div>

          <div class="bg-card border border-border rounded-lg p-6">
            <h3 class="font-semibold text-lg mb-3">🧩 Shadcn Vue</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Copy-paste component approach</li>
              <li>• Full customization control</li>
              <li>• TypeScript support</li>
              <li>• Accessibility built-in</li>
            </ul>
          </div>

          <div class="bg-card border border-border rounded-lg p-6">
            <h3 class="font-semibold text-lg mb-3">⚡ Nuxt 4</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Auto-imports for components</li>
              <li>• Server-side rendering</li>
              <li>• File-based routing</li>
              <li>• Full-stack capabilities</li>
            </ul>
          </div>

          <div class="bg-card border border-border rounded-lg p-6">
            <h3 class="font-semibold text-lg mb-3">🌙 Dark Mode</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Automatic theme switching</li>
              <li>• CSS custom properties</li>
              <li>• Consistent across components</li>
              <li>• No additional configuration needed</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Next Steps -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Next Steps</h2>
        <div
          class="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800"
        >
          <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Ready to build! 🚀
          </h3>
          <div class="text-blue-800 dark:text-blue-300 space-y-2">
            <p>You can now add more Shadcn Vue components:</p>
            <code
              class="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-sm"
            >
              npx shadcn-vue@latest add dialog card input label
            </code>
            <p class="mt-2">
              Or explore all available components at
              <a href="https://www.shadcn-vue.com" class="underline"
                >shadcn-vue.com</a
              >
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-card border-t border-border mt-16">
      <div
        class="container mx-auto px-4 py-6 text-center text-muted-foreground"
      >
        <p>Built with ❤️ using Shadcn Vue, Nuxt 4, and Tailwind CSS v4</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.app__header {
  text-align: center;
  margin-bottom: 48px;
  color: white;
}

.app__header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app__header p {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.app__content {
  max-width: 1200px;
  margin: 0 auto;
}

.app__section {
  margin-bottom: 48px;
}

.app__section h2 {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  justify-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app {
    padding: 20px 16px;
  }

  .app__header h1 {
    font-size: 28px;
  }

  .app__header p {
    font-size: 16px;
  }

  .app__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
