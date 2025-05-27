<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRequestURL } from "#app";

const props = defineProps<{
  href: string;
}>();

const route = useRoute();
const requestURL = useRequestURL();

const isExternal = computed(() => {
  return props.href.startsWith("http");
});

const hrefWithUtm = computed(() => {
  try {
    const url = new URL(props.href, requestURL.href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      url.searchParams.set("utm_source", "My Blog");
      url.searchParams.set("utm_medium", "referral");
      url.searchParams.set("utm_campaign", route.path);
      return url.toString();
    }
    return props.href;
  } catch {
    return props.href;
  }
});
</script>
<template>
  <NuxtLink :to="hrefWithUtm" :target="isExternal ? '_blank' : undefined">
    <slot />
  </NuxtLink>
</template>
