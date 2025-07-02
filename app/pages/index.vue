<script setup lang="ts">
useSeoMeta({
  title: "Home",
  description:
    "Welcome to our blog - discover insightful articles and the latest updates",
});
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">Welcome to Our Blog</h1>
      <p class="text-xl text-muted-foreground mb-8 leading-relaxed">
        Discover insightful articles, tutorials, and the latest updates from our
        team. Explore topics ranging from technology and development to best
        practices and industry insights.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/posts">
          <UiButton size="lg" class="w-full sm:w-auto">
            <Icon name="lucide:book-open" class="w-5 h-5 mr-2" />
            Read Our Posts
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/playground">
          <UiButton variant="outline" size="lg" class="w-full sm:w-auto">
            <Icon name="lucide:play" class="w-5 h-5 mr-2" />
            Component Playground
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Stats or Features -->
    <div class="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
      <UiCard class="text-center">
        <UiCardHeader>
          <Icon
            name="lucide:file-text"
            class="w-8 h-8 mx-auto mb-2 text-primary"
          />
          <UiCardTitle>Quality Content</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-muted-foreground">
            In-depth articles and tutorials written by experts in the field.
          </p>
        </UiCardContent>
      </UiCard>

      <UiCard class="text-center">
        <UiCardHeader>
          <Icon
            name="lucide:trending-up"
            class="w-8 h-8 mx-auto mb-2 text-primary"
          />
          <UiCardTitle>Latest Updates</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-muted-foreground">
            Stay up-to-date with the latest trends and technologies.
          </p>
        </UiCardContent>
      </UiCard>

      <UiCard class="text-center">
        <UiCardHeader>
          <Icon name="lucide:users" class="w-8 h-8 mx-auto mb-2 text-primary" />
          <UiCardTitle>Community</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <p class="text-muted-foreground">
            Join our community of developers and tech enthusiasts.
          </p>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
