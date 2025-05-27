<script setup lang="ts">
const { data: articles, error } = await useAsyncData("articles", () =>
  queryCollection("blog").all()
);
</script>

<template>
  <div>
    <h1>Blog Posts</h1>
    hello
    <pre>
    {{ articles }}
  </pre
    >
    <ul>
      <li v-for="article in articles" :key="article.path">
        <NuxtLink :to="article.path">
          <h2>{{ article.title }}</h2>
          <p>{{ article.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
