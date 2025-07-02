<script setup lang="ts">
import type { Conversation } from "./Chat.vue";

const props = defineProps<{
  conversations: Conversation[];
  currentConversationId?: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (
    e:
      | "select-conversation"
      | "new-conversation"
      | "delete-conversation"
      | "toggle-pin"
      | "update:open",
    payload?: string | boolean
  ): void;
}>();
</script>

<template>
  <aside v-if="props.open" class="w-64 border-r bg-background flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="font-semibold text-foreground">Conversations</h2>
      <UiTooltip>
        <UiTooltipTrigger as-child>
          <UiButton size="sm" variant="ghost" @click="emit('new-conversation')">
            <Icon name="lucide:plus" class="w-4 h-4" />
          </UiButton>
        </UiTooltipTrigger>
        <UiTooltipContent>
          <p>New conversation</p>
        </UiTooltipContent>
      </UiTooltip>
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-2 space-y-1">
        <div
          v-for="conv in props.conversations"
          :key="conv.id"
          :class="[
            'group px-3 py-2 rounded-md cursor-pointer transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            conv.id === props.currentConversationId
              ? 'bg-accent text-accent-foreground'
              : '',
          ]"
          @click="emit('select-conversation', conv.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-medium">{{
                  conv.title
                }}</span>
                <UiBadge
                  v-if="conv.isPinned"
                  variant="secondary"
                  class="text-xs px-1 py-0"
                >
                  <Icon name="lucide:pin" class="w-3 h-3" />
                </UiBadge>
              </div>
              <p class="text-xs text-muted-foreground truncate mt-1">
                {{ conv.lastMessage }}
              </p>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-muted-foreground">
                  {{ conv.timestamp.toLocaleDateString() }}
                </span>
                <UiBadge variant="outline" class="text-xs">
                  {{ conv.messageCount }}
                </UiBadge>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <UiTooltip>
                <UiTooltipTrigger as-child>
                  <UiButton
                    size="icon"
                    variant="ghost"
                    class="h-6 w-6"
                    @click.stop="emit('toggle-pin', conv.id)"
                  >
                    <Icon
                      :name="conv.isPinned ? 'lucide:pin-off' : 'lucide:pin'"
                      class="w-3 h-3"
                    />
                  </UiButton>
                </UiTooltipTrigger>
                <UiTooltipContent>
                  <p>{{ conv.isPinned ? "Unpin" : "Pin" }} conversation</p>
                </UiTooltipContent>
              </UiTooltip>

              <UiTooltip>
                <UiTooltipTrigger as-child>
                  <UiButton
                    size="icon"
                    variant="ghost"
                    class="h-6 w-6 text-destructive hover:text-destructive"
                    @click.stop="emit('delete-conversation', conv.id)"
                  >
                    <Icon name="lucide:trash-2" class="w-3 h-3" />
                  </UiButton>
                </UiTooltipTrigger>
                <UiTooltipContent>
                  <p>Delete conversation</p>
                </UiTooltipContent>
              </UiTooltip>
            </div>
          </div>
        </div>

        <div v-if="props.conversations.length === 0" class="p-4 text-center">
          <Icon
            name="lucide:message-circle"
            class="w-8 h-8 mx-auto text-muted-foreground mb-2"
          />
          <p class="text-sm text-muted-foreground">No conversations yet</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <UiSeparator />
    <div class="p-2">
      <UiButton
        variant="ghost"
        class="w-full justify-start text-xs"
        @click="emit('update:open', false)"
      >
        <Icon name="lucide:sidebar-close" class="w-4 h-4 mr-2" />
        Hide Sidebar
      </UiButton>
    </div>
  </aside>
</template>
