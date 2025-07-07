<script setup lang="ts">
interface PostsQueryParams {
  page?: string;
  search?: string;
  sort?: string;
  order?: string;
}

// Get query parameters for pagination and search
const route = useRoute();
const router = useRouter();

const queryParams = computed<PostsQueryParams>(() => ({
  page: (route.query.page as string) || "1",
  search: (route.query.search as string) || "",
  sort: (route.query.sort as string) || "published_at",
  order: (route.query.order as string) || "desc",
}));

// Build query string for API call
const queryString = computed(() => {
  const params = new URLSearchParams();
  params.append("page", queryParams.value.page!);
  params.append("limit", "10");
  params.append("status", "published");

  if (queryParams.value.search) {
    params.append("search", queryParams.value.search);
  }

  params.append("sort", queryParams.value.sort!);
  params.append("order", queryParams.value.order!);

  return params.toString();
});

// Fetch posts data
const { data: postsData, pending } = await useFetch(
  () => `/api/posts?${queryString.value}`
);

// Search functionality
const searchQuery = ref(queryParams.value.search);

const handleSearch = () => {
  const query = { ...route.query };
  if (searchQuery.value) {
    query.search = searchQuery.value;
  } else {
    delete query.search;
  }
  query.page = "1"; // Reset to first page when searching

  router.push({ query });
};

const clearSearch = () => {
  searchQuery.value = "";
  const query = { ...route.query };
  delete query.search;
  query.page = "1";
  router.push({ query });
};

// Pagination helpers
const currentPage = computed(() => parseInt(queryParams.value.page!));
const totalPages = computed(() => {
  if (!postsData.value?.pagination) return 1;
  return Math.ceil(
    postsData.value.pagination.total / postsData.value.pagination.limit
  );
});

const goToPage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  });
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// SEO
useHead({
  title: "Blog Posts",
  meta: [
    {
      name: "description",
      content: "Read our latest blog posts and articles.",
    },
  ],
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Blog Posts</h1>
      <p class="text-lg text-muted-foreground">
        Discover our latest articles and insights
      </p>
    </div>

    <!-- Search Bar -->
    <div class="mb-8">
      <div class="flex gap-2 max-w-md">
        <UiInput
          v-model="searchQuery"
          placeholder="Search posts..."
          class="flex-1"
          @keyup.enter="handleSearch"
        />
        <UiButton :disabled="pending" @click="handleSearch">
          <Icon name="lucide:search" class="w-4 h-4" />
        </UiButton>
        <UiButton
          v-if="queryParams.search"
          variant="outline"
          @click="clearSearch"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </UiButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <UiSkeleton class="h-32 w-full" />
      <UiSkeleton class="h-32 w-full" />
      <UiSkeleton class="h-32 w-full" />
    </div>

    <!-- Posts List -->
    <div v-else-if="postsData?.data.length" class="space-y-6">
      <UiCard
        v-for="post in postsData.data"
        :key="post.id"
        class="hover:shadow-md transition-shadow"
      >
        <UiCardHeader>
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <UiCardTitle class="text-xl mb-2">
                <NuxtLink
                  :to="`/posts/${post.id}`"
                  class="hover:text-primary transition-colors"
                >
                  {{ post.title }}
                </NuxtLink>
              </UiCardTitle>
              <UiCardDescription class="text-sm text-muted-foreground mb-2">
                {{ post.description }}
              </UiCardDescription>
              <div
                class="flex items-center gap-4 text-sm text-muted-foreground"
              >
                <span class="flex items-center gap-1">
                  <Icon name="lucide:user" class="w-4 h-4" />
                  {{ post.author }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                  {{ formatDate(post.published_at!) }}
                </span>
              </div>
            </div>
            <UiBadge variant="secondary">
              {{ post.status }}
            </UiBadge>
          </div>
        </UiCardHeader>
        <UiCardFooter class="pt-0">
          <NuxtLink :to="`/posts/${post.id}`">
            <UiButton variant="outline" size="sm">
              Read More
              <Icon name="lucide:arrow-right" class="w-4 h-4 ml-1" />
            </UiButton>
          </NuxtLink>
        </UiCardFooter>
      </UiCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon
        name="lucide:file-text"
        class="w-16 h-16 mx-auto mb-4 text-muted-foreground"
      />
      <h3 class="text-lg font-semibold mb-2">No posts found</h3>
      <p class="text-muted-foreground mb-4">
        {{
          queryParams.search
            ? "Try adjusting your search terms."
            : "No published posts are available yet."
        }}
      </p>
      <UiButton
        v-if="queryParams.search"
        variant="outline"
        @click="clearSearch"
      >
        Clear Search
      </UiButton>
    </div>

    <!-- Pagination -->
    <div v-if="postsData?.data.length && totalPages > 1" class="mt-8">
      <div class="flex justify-center">
        <UiPagination
          :total="postsData.pagination.total"
          :items-per-page="postsData.pagination.limit"
          :sibling-count="1"
          :show-edges="true"
          :default-page="currentPage"
          @update:page="goToPage"
        />
      </div>

      <!-- Pagination Info -->
      <div class="text-center mt-4 text-sm text-muted-foreground">
        Showing {{ (currentPage - 1) * 10 + 1 }} to
        {{ Math.min(currentPage * 10, postsData.pagination.total) }} of
        {{ postsData.pagination.total }} posts
      </div>
    </div>
  </div>
</template>
