<script setup lang="ts">
const {
  conversations,
  currentConversation,
  messages,
  isLoading,
  error,
  loadConversations,
  loadConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  sendMessage,
} = useChat();

const renameTitle = ref("");

onMounted(async () => {
  await loadConversations();
});

watch(
  () => currentConversation.value?.title,
  (value) => {
    renameTitle.value = value ?? "";
  },
  { immediate: true }
);

async function handleCreateConversation() {
  await createConversation("New conversation");
}

async function handleRenameConversation() {
  if (!currentConversation.value) return;
  await updateConversation(currentConversation.value.id, renameTitle.value.trim() || "New conversation");
}

async function handleDeleteConversation() {
  if (!currentConversation.value) return;
  await deleteConversation(currentConversation.value.id);
  if (conversations.value.length > 0) {
    await loadConversation(conversations.value[0].id);
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Chat</h1>
        <p class="text-muted-foreground">Mock ChatGPT-like interface</p>
      </div>
      <UiButton @click="handleCreateConversation">New conversation</UiButton>
    </div>

    <p v-if="error" class="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {{ error }}
    </p>

    <div class="grid gap-4 lg:grid-cols-[280px_1fr]">
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Conversations</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="space-y-2">
          <UiButton
            v-for="conversation in conversations"
            :key="conversation.id"
            variant="ghost"
            class="h-auto w-full justify-start whitespace-normal text-left"
            :class="conversation.id === currentConversation?.id ? 'bg-muted' : ''"
            @click="loadConversation(conversation.id)"
          >
            {{ conversation.title }}
          </UiButton>
          <p v-if="conversations.length === 0" class="text-sm text-muted-foreground">
            No conversations yet.
          </p>
        </UiCardContent>
      </UiCard>

      <UiCard>
        <UiCardHeader>
          <UiCardTitle>{{ currentConversation?.title || "Select a conversation" }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div v-if="currentConversation" class="flex gap-2">
            <UiInput v-model="renameTitle" placeholder="Conversation title" />
            <UiButton variant="outline" @click="handleRenameConversation">Rename</UiButton>
            <UiButton variant="destructive" @click="handleDeleteConversation">Delete</UiButton>
          </div>

          <div class="min-h-[360px] rounded-md border p-3">
            <ChatMessageList v-if="messages.length > 0" :messages="messages" />
            <p v-else class="text-sm text-muted-foreground">
              Start the conversation by sending a message.
            </p>
          </div>

          <ChatComposer :loading="isLoading" @submit="sendMessage" />
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
