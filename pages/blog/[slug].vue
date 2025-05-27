<script setup lang="ts">
const route = useRoute();
const { data: article } = await useAsyncData(`content-${route.path}`, () => {
  return queryCollection("blog").where("path", "=", route.path).first();
});
</script>

<template>
  <main v-if="article">
    <h1>{{ article.title }}</h1>
    <ContentRenderer v-if="article" :value="article" />
    <div v-else>
      <p>Article not found.</p>
    </div>
  </main>
</template>
