<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [content: string];
}>();

const content = ref("");

function onSubmit() {
  const trimmed = content.value.trim();
  if (!trimmed || props.loading) {
    return;
  }
  emit("submit", trimmed);
  content.value = "";
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="onSubmit">
    <UiInput v-model="content" placeholder="Type your message..." :disabled="loading" />
    <UiButton type="submit" :disabled="loading || !content.trim()">
      {{ loading ? "Sending..." : "Send" }}
    </UiButton>
  </form>
</template>
